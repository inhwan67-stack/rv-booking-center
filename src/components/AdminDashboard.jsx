import React, { useMemo, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { getDesiredDate, getReceiptNumber, getVehicleNumber } from '../data/sampleBookings.js';
import { bookingStatuses, serviceOptions } from '../types/booking.js';

const SERVICE_FILTERS = ['전체', ...serviceOptions];

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

export default function AdminDashboard({ reservations, onStatusChange }) {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [serviceFilter, setServiceFilter] = useState('전체');

  const filteredReservations = useMemo(() => {
    if (serviceFilter === '전체') {
      return reservations;
    }

    return reservations.filter(
      (reservation) => reservation.serviceType === serviceFilter,
    );
  }, [reservations, serviceFilter]);

  const updateStatus = (reservationId, nextStatus) => {
    // TODO: 실제 DB 상태 변경 API 연결 예정
    onStatusChange?.(reservationId, nextStatus);
    setSelectedReservation((current) =>
      current?.id === reservationId ? { ...current, status: nextStatus } : current,
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
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-bold text-navy-900 transition hover:bg-slate-100"
            >
              <RefreshCw size={16} />
              메모리 목록
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

          <p className="mt-4 rounded-md bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
            현재는 프론트엔드 메모리 상태로만 관리됩니다. 새로고침하면 샘플
            데이터로 초기화됩니다.
          </p>

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
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-500" colSpan="10">
                      선택한 조건에 해당하는 접수 건이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation, index) => (
                    <tr key={reservation.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-bold text-navy-900">
                        {getReceiptNumber(reservation, index)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {formatDate(reservation.createdAt)}
                      </td>
                      <td className="px-4 py-4 font-bold text-navy-900">
                        {reservation.customerName}
                      </td>
                      <td className="px-4 py-4 text-slate-700">{reservation.phone}</td>
                      <td className="px-4 py-4 text-slate-700">
                        {reservation.vehicleType}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {reservation.serviceType}
                      </td>
                      <td className="px-4 py-4 text-slate-700">{reservation.region}</td>
                      <td className="px-4 py-4 text-slate-700">
                        {getDesiredDate(reservation)}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={reservation.status} />
                      </td>
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedReservation(reservation)}
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

      {selectedReservation && (
        <ReservationDetailModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
          onStatusChange={updateStatus}
        />
      )}
    </section>
  );
}

function ReservationDetailModal({ reservation, onClose, onStatusChange }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/55 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-bold text-signal-orange">접수 상세</p>
            <h3 className="mt-1 text-xl font-black text-navy-900">
              {reservation.customerName} 고객 상담 건
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
          <DetailItem label="고객명" value={reservation.customerName} />
          <DetailItem label="연락처" value={reservation.phone} />
          <DetailItem label="차량 종류" value={reservation.vehicleType} />
          <DetailItem label="서비스 종류" value={reservation.serviceType} />
          <DetailItem label="지역" value={reservation.region} />
          <DetailItem label="희망 날짜" value={getDesiredDate(reservation)} />
          <DetailItem label="차량번호" value={getVehicleNumber(reservation)} />
          <DetailItem label="차량 모델명" value={reservation.vehicleModel || '-'} />
          <DetailItem
            label="첨부 자료 여부"
            value={reservation.hasAttachment ? reservation.attachmentNote : '없음'}
          />
          <label className="block">
            <span className="text-sm font-bold text-navy-900">현재 상태</span>
            <select
              value={reservation.status}
              onChange={(event) => onStatusChange(reservation.id, event.target.value)}
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
              value={reservation.message || '등록된 문의 내용이 없습니다.'}
              multiline
            />
          </div>
          <div className="md:col-span-2">
            <DetailItem label="관리자 메모" value={reservation.adminMemo} multiline />
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

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateValue));
}
