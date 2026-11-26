-- Rota Industrial — ranking online, sincronização e certificados verificáveis
-- Projeto Supabase: rota-industrial (sa-east-1)
-- Modelo: sem e-mail e sem senha. Cada aluno tem um TOKEN aleatório gerado no navegador
-- (o "código de acesso"). O banco guarda só o hash do token. Tudo passa por funções RPC;
-- as tabelas ficam no schema "privado", que não é exposto pela API.

create extension if not exists pgcrypto with schema extensions;
create schema if not exists privado;
revoke all on schema privado from public, anon, authenticated;

create table if not exists privado.cursos (
  id text primary key,
  titulo text not null,
  aulas int not null,
  testes int not null,
  carga text not null
);

create table if not exists privado.alunos (
  id bigint generated always as identity primary key,
  token_hash text not null unique,
  apelido text not null,
  xp int not null default 0,
  nivel int not null default 1,
  seq_melhor int not null default 0,
  media int,
  testes int not null default 0,
  aulas int not null default 0,
  dias_melhor int not null default 0,
  semana date not null default (date_trunc('week', now() at time zone 'America/Sao_Paulo'))::date,
  xp_inicio_semana int not null default 0,
  dados jsonb,
  criado timestamptz not null default now(),
  atualizado timestamptz not null default now()
);
create unique index if not exists alunos_apelido_unico on privado.alunos (lower(apelido));

create table if not exists privado.certificados (
  codigo text primary key,
  aluno_id bigint not null references privado.alunos(id) on delete cascade,
  curso text not null references privado.cursos(id),
  nome text not null,
  media int not null,
  concluido date not null,
  emitido timestamptz not null default now(),
  unique (aluno_id, curso)
);
create index if not exists certificados_aluno on privado.certificados (aluno_id);

alter table privado.cursos enable row level security;
alter table privado.alunos enable row level security;
alter table privado.certificados enable row level security;

-- utilitário: hash do token
create or replace function privado.hash_token(p_token text) returns text
language sql immutable set search_path = '' as $$
  select encode(extensions.digest(p_token, 'sha256'), 'hex')
$$;

create or replace function privado.inicio_semana() returns date
language sql stable set search_path = '' as $$
  select (date_trunc('week', now() at time zone 'America/Sao_Paulo'))::date
$$;

create or replace function privado.limitar(v int, lo int, hi int) returns int
language sql immutable set search_path = '' as $$
  select greatest(lo, least(hi, coalesce(v, lo)))
$$;

