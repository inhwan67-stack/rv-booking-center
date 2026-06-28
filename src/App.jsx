import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ProblemSection from './components/ProblemSection.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import ProcessSection from './components/ProcessSection.jsx';
import BookingForm from './components/BookingForm.jsx';
import BookingLookup from './components/BookingLookup.jsx';
import CaseStudies from './components/CaseStudies.jsx';
import PartnerSection from './components/PartnerSection.jsx';
import SpecializedSection from './components/SpecializedSection.jsx';
import CTASection from './components/CTASection.jsx';
import Footer from './components/Footer.jsx';
import { sampleBookings } from './data/sampleBookings.js';

export default function App() {
  const [reservations, setReservations] = useState(sampleBookings);
  const [selectedService, setSelectedService] = useState('');

  const handleBookingCreated = (reservation) => {
    setReservations((current) => [reservation, ...current]);
  };

  const handleReservationUpdate = (reservationId, patch) => {
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === reservationId
          ? { ...reservation, ...patch }
          : reservation,
      ),
    );
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
        <AdminDashboard
          reservations={reservations}
          onReservationUpdate={handleReservationUpdate}
        />
        <BookingLookup reservations={reservations} />
        <CaseStudies />
        <PartnerSection />
        <SpecializedSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
