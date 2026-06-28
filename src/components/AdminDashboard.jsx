import React, { useEffect, useMemo, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import {
  fetchBookings,
  getBookingStorageMode,
} from '../services/bookingRepository.js';
import { bookingStatuses, serviceOptions } from '../types/booking.js';

const SERVICE_FILTERS = ['전체', ...serviceOptions];

const SAMPLE_BOOKINGS = [
  {
    id: 'sample-001',
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

const statusStyles = {
  '접수 완료': 'bg-slate-100 text-slate-700',
  '검토 중': 'bg-blue-50 text-blue-700',
  '추가자료 요청': 'bg-orange-50 text-orange-700',
  '견적 안내': 'bg-amber-50 text-amber-700',
  '예약 확정': 'bg-navy-50 text-navy-900',
  '진행 중': 'bg-purple-50 text-purple-700',
  완료: 'bg-emerald-50 text-emerald-700',
  취소: 'bg-slate-200 text-slate-600',
};

export default function AdminDashboard({ latestBooking }) {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [serviceFilter, setServiceFilter] = useState('전체');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const storageMode = getBookingStorageMode();

  const loadBookings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const bookingList = await fetchBookings();
      setBookings(mergeWithSamples(bookingList));
    } catch (loadError) {
      console.error('예약 목록 조회 오류:', loadError);
      setError(
        loadError.message ||
          '예약 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
      setBookings(SAMPLE_BOOKINGS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (!latestBooking) {
      return;
    }

    const normalizedBooking = normalizeBooking(latestBooking);
    setBookings((current) => [
      normalizedBooking,
      ...current.filter((booking) => booking.id !== normalizedBooking.id),
    ]);
  }, [latestBooking]);

  const filteredBookings = useMemo(() => {
    if (serviceFilter === '전체') {
      return bookings;
    }

    return bookings.filter((booking) => booking.service === serviceFilter);
  }, [bookings, serviceFilter]);

  const updateBookingStatus = (bookingId, nextStatus) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === bookingId
          ? { ...booking, processStatus: nextStatus }
          : booking,
      ),
    );
    setSelectedBooking((current) =>
      current?.id === bookingId
        ? { ...current, processStatus: nextStatus }
        : current,
    );
  };

  return (
    <section id="admin" className="bg-slate-100 py-16 lg:py-24">
      <div className="section-shell">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">관리자 페이지</p>
              <h2 className="section-title mt-3">상담·예약 접수 관리</h2>
              <p className="section-copy">
                접수된 검사, 구조변경, 탁송, 정비 상담, 위탁점검 신청 건을
                확인하고 진행 상태를 관리합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={loadBookings}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-navy-900 transition hover:bg-slate-100"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              목록 새로고침
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <strong className="text-sm font-black text-navy-900">
                서비스 필터
              </strong>
              <p className="mt-1 text-xs text-slate-500">
                선택한 서비스 종류의 접수 건만 표시합니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SERVICE_FILTERS.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setServiceFilter(filter)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    serviceFilter === filter
                      ? 'bg-navy-900 text-white'
                      : 'bg-white text-slate-700 hover:bg-navy-50'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {storageMode === 'local' && (
            <p className="mt-4 rounded-md bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
              테스트 모드입니다. 실제 접수 데이터는 브라우저에 임시 저장되며,
              샘플 접수 5건이 함께 표시됩니다.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[1180px] text-left text-sm">
              <thead className="bg-navy-900 text-xs font-bold uppercase tracking-wide text-white">
                <tr>
                  <th className="px-4 py-4">접수번호</th>
                  <th className="px-4 py-4">접수일</th>
                  <th className="px-4 py-4">고객명</th>
                  <th className="px-4 py-4">연락처</th>
                  <th className="px-4 py-4">차량 종류</th>
                  <th className="px-4 py-4">서비스 종류</th>
                  <th className="px-4 py-4">지역</th>
                  <th className="px-4 py-4">희망 날짜</th>
                  <th className="px-4 py-4">현재 상태</th>
                  <th className="px-4 py-4">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-500" colSpan="10">
                      선택한 조건에 해당하는 접수 건이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-bold text-navy-900">
                        {getReceiptNumber(booking, index)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-4 py-4 font-bold text-navy-900">
                        {booking.name}
                      </td>
                      <td className="px-4 py-4 text-slate-700">{booking.phone}</td>
                      <td className="px-4 py-4 text-slate-700">
                        {booking.vehicleType}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {booking.service}
                      </td>
                      <td className="px-4 py-4 text-slate-700">{booking.region}</td>
                      <td className="px-4 py-4 text-slate-700">
                        {getDesiredDate(booking)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={booking.processStatus} />
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(booking)}
                          className="rounded-md bg-signal-orange px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-600"
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={updateBookingStatus}
        />
      )}
    </section>
  );
}

function BookingDetailModal({ booking, onClose, onStatusChange }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/55 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-bold text-signal-orange">접수 상세</p>
            <h3 className="mt-1 text-xl font-black text-navy-900">
              {booking.name} 고객 상담 건
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100"
            aria-label="상세보기 닫기"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
          <DetailItem label="고객명" value={booking.name} />
          <DetailItem label="연락처" value={booking.phone} />
          <DetailItem label="차량 종류" value={booking.vehicleType} />
          <DetailItem label="서비스 종류" value={booking.service} />
          <DetailItem label="지역" value={booking.region} />
          <DetailItem label="희망 날짜" value={getDesiredDate(booking)} />
          <DetailItem label="차량번호" value={getVehicleNumber(booking)} />
          <DetailItem label="차량 모델명" value={booking.vehicleModel || '-'} />
          <DetailItem
            label="첨부 자료 여부"
            value={booking.photoUrls?.length ? `있음 (${booking.photoUrls.length}개)` : '없음'}
          />
          <label className="block">
            <span className="text-sm font-bold text-navy-900">현재 상태</span>
            <select
              value={booking.processStatus}
              onChange={(event) => onStatusChange(booking.id, event.target.value)}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
            >
              {bookingStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <div className="md:col-span-2">
            <DetailItem
              label="문의 내용"
              value={booking.message || '등록된 문의 내용이 없습니다.'}
              multiline
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value, multiline = false }) {
  return (
    <div>
      <span className="text-sm font-bold text-navy-900">{label}</span>
      <p
        className={`mt-2 rounded-md bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700 ${
          multiline ? 'whitespace-pre-wrap' : ''
        }`}
      >
        {value || '-'}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
        statusStyles[status] ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {status}
    </span>
  );
}

function mergeWithSamples(bookings) {
  const normalizedBookings = bookings.map(normalizeBooking);
  const existingIds = new Set(normalizedBookings.map((booking) => booking.id));
  const samplesToAdd = SAMPLE_BOOKINGS.filter(
    (booking) => !existingIds.has(booking.id),
  );

  return [...normalizedBookings, ...samplesToAdd];
}

function normalizeBooking(booking) {
  return {
    ...booking,
    processStatus: normalizeStatus(booking.processStatus),
  };
}

function normalizeStatus(status) {
  const statusMap = {
    접수: '접수 완료',
    상담중: '검토 중',
    견적중: '견적 안내',
  };

  return statusMap[status] || status || '접수 완료';
}

function getReceiptNumber(booking, index) {
  if (booking.id?.startsWith('sample-')) {
    return booking.id.replace('sample-', 'RV-');
  }

  return `RV-${String(index + 1).padStart(4, '0')}`;
}

function getDesiredDate(booking) {
  return booking.year || parseVehicleStatus(booking.vehicleStatus, '희망 날짜') || '-';
}

function getVehicleNumber(booking) {
  return parseVehicleStatus(booking.vehicleStatus, '차량번호') || '-';
}

function parseVehicleStatus(vehicleStatus, label) {
  if (!vehicleStatus) {
    return '';
  }

  const pattern = new RegExp(`${label}:\\s*([^/\\n]+)`);
  return vehicleStatus.match(pattern)?.[1]?.trim() || '';
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
