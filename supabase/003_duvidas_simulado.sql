-- Rota Industrial — dúvidas nas aulas (respondidas pelo painel admin) e simulado final no certificado

create table if not exists privado.duvidas (
  id bigint generated always as identity primary key,
  aluno_id bigint not null references privado.alunos(id) on delete cascade,
  curso text not null references privado.cursos(id),
  aula text not null check (aula ~ '^\d+-\d+$'),
  texto text not null,
  criado timestamptz not null default now(),
  resposta text,
  respondido_em timestamptz,
  respondido_por bigint references privado.alunos(id) on delete set null,
  publica boolean not null default true,
  status text not null default 'pendente' check (status in ('pendente', 'respondida', 'oculta'))
);
create index if not exists duvidas_aula on privado.duvidas (curso, aula);
create index if not exists duvidas_status on privado.duvidas (status, criado);
alter table privado.duvidas enable row level security;

-- dúvidas de uma aula: as respondidas públicas para todos + as do próprio aluno
create or replace function public.rota_duvidas(p_curso text, p_aula text, p_token text default null)
returns jsonb language sql stable security definer set search_path = '' as $$
  with eu as (select privado.aluno_do_token(p_token) as id)
  select coalesce(jsonb_agg(jsonb_build_object('id', d.id, 'apelido', a.apelido, 'texto', d.texto, 'criado', d.criado,
      'resposta', d.resposta, 'respondido_em', d.respondido_em, 'status', d.status, 'publica', d.publica,
      'minha', d.aluno_id = (select id from eu)) order by coalesce(d.respondido_em, d.criado) desc), '[]'::jsonb)
  from privado.duvidas d join privado.alunos a on a.id = d.aluno_id
  where d.curso = p_curso and d.aula = p_aula
    and ((d.status = 'respondida' and d.publica and not a.bloqueado) or (d.aluno_id = (select id from eu) and d.status <> 'oculta'))
$$;

create or replace function public.rota_enviar_duvida(p_token text, p_curso text, p_aula text, p_texto text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_id bigint := privado.aluno_do_token(p_token); v_txt text := btrim(coalesce(p_texto, '')); v_novo bigint;
begin
  if v_id is null then raise exception 'sessao_invalida'; end if;
  if length(v_txt) < 10 then raise exception 'duvida_curta'; end if;
  if length(v_txt) > 1000 then raise exception 'duvida_longa'; end if;
  if not exists (select 1 from privado.cursos where id = p_curso) or coalesce(p_aula, '') !~ '^\d+-\d+$' then raise exception 'aula_invalida'; end if;
  if (select count(*) from privado.duvidas where aluno_id = v_id and status = 'pendente') >= 5 then raise exception 'muitas_pendentes'; end if;
  if (select count(*) from privado.duvidas where aluno_id = v_id and criado > now() - interval '24 hours') >= 10 then raise exception 'limite_diario'; end if;
  insert into privado.duvidas (aluno_id, curso, aula, texto) values (v_id, p_curso, p_aula, v_txt) returning id into v_novo;
  return jsonb_build_object('ok', true, 'id', v_novo);
end $$;

create or replace function public.rota_apagar_duvida(p_token text, p_id bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_id bigint := privado.aluno_do_token(p_token);
begin
  if v_id is null then raise exception 'sessao_invalida'; end if;
  delete from privado.duvidas where id = p_id and aluno_id = v_id and status = 'pendente';
  if not found then raise exception 'duvida_nao_encontrada'; end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.rota_minhas_duvidas(p_token text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'curso', curso, 'aula', aula, 'texto', texto, 'criado', criado,
      'resposta', resposta, 'respondido_em', respondido_em, 'status', status) order by criado desc), '[]'::jsonb)
  from privado.duvidas where aluno_id = privado.aluno_do_token(p_token) and status <> 'oculta'
$$;

