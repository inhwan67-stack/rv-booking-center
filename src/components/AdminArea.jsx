import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import AdminDashboard from './AdminDashboard.jsx';
import AdminLogin from './AdminLogin.jsx';

const ADMIN_AUTH_STORAGE_KEY = 'rv_admin_authenticated';

function getInitialAdminAuthState() {
  return sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true';
}

export default function AdminArea({
  reservations,
  reservationStorageMode,
  isRefreshingReservations,
  onReservationsRefresh,
  onReservationUpdate,
  onReservationsReset,
  onReservationsExport,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(getInitialAdminAuthState);

  const handleLoginSuccess = () => {
    sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <section id="admin" className="bg-slate-950 py-14 lg:py-20">
      <div className="section-shell">
        <div className="rounded-2xl border border-white/10 bg-white p-5 shadow-soft sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">테스트 관리자 영역</p>
              <h2 className="section-title mt-3">관리자 업무 화면</h2>
              <p className="section-copy">
                이 영역은 접수된 상담·예약 건을 확인하고 진행 상태를 관리하기
                위한 테스트용 관리자 화면입니다. 실제 서비스 운영 시에는
                관리자 로그인과 권한 설정이 필요합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-signal-orange px-5 py-3 text-sm font-black text-white transition hover:bg-orange-600 sm:w-auto"
              aria-expanded={isOpen}
              aria-controls="admin-dashboard-panel"
            >
              <ShieldCheck size={18} />
              {isOpen ? '관리자 화면 닫기' : '관리자 화면 열기'}
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {!isOpen && (
            <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
              관리자 화면은 고객용 상담 흐름과 구분하기 위해 기본적으로 접힌
              상태입니다. 테스트가 필요할 때 버튼을 눌러 통계, 검색/필터,
              접수 목록, 상세보기, CSV 다운로드 기능을 확인할 수 있습니다.
            </div>
          )}
        </div>

        {isOpen && !isAuthenticated && (
          <div id="admin-dashboard-panel" className="mt-6">
            <AdminLogin onLoginSuccess={handleLoginSuccess} />
          </div>
        )}

        {isOpen && isAuthenticated && (
          <div id="admin-dashboard-panel" className="mt-6">
            <AdminDashboard
              reservations={reservations}
              reservationStorageMode={reservationStorageMode}
              isRefreshingReservations={isRefreshingReservations}
              onReservationsRefresh={onReservationsRefresh}
              onReservationUpdate={onReservationUpdate}
              onReservationsReset={onReservationsReset}
              onReservationsExport={onReservationsExport}
              onAdminLogout={handleLogout}
            />
          </div>
        )}
      </div>
    </section>
  );
}
