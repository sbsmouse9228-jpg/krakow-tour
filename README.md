# Kraków Guide

크라쿠프(폴란드) 여행을 위한 Expo/React Native 가이드 앱입니다. 로그인 없이 명소·맛집·추천 일정을 둘러보고, 지도에서 위치를 확인하고, 즐겨찾기에 저장할 수 있습니다.

## 주요 기능

- **명소 (Sights)**: 랜드마크/박물관/성당/공원 목록, 이름·태그·주소 검색 및 카테고리 필터
- **맛집/카페 (Food & Cafes)**: 맛집·카페 목록, 동일한 검색/필터 지원
- **지도 (Map)**: 전체 장소를 지도에 마커로 표시, 카테고리별 핀 색상, 현재 위치로 이동
- **추천 일정 (Itineraries)**: 일차별로 구성된 추천 코스, 일정 상세에서 경유지 확인
- **즐겨찾기 (Favorites)**: 장소를 하트 버튼으로 저장하고 즐겨찾기 탭에서 모아보기 (기기 로컬 저장, 로그인 불필요)
- **리뷰 (Review)**: 장소 상세 화면에서 별점+메시지로 리뷰 등록, 모든 사용자가 해당 장소의 리뷰를 조회 가능, 이메일로 바로 보내기 버튼도 제공
- **관리자 (Admin)**: `/admin`에서 Supabase Auth로 로그인 후 새 명소 등록, 받은 리뷰 목록 확인
- **다국어**: 기본 언어 영어, 우측 상단 버튼으로 한국어 전환

## 기술 스택

- [Expo](https://expo.dev) / [Expo Router](https://docs.expo.dev/router/introduction/) (React Native)
- [Supabase](https://supabase.com) (Postgres + REST API, 데이터 저장)
- [NativeWind](https://www.nativewind.dev) (Tailwind CSS for React Native)
- [i18next](https://www.i18next.com) / react-i18next (다국어)
- react-native-maps (지도)
- TypeScript

## 프로젝트 구조

```
app/                    # Expo Router 라우트 (화면)
  (tabs)/                 - 탭 화면: index(명소), food, map, itineraries, favorites
  place/[id].tsx           - 장소 상세
  itinerary/[id].tsx       - 일정 상세
  review/[placeId].tsx     - 장소별 리뷰 남기기
  admin/index.tsx          - 관리자 로그인 + 명소 등록/리뷰 확인
components/             # 재사용 UI 컴포넌트
contexts/                # 전역 상태 (즐겨찾기, 인증 등)
hooks/                   # 데이터 훅 (usePlaces, useItineraries)
i18n/                    # 다국어 설정 및 번역 파일
lib/supabase.ts          # Supabase 클라이언트
types/database.ts        # DB 타입 정의
supabase/migrations/     # DB 스키마, 시드 데이터, 장소 추가/이미지 업데이트 (번호순 적용)
utils/                   # 필터링 등 유틸 함수
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사해 `.env`를 만들고 Supabase 프로젝트 정보를 채워주세요.

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_ADMIN_EMAIL=admin@example.com
```

`EXPO_PUBLIC_ADMIN_EMAIL`은 장소 상세 화면의 "이메일로 보내기" 버튼이 여는 mailto 링크의 수신 주소입니다.

### 3. Supabase 스키마 적용

`supabase/migrations/`에 번호순으로 마이그레이션 파일이 있습니다. Supabase CLI로 연결된 프로젝트에 적용하세요.

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

CLI 없이도 각 `.sql` 파일 내용을 Supabase 대시보드의 SQL 에디터에 순서대로 붙여넣어 실행할 수 있습니다.

> 관리자 기능을 쓰려면 Supabase 대시보드 **Authentication → Users**에서 관리자 계정을 직접 생성하세요. 앱 내 회원가입 화면은 없으며, 로그인한 사용자는 누구나 명소 등록 및 피드백 조회 권한을 가집니다.

### 4. 개발 서버 실행

```bash
npx expo start       # 개발 서버 시작 (QR 코드로 Expo Go 접속)
npx expo start --ios     # iOS 시뮬레이터
npx expo start --android # Android 에뮬레이터
npx expo start --web     # 웹 프리뷰
```

지도(react-native-maps), 위치(expo-location) 등 네이티브 모듈이 포함되어 있어 Expo Go에서 기본 동작하지만, 네이티브 모듈을 추가/변경한 경우 개발 빌드가 필요합니다: `npx expo run:ios` / `npx expo run:android`.

> Android에서 지도를 표시하려면 `app.json`의 `expo.android.config.googleMaps.apiKey`에 발급받은 Google Maps API 키를 넣어야 합니다 (현재 플레이스홀더 상태).

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npx expo start` | 개발 서버 실행 |
| `npx expo lint` | ESLint 검사 |
| `npx tsc --noEmit` | 타입 체크 |
| `npx expo-doctor` | 의존성/설정 진단 |
| `npx expo install --fix` | SDK 호환 버전으로 의존성 수정 |

커밋 전 `npx expo lint`와 `npx tsc --noEmit`을 실행해 통과하는지 확인해주세요.

## 남은 작업

- 테스트 코드 없음
- 샘플 데이터가 적어 콘텐츠 보강 필요 (현재 명소 6곳, 맛집/카페 2곳, 일정 1개)
- 장소 이미지는 Wikimedia Commons의 임시 이미지로 채워둔 상태. 대부분 CC BY-SA 라이선스라 정식 서비스 전환 시 출처 표기 또는 자체 촬영 이미지로 교체 필요 (`image_url`이 비어 있으면 이모지로 대체 표시)
