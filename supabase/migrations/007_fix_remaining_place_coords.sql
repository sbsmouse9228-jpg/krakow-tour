-- =============================================
-- 나머지 장소 좌표 정밀도 보정 (Wikipedia/지도 서비스 대조)
-- =============================================
update public.places set lat = 50.05389, lng = 19.93472
  where name = 'Wawel Castle';

update public.places set lat = 50.06298, lng = 19.93920
  where name = 'Café Camelot';

update public.places set lat = 50.05156, lng = 19.94361
  where name = 'Pierogi Mr Vincent';
