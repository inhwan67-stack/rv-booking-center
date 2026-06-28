export const bookingStatuses = [
  '접수 완료',
  '검토 중',
  '추가자료 요청',
  '견적 안내',
  '예약 확정',
  '진행 중',
  '완료',
  '취소',
];

export const vehicleTypes = [
  '캠핑카',
  '카라반',
  '트레일러',
  '수입 카라반',
  '기타 특수차량',
];

export const serviceOptions = [
  '검사 예약',
  '구조변경 상담',
  '카라반 탁송',
  '정비 상담/업체 연결',
  '중고 위탁점검',
];

export const mapBookingToSupabaseRow = (booking) => ({
  id: booking.id,
  name: booking.name,
  phone: booking.phone,
  region: booking.region,
  vehicle_type: booking.vehicleType,
  vehicle_model: booking.vehicleModel,
  vehicle_year: booking.year,
  service: booking.service,
  vehicle_status: booking.vehicleStatus,
  message: booking.message,
  photo_urls: booking.photoUrls,
  process_status: booking.processStatus,
  created_at: booking.createdAt,
});

export const mapSupabaseRowToBooking = (row) => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  region: row.region,
  vehicleType: row.vehicle_type,
  vehicleModel: row.vehicle_model,
  year: row.vehicle_year,
  service: row.service,
  vehicleStatus: row.vehicle_status,
  message: row.message ?? '',
  photoUrls: row.photo_urls ?? [],
  processStatus: row.process_status,
  createdAt: row.created_at,
});
