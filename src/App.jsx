import React, { useState } from 'react';
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

export default function App() {
  const [reservations, setReservations] = useState(() => loadReservations());
  const [selectedService, setSelectedService] = useState('');

  const handleBookingCreated = (reservation) => {
    setReservations((current) => {
      const nextReservations = current.some((item) => item.id === reservation.id)
        ? current
        : [reservation, ...current];
      saveReservations(nextReservations);
      return nextReservations;
    });
  };

  const handleReservationUpdate = (reservationId, patch) => {
    setReservations((current) => {
      const nextReservations = current.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, ...patch }
          : reservation,
      );
      saveReservations(nextReservations);
      return nextReservations;
    });
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
