export const sampleBookings = [
  {
    id: 'sample-001',
    receiptNumber: 'RV-001',
    name: '김민수',
    phone: '010-1234-1001',
    region: '경기 화성',
    vehicleType: '카라반',
    vehicleModel: 'Adria Altea 552',
    year: '2026-07-05',
    service: '카라반 탁송',
    vehicleStatus: '차량번호: 경기12가3456 / 희망 날짜: 2026-07-05',
    message:
      '[문의 내용]\n화성 보관장에서 검사장까지 카라반 이동이 필요합니다.\n\n[탁송 정보]\n출발지: 경기 화성\n도착지: 경기 수원 검사장\n탁송 목적: 검사장 이동',
    photoUrls: [],
    processStatus: '견적 안내',
    createdAt: '2026-06-28T01:10:00.000Z',
    isSample: true,
  },
  {
    id: 'sample-002',
    receiptNumber: 'RV-002',
    name: '박지훈',
    phone: '010-1234-1002',
    region: '서울 강서',
    vehicleType: '캠핑카',
    vehicleModel: '포터 기반 캠핑카',
    year: '2026-07-08',
    service: '검사 예약',
    vehicleStatus: '차량번호: 서울34나5678 / 희망 날짜: 2026-07-08',
    message: '[문의 내용]\n정기검사 기간이 도래해 검사 예약 가능 여부를 알고 싶습니다.',
    photoUrls: [],
    processStatus: '접수 완료',
    createdAt: '2026-06-28T02:20:00.000Z',
    isSample: true,
  },
  {
    id: 'sample-003',
    receiptNumber: 'RV-003',
    name: '이성호',
    phone: '010-1234-1003',
    region: '부산',
    vehicleType: '수입 카라반',
    vehicleModel: 'Hobby Prestige',
    year: '2026-07-10',
    service: '구조변경 상담',
    vehicleStatus: '차량번호: 부산56다9012 / 희망 날짜: 2026-07-10',
    message:
      '[문의 내용]\n수입 카라반 내부 설비 변경 후 구조변경 필요 여부를 확인하고 싶습니다.',
    photoUrls: [],
    processStatus: '검토 중',
    createdAt: '2026-06-28T03:30:00.000Z',
    isSample: true,
  },
  {
    id: 'sample-004',
    receiptNumber: 'RV-004',
    name: '정다은',
    phone: '010-1234-1004',
    region: '대전',
    vehicleType: '캠핑카',
    vehicleModel: '스타리아 캠퍼',
    year: '2026-07-12',
    service: '정비 상담/업체 연결',
    vehicleStatus: '차량번호: 대전78라3456 / 희망 날짜: 2026-07-12',
    message:
      '[문의 내용]\n보조 배터리 충전이 불안정하고 냉장고 전원이 자주 꺼집니다.\n\n[정비 증상]\n배터리, 충전, 냉장고',
    photoUrls: [],
    processStatus: '추가자료 요청',
    createdAt: '2026-06-28T04:40:00.000Z',
    isSample: true,
  },
  {
    id: 'sample-005',
    receiptNumber: 'RV-005',
    name: '최영민',
    phone: '010-1234-1005',
    region: '인천',
    vehicleType: '카라반',
    vehicleModel: 'Swift Sprite',
    year: '2026-07-15',
    service: '중고 위탁점검',
    vehicleStatus: '차량번호: 인천90마7890 / 희망 날짜: 2026-07-15',
    message:
      '[문의 내용]\n중고 카라반 구매 전 누수와 하부 상태를 확인하고 싶습니다.\n\n[점검 희망 항목]\n누수, 하부 상태, 전기 시스템, 구조변경 이력',
    photoUrls: [],
    processStatus: '예약 확정',
    createdAt: '2026-06-28T05:50:00.000Z',
    isSample: true,
  },
];

export function getReceiptNumber(booking, fallbackIndex = 0) {
  if (booking.receiptNumber) {
    return booking.receiptNumber;
  }

  if (booking.id?.startsWith('sample-')) {
    return booking.id.replace('sample-', 'RV-');
  }

  return `RV-${String(fallbackIndex + 1).padStart(4, '0')}`;
}

export function getDesiredDate(booking) {
  return booking.year || parseVehicleStatus(booking.vehicleStatus, '희망 날짜') || '-';
}

export function getVehicleNumber(booking) {
  return parseVehicleStatus(booking.vehicleStatus, '차량번호') || '-';
}

function parseVehicleStatus(vehicleStatus, label) {
  if (!vehicleStatus) {
    return '';
  }

  const pattern = new RegExp(`${label}:\\s*([^/\\n]+)`);
  return vehicleStatus.match(pattern)?.[1]?.trim() || '';
}
