-- =============================================
-- Wieliczka Salt Mine 사진 추가 (Wikimedia Commons)
-- =============================================
update public.places set image_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Chapel_of_St._Kinga%2C_Wieliczka_Salt_Mine_%282437283812%29.jpg/1280px-Chapel_of_St._Kinga%2C_Wieliczka_Salt_Mine_%282437283812%29.jpg'
  where name = 'Wieliczka Salt Mine';
