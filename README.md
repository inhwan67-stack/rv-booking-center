# RV 인증관리센터

캠핑카·카라반 검사·정비·구조변경 전문 예약 플랫폼 프론트엔드입니다. React, Vite, Tailwind CSS 기반이며 예약 신청, 사진 업로드, 관리자 예약 목록 화면을 포함합니다.

Supabase 환경변수가 있으면 예약 데이터는 Supabase `bookings` 테이블과 Storage에 저장됩니다. Supabase 환경변수가 없으면 테스트를 위해 브라우저 `localStorage`에 임시 저장됩니다.

## 로컬 실행

Windows PowerShell에서는 실행 정책 문제로 `npm` 대신 `npm.cmd` 사용을 권장합니다.

```bash
npm.cmd install
npm.cmd run dev
```

브라우저에서 터미널에 표시되는 주소를 엽니다. 보통 아래 주소입니다.

```text
http://localhost:5173/
```

## 빌드 확인

배포 전 반드시 아래 명령으로 오류가 없는지 확인합니다.

```bash
npm.cmd run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

## 환경변수

`.env.example`을 복사해서 프로젝트 루트에 `.env` 파일을 만들 수 있습니다.

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_STORAGE_BUCKET=booking-photos
VITE_ADMIN_NOTIFICATION_EMAIL=admin@example.com
VITE_KAKAO_NOTIFICATION_WEBHOOK_URL=
```

Supabase 프로젝트의 `Project Settings > API`에서 `Project URL`과 `anon public` key를 확인해 입력합니다. 환경변수를 바꾼 뒤에는 개발 서버를 재시작해야 합니다.

`.env` 파일이 없어도 예약 신청은 동작합니다. 이 경우 성공 메시지는 `테스트 예약이 접수되었습니다. 현재는 브라우저 임시 저장 상태입니다.`로 표시되며, 관리자 페이지도 같은 브라우저의 `localStorage` 예약 목록을 보여줍니다.

## Supabase 테이블 생성 SQL

Supabase SQL Editor에서 아래 SQL을 실행합니다.

```sql
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  region text not null,
  vehicle_type text not null,
  vehicle_model text not null,
  vehicle_year text not null,
  service text not null,
  vehicle_status text not null,
  message text default '',
  photo_urls jsonb not null default '[]'::jsonb,
  process_status text not null default '접수',
  created_at timestamptz not null default now(),
  constraint bookings_process_status_check
    check (process_status in ('접수', '상담중', '견적중', '완료'))
);

alter table public.bookings enable row level security;

create policy "Allow public booking insert"
on public.bookings
for insert
to anon
with check (true);

create policy "Allow public booking read"
on public.bookings
for select
to anon
using (true);
```

현재 관리자 화면도 프론트엔드에서 anon key로 조회하므로 `select` 정책을 열어두었습니다. 실제 운영에서는 관리자 인증을 붙이고 select 정책을 관리자에게만 허용하는 방식으로 바꾸는 것이 맞습니다.

## Supabase Storage 설정

사진 업로드를 Supabase에 저장하려면 Storage에서 `booking-photos` 버킷을 생성합니다. `.env`의 `VITE_SUPABASE_STORAGE_BUCKET` 값을 바꾸면 다른 버킷명을 사용할 수 있습니다.

테스트를 빠르게 하려면 버킷을 public으로 만들고 아래 정책을 추가합니다.

```sql
create policy "Allow public booking photo upload"
on storage.objects
for insert
to anon
with check (bucket_id = 'booking-photos');

create policy "Allow public booking photo read"
on storage.objects
for select
to anon
using (bucket_id = 'booking-photos');
```

Supabase 환경변수가 없으면 사진은 브라우저 `localStorage`에 data URL 형태로 임시 저장됩니다. 이 방식은 테스트용이며 큰 사진을 많이 저장하기에는 적합하지 않습니다.

## Vercel 배포 방법

### 1. GitHub에 프로젝트 올리기

