create table perfis (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  usuario text unique not null,
  papel text not null check (papel in ('gestao','colaborador')),
  created_at timestamptz default now()
);
create table colaboradores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  equipe text not null check (equipe in ('Equipe A','Equipe B')),
  fixo boolean default false,
  falta boolean default false,
  ativo boolean default true,
  created_at timestamptz default now()
);
create table bancadas (
  id uuid primary key default gen_random_uuid(),
  lado text not null check (lado in ('A','B')),
  numero text not null,
  ordem int not null,
  ativa boolean default true
);
create table metas_diarias (
  id uuid primary key default gen_random_uuid(),
  data date not null default current_date,
  meta int default 0,
  realizado int default 0,
  atualizado_por text,
  updated_at timestamptz default now()
);
create table historico_operacional (
  id uuid primary key default gen_random_uuid(),
  tipo text not null,
  descricao text not null,
  created_at timestamptz default now()
);