-- painel: lista, resposta e moderação
create or replace function public.adm_duvidas(p_token text, p_status text default 'pendente')
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token);
begin
  return coalesce((select jsonb_agg(jsonb_build_object('id', d.id, 'curso', d.curso, 'aula', d.aula, 'texto', d.texto, 'criado', d.criado,
      'resposta', d.resposta, 'respondido_em', d.respondido_em, 'status', d.status, 'publica', d.publica,
      'aluno_id', a.id, 'apelido', a.apelido, 'nome', a.nome, 'respondido_por', (select coalesce(nome, apelido) from privado.alunos r where r.id = d.respondido_por))
      order by case when d.status = 'pendente' then d.criado end asc, d.criado desc)
    from privado.duvidas d join privado.alunos a on a.id = d.aluno_id
    where p_status = 'todas' or d.status = p_status), '[]'::jsonb);
end $$;

create or replace function public.adm_responder_duvida(p_token text, p_id bigint, p_resposta text, p_publica boolean default true)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token); v_txt text := btrim(coalesce(p_resposta, ''));
begin
  if length(v_txt) < 2 then raise exception 'resposta_curta'; end if;
  update privado.duvidas set resposta = left(v_txt, 4000), respondido_em = now(), respondido_por = v_adm, publica = coalesce(p_publica, true), status = 'respondida'
  where id = p_id;
  if not found then raise exception 'duvida_nao_encontrada'; end if;
  perform privado.registrar(v_adm, 'responder_duvida', 'dúvida #' || p_id, jsonb_build_object('publica', p_publica));
  return jsonb_build_object('ok', true);
end $$;

create or replace function public.adm_duvida_acao(p_token text, p_id bigint, p_acao text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token);
begin
  case p_acao
    when 'ocultar' then update privado.duvidas set status = 'oculta' where id = p_id;
    when 'reabrir' then update privado.duvidas set status = 'pendente', resposta = null, respondido_em = null, respondido_por = null where id = p_id;
    when 'apagar' then delete from privado.duvidas where id = p_id;
    else raise exception 'acao_invalida';
  end case;
  perform privado.registrar(v_adm, p_acao || '_duvida', 'dúvida #' || p_id);
  return jsonb_build_object('ok', true);
end $$;

-- contadores para o menu do painel e estatísticas dos simulados
create or replace function public.adm_contadores(p_token text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token);
begin
  return jsonb_build_object('duvidas_pendentes', (select count(*) from privado.duvidas where status = 'pendente'));
end $$;

create or replace function public.adm_simulados(p_token text)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare v_adm bigint := privado.admin_do_token(p_token);
begin
  return coalesce((select jsonb_object_agg(curso, jsonb_build_object('alunos', n, 'aprovados', ap, 'media', md)) from (
    select e.key as curso, count(*) as n, count(*) filter (where (e.value->>'melhor')::int >= 70) as ap, round(avg((e.value->>'melhor')::int)) as md
    from privado.alunos a, jsonb_each(coalesce(a.dados->'aluno'->'simulados', '{}'::jsonb)) e group by e.key) x), '{}'::jsonb);
end $$;

-- certificado: agora exige também o simulado final com 70 % ou mais
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
  if coalesce((v_aluno.dados->'aluno'->'simulados'->p_curso->>'melhor')::int, 0) < 70 then raise exception 'simulado_pendente'; end if;
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

do $$
declare f text;
begin
  foreach f in array array[
    'rota_duvidas(text,text,text)', 'rota_enviar_duvida(text,text,text,text)', 'rota_apagar_duvida(text,bigint)', 'rota_minhas_duvidas(text)',
    'adm_duvidas(text,text)', 'adm_responder_duvida(text,bigint,text,boolean)', 'adm_duvida_acao(text,bigint,text)',
    'adm_contadores(text)', 'adm_simulados(text)', 'rota_emitir_certificado(text,text,text)']
  loop
    execute format('revoke all on function public.%s from public', f);
    execute format('grant execute on function public.%s to anon, authenticated', f);
  end loop;
end $$;
