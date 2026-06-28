import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import {
  getDesiredDate,
  getReceiptNumber,
  sampleBookings,
} from '../data/sampleBookings.js';

const customerMessages = {
  '접수 완료':
    '상담 신청이 정상 접수되었습니다. 담당자가 내용을 확인한 후 연락드릴 예정입니다.',
  '검토 중':
    '차량 정보와 첨부자료를 검토 중입니다. 구조변경 가능 여부, 탁송 조건, 정비 연결 가능 여부를 확인하고 있습니다.',
  '추가자료 요청':
    '정확한 검토를 위해 추가 서류나 사진이 필요합니다. 담당자의 안내에 따라 자료를 추가 제출해주세요.',
  '견적 안내': '서비스 진행에 필요한 예상 비용과 일정을 안내드리는 단계입니다.',
  '예약 확정':
    '상담 내용 검토가 완료되어 예약이 확정되었습니다. 안내된 일정에 맞춰 진행됩니다.',
  '진행 중':
    '현재 검사, 탁송, 정비 상담 또는 위탁점검 절차가 진행 중입니다.',
  완료: '요청하신 상담 또는 서비스 진행이 완료되었습니다.',
  취소: '해당 접수 건은 취소되었습니다. 추가 문의가 필요하면 다시 상담을 신청해주세요.',
};

const progressSteps = [
  '접수 완료',
  '검토 중',
  '견적 안내',
  '예약 확정',
  '진행 중',
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

export default function BookingLookup({ latestBooking }) {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const searchableBookings = useMemo(() => {
    const runtimeBookings = latestBooking ? [latestBooking] : [];
    return [...runtimeBookings, ...sampleBookings];
  }, [latestBooking]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedReceipt = receiptNumber.trim().toUpperCase();
    const normalizedPhone = phone.trim().replaceAll('-', '');

    const foundBooking = searchableBookings.find((booking, index) => {
      const bookingReceipt = getReceiptNumber(booking, index).toUpperCase();
      const bookingPhone = booking.phone.replaceAll('-', '');

      return (
        bookingReceipt === normalizedReceipt && bookingPhone === normalizedPhone
      );
    });

    setLookupResult(foundBooking ?? null);
    setHasSearched(true);
  };

  return (
    <section id="lookup" className="bg-white py-16 lg:py-24">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="eyebrow">예약 조회</p>
            <h2 className="section-title mt-3">상담·예약 진행상태 조회</h2>
            <p className="section-copy">
              접수번호와 연락처를 입력하면 신청한 검사, 구조변경, 탁송,
              정비 상담, 위탁점검의 진행 상태를 확인할 수 있습니다.
            </p>
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              샘플 조회 예시: 접수번호 <strong>RV-001</strong>, 연락처{' '}
              <strong>010-1234-1001</strong>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-navy-900">접수번호</span>
                <input
                  value={receiptNumber}
                  onChange={(event) => setReceiptNumber(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
                  placeholder="예: RV-001"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-navy-900">연락처</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
                  placeholder="예: 010-1234-1001"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-800 md:col-span-2"
              >
                <Search size={17} />
                진행상태 조회하기
              </button>
            </form>

            {hasSearched && !lookupResult && (
              <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
                입력하신 정보와 일치하는 상담/예약 내역을 찾을 수 없습니다.
                접수번호와 연락처를 다시 확인해주세요.
              </p>
            )}

            {lookupResult && (
              <LookupResult booking={lookupResult} receiptNumber={receiptNumber} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function LookupResult({ booking, receiptNumber }) {
  const status = booking.processStatus || '접수 완료';
  const receipt = booking.receiptNumber || receiptNumber.trim().toUpperCase();

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold text-signal-orange">조회 결과</p>
          <h3 className="mt-1 text-xl font-black text-navy-900">
            {booking.name} 고객님의 진행 상태
          </h3>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <InfoItem label="접수번호" value={receipt} />
        <InfoItem label="접수일" value={formatDate(booking.createdAt)} />
        <InfoItem label="고객명" value={booking.name} />
        <InfoItem label="차량 종류" value={booking.vehicleType} />
        <InfoItem label="서비스 종류" value={booking.service} />
        <InfoItem label="지역" value={booking.region} />
        <InfoItem label="희망 날짜" value={getDesiredDate(booking)} />
        <InfoItem label="현재 상태" value={status} />
      </div>

      <div className="mt-5 rounded-lg border border-orange-100 bg-orange-50/70 p-4">
        <strong className="text-sm font-black text-navy-900">
          담당자 안내
        </strong>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {customerMessages[status] ?? customerMessages['접수 완료']}
        </p>
      </div>

      <ProgressSteps status={status} />
    </div>
  );
}

function ProgressSteps({ status }) {
  const activeIndex = getProgressIndex(status);

  return (
    <div className="mt-6">
      <h4 className="text-sm font-black text-navy-900">진행 단계</h4>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {progressSteps.map((step, index) => {
          const isActive = index <= activeIndex;
          return (
            <div
              key={step}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                isActive
                  ? 'border-navy-200 bg-navy-50 text-navy-900'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                  isActive
                    ? 'bg-navy-900 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-bold">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getProgressIndex(status) {
  if (status === '추가자료 요청') {
    return 1;
  }

  if (status === '취소') {
    return 0;
  }

  const index = progressSteps.indexOf(status);
  return index >= 0 ? index : 0;
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

function InfoItem({ label, value }) {
  return (
    <div>
      <span className="text-xs font-black text-slate-500">{label}</span>
      <p className="mt-1 rounded-md bg-white px-4 py-3 text-sm font-semibold text-slate-700">
        {value || '-'}
      </p>
    </div>
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
