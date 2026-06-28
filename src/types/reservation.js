export const RESERVATION_STATUSES = [
  '접수 완료',
  '검토 중',
  '추가자료 요청',
  '견적 안내',
  '예약 확정',
  '진행 중',
  '완료',
  '취소',
];

export const SERVICE_TYPES = [
  '검사 예약',
  '구조변경 상담',
  '카라반 탁송',
  '정비 상담/업체 연결',
  '중고 위탁점검',
];

export const VEHICLE_TYPES = [
  '캠핑카',
  '카라반',
  '트레일러',
  '수입 카라반',
  '기타 특수차량',
];

/**
 * @typedef {Object} Reservation
 * @property {string} id
 * @property {string} receiptNumber
 * @property {string} createdAt
 * @property {string} customerName
 * @property {string} phone
 * @property {string} vehicleType
 * @property {string} serviceType
 * @property {string} region
 * @property {string} preferredDate
 * @property {string} vehicleNumber
 * @property {string} vehicleModel
 * @property {string} message
 * @property {boolean} hasAttachment
 * @property {string} attachmentNote
 * @property {string} status
 * @property {string} adminMemo
 * @property {string=} departureLocation
 * @property {string=} arrivalLocation
 * @property {string=} towingPurpose
 * @property {string[]=} symptoms
 * @property {string[]=} inspectionItems
 * @property {boolean=} hasTowVehicle
 * @property {boolean=} hasTrailerLicense
 * @property {boolean=} needsTowing
 */

export function createReservationFromForm(formData) {
  const createdAt = new Date().toISOString();
  const hasAttachment = Boolean(formData.photos?.length);

  return {
    id: crypto.randomUUID(),
    receiptNumber: createReceiptNumber(createdAt),
    createdAt,
    customerName: formData.name.trim(),
    phone: formData.phone.trim(),
    vehicleType: formData.vehicleType,
    serviceType: formData.service,
    region: formData.region.trim(),
    preferredDate: formData.desiredDate,
    vehicleNumber: formData.vehicleNumber.trim(),
    vehicleModel: formData.vehicleModel.trim(),
    message: buildReservationMessage(formData),
    hasAttachment,
    attachmentNote: buildAttachmentNote(formData, hasAttachment),
    status: '접수 완료',
    adminMemo: '신규 접수 건입니다.',
    departureLocation: formData.departure?.trim() || '',
    arrivalLocation: formData.destination?.trim() || '',
    towingPurpose: formData.deliveryPurpose || '',
    symptoms: formData.repairSymptoms ?? [],
    inspectionItems: formData.usedInspectionItems ?? [],
    hasTowVehicle: Boolean(formData.hasTowVehicle),
    hasTrailerLicense: Boolean(formData.hasTrailerLicense),
    needsTowing: Boolean(formData.needsDelivery),
  };
}

export function normalizeReservation(reservation) {
  if (reservation.customerName || reservation.serviceType) {
    return reservation;
  }

  return {
    id: reservation.id,
    receiptNumber: reservation.receiptNumber,
    createdAt: reservation.createdAt,
    customerName: reservation.name ?? '',
    phone: reservation.phone ?? '',
    vehicleType: reservation.vehicleType ?? '',
    serviceType: reservation.service ?? '',
    region: reservation.region ?? '',
    preferredDate: reservation.year ?? '',
    vehicleNumber: parseVehicleStatus(reservation.vehicleStatus, '차량번호'),
    vehicleModel: reservation.vehicleModel ?? '',
    message: reservation.message ?? '',
    hasAttachment: Boolean(reservation.photoUrls?.length),
    attachmentNote: reservation.photoUrls?.length
      ? `${reservation.photoUrls.length}개 첨부`
      : '첨부자료 없음',
    status: normalizeStatus(reservation.processStatus),
    adminMemo: reservation.adminMemo ?? '신규 접수 건입니다.',
  };
}

export function normalizeStatus(status) {
  const statusMap = {
    접수: '접수 완료',
    상담중: '검토 중',
    견적중: '견적 안내',
  };

  return statusMap[status] || status || '접수 완료';
}

export function createReceiptNumber(createdAt = new Date().toISOString()) {
  const date = new Date(createdAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequence = String(Date.now()).slice(-3);
  return `RV-${year}${month}-${sequence}`;
}

export function getReservationReceiptNumber(reservation, fallbackIndex = 0) {
  return reservation.receiptNumber || `RV-${String(fallbackIndex + 1).padStart(3, '0')}`;
}

function buildReservationMessage(formData) {
  const sections = [];

  if (formData.message?.trim()) {
    sections.push(formData.message.trim());
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
    sections.push('[첨부자료]\n현재 첨부할 자료가 없어 담당자 안내 후 추가 제출 예정');
  }

  return sections.join('\n\n');
}

function buildAttachmentNote(formData, hasAttachment) {
  if (hasAttachment) {
    return `${formData.photos.length}개 첨부`;
  }

  if (formData.noAttachments) {
    return '현재 첨부자료 없음, 담당자 안내 후 추가 제출 예정';
  }

  return '첨부자료 없음';
}

function parseVehicleStatus(vehicleStatus, label) {
  if (!vehicleStatus) {
    return '';
  }

  const pattern = new RegExp(`${label}:\\s*([^/\\n]+)`);
  return vehicleStatus.match(pattern)?.[1]?.trim() || '';
}
