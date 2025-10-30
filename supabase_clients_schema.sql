-- SCHEMA SUPABASE : Table 'clients'
-- Ce fichier vous permet de créer la table sur n'importe quel compte Supabase en un copier-coller.
-- Collez ces requêtes dans le SQL Editor de Supabase et exécutez-les.

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  amountDue numeric not null default 0,
  amountPaid numeric not null default 0,
  status text not null default 'non-payé',
  created_at timestamp with time zone default timezone('utc', now())
);

-- (Optionnel mais recommandé) Active la sécurité ligne à ligne (RLS)
alter table public.clients enable row level security;

-- (Pour dev/demo) Politique qui accepte toutes les opérations publics (lecture/écriture)
create policy if not exists "Enable all operations" on public.clients for all using (true);

-- Personnalisez les droits dans Supabase > Auth / Policies si besoin.
