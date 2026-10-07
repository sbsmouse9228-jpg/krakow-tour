-- =============================================
-- pending_places 테이블 (AI가 발굴한 장소 후보, 관리자 승인 대기)
-- =============================================
create table if not exists public.pending_places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_local text,
  category text not null check (category in ('landmark', 'museum', 'church', 'park', 'food', 'cafe')),
  description text,
  address text,
  lat double precision not null,
  lng double precision not null,
  image_url text,
  rating numeric(2, 1),
  price_level smallint check (price_level between 1 and 4),
  tags text[],
  status text not null default 'pending' check (status in ('pending', 'rejected')),
  source text not null default 'ai-discovery',
  source_notes text,
  created_at timestamptz not null default now()
);

comment on table public.pending_places is 'AI agent가 주기적으로 발굴한 신규 장소 후보. 관리자가 승인하면 places로 옮기고 행을 삭제한다.';
comment on column public.pending_places.source_notes is 'AI가 후보를 제안한 근거(출처 요약 등)';

create index if not exists pending_places_status_idx on public.pending_places (status);

-- =============================================
-- RLS 활성화
-- =============================================
alter table public.pending_places enable row level security;

-- 발굴 스크립트는 service_role 키로 접근하므로 RLS를 우회한다.
-- 일반 사용자에게는 노출되지 않도록 select/update/delete를 로그인한 관리자로 제한한다.
create policy "관리자 대기 명소 조회"
  on public.pending_places for select
  to authenticated
  using (true);

create policy "관리자 대기 명소 수정"
  on public.pending_places for update
  to authenticated
  using (true)
  with check (true);

create policy "관리자 대기 명소 삭제"
  on public.pending_places for delete
  to authenticated
  using (true);
