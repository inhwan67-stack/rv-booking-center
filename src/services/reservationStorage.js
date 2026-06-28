import { sampleBookings } from '../data/sampleBookings.js';
import { getReceiptNumber } from '../data/sampleBookings.js';

const STORAGE_KEY = 'rv-booking-reservations';

export function loadReservations() {
  // TODO: 현재는 테스트용 localStorage 저장 방식입니다.
  // 실제 서비스 운영 시에는 Supabase, Firebase, Google Sheets, Airtable 또는 자체 DB로 교체해야 합니다.
  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return sampleBookings;
  }

  try {
    const parsedReservations = JSON.parse(storedValue);
    return Array.isArray(parsedReservations) ? parsedReservations : sampleBookings;
  } catch {
    return sampleBookings;
  }
}

export function saveReservations(reservations) {
  // TODO: 현재는 테스트용 localStorage 저장 방식입니다.
  // 실제 서비스 운영 시에는 Supabase, Firebase, Google Sheets, Airtable 또는 자체 DB로 교체해야 합니다.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
}

export function resetReservations() {
  localStorage.removeItem(STORAGE_KEY);
  return sampleBookings;
}

export function exportReservationsToCsv(reservations) {
  const headers = [
    '접수번호',
    '접수일',
    '고객명',
    '연락처',
    '차량 종류',
    '서비스 종류',
    '지역',
    '희망 날짜',
    '차량번호',
    '차량 모델명',
    '현재 상태',
    '담당자 메모',
    '문의 내용',
  ];

  const rows = reservations.map((reservation, index) => [
    getReceiptNumber(reservation, index),
    formatDate(reservation.createdAt),
    reservation.customerName,
    reservation.phone,
    reservation.vehicleType,
    reservation.serviceType,
    reservation.region,
    reservation.preferredDate,
    reservation.vehicleNumber,
    reservation.vehicleModel,
    reservation.status,
    reservation.adminMemo,
    reservation.message,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n');
  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: 'text/csv;charset=utf-8;',
  });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = `rv-booking-reservations-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
}

function escapeCsvCell(value) {
  const stringValue = String(value ?? '');
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue));
}
