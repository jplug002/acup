import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import CountryCarousel from './components/CountryCarousel';
import EventsSection from './components/EventsSection';
import AboutSection from './components/AboutSection';
import VisionSection from './components/VisionSection';
import MissionSection from './components/MissionSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import Membership from './components/Membership';
import MembershipForm from './components/MembershipForm';
import ThankYou from './components/ThankYou';
import './App.css';

function App() {
  const HomePage = () => (
    <>
      <Hero />
      <CountryCarousel />
      <EventsSection />
      <AboutSection />
      <VisionSection />
      <MissionSection />
      <CTASection />
    </>
  );

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/register" element={<MembershipForm />} />
          <Route path="/thank-you" element={<ThankYou />} />
          {/* Additional routes will be added here */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
