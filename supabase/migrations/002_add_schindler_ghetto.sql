-- =============================================
-- 쉰들러 공장, 게토 영웅 광장 추가
-- =============================================
insert into public.places (name, name_local, category, description, address, lat, lng, image_url, rating, price_level, tags) values
  ('Oskar Schindler''s Factory', 'Fabryka Emalia Oskara Schindlera', 'museum', 'A former enamelware factory turned museum, telling the story of Kraków under Nazi occupation and Oskar Schindler''s rescue of his Jewish workers.', 'ul. Lipowa 4, 30-702 Kraków', 50.0037, 19.9658, null, 4.8, 2, array['history', 'wwii', 'museum']),
  ('Ghetto Heroes Square', 'Plac Bohaterów Getta', 'landmark', 'A memorial square in Podgórze marking the former Kraków Ghetto, lined with empty chairs commemorating its Jewish residents.', 'Plac Bohaterów Getta, 30-547 Kraków', 50.0489, 19.9525, null, 4.7, 1, array['history', 'wwii', 'memorial'])
on conflict do nothing;
