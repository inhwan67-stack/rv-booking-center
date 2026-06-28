import {
  RESERVATION_STATUSES,
  SERVICE_TYPES,
  VEHICLE_TYPES,
  normalizeReservation,
} from './reservation.js';

export const bookingStatuses = RESERVATION_STATUSES;
export const serviceOptions = SERVICE_TYPES;
export const vehicleTypes = VEHICLE_TYPES;

export const mapBookingToSupabaseRow = (booking) => {
  const reservation = normalizeReservation(booking);

  return {
    id: reservation.id,
    name: reservation.customerName,
    phone: reservation.phone,
    region: reservation.region,
    vehicle_type: reservation.vehicleType,
    vehicle_model: reservation.vehicleModel,
    vehicle_year: reservation.preferredDate,
    service: reservation.serviceType,
    vehicle_status: `차량번호: ${reservation.vehicleNumber} / 희망 날짜: ${reservation.preferredDate}`,
    message: reservation.message,
    photo_urls: [],
    process_status: reservation.status,
    created_at: reservation.createdAt,
  };
};

export const mapSupabaseRowToBooking = (row) => ({
  id: row.id,
  receiptNumber: row.receipt_number,
  createdAt: row.created_at,
  customerName: row.name,
  phone: row.phone,
  vehicleType: row.vehicle_type,
  serviceType: row.service,
  region: row.region,
  preferredDate: row.vehicle_year,
  vehicleNumber: '',
  vehicleModel: row.vehicle_model,
  message: row.message ?? '',
  hasAttachment: Boolean(row.photo_urls?.length),
  attachmentNote: row.photo_urls?.length
    ? `${row.photo_urls.length}개 첨부`
    : '첨부자료 없음',
  status: row.process_status,
  adminMemo: row.admin_memo ?? '신규 접수 건입니다.',
});
