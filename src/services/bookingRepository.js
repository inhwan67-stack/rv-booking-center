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
    year: formData.year.trim(),
    service: formData.service,
    vehicleStatus: formData.status,
    message: formData.message.trim(),
    photoUrls,
    processStatus: '접수',
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
