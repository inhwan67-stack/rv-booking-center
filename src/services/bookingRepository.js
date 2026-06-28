import { createReservationFromForm } from '../types/reservation.js';

export async function createBooking(formData) {
  const reservation = createReservationFromForm(formData);

  // TODO: Supabase 또는 Firebase 저장 로직 연결 예정
  // TODO: Google Sheets 또는 Airtable API 연동 가능 위치
  // TODO: 실제 파일 업로드 스토리지 연결 예정
  return { booking: reservation, storage: 'memory' };
}

export async function fetchBookings() {
  // TODO: 실제 DB 조회 로직으로 교체 예정
  return [];
}

export function getBookingStorageMode() {
  return 'memory';
}
