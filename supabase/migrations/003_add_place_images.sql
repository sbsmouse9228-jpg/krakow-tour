-- =============================================
-- 장소 이미지 채우기 (Wikimedia Commons, CC 라이선스 이미지)
-- =============================================
update public.places set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Wawel_castle.jpg'
  where name = 'Wawel Castle';

update public.places set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Krak%C3%B3w,_Rynek_G%C5%82%C3%B3wny_34.JPG'
  where name = 'Main Market Square';

update public.places set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Krak%C3%B3w_-_St._Mary_Church_01.JPG'
  where name = 'St. Mary''s Basilica';

update public.places set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Krakow_kazimierz_2.jpg'
  where name = 'Kazimierz';

update public.places set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Cafe_Camelot._Krakow,_Poland.jpg'
  where name = 'Café Camelot';

update public.places set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Pierogi_07-01.JPG'
  where name = 'Pierogi Mr Vincent';

update public.places set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Oskar_Schindlers_Fabrik_Krakau.JPG'
  where name = 'Oskar Schindler''s Factory';

update public.places set image_url = 'https://commons.wikimedia.org/wiki/Special:FilePath/Krak%C3%B3w_-_Plac_Bohater%C3%B3w_Getta.jpg'
  where name = 'Ghetto Heroes Square';