-- salvar/atualizar o aluno (cria na 1ª vez)
create or replace function public.rota_salvar(p_token text, p_apelido text, p_resumo jsonb, p_dados jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_hash text;
  v_apelido text := btrim(coalesce(p_apelido, ''));
  v_xp int; v_semana date := privado.inicio_semana();
  v_aluno privado.alunos%rowtype;
begin
  if p_token is null or length(p_token) < 32 or length(p_token) > 128 then
    raise exception 'token_invalido';
  end if;
  if v_apelido !~ '^[A-Za-zÀ-ÖØ-öø-ÿ0-9 _.\-]{3,24}$' then
    raise exception 'apelido_invalido';
  end if;
  if p_dados is not null and pg_column_size(p_dados) > 300000 then
    raise exception 'dados_grandes';
  end if;
  v_hash := privado.hash_token(p_token);
  v_xp := privado.limitar((p_resumo->>'xp')::int, 0, 8000);

  if exists (select 1 from privado.alunos where lower(apelido) = lower(v_apelido) and token_hash <> v_hash) then
    raise exception 'apelido_em_uso';
  end if;

  select * into v_aluno from privado.alunos where token_hash = v_hash for update;
  if not found then
    insert into privado.alunos (token_hash, apelido, xp, xp_inicio_semana, semana)
    values (v_hash, v_apelido, v_xp, v_xp, v_semana)  -- XP de antes de entrar não conta na semana
    returning * into v_aluno;
  end if;

  -- virou a semana: o XP atual passa a ser a base da semana nova
  if v_aluno.semana <> v_semana then
    v_aluno.xp_inicio_semana := v_aluno.xp;
    v_aluno.semana := v_semana;
  end if;

  update privado.alunos set
    apelido = v_apelido,
    xp = v_xp,
    nivel = privado.limitar((p_resumo->>'nivel')::int, 1, 20),
    seq_melhor = privado.limitar((p_resumo->>'seqMelhor')::int, 0, 500),
    media = case when p_resumo ? 'media' and p_resumo->>'media' is not null then privado.limitar((p_resumo->>'media')::int, 0, 100) end,
    testes = privado.limitar((p_resumo->>'testes')::int, 0, 1000),
    aulas = privado.limitar((p_resumo->>'aulas')::int, 0, 1000),
    dias_melhor = privado.limitar((p_resumo->>'diasMelhor')::int, 0, 3650),
    semana = v_aluno.semana,
    xp_inicio_semana = least(v_aluno.xp_inicio_semana, v_xp),
    dados = coalesce(p_dados, dados),
    atualizado = now()
  where id = v_aluno.id;

  return jsonb_build_object('ok', true);
end $$;

-- baixar o progresso salvo (para usar em outro aparelho)
create or replace function public.rota_carregar(p_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('apelido', apelido, 'dados', dados, 'atualizado', atualizado)
  from privado.alunos where token_hash = privado.hash_token(p_token)
$$;

-- ranking público: tipo = xp | semana | sequencia | media
create or replace function public.rota_ranking(p_tipo text default 'xp', p_limite int default 50)
returns table (pos bigint, apelido text, nivel int, valor int, xp int, seq_melhor int, media int, aulas int)
language sql stable security definer set search_path = '' as $$
  with base as (
    select a.apelido, a.nivel, a.xp, a.seq_melhor, a.media, a.aulas, a.testes, a.atualizado,
      case p_tipo
        when 'semana' then case when a.semana = privado.inicio_semana() then a.xp - a.xp_inicio_semana else 0 end
        when 'sequencia' then a.seq_melhor
        when 'media' then a.media
        else a.xp end as valor
    from privado.alunos a
    where (p_tipo <> 'media' or (a.testes >= 5 and a.media is not null))
  )
  select rank() over (order by valor desc, xp desc), apelido, nivel, valor, xp, seq_melhor, media, aulas
  from base where valor > 0
  order by valor desc, xp desc, atualizado asc
  limit greatest(1, least(coalesce(p_limite, 50), 100))
$$;

-- posição do próprio aluno
create or replace function public.rota_minha_posicao(p_token text, p_tipo text default 'xp')
returns jsonb language sql stable security definer set search_path = '' as $$
  with base as (
    select token_hash,
      case p_tipo
        when 'semana' then case when semana = privado.inicio_semana() then xp - xp_inicio_semana else 0 end
        when 'sequencia' then seq_melhor
        when 'media' then case when testes >= 5 then media end
        else xp end as valor, xp
    from privado.alunos
  ), r as (
    select token_hash, valor, rank() over (order by valor desc nulls last, xp desc) as pos from base where coalesce(valor, 0) > 0
  )
  select jsonb_build_object('pos', (select pos from r where token_hash = privado.hash_token(p_token)),
                            'valor', (select valor from r where token_hash = privado.hash_token(p_token)),
                            'total', (select count(*) from r))
$$;

-- emitir (ou reemitir) o certificado: confere o progresso salvo no banco
create or replace function public.rota_emitir_certificado(p_token text, p_curso text, p_nome text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_aluno privado.alunos%rowtype;
  v_curso privado.cursos%rowtype;
  v_nome text := btrim(coalesce(p_nome, ''));
  v_aulas int; v_testes_ok int; v_media numeric; v_fim bigint; v_codigo text;
begin
  select * into v_aluno from privado.alunos where token_hash = privado.hash_token(p_token);
  if not found then raise exception 'aluno_nao_encontrado'; end if;
  select * into v_curso from privado.cursos where id = p_curso;
  if not found then raise exception 'curso_invalido'; end if;
  if length(v_nome) < 3 or length(v_nome) > 80 then raise exception 'nome_invalido'; end if;

  select count(*), max((value)::bigint) into v_aulas, v_fim
  from jsonb_each_text(coalesce(v_aluno.dados->'progresso', '{}'::jsonb))
  where key like p_curso || '/%';

  select count(*) filter (where (value->>'melhor')::int >= 70), avg((value->>'melhor')::int)
  into v_testes_ok, v_media
  from jsonb_each(coalesce(v_aluno.dados->'aluno'->'quizzes', '{}'::jsonb))
  where key like p_curso || '/%';

  if v_aulas < v_curso.aulas or v_testes_ok < v_curso.testes then
    raise exception 'curso_incompleto';
  end if;

  select codigo into v_codigo from privado.certificados where aluno_id = v_aluno.id and curso = p_curso;
  if v_codigo is null then
    v_codigo := 'RI-' || upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 5)) || '-' || upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 5));
    insert into privado.certificados (codigo, aluno_id, curso, nome, media, concluido)
    values (v_codigo, v_aluno.id, p_curso, v_nome, round(v_media)::int,
            (to_timestamp(coalesce(v_fim, extract(epoch from now()) * 1000) / 1000.0) at time zone 'America/Sao_Paulo')::date);
  else
    update privado.certificados set nome = v_nome, media = round(v_media)::int where codigo = v_codigo;
  end if;

  return (select jsonb_build_object('codigo', codigo, 'nome', nome, 'media', media, 'concluido', concluido)
          from privado.certificados where codigo = v_codigo);
