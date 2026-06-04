import React, { useState } from 'react';
import AdminDashboard from './components/AdminDashboard.jsx';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ProblemSection from './components/ProblemSection.jsx';
import ServicesSection from './components/ServicesSection.jsx';
import ProcessSection from './components/ProcessSection.jsx';
import BookingForm from './components/BookingForm.jsx';
import CaseStudies from './components/CaseStudies.jsx';
import PartnerSection from './components/PartnerSection.jsx';
import CTASection from './components/CTASection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [latestBooking, setLatestBooking] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <ServicesSection />
        <ProcessSection />
        <BookingForm onBookingCreated={setLatestBooking} />
        <AdminDashboard latestBooking={latestBooking} />
        <CaseStudies />
        <PartnerSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
