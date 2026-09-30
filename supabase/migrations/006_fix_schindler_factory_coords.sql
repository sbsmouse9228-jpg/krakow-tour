-- =============================================
-- 쉰들러 공장 좌표 오류 수정
-- =============================================
update public.places
set lat = 50.04740, lng = 19.96175
where name = 'Oskar Schindler''s Factory';
