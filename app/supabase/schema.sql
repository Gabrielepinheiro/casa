-- Família Pinheiro Bernt Eymael — banco de dados no Supabase.
-- Rode este arquivo inteiro uma vez em: Supabase → SQL Editor → New query → Run.

-- Famílias. Cada família tem um código de convite para os outros entrarem.
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  join_code text unique not null default upper(substr(md5(random()::text), 1, 6)),
  created_at timestamptz not null default now()
);

-- Quem faz parte de cada família.
create table if not exists public.family_members (
  family_id uuid not null references public.families on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (family_id, user_id)
);

-- Os dados do app (tarefas, dias, lembretes, receitas, cardápios, pontos...).
-- Cada linha é um "documento": coleção + id + conteúdo em JSON.
create table if not exists public.docs (
  family_id uuid not null references public.families on delete cascade,
  collection text not null,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid(),
  primary key (family_id, collection, id)
);

-- Segurança: só quem é da família vê e muda os dados dela.
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.docs enable row level security;

create or replace function public.is_member(f uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.family_members where family_id = f and user_id = auth.uid());
$$;

drop policy if exists "ver a própria família" on public.families;
create policy "ver a própria família" on public.families for select using (public.is_member(id));

drop policy if exists "ver membros da família" on public.family_members;
create policy "ver membros da família" on public.family_members for select using (user_id = auth.uid() or public.is_member(family_id));

drop policy if exists "dados da família" on public.docs;
create policy "dados da família" on public.docs for all using (public.is_member(family_id)) with check (public.is_member(family_id));

-- Criar uma família nova (quem cria já entra nela).
create or replace function public.create_family(p_name text) returns public.families
language plpgsql security definer set search_path = public as $$
declare f public.families;
begin
  if auth.uid() is null then raise exception 'É preciso entrar na conta'; end if;
  insert into public.families (name) values (p_name) returning * into f;
  insert into public.family_members (family_id, user_id) values (f.id, auth.uid());
  return f;
end $$;

-- Entrar numa família com o código de convite.
create or replace function public.join_family(p_code text) returns public.families
language plpgsql security definer set search_path = public as $$
declare f public.families;
begin
  if auth.uid() is null then raise exception 'É preciso entrar na conta'; end if;
  select * into f from public.families where join_code = upper(trim(p_code));
  if f.id is null then raise exception 'Código não encontrado'; end if;
  insert into public.family_members (family_id, user_id) values (f.id, auth.uid()) on conflict do nothing;
  return f;
end $$;

grant execute on function public.create_family(text) to authenticated;
grant execute on function public.join_family(text) to authenticated;

-- Atualização ao vivo entre aparelhos (tablet, celulares).
alter table public.docs replica identity full;
do $$ begin
  alter publication supabase_realtime add table public.docs;
exception when duplicate_object then null; end $$;
