-- =============================================
-- 방문자 수(앱 실행 횟수) 카운터
-- =============================================
create table if not exists public.app_stats (
  id smallint primary key default 1,
  visit_count bigint not null default 0
);

insert into public.app_stats (id, visit_count) values (1, 0)
on conflict (id) do nothing;

alter table public.app_stats enable row level security;

-- 방문자 수는 누구나 조회 가능
create policy "방문자 수 공개 조회"
  on public.app_stats for select
  using (true);

-- 직접 UPDATE 권한은 주지 않고, 아래 함수를 통해서만 증가시킴 (임의 조작 방지)
create or replace function public.increment_visit_count()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count bigint;
begin
  update public.app_stats
  set visit_count = visit_count + 1
  where id = 1
  returning visit_count into new_count;

  return new_count;
end;
$$;

grant execute on function public.increment_visit_count() to anon, authenticated;
