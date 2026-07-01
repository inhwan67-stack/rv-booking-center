import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Download, LogOut, RefreshCw, RotateCcw, Search, X } from 'lucide-react';
import {
  getDesiredDate,
  getReceiptNumber,
  getVehicleNumber,
} from '../data/sampleBookings.js';
import { bookingStatuses, serviceOptions } from '../types/booking.js';

const SERVICE_FILTERS = ['전체', ...serviceOptions];
const STATUS_FILTERS = ['전체 상태', ...bookingStatuses];
const PAYMENT_STATUSES = ['미결제', '입금대기', '결제완료', '환불', '취소'];
const SUMMARY_STATUSES = [
  '전체 접수',
  '접수 완료',
  '검토 중',
  '추가자료 요청',
  '견적 안내',
  '예약 확정',
  '완료',
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

export default function AdminDashboard({
  reservations,
  reservationStorageMode,
  isRefreshingReservations,
  onReservationsRefresh,
  onReservationUpdate,
  onReservationsReset,
  onReservationsExport,
  onAdminLogout,
}) {
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [serviceFilter, setServiceFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체 상태');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    onReservationsRefresh?.();
  }, [onReservationsRefresh]);

  const summaryItems = useMemo(
    () =>
      SUMMARY_STATUSES.map((status) => ({
        label: status,
        value:
          status === '전체 접수'
            ? reservations.length
            : reservations.filter((reservation) => reservation.status === status)
                .length,
      })),
    [reservations],
  );

  const filteredReservations = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return reservations.filter((reservation, index) => {
      const matchesService =
        serviceFilter === '전체' || reservation.serviceType === serviceFilter;
      const matchesStatus =
        statusFilter === '전체 상태' || reservation.status === statusFilter;
      const searchableText = [
        reservation.customerName,
        reservation.phone,
        reservation.vehicleNumber,
        reservation.vehicleModel,
        reservation.region,
        getReceiptNumber(reservation, index),
      ]
        .join(' ')
        .toLowerCase();
      const matchesSearch = !keyword || searchableText.includes(keyword);

      return matchesService && matchesStatus && matchesSearch;
    });
  }, [reservations, searchKeyword, serviceFilter, statusFilter]);

  const handleReservationUpdate = async (reservationId, patch, reservation) => {
    const result = await onReservationUpdate?.(reservationId, patch, reservation);

    if (result?.success === false) {
      return result;
    }

    setSelectedReservation((current) =>
      current?.id === reservationId || current?.receiptNumber === reservationId
        ? { ...current, ...patch }
        : current,
    );
    return { success: true };
  };

  const handleResetClick = () => {
    if (
      window.confirm(
        '저장된 상담/예약 데이터를 초기화하시겠습니까? 테스트 데이터가 샘플 상태로 돌아갑니다.',
      )
    ) {
      onReservationsReset?.();
      setSelectedReservation(null);
      setServiceFilter('전체');
      setStatusFilter('전체 상태');
      setSearchKeyword('');
    }
  };

  return (
    <section className="bg-slate-100 py-6">
      <div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
          <div>
            <p className="eyebrow">관리자 페이지</p>
            <h2 className="section-title mt-3">상담·예약 접수 관리</h2>
            <p className="section-copy">
              접수된 검사, 구조변경, 탁송, 정비 상담, 위탁점검 신청 건을
              확인하고 진행 상태를 관리합니다.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onReservationsRefresh}
              disabled={isRefreshingReservations}
              className="inline-flex items-center gap-2 rounded-md bg-signal-orange px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <RefreshCw
                className={isRefreshingReservations ? 'animate-spin' : undefined}
                size={16}
              />
              DB 새로고침
            </button>
            <button
              type="button"
              onClick={onReservationsExport}
              className="inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-navy-800"
            >
              <Download size={16} />
              CSV 다운로드
            </button>
            <button
              type="button"
              onClick={onAdminLogout}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut size={16} />
              관리자 로그아웃
            </button>
            <button
              type="button"
              onClick={handleResetClick}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
            >
              <RotateCcw size={14} />
              샘플 데이터로 초기화
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4"
              >
                <span className="text-xs font-bold text-slate-500">
                  {item.label}
                </span>
                <strong className="mt-2 block text-2xl font-black text-navy-900">
                  {item.value}
                </strong>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1.2fr_0.9fr_0.9fr]">
            <label className="block">
              <span className="text-sm font-bold text-navy-900">검색</span>
              <div className="relative mt-2">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
                  placeholder="고객명, 연락처, 차량번호, 모델명, 지역, 접수번호"
                />
              </div>
            </label>
            <SelectFilter
              label="서비스 종류"
              value={serviceFilter}
              onChange={setServiceFilter}
              options={SERVICE_FILTERS}
            />
            <SelectFilter
              label="상태"
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_FILTERS}
            />
          </div>

          <p className="mt-4 rounded-md bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
            {reservationStorageMode === 'supabase'
              ? '현재 상담/예약 데이터는 Supabase DB에서 불러오고 있습니다.'
              : '현재는 프론트엔드 임시 저장 상태입니다.'}
          </p>

          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-navy-900 text-xs font-bold uppercase tracking-wide text-white">
                <tr>
                  <th className="px-4 py-4">접수번호</th>
                  <th className="px-4 py-4">고객명</th>
                  <th className="px-4 py-4">서비스 종류</th>
                  <th className="px-4 py-4">차량 종류</th>
                  <th className="px-4 py-4">지역</th>
                  <th className="px-4 py-4">희망 날짜</th>
                  <th className="px-4 py-4">현재 상태</th>
                  <th className="px-4 py-4">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.length === 0 ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-500" colSpan="8">
                      검색 또는 필터 조건에 해당하는 접수 건이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredReservations.map((reservation, index) => (
                    <tr key={reservation.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <span className="font-bold text-navy-900">
                            {getReceiptNumber(reservation, index)}
                          </span>
                          {isPriorityReservation(reservation) && (
                            <PriorityBadge />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <strong className="block text-navy-900">
                          {reservation.customerName}
                        </strong>
                        <span className="text-xs text-slate-500">
                          {reservation.phone}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {reservation.serviceType}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {reservation.vehicleType}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {reservation.region}
                      </td>
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
          onReservationUpdate={handleReservationUpdate}
        />
      )}
    </section>
  );
}

function ReservationDetailModal({ reservation, onClose, onReservationUpdate }) {
  const [memo, setMemo] = useState(reservation.adminMemo || '');
  const [baseAmount, setBaseAmount] = useState(toAmountInput(reservation.baseAmount));
  const [extraAmount, setExtraAmount] = useState(toAmountInput(reservation.extraAmount));
  const [discountAmount, setDiscountAmount] = useState(
    toAmountInput(reservation.discountAmount),
  );
  const [finalAmount, setFinalAmount] = useState(toAmountInput(reservation.finalAmount));
  const [isFinalAmountEdited, setIsFinalAmountEdited] = useState(
    hasPositiveAmount(reservation.finalAmount),
  );
  const [paymentStatus, setPaymentStatus] = useState(
    reservation.paymentStatus || PAYMENT_STATUSES[0],
  );
  const [priceMemo, setPriceMemo] = useState(reservation.priceMemo || '');
  const [statusSaveError, setStatusSaveError] = useState('');
  const [memoSaveMessage, setMemoSaveMessage] = useState('');
  const [memoSaveError, setMemoSaveError] = useState('');
  const [priceSaveMessage, setPriceSaveMessage] = useState('');
  const [priceSaveError, setPriceSaveError] = useState('');
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingMemo, setIsSavingMemo] = useState(false);
  const [isSavingPrice, setIsSavingPrice] = useState(false);

  const handleStatusChange = async (nextStatus) => {
    setStatusSaveError('');
    setIsSavingStatus(true);

    const result = await onReservationUpdate(
      getReservationIdentifier(reservation),
      {
        status: nextStatus,
      },
      reservation,
    );

    if (result?.success === false) {
      setStatusSaveError('상태 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }

    setIsSavingStatus(false);
  };

  const handleMemoSave = async () => {
    setMemoSaveMessage('');
    setMemoSaveError('');
    setIsSavingMemo(true);

    const result = await onReservationUpdate(
      getReservationIdentifier(reservation),
      {
        adminMemo: memo,
      },
      reservation,
    );

    if (result?.success === false) {
      setMemoSaveError('메모 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } else {
      setMemoSaveMessage('관리자 메모가 저장되었습니다.');
    }

    setIsSavingMemo(false);
  };

  const handleAmountChange = (setter) => (event) => {
    const nextValue = sanitizeAmountInput(event.target.value);
    setter(nextValue);

    if (!isFinalAmountEdited) {
      const nextBaseAmount = setter === setBaseAmount ? nextValue : baseAmount;
      const nextExtraAmount = setter === setExtraAmount ? nextValue : extraAmount;
      const nextDiscountAmount =
        setter === setDiscountAmount ? nextValue : discountAmount;

      setFinalAmount(
        String(
          calculateFinalAmount(
            nextBaseAmount,
            nextExtraAmount,
            nextDiscountAmount,
          ),
        ),
      );
    }
  };

  const handleFinalAmountChange = (event) => {
    setIsFinalAmountEdited(true);
    setFinalAmount(sanitizeAmountInput(event.target.value));
  };

  const handlePriceSave = async () => {
    const pricePatch = {
      baseAmount: toAmountNumber(baseAmount),
      extraAmount: toAmountNumber(extraAmount),
      discountAmount: toAmountNumber(discountAmount),
      finalAmount: toAmountNumber(finalAmount),
      paymentStatus,
      priceMemo,
    };

    setPriceSaveMessage('');
    setPriceSaveError('');
    setIsSavingPrice(true);

    const result = await onReservationUpdate(
      getReservationIdentifier(reservation),
      pricePatch,
      reservation,
    );

    if (result?.success === false) {
      setPriceSaveError('금액 정보 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } else {
      setPriceSaveMessage('금액 정보가 저장되었습니다.');
    }

    setIsSavingPrice(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-900/55 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-soft">
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
          <DetailItem label="접수번호" value={getReceiptNumber(reservation)} />
          <DetailItem label="접수일" value={formatDate(reservation.createdAt)} />
          <DetailItem label="고객명" value={reservation.customerName} />
          <DetailItem label="연락처" value={reservation.phone} />
          <DetailItem label="차량 종류" value={reservation.vehicleType} />
          <DetailItem label="서비스 종류" value={reservation.serviceType} />
          <DetailItem label="지역" value={reservation.region} />
          <DetailItem label="희망 날짜" value={getDesiredDate(reservation)} />
          <DetailItem label="차량번호" value={getVehicleNumber(reservation)} />
          <DetailItem label="차량 모델명" value={reservation.vehicleModel || '-'} />
          <DetailItem
            label="첨부자료 여부"
            value={reservation.hasAttachment ? '있음' : '없음'}
          />
          <DetailItem
            label="첨부자료 메모"
            value={reservation.attachmentNote || '-'}
          />
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-sm font-black text-navy-900">첨부파일</h4>
            <DetailItem
              label="첨부파일 메모"
              value={reservation.attachmentMemo || '-'}
              multiline
            />
            <AdminAttachmentList attachments={reservation.attachmentUrls ?? []} />
          </div>
          <label className="block">
            <span className="text-sm font-bold text-navy-900">현재 상태</span>
            <select
              value={reservation.status}
              onChange={(event) => handleStatusChange(event.target.value)}
              disabled={isSavingStatus}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
            >
              {bookingStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {statusSaveError && (
              <p className="mt-2 rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {statusSaveError}
              </p>
            )}
          </label>
          <div className="md:col-span-2">
            <DetailItem
              label="문의 내용"
              value={reservation.message || '등록된 문의 내용이 없습니다.'}
              multiline
            />
          </div>
          <label className="block md:col-span-2">
            <span className="text-sm font-bold text-navy-900">담당자 메모</span>
            <textarea
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              rows="5"
              className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
              placeholder="예: 고객에게 등록증 추가 요청, 탁송 견적 안내 필요, 구조변경 가능 여부 확인 중"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleMemoSave}
                disabled={isSavingMemo}
                className="rounded-md bg-navy-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-navy-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSavingMemo ? '저장 중...' : '메모 저장'}
              </button>
              {memoSaveMessage && (
                <p className="text-sm font-semibold text-emerald-700">
                  {memoSaveMessage}
                </p>
              )}
              {memoSaveError && (
                <p className="text-sm font-semibold text-red-700">
                  {memoSaveError}
                </p>
              )}
            </div>
          </label>
          <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold text-signal-orange">
                  견적/결제 정보
                </p>
                <h4 className="mt-1 text-lg font-black text-navy-900">
                  금액 입력 및 결제 상태
                </h4>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsFinalAmountEdited(false);
                  setFinalAmount(
                    String(
                      calculateFinalAmount(
                        baseAmount,
                        extraAmount,
                        discountAmount,
                      ),
                    ),
                  );
                }}
                className="w-fit rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
              >
                최종 금액 자동계산
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <AmountInput
                label="기본 금액"
                value={baseAmount}
                onChange={handleAmountChange(setBaseAmount)}
              />
              <AmountInput
                label="추가 금액"
                value={extraAmount}
                onChange={handleAmountChange(setExtraAmount)}
              />
              <AmountInput
                label="할인 금액"
                value={discountAmount}
                onChange={handleAmountChange(setDiscountAmount)}
              />
              <AmountInput
                label="최종 견적 금액"
                value={finalAmount}
                onChange={handleFinalAmountChange}
              />
              <label className="block">
                <span className="text-sm font-bold text-navy-900">
                  결제 상태
                </span>
                <select
                  value={paymentStatus}
                  onChange={(event) => setPaymentStatus(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="text-sm font-bold text-navy-900">
                  금액 메모
                </span>
                <textarea
                  value={priceMemo}
                  onChange={(event) => setPriceMemo(event.target.value)}
                  rows="4"
                  className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
                  placeholder="견적 산정 기준, 추가 비용, 할인 사유 등을 입력하세요."
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePriceSave}
                disabled={isSavingPrice}
                className="rounded-md bg-signal-orange px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSavingPrice ? '저장 중...' : '금액 저장'}
              </button>
              {priceSaveMessage && (
                <p className="text-sm font-semibold text-emerald-700">
                  {priceSaveMessage}
                </p>
              )}
              {priceSaveError && (
                <p className="text-sm font-semibold text-red-700">
                  {priceSaveError}
                </p>
              )}
            </div>
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

function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-navy-900">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
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

function AdminAttachmentList({ attachments }) {
  if (!attachments.length) {
    return (
      <p className="mt-3 rounded-md bg-white px-4 py-3 text-sm text-slate-500">
        업로드된 첨부파일이 없습니다.
      </p>
    );
  }

  return (
    <ul className="mt-3 grid gap-2">
      {attachments.map((attachment, index) => (
        <li
          key={`${attachment.url}-${index}`}
          className="rounded-md border border-slate-200 bg-white p-3 text-sm"
        >
          <div className="font-bold text-navy-900">
            {attachment.name || '첨부파일'}
          </div>
          <div className="mt-1 text-slate-500">
            업로드일: {formatDate(attachment.uploadedAt)}
          </div>
          {attachment.url && (
            <a
              href={attachment.url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-bold text-signal-orange hover:text-orange-700"
            >
              파일 열기
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}

function AmountInput({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-navy-900">{label}</span>
      <input
        value={value}
        onChange={onChange}
        inputMode="numeric"
        pattern="[0-9]*"
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
        placeholder="0"
      />
    </label>
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

function PriorityBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-[11px] font-black text-red-700">
      <AlertTriangle size={12} />
      우선 확인
    </span>
  );
}

function isPriorityReservation(reservation) {
  const urgentWords = ['급함', '긴급', '오늘', '내일'];
  const message = reservation.message || '';

  return (
    reservation.status === '추가자료 요청' ||
    urgentWords.some((word) => message.includes(word))
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

function getReservationIdentifier(reservation) {
  return reservation.id || reservation.receiptNumber;
}

function sanitizeAmountInput(value) {
  return value.replace(/\D/g, '');
}

function toAmountNumber(value) {
  return Number(sanitizeAmountInput(String(value ?? ''))) || 0;
}

function toAmountInput(value) {
  const amount = toAmountNumber(value);
  return amount > 0 ? String(amount) : '';
}

function calculateFinalAmount(baseAmount, extraAmount, discountAmount) {
  return Math.max(
    toAmountNumber(baseAmount) +
      toAmountNumber(extraAmount) -
      toAmountNumber(discountAmount),
    0,
  );
}

function hasPositiveAmount(value) {
  return toAmountNumber(value) > 0;
}
