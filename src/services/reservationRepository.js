import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js';
import {
  loadReservations,
  saveReservations,
} from './reservationStorage.js';

const RESERVATIONS_TABLE = 'reservations';
const RESERVATION_FILES_BUCKET = 'reservation-files';

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
    attachment_urls: reservation.attachmentUrls,
    attachment_memo: reservation.attachmentMemo,
    status: reservation.status,
    admin_memo: reservation.adminMemo,
    base_amount: reservation.baseAmount,
    extra_amount: reservation.extraAmount,
    discount_amount: reservation.discountAmount,
    final_amount: reservation.finalAmount,
    payment_status: reservation.paymentStatus,
    price_memo: reservation.priceMemo,
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
    attachmentUrls: Array.isArray(row.attachment_urls) ? row.attachment_urls : [],
    attachmentMemo: row.attachment_memo ?? '',
    status: row.status,
    adminMemo: row.admin_memo,
    customerNotice: row.customer_notice ?? row.admin_memo ?? '',
    baseAmount: row.base_amount ?? 0,
    extraAmount: row.extra_amount ?? 0,
    discountAmount: row.discount_amount ?? 0,
    finalAmount: row.final_amount ?? 0,
    paymentStatus: row.payment_status ?? '미결제',
    priceMemo: row.price_memo ?? '',
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

  if (normalizedReceiptNumber) {
    const { data, error } = await supabase
      .from(RESERVATIONS_TABLE)
      .select('*')
      .eq('receipt_number', normalizedReceiptNumber)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapSupabaseRowToReservation);
  }

  if (!phoneCandidates.length) {
    return [];
  }

  let query = supabase
    .from(RESERVATIONS_TABLE)
    .select('*')
    .in('phone', phoneCandidates)
    .order('created_at', { ascending: false });

  if (normalizedCustomerName) {
    query = query.ilike('customer_name', `%${normalizedCustomerName}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapSupabaseRowToReservation);
}

export async function uploadReservationAttachment(reservation, file) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  const receiptNumber = reservation.receiptNumber;
  const timestamp = Date.now();
  const safeFileName = createSafeStorageFileName(file.name);
  const filePath = `${receiptNumber}/${timestamp}_${safeFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(RESERVATION_FILES_BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error('Supabase reservation attachment storage upload failed', {
      code: uploadError?.code,
      message: uploadError?.message,
      details: uploadError?.details,
      hint: uploadError?.hint,
      status: uploadError?.status,
    });
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from(RESERVATION_FILES_BUCKET)
    .getPublicUrl(filePath);

  const attachment = {
    name: file.name,
    url: publicUrlData.publicUrl,
    type: file.type,
    uploadedAt: new Date().toISOString(),
  };
  let updatedReservation;

  try {
    const currentAttachments = await fetchReservationAttachmentUrls(reservation);
    const attachmentUrls = [...currentAttachments, attachment];
    updatedReservation = await updateReservationAttachments(reservation, {
      attachmentUrls,
    });
  } catch (error) {
    console.error('Supabase reservation attachment database update failed', {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      status: error?.status,
    });
    throw error;
  }

  return {
    attachment,
    reservation: updatedReservation,
  };
}

export async function updateReservationAttachmentMemo(reservation, attachmentMemo) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured.');
  }

  return updateReservationAttachments(reservation, { attachmentMemo });
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

export async function updateReservationPrice(reservation, priceInfo) {
  const supabaseUpdated = await updateReservationPriceInSupabase(
    reservation,
    priceInfo,
  );

  if (!supabaseUpdated) {
    return {
      reservation: findReservationByIdentifier(reservation?.id ?? reservation?.receiptNumber),
      supabaseUpdated: false,
    };
  }

  return {
    reservation: await updateReservation(
      reservation?.id ?? reservation?.receiptNumber,
      priceInfo,
    ),
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

async function updateReservationPriceInSupabase(reservation, priceInfo) {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  try {
    const query = supabase.from(RESERVATIONS_TABLE).update({
      base_amount: priceInfo.baseAmount,
      extra_amount: priceInfo.extraAmount,
      discount_amount: priceInfo.discountAmount,
      final_amount: priceInfo.finalAmount,
      payment_status: priceInfo.paymentStatus,
      price_memo: priceInfo.priceMemo,
    });

    const { error } = reservation?.id
      ? await query.eq('id', reservation.id)
      : await query.eq('receipt_number', reservation.receiptNumber);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Supabase reservation price update failed', {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      status: error?.status,
    });
    return false;
  }
}

async function fetchReservationAttachmentUrls(reservation) {
  const query = supabase
    .from(RESERVATIONS_TABLE)
    .select('attachment_urls');

  const { data, error } = reservation?.id
    ? await query.eq('id', reservation.id).maybeSingle()
    : await query.eq('receipt_number', reservation.receiptNumber).maybeSingle();

  if (error) {
    throw error;
  }

  return Array.isArray(data?.attachment_urls) ? data.attachment_urls : [];
}

async function updateReservationAttachments(reservation, patch) {
  const updatePayload = {};

  if (Object.prototype.hasOwnProperty.call(patch, 'attachmentUrls')) {
    updatePayload.attachment_urls = patch.attachmentUrls;
    updatePayload.has_attachment = patch.attachmentUrls.length > 0;
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'attachmentMemo')) {
    updatePayload.attachment_memo = patch.attachmentMemo;
  }

  const query = supabase
    .from(RESERVATIONS_TABLE)
    .update(updatePayload)
    .select('*');

  const { data, error } = reservation?.id
    ? await query.eq('id', reservation.id).single()
    : await query.eq('receipt_number', reservation.receiptNumber).single();

  if (error) {
    throw error;
  }

  return mapSupabaseRowToReservation(data);
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

function createSafeStorageFileName(fileName) {
  const safeFileName = String(fileName ?? 'attachment')
    .replace(/[^A-Za-z0-9._-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  return safeFileName || 'attachment';
}

async function updateReservation(reservationId, patch) {
  const reservations = loadReservations();
  const nextReservations = reservations.map((reservation) =>
    reservation.id === reservationId || reservation.receiptNumber === reservationId
      ? { ...reservation, ...patch }
      : reservation,
  );
  saveReservations(nextReservations);
  return findReservationByIdentifier(reservationId, nextReservations);
}

function findReservationByIdentifier(identifier, reservations = loadReservations()) {
  return reservations.find(
    (reservation) =>
      reservation.id === identifier || reservation.receiptNumber === identifier,
  );
}
