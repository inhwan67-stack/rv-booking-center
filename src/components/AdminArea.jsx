import React, { useState } from 'react';
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
        {!isAuthenticated ? (
          <AdminLogin onLoginSuccess={handleLoginSuccess} />
        ) : (
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
        )}
      </div>
    </section>
  );
}
