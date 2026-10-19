-- =============================================
-- 비엘리치카 소금광산 (Kopalnia Soli „Wieliczka”) 추가
-- =============================================
insert into public.places (name, name_local, category, description, address, lat, lng, image_url, rating, price_level, tags) values
  ('Wieliczka Salt Mine', 'Kopalnia Soli „Wieliczka”', 'landmark', 'UNESCO World Heritage underground salt mine with over 700 years of history, featuring chambers, sculptures and the spectacular St. Kinga''s Chapel carved entirely from rock salt.', 'Daniłowicza 10, 32-020 Wieliczka', 49.9833, 20.0562, null, 4.7, 2, array['unesco', 'history', 'underground', 'salt'])
on conflict do nothing;
