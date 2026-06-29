import React, { useCallback, useState } from 'react';
import AdminArea from './components/AdminArea.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ProblemSection from './components/ProblemSection.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import ProcessSection from './components/ProcessSection.jsx';
import BookingForm from './components/BookingForm.jsx';
import BookingLookup from './components/BookingLookup.jsx';
import CaseStudies from './components/CaseStudies.jsx';
import FAQSection from './components/FAQSection.jsx';
import PartnerSection from './components/PartnerSection.jsx';
import SpecializedSection from './components/SpecializedSection.jsx';
import CTASection from './components/CTASection.jsx';
import Footer from './components/Footer.jsx';
import {
  exportReservationsToCsv,
  loadReservations,
  resetReservations,
  saveReservations,
} from './services/reservationStorage.js';
import {
  fetchReservationsFromSupabase,
  updateReservationMemo,
  updateReservationStatus,
} from './services/reservationRepository.js';

export default function App() {
  const [reservations, setReservations] = useState(() => loadReservations());
  const [selectedService, setSelectedService] = useState('');
  const [reservationStorageMode, setReservationStorageMode] = useState('temporary');
  const [isRefreshingReservations, setIsRefreshingReservations] = useState(false);

  const refreshReservationsFromDb = useCallback(async () => {
    setIsRefreshingReservations(true);

    try {
      const result = await fetchReservationsFromSupabase();
      setReservationStorageMode(result.supabaseLoaded ? 'supabase' : 'temporary');
      setReservations(result.reservations);

      if (result.supabaseLoaded) {
        saveReservations(result.reservations);
      }
    } finally {
      setIsRefreshingReservations(false);
    }
  }, []);

  const handleBookingCreated = (reservation, result) => {
    setReservationStorageMode(result?.supabaseSaved ? 'supabase' : 'temporary');
    setReservations((current) => {
      const nextReservations = current.some((item) => item.id === reservation.id)
        ? current
        : [reservation, ...current];
      saveReservations(nextReservations);
      return nextReservations;
    });
  };

  const applyReservationPatch = useCallback((reservationId, patch) => {
    setReservations((current) => {
      const targetReservation = current.find(
        (reservation) => reservation.id === reservationId,
      );
      const nextReservations = current.map((reservation) =>
        reservation.id === reservationId ||
        (!reservation.id &&
          targetReservation?.receiptNumber &&
          reservation.receiptNumber === targetReservation.receiptNumber)
          ? { ...reservation, ...patch }
          : reservation,
      );
      saveReservations(nextReservations);
      return nextReservations;
    });
  }, []);

  const handleReservationUpdate = async (reservationId, patch) => {
    if (Object.prototype.hasOwnProperty.call(patch, 'status')) {
      const result = await updateReservationStatus(reservationId, patch.status);

      if (!result.supabaseUpdated) {
        return { success: false };
      }
    }

    if (Object.prototype.hasOwnProperty.call(patch, 'adminMemo')) {
      const reservation = reservations.find((item) => item.id === reservationId);
      const result = await updateReservationMemo(
        reservationId,
        patch.adminMemo,
        reservation,
      );

      if (!result.supabaseUpdated) {
        return { success: false };
      }
    }

    applyReservationPatch(reservationId, patch);
    return { success: true };
  };

  const handleReservationsReset = () => {
    const nextReservations = resetReservations();
    setReservations(nextReservations);
  };

  const handleReservationsExport = () => {
    exportReservationsToCsv(reservations);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <ServicesSection onServiceSelect={setSelectedService} />
        <ProcessSection />
        <BookingForm
          selectedService={selectedService}
          onBookingCreated={handleBookingCreated}
        />
        <BookingLookup reservations={reservations} />
        <AdminArea
          reservations={reservations}
          reservationStorageMode={reservationStorageMode}
          isRefreshingReservations={isRefreshingReservations}
          onReservationsRefresh={refreshReservationsFromDb}
          onReservationUpdate={handleReservationUpdate}
          onReservationsReset={handleReservationsReset}
          onReservationsExport={handleReservationsExport}
        />
        <CaseStudies />
        <PartnerSection />
        <SpecializedSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
