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
    customerNotice: row.customer_notice ?? row.admin_memo ?? '',
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

export async function fetchReservationsFromSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      reservations: loadReservations(),
      supabaseLoaded: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from(RESERVATIONS_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const reservations = (data ?? []).map(mapSupabaseRowToReservation);
    return {
      reservations,
      supabaseLoaded: true,
    };
  } catch (error) {
    console.error('Supabase reservations select failed', {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    });

    return {
      reservations: loadReservations(),
      supabaseLoaded: false,
    };
  }
}

export async function updateReservationStatus(reservationId, status) {
  const supabaseUpdated = await updateReservationStatusInSupabase(
    reservationId,
    status,
  );

  if (!supabaseUpdated) {
    return {
      reservation: loadReservations().find(
        (reservation) => reservation.id === reservationId,
      ),
      supabaseUpdated: false,
    };
  }

  return {
    reservation: await updateReservation(reservationId, { status }),
    supabaseUpdated: true,
  };
}

export async function lookupCustomerReservations({
  receiptNumber = '',
  phone = '',
  customerName = '',
}) {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const normalizedReceiptNumber = receiptNumber.trim().toUpperCase();
  const normalizedPhone = phone.trim();
  const phoneCandidates = createPhoneCandidates(normalizedPhone);
  const normalizedCustomerName = customerName.trim();
  const queryPromises = [];

  if (normalizedReceiptNumber) {
    queryPromises.push(
      supabase
        .from(RESERVATIONS_TABLE)
        .select('*')
        .eq('receipt_number', normalizedReceiptNumber)
        .order('created_at', { ascending: false }),
    );
  }

  if (phoneCandidates.length) {
    let phoneQuery = supabase
      .from(RESERVATIONS_TABLE)
      .select('*')
      .in('phone', phoneCandidates)
      .order('created_at', { ascending: false });

    if (normalizedCustomerName) {
      phoneQuery = phoneQuery.eq('customer_name', normalizedCustomerName);
    }

    queryPromises.push(phoneQuery);
  }

  if (!queryPromises.length) {
    return [];
  }

  const responses = await Promise.all(queryPromises);
  const failedResponse = responses.find((response) => response.error);

  if (failedResponse?.error) {
    throw failedResponse.error;
  }

  const uniqueRows = new Map();
  responses
    .flatMap((response) => response.data ?? [])
    .forEach((row) => {
      uniqueRows.set(row.id ?? row.receipt_number, row);
    });

  return Array.from(uniqueRows.values()).map(mapSupabaseRowToReservation);
}

export async function updateReservationMemo(reservationId, adminMemo, reservation) {
  const supabaseUpdated = await updateReservationMemoInSupabase(
    reservation ?? { id: reservationId },
    adminMemo,
  );

  if (!supabaseUpdated) {
    return {
      reservation: loadReservations().find(
        (reservation) => reservation.id === reservationId,
      ),
      supabaseUpdated: false,
    };
  }

  return {
    reservation: await updateReservation(reservationId, { adminMemo }),
    supabaseUpdated: true,
  };
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

    console.log('Supabase reservation insert success');
    return true;
  } catch (error) {
    console.error('Supabase reservation insert failed', {
      status: error?.status,
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    });
    return false;
  }
}

async function updateReservationStatusInSupabase(reservationId, status) {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from(RESERVATIONS_TABLE)
      .update({ status })
      .eq('id', reservationId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Supabase reservation status update failed', {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    });
    return false;
  }
}

async function updateReservationMemoInSupabase(reservation, adminMemo) {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const query = supabase
      .from(RESERVATIONS_TABLE)
      .update({ admin_memo: adminMemo });

    const { error } = reservation.id
      ? await query.eq('id', reservation.id)
      : await query.eq('receipt_number', reservation.receiptNumber);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Supabase reservation memo update failed', {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      status: error?.status,
    });
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

function createPhoneCandidates(phone) {
  const compactPhone = phone.replace(/\D/g, '');
  const candidates = new Set([phone]);

  if (compactPhone) {
    candidates.add(compactPhone);
  }

  if (compactPhone.length === 11) {
    candidates.add(
      `${compactPhone.slice(0, 3)}-${compactPhone.slice(3, 7)}-${compactPhone.slice(7)}`,
    );
  }

  if (compactPhone.length === 10) {
    candidates.add(
      `${compactPhone.slice(0, 3)}-${compactPhone.slice(3, 6)}-${compactPhone.slice(6)}`,
    );
  }

  return Array.from(candidates).filter(Boolean);
}

async function updateReservation(reservationId, patch) {
  const reservations = loadReservations();
  const nextReservations = reservations.map((reservation) =>
    reservation.id === reservationId ? { ...reservation, ...patch } : reservation,
  );
  saveReservations(nextReservations);
  return nextReservations.find((reservation) => reservation.id === reservationId);
}
