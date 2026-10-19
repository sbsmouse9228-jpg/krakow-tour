-- =============================================
-- Wieliczka Salt Mine 사진을 성 킹가 예배당 사진으로 변경 (Wikimedia Commons)
-- =============================================
update public.places set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Wieliczka%2C_St_Kingas_Chapel_%286467348331%29.jpg/1280px-Wieliczka%2C_St_Kingas_Chapel_%286467348331%29.jpg'
  where name = 'Wieliczka Salt Mine';
