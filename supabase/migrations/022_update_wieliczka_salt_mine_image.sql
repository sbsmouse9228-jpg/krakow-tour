-- =============================================
-- Wieliczka Salt Mine 사진을 더 밝은 사진으로 변경 (Wikimedia Commons)
-- =============================================
update public.places set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Wieliczka_Salt_Mine_2024-07-08_%2825%29.jpg/1280px-Wieliczka_Salt_Mine_2024-07-08_%2825%29.jpg'
  where name = 'Wieliczka Salt Mine';
