import {
  loadReservations,
  saveReservations,
} from './reservationStorage.js';

/*
Supabase table: reservations

Columns:
- id
- receipt_number
- created_at
- customer_name
- phone
- vehicle_type
- service_type
- region
- preferred_date
- vehicle_number
- vehicle_model
- message
- has_attachment
- attachment_note
- status
- admin_memo
- departure_location
- arrival_location
- towing_purpose
- symptoms
- inspection_items
- has_tow_vehicle
- has_trailer_license
- needs_towing

Frontend -> Supabase mapping:
- receiptNumber -> receipt_number
- createdAt -> created_at
- customerName -> customer_name
- vehicleType -> vehicle_type
- serviceType -> service_type
- preferredDate -> preferred_date
- vehicleNumber -> vehicle_number
- vehicleModel -> vehicle_model
- hasAttachment -> has_attachment
- attachmentNote -> attachment_note
- adminMemo -> admin_memo
- departureLocation -> departure_location
- arrivalLocation -> arrival_location
- towingPurpose -> towing_purpose
- inspectionItems -> inspection_items
- hasTowVehicle -> has_tow_vehicle
- hasTrailerLicense -> has_trailer_license
- needsTowing -> needs_towing
*/

export function mapReservationToSupabaseRow(reservation) {
  return {
    id: reservation.id,
    receipt_number: reservation.receiptNumber,
    created_at: reservation.createdAt,
    customer_name: reservation.customerName,
    phone: reservation.phone,
    vehicle_type: reservation.vehicleType,
    service_type: reservation.serviceType,
    region: reservation.region,
    preferred_date: reservation.preferredDate,
    vehicle_number: reservation.vehicleNumber,
    vehicle_model: reservation.vehicleModel,
    message: reservation.message,
    has_attachment: reservation.hasAttachment,
    attachment_note: reservation.attachmentNote,
    status: reservation.status,
    admin_memo: reservation.adminMemo,
    departure_location: reservation.departureLocation,
    arrival_location: reservation.arrivalLocation,
    towing_purpose: reservation.towingPurpose,
    symptoms: reservation.symptoms,
    inspection_items: reservation.inspectionItems,
    has_tow_vehicle: reservation.hasTowVehicle,
    has_trailer_license: reservation.hasTrailerLicense,
    needs_towing: reservation.needsTowing,
  };
}

export function mapSupabaseRowToReservation(row) {
  return {
    id: row.id,
    receiptNumber: row.receipt_number,
    createdAt: row.created_at,
    customerName: row.customer_name,
    phone: row.phone,
    vehicleType: row.vehicle_type,
    serviceType: row.service_type,
    region: row.region,
    preferredDate: row.preferred_date,
    vehicleNumber: row.vehicle_number,
    vehicleModel: row.vehicle_model,
    message: row.message,
    hasAttachment: row.has_attachment,
    attachmentNote: row.attachment_note,
    status: row.status,
    adminMemo: row.admin_memo,
    departureLocation: row.departure_location,
    arrivalLocation: row.arrival_location,
    towingPurpose: row.towing_purpose,
    symptoms: row.symptoms,
    inspectionItems: row.inspection_items,
    hasTowVehicle: row.has_tow_vehicle,
    hasTrailerLicense: row.has_trailer_license,
    needsTowing: row.needs_towing,
  };
}

export async function createReservation(reservation) {
  // TODO: 실제 운영 시 Supabase reservations 테이블 insert 로직으로 교체합니다.
  const reservations = loadReservations();
  const nextReservations = [reservation, ...reservations];
  saveReservations(nextReservations);
  return reservation;
}

export async function getReservations() {
  // TODO: 실제 운영 시 Supabase reservations 테이블 select 로직으로 교체합니다.
  return loadReservations();
}

export async function updateReservationStatus(reservationId, status) {
  // TODO: 실제 운영 시 Supabase reservations 테이블 update(status) 로직으로 교체합니다.
  return updateReservation(reservationId, { status });
}

export async function updateReservationMemo(reservationId, adminMemo) {
  // TODO: 실제 운영 시 Supabase reservations 테이블 update(admin_memo) 로직으로 교체합니다.
  return updateReservation(reservationId, { adminMemo });
}

async function updateReservation(reservationId, patch) {
  const reservations = loadReservations();
  const nextReservations = reservations.map((reservation) =>
    reservation.id === reservationId ? { ...reservation, ...patch } : reservation,
  );
  saveReservations(nextReservations);
  return nextReservations.find((reservation) => reservation.id === reservationId);
}
