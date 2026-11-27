-- Rota Industrial — login por telefone e senha, sessões, painel administrativo e avisos
-- Substitui o "código de acesso" (001) por conta com telefone + senha.
-- Tudo continua por funções RPC; as tabelas ficam no schema "privado".

-- ---------------------------------------------------------------- tabelas
alter table privado.alunos alter column token_hash drop not null;
alter table privado.alunos add column if not exists telefone text unique;
alter table privado.alunos add column if not exists senha_hash text;
alter table privado.alunos add column if not exists nome text;
alter table privado.alunos add column if not exists admin boolean not null default false;
alter table privado.alunos add column if not exists bloqueado boolean not null default false;
alter table privado.alunos add column if not exists oculto_ranking boolean not null default false;
alter table privado.alunos add column if not exists ultimo_acesso timestamptz;
alter table privado.alunos add column if not exists tentativas int not null default 0;
alter table privado.alunos add column if not exists bloqueio_ate timestamptz;
alter table privado.certificados add column if not exists revogado boolean not null default false;

create table if not exists privado.sessoes (
  token_hash text primary key,
  aluno_id bigint not null references privado.alunos(id) on delete cascade,
  criada timestamptz not null default now(),
  expira timestamptz not null default now() + interval '60 days'
);
create index if not exists sessoes_aluno on privado.sessoes (aluno_id);

create table if not exists privado.config (
  chave text primary key,
  valor jsonb not null,
  atualizado timestamptz not null default now()
);

create table if not exists privado.eventos (
  id bigint generated always as identity primary key,
  admin_id bigint references privado.alunos(id) on delete set null,
  admin_nome text,
  acao text not null,
  alvo text,
  detalhes jsonb,
  quando timestamptz not null default now()
);

alter table privado.sessoes enable row level security;
alter table privado.config enable row level security;
alter table privado.eventos enable row level security;

-- ---------------------------------------------------------------- utilitários
create or replace function privado.normalizar_telefone(p text) returns text
language plpgsql immutable set search_path = '' as $$
declare d text := regexp_replace(coalesce(p, ''), '\D', '', 'g');
begin
  if length(d) in (10, 11) then d := '55' || d; end if;           -- DDD + número (Brasil)
  if length(d) < 12 or length(d) > 15 then return null; end if;
  return '+' || d;
end $$;

create or replace function privado.aluno_do_token(p_token text) returns bigint
language sql stable set search_path = '' as $$
  select a.id from privado.sessoes s join privado.alunos a on a.id = s.aluno_id
  where s.token_hash = privado.hash_token(coalesce(p_token, '')) and s.expira > now() and not a.bloqueado
$$;

create or replace function privado.admin_do_token(p_token text) returns bigint
language plpgsql stable set search_path = '' as $$
declare v bigint;
begin
  select a.id into v from privado.sessoes s join privado.alunos a on a.id = s.aluno_id
  where s.token_hash = privado.hash_token(coalesce(p_token, '')) and s.expira > now() and not a.bloqueado and a.admin;
  if v is null then raise exception 'sem_permissao'; end if;
  return v;
end $$;

create or replace function privado.nova_sessao(p_aluno bigint) returns text
language plpgsql set search_path = '' as $$
declare t text := encode(extensions.gen_random_bytes(32), 'hex');
begin
  delete from privado.sessoes where aluno_id = p_aluno and expira < now();
  insert into privado.sessoes (token_hash, aluno_id) values (privado.hash_token(t), p_aluno);
  update privado.alunos set ultimo_acesso = now() where id = p_aluno;
  return t;
end $$;

create or replace function privado.registrar(p_admin bigint, p_acao text, p_alvo text, p_detalhes jsonb default null) returns void
language sql set search_path = '' as $$
  insert into privado.eventos (admin_id, admin_nome, acao, alvo, detalhes)
  select p_admin, (select coalesce(nome, apelido) from privado.alunos where id = p_admin), p_acao, p_alvo, p_detalhes
$$;

