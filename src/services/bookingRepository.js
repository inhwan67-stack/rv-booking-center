import { isSupabaseConfigured, supabase } from '../lib/supabaseClient.js';
import {
  mapBookingToSupabaseRow,
  mapSupabaseRowToBooking,
} from '../types/booking.js';
import { notifyAdminBookingCreated } from './notificationService.js';

const BOOKINGS_TABLE = 'bookings';
const LOCAL_STORAGE_KEY = 'rv-certification-center-bookings';
const PHOTO_BUCKET =
  import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'booking-photos';

export async function createBooking(formData) {
  const bookingId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const photoUrls =
    isSupabaseConfigured && supabase
      ? await uploadPhotosToSupabase(formData.photos, bookingId)
      : await convertPhotosToDataUrls(formData.photos);

  const booking = {
    id: bookingId,
    name: formData.name.trim(),
    phone: formData.phone.trim(),
    region: formData.region.trim(),
    vehicleType: formData.vehicleType,
    vehicleModel: formData.vehicleModel.trim(),
    year: formData.desiredDate || formData.year || '',
    service: formData.service,
    vehicleStatus: buildVehicleStatus(formData),
    message: buildBookingMessage(formData),
    photoUrls,
    processStatus: '접수 완료',
    createdAt,
  };

  if (!isSupabaseConfigured || !supabase) {
    const savedBooking = saveLocalBooking(booking);
    await notifyAdminBookingCreated(savedBooking);
    return { booking: savedBooking, storage: 'local' };
  }

  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .insert(mapBookingToSupabaseRow(booking))
    .select()
    .single();

  if (error) {
    throw error;
  }

  const savedBooking = mapSupabaseRowToBooking(data);
  await notifyAdminBookingCreated(savedBooking);
  return { booking: savedBooking, storage: 'supabase' };
}

export async function fetchBookings() {
  if (!isSupabaseConfigured || !supabase) {
    return getLocalBookings();
  }

  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data.map(mapSupabaseRowToBooking);
}

export function getBookingStorageMode() {
  return isSupabaseConfigured && supabase ? 'supabase' : 'local';
}

async function uploadPhotosToSupabase(photos, bookingId) {
  if (!photos?.length) {
    return [];
  }

  const uploadedPhotos = [];

  for (const [index, photo] of photos.entries()) {
    const extension = getFileExtension(photo.name);
    const filePath = `${bookingId}/${Date.now()}-${index}.${extension}`;
    const { error } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(filePath, photo, {
        cacheControl: '3600',
        contentType: photo.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(filePath);
    uploadedPhotos.push({
      name: photo.name,
      size: photo.size,
      type: photo.type,
      path: filePath,
      url: data.publicUrl,
    });
  }

  return uploadedPhotos;
}

async function convertPhotosToDataUrls(photos) {
  if (!photos?.length) {
    return [];
  }

  return Promise.all(
    photos.map(async (photo) => ({
      name: photo.name,
      size: photo.size,
      type: photo.type,
      url: await readFileAsDataUrl(photo),
    })),
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function saveLocalBooking(booking) {
  const localBookings = getLocalBookings();
  const savedBooking = {
    ...booking,
    id: `local-${booking.id}`,
  };

  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify([savedBooking, ...localBookings]),
  );

  return savedBooking;
}

function getLocalBookings() {
  const storedBookings = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!storedBookings) {
    return [];
  }

  try {
    const parsedBookings = JSON.parse(storedBookings);
    return Array.isArray(parsedBookings) ? parsedBookings : [];
  } catch {
    return [];
  }
}

function getFileExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() || 'jpg';
}

function buildVehicleStatus(formData) {
  const statusItems = [
    formData.vehicleNumber && `차량번호: ${formData.vehicleNumber}`,
    formData.desiredDate && `희망 날짜: ${formData.desiredDate}`,
  ].filter(Boolean);

  return statusItems.join(' / ') || formData.status || '';
}

function buildBookingMessage(formData) {
  const sections = [];

  if (formData.message?.trim()) {
    sections.push(`[문의 내용]\n${formData.message.trim()}`);
  }

  const basicInfo = [
    formData.vehicleNumber && `차량번호: ${formData.vehicleNumber}`,
    formData.desiredDate && `희망 날짜: ${formData.desiredDate}`,
  ].filter(Boolean);

  if (basicInfo.length) {
    sections.push(`[기본 정보]\n${basicInfo.join('\n')}`);
  }

  const isCaravan =
    formData.vehicleType === '카라반' || formData.vehicleType === '수입 카라반';
  if (isCaravan) {
    const caravanInfo = [
      `견인차 보유 여부: ${formData.hasTowVehicle ? '예' : '아니오'}`,
      `트레일러 견인면허 보유 여부: ${
        formData.hasTrailerLicense ? '예' : '아니오'
      }`,
      `탁송 필요 여부: ${formData.needsDelivery ? '예' : '아니오'}`,
    ];
    sections.push(`[카라반 확인]\n${caravanInfo.join('\n')}`);
  }

  if (formData.service === '카라반 탁송') {
    const deliveryInfo = [
      formData.departure && `출발지: ${formData.departure}`,
      formData.destination && `도착지: ${formData.destination}`,
      formData.deliveryPurpose && `탁송 목적: ${formData.deliveryPurpose}`,
    ].filter(Boolean);

    if (deliveryInfo.length) {
      sections.push(`[탁송 정보]\n${deliveryInfo.join('\n')}`);
    }
  }

  if (formData.service === '정비 상담/업체 연결' && formData.repairSymptoms?.length) {
    sections.push(`[정비 증상]\n${formData.repairSymptoms.join(', ')}`);
  }

  if (
    formData.service === '중고 위탁점검' &&
    formData.usedInspectionItems?.length
  ) {
    sections.push(`[점검 희망 항목]\n${formData.usedInspectionItems.join(', ')}`);
  }

  if (formData.noAttachments) {
    sections.push(
      '[첨부자료]\n현재 첨부할 자료가 없어 담당자 안내 후 추가 제출 예정',
    );
  }

  return sections.join('\n\n');
}
