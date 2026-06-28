# Supabase reservations schema draft

This document is a preparation note only. Do not run this against production
without reviewing row level security, indexes, storage, and admin access rules.

## Environment variables

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Table

```sql
create table if not exists public.reservations (
  id text primary key,
  receipt_number text not null unique,
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone text not null,
  vehicle_type text not null,
  service_type text not null,
  region text,
  preferred_date date,
  vehicle_number text,
  vehicle_model text,
  message text,
  has_attachment boolean not null default false,
  attachment_note text,
  status text not null default '접수 완료',
  admin_memo text,
  departure_location text,
  arrival_location text,
  towing_purpose text,
  symptoms text[] default '{}',
  inspection_items text[] default '{}',
  has_tow_vehicle boolean,
  has_trailer_license boolean,
  needs_towing boolean,
  updated_at timestamptz not null default now()
);
```

## Suggested indexes

```sql
create index if not exists reservations_receipt_number_idx
  on public.reservations (receipt_number);

create index if not exists reservations_phone_idx
  on public.reservations (phone);

create index if not exists reservations_service_type_idx
  on public.reservations (service_type);

create index if not exists reservations_status_idx
  on public.reservations (status);

create index if not exists reservations_created_at_idx
  on public.reservations (created_at desc);
```

## Status values

```text
접수 완료
검토 중
추가자료 요청
견적 안내
예약 확정
진행 중
완료
취소
```

## Frontend mapping

| Frontend field | Supabase column |
| --- | --- |
| id | id |
| receiptNumber | receipt_number |
| createdAt | created_at |
| customerName | customer_name |
| phone | phone |
| vehicleType | vehicle_type |
| serviceType | service_type |
| region | region |
| preferredDate | preferred_date |
| vehicleNumber | vehicle_number |
| vehicleModel | vehicle_model |
| message | message |
| hasAttachment | has_attachment |
| attachmentNote | attachment_note |
| status | status |
| adminMemo | admin_memo |
| departureLocation | departure_location |
| arrivalLocation | arrival_location |
| towingPurpose | towing_purpose |
| symptoms | symptoms |
| inspectionItems | inspection_items |
| hasTowVehicle | has_tow_vehicle |
| hasTrailerLicense | has_trailer_license |
| needsTowing | needs_towing |

## Future implementation notes

- Replace localStorage calls with Supabase `insert`, `select`, and `update`.
- Add row level security policies before exposing real customer data.
- Store uploaded files in Supabase Storage or a separate object storage service.
- Add an admin-only route or login before allowing memo and status updates.
