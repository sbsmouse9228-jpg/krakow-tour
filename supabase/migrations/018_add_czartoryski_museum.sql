-- =============================================
-- Czartoryski Museum (Muzeum Książąt Czartoryskich) 추가
-- =============================================
insert into public.places (name, name_local, category, description, address, lat, lng, image_url, rating, price_level, tags) values
  ('Czartoryski Museum', 'Muzeum Książąt Czartoryskich', 'museum', 'One of Poland''s oldest museums, housing Leonardo da Vinci''s Lady with an Ermine, Rembrandt''s Landscape with the Good Samaritan, and the princely Czartoryski family collections.', 'ul. św. Jana 19, 31-018 Kraków', 50.0662, 19.9411, null, 4.7, 2, array['art', 'history', 'museum', 'leonardo'])
on conflict do nothing;
