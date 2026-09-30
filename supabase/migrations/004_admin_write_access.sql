-- =============================================
-- 관리자(로그인 사용자) 장소 등록 허용
-- =============================================
-- 이 앱에는 별도 회원가입 화면이 없습니다. 관리자 계정은
-- Supabase 대시보드 > Authentication > Users 에서 직접 생성하세요.
-- 로그인한 사용자는 누구나 관리자로 간주되어 장소를 등록할 수 있습니다.
create policy "인증된 사용자 장소 등록"
  on public.places for insert
  to authenticated
  with check (true);
