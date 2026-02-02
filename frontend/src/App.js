import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { ServicesSection } from "./components/ServicesSection";
import { PricingSection } from "./components/PricingSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { WhatsAppCTA } from "./components/WhatsAppCTA";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-20 md:pt-24">
        <HeroSection />
        <ServicesSection />
        <PricingSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
      
      <WhatsAppCTA
        phone="6565805411"
        threshold={0.7}
        label="Talk to us"
        message="Hi Apptélier! I’d like a FREE quotation."
      />
      <Toaster position="bottom-right" theme="light" />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;