-- =============================================
-- MU Restaurant Krakow (무대륙) 추가
-- =============================================
insert into public.places (name, name_local, category, description, address, lat, lng, image_url, rating, price_level, tags) values
  ('MU Restaurant Krakow', null, 'food', 'A Korean bistro and bar in Zabłocie serving dishes like bibimbap, tteokbokki, and Korean fried chicken.', 'ul. Przemysłowa 15, 30-701 Kraków', 50.0480, 19.9602, null, 4.7, 2, array['korean', 'asian'])
on conflict do nothing;
