-- =============================================
-- 요르단 공원(Park Jordana) 추가
-- =============================================
insert into public.places (name, name_local, category, description, address, lat, lng, image_url, rating, price_level, tags) values
  ('Jordan Park', 'Park dra Henryka Jordana', 'park', 'Poland''s oldest public park, featuring monuments to Polish historical figures, playgrounds, and sports fields near Błonia Meadow.', 'al. 3 Maja, 30-063 Kraków', 50.0675, 19.9080, null, 4.6, 1, array['park', 'nature', 'family'])
on conflict do nothing;
