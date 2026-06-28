export const bookingStatuses = ['접수', '상담중', '견적중', '완료'];

export const vehicleTypes = ['캠핑카', '카라반', '트레일러', '모터홈', '기타'];

export const serviceOptions = [
  '검사 예약',
  '구조변경 상담',
  '카라반 탁송',
  '정비 상담/업체 연결',
  '중고 위탁점검',
  '기타 상담',
];

export const vehicleStatusOptions = [
  '정기검사 예정',
  '검사 불합격',
  '실내 개조 예정',
  '보험 수리 후 구조변경 필요',
  '중량 문제',
  '중고 구입 전 점검 필요',
  '탁송 필요',
  '기타',
];

/**
 * @typedef {'접수' | '상담중' | '견적중' | '완료'} BookingStatus
 * @typedef {'캠핑카' | '카라반' | '트레일러' | '모터홈' | '기타'} VehicleType
 * @typedef {'검사 예약' | '구조변경 상담' | '카라반 탁송' | '정비 상담/업체 연결' | '중고 위탁점검' | '기타 상담'} BookingService
 * @typedef {'정기검사 예정' | '검사 불합격' | '실내 개조 예정' | '보험 수리 후 구조변경 필요' | '중량 문제' | '중고 구입 전 점검 필요' | '탁송 필요' | '기타'} VehicleStatus
 */

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