Vercel은 GitHub 저장소와 연결해서 배포하는 방식이 가장 쉽습니다.

1. GitHub에서 새 저장소를 만듭니다.
2. 이 프로젝트 폴더를 GitHub 저장소에 push합니다.
3. `.env` 파일은 올리지 않습니다. `.env.example`만 올립니다.

### 2. Vercel에서 새 프로젝트 만들기

1. https://vercel.com 에 로그인합니다.
2. `Add New...` 버튼을 누릅니다.
3. `Project`를 선택합니다.
4. GitHub 저장소 목록에서 이 프로젝트를 선택합니다.
5. Framework Preset이 `Vite`로 잡히는지 확인합니다.

Vercel 설정값은 아래처럼 두면 됩니다.

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

이 프로젝트에는 [vercel.json](./vercel.json)이 포함되어 있어 Vercel이 `npm run build`로 빌드하고 `dist` 폴더를 배포합니다.

### 3. Vercel 환경변수 입력

Supabase를 실제로 연결하려면 Vercel 프로젝트 설정에서 환경변수를 입력합니다.

1. Vercel 프로젝트 화면으로 이동합니다.
2. `Settings`를 누릅니다.
3. `Environment Variables` 메뉴를 엽니다.
4. 아래 값을 추가합니다.

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_STORAGE_BUCKET
VITE_ADMIN_NOTIFICATION_EMAIL
VITE_KAKAO_NOTIFICATION_WEBHOOK_URL
```

필수값은 아래 2개입니다.

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

사진 업로드를 Supabase Storage로 저장하려면 아래 값도 넣습니다.

```text
VITE_SUPABASE_STORAGE_BUCKET=booking-photos
```

환경변수를 추가하거나 수정한 뒤에는 Vercel에서 다시 배포해야 반영됩니다.

### 4. 배포하기

설정 확인 후 `Deploy` 버튼을 누릅니다. 배포가 끝나면 Vercel이 사이트 주소를 제공합니다.

예시:

```text
https://your-project-name.vercel.app
```

### 5. 배포 후 확인할 것

배포된 사이트에서 아래 기능을 확인합니다.

- 메인 페이지가 정상 표시되는지
- 예약 폼 제출이 되는지
- Supabase 환경변수가 없을 때 테스트 저장 메시지가 나오는지
- Supabase 환경변수가 있을 때 `bookings` 테이블에 데이터가 저장되는지
- 사진 업로드 후 관리자 페이지에서 사진 링크가 보이는지
- 관리자 페이지에서 예약 목록이 보이는지

## 주요 구조

```text
src/
  components/
    BookingForm.jsx
    AdminDashboard.jsx
    Hero.jsx
  data/
    siteData.js
  lib/
    supabaseClient.js
  services/
    bookingRepository.js
    notificationService.js
  types/
    booking.js
  assets/
    rv-inspection-hero.png
```

## 저장 흐름

- `src/components/BookingForm.jsx`
  - 예약 폼 입력값을 검증합니다.
  - 사진 파일을 선택하고 미리보기를 표시합니다.
  - `createBooking(formData)`를 호출합니다.

- `src/services/bookingRepository.js`
  - Supabase 환경변수가 있으면 `bookings` 테이블에 예약을 `insert`하고 사진은 Storage에 업로드합니다.
  - Supabase 환경변수가 없으면 브라우저 `localStorage`에 예약과 사진을 임시 저장합니다.

- `src/components/AdminDashboard.jsx`
  - Supabase 또는 localStorage에서 예약 목록을 불러옵니다.
  - 고객명, 연락처, 지역, 차량 종류, 신청 서비스, 사진, 접수일, 처리상태를 표시합니다.

## 알림 연결 위치

예약 저장 후 `src/services/notificationService.js`의 `notifyAdminBookingCreated`가 호출됩니다. 현재는 함수 구조만 있으며, 추후 이메일 API, Supabase Edge Function, 카카오 알림톡 API 또는 웹훅으로 교체하면 됩니다.
