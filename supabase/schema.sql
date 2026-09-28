-- 크라쿠프 가이드 앱 초기 스키마
-- Supabase SQL Editor에서 실행하세요.

create extension if not exists "uuid-ossp";

create table if not exists places (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  name_en text,
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

create table if not exists itineraries (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  duration_days smallint not null default 1,
  cover_image_url text,
  created_at timestamptz not null default now()
);

create table if not exists itinerary_stops (
  id uuid primary key default uuid_generate_v4(),
  itinerary_id uuid not null references itineraries (id) on delete cascade,
  place_id uuid not null references places (id) on delete cascade,
  day_number smallint not null default 1,
  order_in_day smallint not null default 1,
  note text
);

create index if not exists idx_places_category on places (category);
create index if not exists idx_itinerary_stops_itinerary on itinerary_stops (itinerary_id);

-- 앱이 로그인 없이 읽기만 하는 가이드 앱이므로 anon 역할에 읽기 권한만 부여
alter table places enable row level security;
alter table itineraries enable row level security;
alter table itinerary_stops enable row level security;

create policy "public read places" on places for select using (true);
create policy "public read itineraries" on itineraries for select using (true);
create policy "public read itinerary_stops" on itinerary_stops for select using (true);

-- 샘플 데이터
insert into places (name, name_en, category, description, address, lat, lng, image_url, rating, price_level, tags) values
  ('바벨성', 'Wawel Castle', 'landmark', '폴란드 왕들이 거주했던 성으로 크라쿠프를 대표하는 랜드마크입니다.', 'Wawel 5, 31-001 Kraków', 50.0544, 19.9356, null, 4.7, 2, array['역사', '필수코스']),
  ('구시가지 광장', 'Rynek Główny', 'landmark', '유럽에서 가장 큰 중세 광장 중 하나로 직물회관과 성모마리아 성당이 있습니다.', 'Rynek Główny, 31-042 Kraków', 50.0616, 19.9373, null, 4.8, 1, array['광장', '필수코스']),
  ('성모마리아 성당', 'St. Mary''s Basilica', 'church', '매시 정각 트럼펫 연주로 유명한 고딕 양식 성당입니다.', 'plac Mariacki 5, 31-042 Kraków', 50.0614, 19.9394, null, 4.8, 2, array['성당', '건축']),
  ('카지미에시 지구', 'Kazimierz', 'landmark', '옛 유대인 지구로 개성 있는 카페와 거리 예술로 유명합니다.', 'Kazimierz, Kraków', 50.0512, 19.9445, null, 4.6, 1, array['거리', '유대인역사'])
on conflict do nothing;

insert into places (name, name_en, category, description, address, lat, lng, image_url, rating, price_level, tags) values
  ('Café Camelot', 'Café Camelot', 'cafe', '구시가지 근처의 아늑한 폴란드 전통 케이크 카페입니다.', 'ul. Świętego Tomasza 17, Kraków', 50.0629, 19.9385, null, 4.6, 2, array['디저트', '전통카페']),
  ('Pierogi Mr Vincent', 'Pierogi Mr Vincent', 'food', '수제 피에로기 전문점으로 다양한 속재료를 선택할 수 있습니다.', 'ul. Bożego Ciała 12, Kraków', 50.0508, 19.9459, null, 4.7, 1, array['피에로기', '현지음식'])
on conflict do nothing;

with sample_itinerary as (
  insert into itineraries (title, description, duration_days)
  values ('크라쿠프 핵심 1일 코스', '처음 방문하는 여행자를 위한 구시가지 중심 당일 코스입니다.', 1)
  returning id
)
insert into itinerary_stops (itinerary_id, place_id, day_number, order_in_day, note)
select sample_itinerary.id, places.id, 1, row_number() over (order by places.name), null
from sample_itinerary, places
where places.name in ('바벨성', '구시가지 광장', '성모마리아 성당')
on conflict do nothing;
