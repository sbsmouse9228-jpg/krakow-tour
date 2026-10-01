-- =============================================
-- inquiries 테이블 (이용자가 관리자에게만 전달하는 의견/문의)
-- =============================================
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  author_name text,
  message text not null,
  created_at timestamptz not null default now()
);

comment on table public.inquiries is '이용자가 관리자에게만 전달하는 의견/문의 (공개되지 않음)';

create index if not exists inquiries_place_idx on public.inquiries (place_id);

alter table public.inquiries enable row level security;

-- 누구나 의견을 등록할 수 있음 (로그인 불필요)
create policy "의견 등록 공개 허용"
  on public.inquiries for insert
  with check (true);

-- 등록된 의견은 관리자(로그인 사용자)만 조회 가능
create policy "인증된 사용자 의견 조회"
  on public.inquiries for select
  to authenticated
  using (true);