create or replace function privado.validar_apelido(p text, p_ignorar bigint) returns text
language plpgsql stable set search_path = '' as $$
declare v text := btrim(coalesce(p, ''));
begin
  if v !~ '^[A-Za-zÀ-ÖØ-öø-ÿ0-9 _.\-]{3,24}$' then raise exception 'apelido_invalido'; end if;
  if exists (select 1 from privado.alunos where lower(apelido) = lower(v) and id is distinct from p_ignorar) then raise exception 'apelido_em_uso'; end if;
  return v;
end $$;

create or replace function privado.perfil(p_id bigint) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object('id', id, 'nome', nome, 'apelido', apelido, 'admin', admin,
    'telefone', case when telefone is null then null else left(telefone, 6) || ' •••• ' || right(telefone, 4) end)
  from privado.alunos where id = p_id
$$;

-- ---------------------------------------------------------------- conta do aluno
create or replace function public.rota_cadastrar(p_telefone text, p_senha text, p_nome text, p_apelido text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_tel text := privado.normalizar_telefone(p_telefone); v_nome text := btrim(coalesce(p_nome, '')); v_ap text; v_id bigint;
begin
  if v_tel is null then raise exception 'telefone_invalido'; end if;
  if length(coalesce(p_senha, '')) < 6 or length(p_senha) > 72 then raise exception 'senha_curta'; end if;
  if length(v_nome) < 3 or length(v_nome) > 80 then raise exception 'nome_invalido'; end if;
  if exists (select 1 from privado.alunos where telefone = v_tel) then raise exception 'telefone_em_uso'; end if;
  v_ap := privado.validar_apelido(p_apelido, null);
  insert into privado.alunos (telefone, senha_hash, nome, apelido, ultimo_acesso)
  values (v_tel, extensions.crypt(p_senha, extensions.gen_salt('bf', 8)), v_nome, v_ap, now())
  returning id into v_id;
  return jsonb_build_object('token', privado.nova_sessao(v_id), 'perfil', privado.perfil(v_id));
end $$;

-- não usa "raise" quando a senha erra, para o contador de tentativas ficar gravado
create or replace function public.rota_entrar(p_telefone text, p_senha text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_tel text := privado.normalizar_telefone(p_telefone); a privado.alunos%rowtype;
begin
  select * into a from privado.alunos where telefone = v_tel;
  if not found or a.senha_hash is null then
    perform extensions.crypt('x', extensions.gen_salt('bf', 8)); -- tempo parecido com o de senha errada
    return jsonb_build_object('erro', 'login_invalido');
  end if;
  if a.bloqueio_ate is not null and a.bloqueio_ate > now() then return jsonb_build_object('erro', 'muitas_tentativas'); end if;
  if a.senha_hash <> extensions.crypt(coalesce(p_senha, ''), a.senha_hash) then
    update privado.alunos set
      tentativas = case when tentativas + 1 >= 5 then 0 else tentativas + 1 end,
      bloqueio_ate = case when tentativas + 1 >= 5 then now() + interval '15 minutes' end
    where id = a.id;
    return jsonb_build_object('erro', 'login_invalido');
  end if;
  if a.bloqueado then return jsonb_build_object('erro', 'conta_bloqueada'); end if;
  update privado.alunos set tentativas = 0, bloqueio_ate = null where id = a.id;
  return jsonb_build_object('token', privado.nova_sessao(a.id), 'perfil', privado.perfil(a.id));
end $$;

create or replace function public.rota_sair(p_token text)
returns jsonb language sql security definer set search_path = '' as $$
  with d as (delete from privado.sessoes where token_hash = privado.hash_token(coalesce(p_token, '')) returning 1)
  select jsonb_build_object('ok', true)
$$;

create or replace function public.rota_eu(p_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select privado.perfil(privado.aluno_do_token(p_token))
$$;

create or replace function public.rota_trocar_senha(p_token text, p_atual text, p_nova text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_id bigint := privado.aluno_do_token(p_token); v_hash text;
begin
  if v_id is null then raise exception 'sessao_invalida'; end if;
  select senha_hash into v_hash from privado.alunos where id = v_id;
  if v_hash <> extensions.crypt(coalesce(p_atual, ''), v_hash) then raise exception 'senha_atual_errada'; end if;
  if length(coalesce(p_nova, '')) < 6 or length(p_nova) > 72 then raise exception 'senha_curta'; end if;
  update privado.alunos set senha_hash = extensions.crypt(p_nova, extensions.gen_salt('bf', 8)) where id = v_id;
  delete from privado.sessoes where aluno_id = v_id and token_hash <> privado.hash_token(p_token);
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.rota_editar_perfil(p_token text, p_nome text, p_apelido text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_id bigint := privado.aluno_do_token(p_token); v_nome text := btrim(coalesce(p_nome, ''));
begin
  if v_id is null then raise exception 'sessao_invalida'; end if;
  if length(v_nome) < 3 or length(v_nome) > 80 then raise exception 'nome_invalido'; end if;
  update privado.alunos set nome = v_nome, apelido = privado.validar_apelido(p_apelido, v_id) where id = v_id;
  return privado.perfil(v_id);
end $$;

-- ---------------------------------------------------------------- funções do 001, agora com sessão
drop function if exists public.rota_salvar(text, text, jsonb, jsonb);
create or replace function public.rota_salvar(p_token text, p_resumo jsonb, p_dados jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_id bigint := privado.aluno_do_token(p_token); v_xp int; v_semana date := privado.inicio_semana(); a privado.alunos%rowtype;
begin
  if v_id is null then raise exception 'sessao_invalida'; end if;
  if p_dados is not null and pg_column_size(p_dados) > 300000 then raise exception 'dados_grandes'; end if;
  select * into a from privado.alunos where id = v_id for update;
  v_xp := privado.limitar((p_resumo->>'xp')::int, 0, 8000);
  if a.semana <> v_semana then a.xp_inicio_semana := a.xp; a.semana := v_semana; end if;
  if a.dados is null and a.xp = 0 then a.xp_inicio_semana := v_xp; end if; -- XP de antes da conta não conta na semana
  update privado.alunos set
    xp = v_xp,
    nivel = privado.limitar((p_resumo->>'nivel')::int, 1, 20),
    seq_melhor = privado.limitar((p_resumo->>'seqMelhor')::int, 0, 500),
    media = case when p_resumo->>'media' is not null then privado.limitar((p_resumo->>'media')::int, 0, 100) end,
    testes = privado.limitar((p_resumo->>'testes')::int, 0, 1000),
    aulas = privado.limitar((p_resumo->>'aulas')::int, 0, 1000),
    dias_melhor = privado.limitar((p_resumo->>'diasMelhor')::int, 0, 3650),
    semana = a.semana,
    xp_inicio_semana = least(a.xp_inicio_semana, v_xp),
    dados = coalesce(p_dados, dados),
    ultimo_acesso = now(),
    atualizado = now()
  where id = v_id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.rota_carregar(p_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('perfil', privado.perfil(id), 'dados', dados, 'atualizado', atualizado)
  from privado.alunos where id = privado.aluno_do_token(p_token)
$$;

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
    where not a.bloqueado and not a.oculto_ranking
      and (p_tipo <> 'media' or (a.testes >= 5 and a.media is not null))
  )
  select rank() over (order by valor desc, xp desc), apelido, nivel, valor, xp, seq_melhor, media, aulas
  from base where valor > 0
  order by valor desc, xp desc, atualizado asc
  limit greatest(1, least(coalesce(p_limite, 50), 100))
$$;

create or replace function public.rota_minha_posicao(p_token text, p_tipo text default 'xp')
returns jsonb language sql stable security definer set search_path = '' as $$
  with base as (
    select id,
      case p_tipo
        when 'semana' then case when semana = privado.inicio_semana() then xp - xp_inicio_semana else 0 end
        when 'sequencia' then seq_melhor
        when 'media' then case when testes >= 5 then media end
        else xp end as valor, xp
    from privado.alunos where not bloqueado and not oculto_ranking
  ), r as (
    select id, valor, rank() over (order by valor desc nulls last, xp desc) as pos from base where coalesce(valor, 0) > 0
  ), eu as (select privado.aluno_do_token(p_token) as id)
  select jsonb_build_object('pos', (select pos from r where id = (select id from eu)),
                            'valor', (select valor from r where id = (select id from eu)),
                            'total', (select count(*) from r),
                            'oculto', (select oculto_ranking from privado.alunos where id = (select id from eu)))
$$;

create or replace function public.rota_emitir_certificado(p_token text, p_curso text, p_nome text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_id bigint := privado.aluno_do_token(p_token);
  v_aluno privado.alunos%rowtype; v_curso privado.cursos%rowtype;
  v_nome text := btrim(coalesce(p_nome, ''));
  v_aulas int; v_testes_ok int; v_media numeric; v_fim bigint; v_codigo text;
begin
  if v_id is null then raise exception 'sessao_invalida'; end if;
  select * into v_aluno from privado.alunos where id = v_id;
  select * into v_curso from privado.cursos where id = p_curso;
  if not found then raise exception 'curso_invalido'; end if;
  if length(v_nome) < 3 or length(v_nome) > 80 then raise exception 'nome_invalido'; end if;
  select count(*), max((value)::bigint) into v_aulas, v_fim
  from jsonb_each_text(coalesce(v_aluno.dados->'progresso', '{}'::jsonb)) where key like p_curso || '/%';
  select count(*) filter (where (value->>'melhor')::int >= 70), avg((value->>'melhor')::int) into v_testes_ok, v_media
  from jsonb_each(coalesce(v_aluno.dados->'aluno'->'quizzes', '{}'::jsonb)) where key like p_curso || '/%';
  if v_aulas < v_curso.aulas or v_testes_ok < v_curso.testes then raise exception 'curso_incompleto'; end if;
  select codigo into v_codigo from privado.certificados where aluno_id = v_id and curso = p_curso;
  if v_codigo is null then
    v_codigo := 'RI-' || upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 5)) || '-' || upper(substr(encode(extensions.gen_random_bytes(8), 'hex'), 1, 5));
    insert into privado.certificados (codigo, aluno_id, curso, nome, media, concluido)
    values (v_codigo, v_id, p_curso, v_nome, round(v_media)::int,
            (to_timestamp(coalesce(v_fim, extract(epoch from now()) * 1000) / 1000.0) at time zone 'America/Sao_Paulo')::date);
  else
    update privado.certificados set nome = v_nome, media = round(v_media)::int where codigo = v_codigo;
  end if;
  return (select jsonb_build_object('codigo', codigo, 'nome', nome, 'media', media, 'concluido', concluido, 'revogado', revogado)
          from privado.certificados where codigo = v_codigo);
end $$;

create or replace function public.rota_verificar_certificado(p_codigo text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select jsonb_build_object('codigo', c.codigo, 'nome', c.nome, 'curso', k.titulo, 'curso_id', k.id, 'carga', k.carga,
                            'aulas', k.aulas, 'media', c.media, 'concluido', c.concluido, 'emitido', c.emitido, 'revogado', c.revogado)
  from privado.certificados c join privado.cursos k on k.id = c.curso
  where c.codigo = upper(btrim(p_codigo))
$$;

drop function if exists public.rota_apagar(text);
create or replace function public.rota_apagar_conta(p_token text, p_senha text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_id bigint := privado.aluno_do_token(p_token); v_hash text;
begin
  if v_id is null then raise exception 'sessao_invalida'; end if;
  select senha_hash into v_hash from privado.alunos where id = v_id;
  if v_hash <> extensions.crypt(coalesce(p_senha, ''), v_hash) then raise exception 'senha_atual_errada'; end if;
  delete from privado.alunos where id = v_id;
  return jsonb_build_object('apagado', true);
end $$;

-- configurações públicas (aviso no site, status dos cursos)
create or replace function public.rota_config()
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_object_agg(chave, valor), '{}'::jsonb) from privado.config where chave in ('aviso', 'cursos')
$$;

-- ---------------------------------------------------------------- painel administrativo
create or replace function public.adm_resumo(p_token text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token); r jsonb;
begin
  with dias as (select generate_series((now() at time zone 'America/Sao_Paulo')::date - 29, (now() at time zone 'America/Sao_Paulo')::date, '1 day')::date as d),
  estudo as (
    select distinct a.id, (e.value)::date as d
    from privado.alunos a, jsonb_array_elements_text(coalesce(a.dados->'aluno'->'dias', '[]'::jsonb)) e
    where e.value ~ '^\d{4}-\d{2}-\d{2}$'
  ),
  prog as (
    select a.id, split_part(e.key, '/', 1) as curso, count(*) as n
    from privado.alunos a, jsonb_each(coalesce(a.dados->'progresso', '{}'::jsonb)) e group by 1, 2
  ),
  notas as (
    select split_part(e.key, '/', 1) as curso, (e.value->>'melhor')::int as melhor
    from privado.alunos a, jsonb_each(coalesce(a.dados->'aluno'->'quizzes', '{}'::jsonb)) e
  ),
  aulas_top as (
    select e.key as aula, count(*) as n
    from privado.alunos a, jsonb_each(coalesce(a.dados->'progresso', '{}'::jsonb)) e group by 1 order by 2 desc limit 10
  )
  select jsonb_build_object(
    'totais', (select jsonb_build_object(
        'alunos', count(*), 'novos7', count(*) filter (where criado > now() - interval '7 days'),
        'ativos7', count(*) filter (where ultimo_acesso > now() - interval '7 days'),
        'ativos30', count(*) filter (where ultimo_acesso > now() - interval '30 days'),
        'aulas', coalesce(sum(aulas), 0), 'testes', coalesce(sum(testes), 0), 'xp', coalesce(sum(xp), 0),
        'media', round(avg(media)), 'bloqueados', count(*) filter (where bloqueado), 'admins', count(*) filter (where admin))
      from privado.alunos),
    'certificados', (select count(*) from privado.certificados where not revogado),
    'cadastros', (select jsonb_agg(jsonb_build_object('dia', dias.d, 'n',
        (select count(*) from privado.alunos where (criado at time zone 'America/Sao_Paulo')::date = dias.d)) order by dias.d) from dias),
    'estudando', (select jsonb_agg(jsonb_build_object('dia', dias.d, 'n',
        (select count(*) from estudo where estudo.d = dias.d)) order by dias.d) from dias),
    'cursos', (select jsonb_agg(jsonb_build_object('id', c.id, 'titulo', c.titulo, 'aulas', c.aulas,
        'iniciaram', (select count(*) from prog where prog.curso = c.id),
        'concluiram', (select count(*) from prog where prog.curso = c.id and prog.n >= c.aulas),
        'media', (select round(avg(melhor)) from notas where notas.curso = c.id),
        'certificados', (select count(*) from privado.certificados x where x.curso = c.id and not x.revogado)) order by c.id)
      from privado.cursos c),
    'aulas_top', (select coalesce(jsonb_agg(jsonb_build_object('aula', aula, 'n', n)), '[]'::jsonb) from aulas_top)
  ) into r;
  return r;
end $$;

create or replace function public.adm_alunos(p_token text, p_busca text default '', p_ordem text default 'recentes', p_limite int default 50, p_offset int default 0)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token); b text := '%' || lower(btrim(coalesce(p_busca, ''))) || '%'; r jsonb;
begin
  with f as (
    select a.*, (select count(*) from privado.certificados c where c.aluno_id = a.id and not c.revogado) as certs
    from privado.alunos a
    where lower(coalesce(a.nome, '') || ' ' || coalesce(a.apelido, '') || ' ' || coalesce(a.telefone, '')) like b
  )
  select jsonb_build_object('total', (select count(*) from f), 'itens', coalesce((
    select jsonb_agg(jsonb_build_object('id', id, 'nome', nome, 'apelido', apelido, 'telefone', telefone, 'xp', xp, 'nivel', nivel,
      'aulas', aulas, 'testes', testes, 'media', media, 'seq_melhor', seq_melhor, 'criado', criado, 'ultimo_acesso', ultimo_acesso,
      'bloqueado', bloqueado, 'oculto_ranking', oculto_ranking, 'admin', admin, 'certificados', certs))
    from (select * from f order by
      case when p_ordem = 'xp' then xp end desc nulls last,
      case when p_ordem = 'acesso' then ultimo_acesso end desc nulls last,
      case when p_ordem = 'nome' then lower(coalesce(nome, apelido)) end asc,
      criado desc
      limit greatest(1, least(coalesce(p_limite, 50), 200)) offset greatest(0, coalesce(p_offset, 0))) x), '[]'::jsonb)) into r;
  return r;
end $$;

create or replace function public.adm_aluno(p_token text, p_id bigint)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token);
begin
  return (select jsonb_build_object('id', a.id, 'nome', a.nome, 'apelido', a.apelido, 'telefone', a.telefone, 'xp', a.xp, 'nivel', a.nivel,
      'aulas', a.aulas, 'testes', a.testes, 'media', a.media, 'seq_melhor', a.seq_melhor, 'dias_melhor', a.dias_melhor,
      'criado', a.criado, 'ultimo_acesso', a.ultimo_acesso, 'bloqueado', a.bloqueado, 'oculto_ranking', a.oculto_ranking, 'admin', a.admin,
      'sessoes', (select count(*) from privado.sessoes s where s.aluno_id = a.id and s.expira > now()),
      'dados', a.dados,
      'certificados', coalesce((select jsonb_agg(jsonb_build_object('codigo', c.codigo, 'curso', c.curso, 'nome', c.nome, 'media', c.media,
          'concluido', c.concluido, 'revogado', c.revogado) order by c.emitido desc) from privado.certificados c where c.aluno_id = a.id), '[]'::jsonb))
    from privado.alunos a where a.id = p_id);
end $$;

create or replace function public.adm_acao_aluno(p_token text, p_id bigint, p_acao text, p_valor text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token); v_senha text; v_alvo text;
begin
  select coalesce(nome, apelido) || ' (#' || id || ')' into v_alvo from privado.alunos where id = p_id;
  if v_alvo is null then raise exception 'aluno_nao_encontrado'; end if;
  if p_id = v_adm and p_acao in ('bloquear', 'admin_off', 'apagar') then raise exception 'nao_em_si_mesmo'; end if;
  case p_acao
    when 'resetar_senha' then
      v_senha := substr(translate(encode(extensions.gen_random_bytes(9), 'base64'), '+/=IlO0', 'xyzabcd'), 1, 8);
      update privado.alunos set senha_hash = extensions.crypt(v_senha, extensions.gen_salt('bf', 8)), tentativas = 0, bloqueio_ate = null where id = p_id;
      delete from privado.sessoes where aluno_id = p_id;
    when 'bloquear' then update privado.alunos set bloqueado = true where id = p_id; delete from privado.sessoes where aluno_id = p_id;
    when 'desbloquear' then update privado.alunos set bloqueado = false, tentativas = 0, bloqueio_ate = null where id = p_id;
    when 'ocultar_ranking' then update privado.alunos set oculto_ranking = true where id = p_id;
    when 'mostrar_ranking' then update privado.alunos set oculto_ranking = false where id = p_id;
    when 'apelido' then update privado.alunos set apelido = privado.validar_apelido(p_valor, p_id) where id = p_id;
    when 'nome' then
      if length(btrim(coalesce(p_valor, ''))) < 3 then raise exception 'nome_invalido'; end if;
      update privado.alunos set nome = btrim(p_valor) where id = p_id;
    when 'admin_on' then update privado.alunos set admin = true where id = p_id;
    when 'admin_off' then update privado.alunos set admin = false where id = p_id;
    when 'encerrar_sessoes' then delete from privado.sessoes where aluno_id = p_id;
    when 'zerar_progresso' then
      update privado.alunos set dados = null, xp = 0, nivel = 1, seq_melhor = 0, media = null, testes = 0, aulas = 0, dias_melhor = 0, xp_inicio_semana = 0 where id = p_id;
    when 'apagar' then delete from privado.alunos where id = p_id;
    else raise exception 'acao_invalida';
  end case;
  perform privado.registrar(v_adm, p_acao, v_alvo, case when p_acao in ('apelido', 'nome') then jsonb_build_object('valor', p_valor) end);
  return jsonb_build_object('ok', true, 'senha', v_senha);
end $$;

create or replace function public.adm_certificados(p_token text, p_busca text default '')
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token); b text := '%' || lower(btrim(coalesce(p_busca, ''))) || '%';
begin
  return coalesce((select jsonb_agg(jsonb_build_object('codigo', c.codigo, 'nome', c.nome, 'curso', k.titulo, 'media', c.media, 'concluido', c.concluido,
      'emitido', c.emitido, 'revogado', c.revogado, 'aluno_id', a.id, 'apelido', a.apelido) order by c.emitido desc)
    from privado.certificados c join privado.cursos k on k.id = c.curso join privado.alunos a on a.id = c.aluno_id
    where lower(c.codigo || ' ' || c.nome || ' ' || k.titulo || ' ' || coalesce(a.apelido, '')) like b), '[]'::jsonb);
end $$;

create or replace function public.adm_certificado(p_token text, p_codigo text, p_revogar boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token);
begin
  update privado.certificados set revogado = p_revogar where codigo = p_codigo;
  if not found then raise exception 'certificado_nao_encontrado'; end if;
  perform privado.registrar(v_adm, case when p_revogar then 'revogar_certificado' else 'restaurar_certificado' end, p_codigo);
  return jsonb_build_object('ok', true);
end $$;

-- taxa de acerto de cada questão (primeira resposta de cada aluno)
create or replace function public.adm_questoes(p_token text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token);
begin
  return coalesce((select jsonb_agg(jsonb_build_object('chave', chave, 'total', total, 'acertos', acertos) order by chave)
    from (select e.key as chave, count(*) as total, count(*) filter (where e.value::text = '1') as acertos
          from privado.alunos a, jsonb_each(coalesce(a.dados->'aluno'->'respondidas', '{}'::jsonb)) e group by e.key) q), '[]'::jsonb);
end $$;

create or replace function public.adm_config(p_token text, p_chave text, p_valor jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token);
begin
  if p_chave not in ('aviso', 'cursos') then raise exception 'chave_invalida'; end if;
  insert into privado.config (chave, valor, atualizado) values (p_chave, p_valor, now())
  on conflict (chave) do update set valor = excluded.valor, atualizado = now();
  perform privado.registrar(v_adm, 'config_' || p_chave, p_chave, p_valor);
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.adm_eventos(p_token text, p_limite int default 100)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token);
begin
  return coalesce((select jsonb_agg(jsonb_build_object('quando', quando, 'admin', admin_nome, 'acao', acao, 'alvo', alvo, 'detalhes', detalhes) order by quando desc)
    from (select * from privado.eventos order by quando desc limit greatest(1, least(coalesce(p_limite, 100), 500))) e), '[]'::jsonb);
end $$;

-- ---------------------------------------------------------------- permissões
do $$
declare f text;
begin
  foreach f in array array[
    'rota_cadastrar(text,text,text,text)', 'rota_entrar(text,text)', 'rota_sair(text)', 'rota_eu(text)',
    'rota_trocar_senha(text,text,text)', 'rota_editar_perfil(text,text,text)', 'rota_salvar(text,jsonb,jsonb)',
    'rota_carregar(text)', 'rota_ranking(text,integer)', 'rota_minha_posicao(text,text)',
    'rota_emitir_certificado(text,text,text)', 'rota_verificar_certificado(text)', 'rota_apagar_conta(text,text)', 'rota_config()',
    'adm_resumo(text)', 'adm_alunos(text,text,text,integer,integer)', 'adm_aluno(text,bigint)', 'adm_acao_aluno(text,bigint,text,text)',
    'adm_certificados(text,text)', 'adm_certificado(text,text,boolean)', 'adm_questoes(text)', 'adm_config(text,text,jsonb)', 'adm_eventos(text,integer)']
  loop
    execute format('revoke all on function public.%s from public', f);
    execute format('grant execute on function public.%s to anon, authenticated', f);
  end loop;
end $$;

-- (ajuste) telefone mascarado no formato (11) •••••-0001
create or replace function privado.perfil(p_id bigint) returns jsonb
language sql stable set search_path = '' as $$
  select jsonb_build_object('id', id, 'nome', nome, 'apelido', apelido, 'admin', admin,
    'telefone', case when telefone is null then null
                     when telefone like '+55%' then '(' || substr(telefone, 4, 2) || ') •••••-' || right(telefone, 4)
                     else '•••• ' || right(telefone, 4) end)
  from privado.alunos where id = p_id
$$;
