-- =============================================
-- 확장
-- =============================================
create extension if not exists "pgcrypto";

-- =============================================
-- places 테이블 (명소/맛집/카페 공용)
-- =============================================
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_local text,
  category text not null check (category in ('landmark', 'museum', 'church', 'park', 'food', 'cafe')),
  description text,
  address text,
  lat double precision not null,
  lng double precision not null,
  image_url text,
  rating numeric(2, 1),
  price_level smallint check (price_level between 1 and 4),
  tags text[],
  created_at timestamptz not null default now()
);

comment on table public.places is '명소/박물관/성당/공원/맛집/카페를 아우르는 장소 정보';
comment on column public.places.name is '앱의 기본 표시 언어(영어) 이름';
comment on column public.places.name_local is '현지어(폴란드어 등) 이름, 참고용';

create index if not exists places_category_idx on public.places (category);

-- =============================================
-- itineraries 테이블 (추천 일정/코스)
-- =============================================
create table if not exists public.itineraries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_days smallint not null default 1,
  cover_image_url text,
  created_at timestamptz not null default now()
);

comment on table public.itineraries is '추천 여행 일정/코스';

-- =============================================
-- itinerary_stops 테이블 (일정 내 장소 순서)
-- =============================================
create table if not exists public.itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references public.itineraries (id) on delete cascade,
  place_id uuid not null references public.places (id) on delete cascade,
  day_number smallint not null default 1,
  order_in_day smallint not null default 1,
  note text
);

comment on table public.itinerary_stops is '일정에 포함된 장소와 일차/순서';

create index if not exists itinerary_stops_itinerary_idx on public.itinerary_stops (itinerary_id);

-- =============================================
-- RLS 활성화
-- =============================================
alter table public.places enable row level security;
alter table public.itineraries enable row level security;
alter table public.itinerary_stops enable row level security;

-- 로그인 없이 보는 가이드 앱이므로 anon 역할에 읽기 전용 공개
create policy "장소 전체 공개 조회"
  on public.places for select
  using (true);

create policy "일정 전체 공개 조회"
  on public.itineraries for select
  using (true);

create policy "일정 경유지 전체 공개 조회"
  on public.itinerary_stops for select
  using (true);

-- =============================================
-- 샘플 데이터 (앱 표시 언어는 영어가 기본)
-- =============================================
insert into public.places (name, name_local, category, description, address, lat, lng, image_url, rating, price_level, tags) values
  ('Wawel Castle', 'Zamek Królewski na Wawelu', 'landmark', 'The former residence of Polish kings and Kraków''s most iconic landmark.', 'Wawel 5, 31-001 Kraków', 50.0544, 19.9356, null, 4.7, 2, array['history', 'must-see']),
  ('Main Market Square', 'Rynek Główny', 'landmark', 'One of the largest medieval town squares in Europe, home to the Cloth Hall and St. Mary''s Basilica.', 'Rynek Główny, 31-042 Kraków', 50.0616, 19.9373, null, 4.8, 1, array['square', 'must-see']),
  ('St. Mary''s Basilica', 'Bazylika Mariacka', 'church', 'A Gothic church famous for the hourly trumpet call played from its tower.', 'plac Mariacki 5, 31-042 Kraków', 50.0614, 19.9394, null, 4.8, 2, array['church', 'architecture']),
  ('Kazimierz', 'Kazimierz', 'landmark', 'The historic Jewish quarter, known for its eclectic cafes and street art.', 'Kazimierz, Kraków', 50.0512, 19.9445, null, 4.6, 1, array['neighborhood', 'jewish-heritage'])
on conflict do nothing;

insert into public.places (name, name_local, category, description, address, lat, lng, image_url, rating, price_level, tags) values
  ('Café Camelot', null, 'cafe', 'A cozy cafe near the Old Town serving traditional Polish cakes.', 'ul. Świętego Tomasza 17, Kraków', 50.0629, 19.9385, null, 4.6, 2, array['dessert', 'traditional']),
  ('Pierogi Mr Vincent', null, 'food', 'A handmade pierogi restaurant with a wide range of fillings to choose from.', 'ul. Bożego Ciała 12, Kraków', 50.0508, 19.9459, null, 4.7, 1, array['pierogi', 'local-food'])
on conflict do nothing;

with sample_itinerary as (
  insert into public.itineraries (title, description, duration_days)
  values ('Kraków Highlights: 1-Day Route', 'A one-day route through the Old Town, perfect for first-time visitors.', 1)
  returning id
)
insert into public.itinerary_stops (itinerary_id, place_id, day_number, order_in_day, note)
select sample_itinerary.id, places.id, 1, row_number() over (order by places.name), null
from sample_itinerary, public.places as places
where places.name in ('Wawel Castle', 'Main Market Square', 'St. Mary''s Basilica')
on conflict do nothing;