end $$;

-- verificação pública de um certificado pelo código
create or replace function public.rota_verificar_certificado(p_codigo text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('codigo', c.codigo, 'nome', c.nome, 'curso', k.titulo, 'curso_id', k.id, 'carga', k.carga,
                            'aulas', k.aulas, 'media', c.media, 'concluido', c.concluido, 'emitido', c.emitido)
  from privado.certificados c join privado.cursos k on k.id = c.curso
  where c.codigo = upper(btrim(p_codigo))
$$;

-- apagar a conta online (o aluno pode pedir a qualquer momento)
create or replace function public.rota_apagar(p_token text)
returns jsonb language sql security definer set search_path = '' as $$
  with d as (delete from privado.alunos where token_hash = privado.hash_token(p_token) returning 1)
  select jsonb_build_object('apagado', (select count(*) from d) > 0)
$$;

revoke all on function public.rota_salvar(text, text, jsonb, jsonb) from public;
revoke all on function public.rota_carregar(text) from public;
revoke all on function public.rota_ranking(text, int) from public;
revoke all on function public.rota_minha_posicao(text, text) from public;
revoke all on function public.rota_emitir_certificado(text, text, text) from public;
revoke all on function public.rota_verificar_certificado(text) from public;
revoke all on function public.rota_apagar(text) from public;
grant execute on function public.rota_salvar(text, text, jsonb, jsonb) to anon, authenticated;
grant execute on function public.rota_carregar(text) to anon, authenticated;
grant execute on function public.rota_ranking(text, int) to anon, authenticated;
grant execute on function public.rota_minha_posicao(text, text) to anon, authenticated;
grant execute on function public.rota_emitir_certificado(text, text, text) to anon, authenticated;
grant execute on function public.rota_verificar_certificado(text) to anon, authenticated;
grant execute on function public.rota_apagar(text) to anon, authenticated;

insert into privado.cursos (id,titulo,aulas,testes,carga) values
('matematica-eletricistas','Matemática para Eletricistas',11,11,'10h'),
('fundamentos-eletricidade','Fundamentos de Eletricidade',22,22,'20h'),
('seguranca-eletricidade','Segurança em Eletricidade',8,7,'8h'),
('analise-circuitos-cc','Análise de Circuitos em Corrente Contínua',9,9,'16h'),
('instalacoes-residenciais','Instalações Elétricas Residenciais',12,11,'20h'),
('instalacoes-comerciais','Instalações Elétricas Comerciais',9,8,'16h'),
('comandos-eletricos','Comandos Elétricos Industriais',12,11,'24h'),
('motores-eletricos','Motores Elétricos',6,5,'12h')
on conflict (id) do update set titulo=excluded.titulo, aulas=excluded.aulas, testes=excluded.testes, carga=excluded.carga;
