-- =============================================
-- feedback 테이블 (장소별 사용자 의견)
-- =============================================
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references public.places (id) on delete cascade,
  author_name text,
  rating smallint check (rating between 1 and 5),
  message text not null,
  created_at timestamptz not null default now()
);

comment on table public.feedback is '사용자가 장소에 대해 남긴 의견/피드백';

create index if not exists feedback_place_idx on public.feedback (place_id);

alter table public.feedback enable row level security;

-- 누구나 피드백을 남길 수 있음 (로그인 불필요)
create policy "피드백 등록 공개 허용"
  on public.feedback for insert
  with check (true);

-- 등록된 피드백은 관리자(로그인 사용자)만 조회 가능 (개인정보/스팸 보호)
create policy "인증된 사용자 피드백 조회"
  on public.feedback for select
  to authenticated
  using (true);
