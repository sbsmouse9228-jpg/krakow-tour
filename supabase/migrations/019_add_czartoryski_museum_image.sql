-- =============================================
-- Czartoryski Museum 사진 추가 (Wikimedia Commons)
-- =============================================
update public.places set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Czartoryski_Museum%2C_Monastery%2C_6_Pijarska_street%2C_Old_Town%2C_Krak%C3%B3w%2C_Poland.jpg/1280px-Czartoryski_Museum%2C_Monastery%2C_6_Pijarska_street%2C_Old_Town%2C_Krak%C3%B3w%2C_Poland.jpg'
  where name = 'Czartoryski Museum';
