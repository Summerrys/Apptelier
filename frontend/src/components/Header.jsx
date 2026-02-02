import React, { useState } from "react";
import { navLinks, companyInfo } from "../data/mock";
import { Menu, X } from "lucide-react";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="apptelier-fixed-header fixed left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <nav className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          
          <img 
            src={companyInfo.logo}
            alt="Apptelier Logo"
            className="h-10 w-auto transition-transform duration-200 group-hover:scale-105"
            style={{ height: 45, width: "auto", objectFit: "contain" }}
          />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-600 hover:text-[#1A3569] text-base font-medium transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center bg-gradient-to-r from-[#1A3569] to-[#1A3569] text-white px-6 py-3 rounded-xl font-semibold text-base hover:shadow-[0_8px_25px_rgba(26,53,105,0.3)] transition-all duration-200 hover:-translate-y-0.5"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#1A3569] hover:bg-slate-100 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 animate-fade-in">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-600 hover:text-[#1A3569] text-lg font-medium py-2 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-gradient-to-r from-[#1A3569] to-[#1A3569] text-white px-6 py-3 rounded-xl font-semibold text-base hover:shadow-lg transition-all duration-200 mt-4"
            >
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
