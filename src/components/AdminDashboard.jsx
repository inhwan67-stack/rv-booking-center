import React, { useEffect, useState } from 'react';
import { Image, RefreshCw } from 'lucide-react';
import {
  fetchBookings,
  getBookingStorageMode,
} from '../services/bookingRepository.js';
import { bookingStatuses } from '../types/booking.js';

const statusStyles = {
  접수: 'bg-blue-50 text-blue-700',
  상담중: 'bg-orange-50 text-orange-700',
  견적중: 'bg-purple-50 text-purple-700',
  완료: 'bg-emerald-50 text-emerald-700',
};

export default function AdminDashboard({ latestBooking }) {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const storageMode = getBookingStorageMode();

  const loadBookings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const bookingList = await fetchBookings();
      setBookings(bookingList);
    } catch (loadError) {
      console.error('예약 목록 조회 오류:', loadError);
      setError(
        loadError.message ||
          '예약 목록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
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

    setBookings((current) => [
      latestBooking,
      ...current.filter((booking) => booking.id !== latestBooking.id),
    ]);
  }, [latestBooking]);

  return (
    <section id="admin" className="bg-white py-16 lg:py-24">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">관리자 페이지</p>
            <h2 className="section-title mt-3">예약 관리 기본 화면</h2>
            <p className="section-copy">
              {storageMode === 'local'
                ? '현재 Supabase 환경변수가 없어 브라우저 localStorage에 저장된 테스트 예약 목록을 표시합니다.'
                : 'Supabase bookings 테이블에서 접수된 예약 목록을 불러와 표시합니다.'}
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

        {storageMode === 'local' && (
          <p className="mt-6 rounded-md bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
            테스트 모드입니다. 예약 데이터와 사진은 현재 브라우저에만 임시
            저장됩니다.
          </p>
        )}

        <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-soft">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 p-4">
            {bookingStatuses.map((status) => (
              <span
                key={status}
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[status]}`}
              >
                {status}
              </span>
            ))}
          </div>

          {error && (
            <p className="m-4 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">고객명</th>
                  <th className="px-5 py-4">연락처</th>
                  <th className="px-5 py-4">지역</th>
                  <th className="px-5 py-4">차량 종류</th>
                  <th className="px-5 py-4">신청 서비스</th>
                  <th className="px-5 py-4">사진</th>
                  <th className="px-5 py-4">접수일</th>
                  <th className="px-5 py-4">처리상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.length === 0 && !error ? (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-500" colSpan="8">
                      아직 접수된 예약이 없습니다.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4 font-bold text-navy-900">
                        {booking.name}
                      </td>
                      <td className="px-5 py-4 text-slate-700">{booking.phone}</td>
                      <td className="px-5 py-4 text-slate-700">{booking.region}</td>
                      <td className="px-5 py-4 text-slate-700">
                        {booking.vehicleType}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {booking.service}
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        <PhotoLinks photos={booking.photoUrls ?? []} />
                      </td>
                      <td className="px-5 py-4 text-slate-700">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            statusStyles[booking.processStatus] ??
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {booking.processStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhotoLinks({ photos }) {
  if (!photos.length) {
    return <span className="text-slate-400">없음</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {photos.map((photo, index) => (
        <a
          key={`${photo.name}-${index}`}
          href={photo.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-900 transition hover:bg-navy-100"
        >
          <Image size={13} />
          {index + 1}
        </a>
      ))}
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
