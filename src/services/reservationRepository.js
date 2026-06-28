import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js';
import {
  loadReservations,
  saveReservations,
} from './reservationStorage.js';

const RESERVATIONS_TABLE = 'reservations';

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
  const supabaseSaved = await insertReservationToSupabase(reservation);
  saveReservationToLocalStorage(reservation);

  return {
    reservation,
    storage: supabaseSaved ? 'supabase-localStorage' : 'localStorage',
    supabaseSaved,
  };
}

export async function getReservations() {
  return loadReservations();
}

export async function updateReservationStatus(reservationId, status) {
  return updateReservation(reservationId, { status });
}

export async function updateReservationMemo(reservationId, adminMemo) {
  return updateReservation(reservationId, { adminMemo });
}

async function insertReservationToSupabase(reservation) {
  if (!isSupabaseConfigured || !supabase) {
    console.info('Supabase is not configured. Reservation saved to localStorage only.');
    return false;
  }

  try {
    const { error } = await supabase
      .from(RESERVATIONS_TABLE)
      .insert(mapReservationToSupabaseRow(reservation));

    if (error) {
      throw error;
    }

    console.info('Supabase reservation insert succeeded:', {
      receiptNumber: reservation.receiptNumber,
    });
    return true;
  } catch (error) {
    console.error('Supabase reservation insert failed:', error);
    return false;
  }
}

function saveReservationToLocalStorage(reservation) {
  const reservations = loadReservations();
  const nextReservations = reservations.some((item) => item.id === reservation.id)
    ? reservations
    : [reservation, ...reservations];
  saveReservations(nextReservations);
}

async function updateReservation(reservationId, patch) {
  const reservations = loadReservations();
  const nextReservations = reservations.map((reservation) =>
    reservation.id === reservationId ? { ...reservation, ...patch } : reservation,
  );
  saveReservations(nextReservations);
  return nextReservations.find((reservation) => reservation.id === reservationId);
}
