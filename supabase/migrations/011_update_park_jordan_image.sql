-- =============================================
-- 요르단 공원(Park Jordana) 사진 추가
-- =============================================
update public.places set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Krakow_3Maja_Park_Jordana_widok_05_A-579.JPG'
  where name = 'Jordan Park';
