import React from "react";
import { companyInfo, footerLinks } from "../data/mock";
import { Mail, Phone, MapPin } from "lucide-react";
import { Twitter, Linkedin, Github, Instagram, Facebook } from "lucide-react";

export const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/apptelier.sg", label: "Facebook" }, // Replace with your Facebook page URL", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-50 to-slate-100 border-t border-slate-200 pt-20 pb-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center justify-start mb-6">
              <img
                src={companyInfo.logo}
                alt="Apptelier Logo"
                className="w-auto max-w-[160px] object-contain"
                style={{ height: 40 }}
              />
            </a>
            <p className="text-slate-600 leading-relaxed mb-6 max-w-sm">
              Empowering businesses with customised ordering and booking solutions that drive growth and enhance customer experience.
            </p>
            {/* Social Links */}
            <div className="flex justify-start items-center gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-gradient-to-r hover:from-[#5BC5E2] hover:to-[#5BC5E2] hover:text-white hover:border-transparent transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-[#1A3569] font-semibold mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-[#5BC5E2] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          {/* <div>
            <h4 className="text-[#1A3569] font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-600 hover:text-[#5BC5E2] transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}

          {/* Get in Touch Links */}
          <div className="text-left">
            <h4 className="text-[#1A3569] font-semibold mb-6">Get in Touch</h4>

            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:hello@apptelier.sg"
                  className="flex items-center justify-start gap-3 text-slate-600 hover:text-[#5BC5E2] transition-colors"
                >
                  <Mail className="w-5 h-5 text-[#5BC5E2] flex-shrink-0" />
                  <span className="text-left">hello@apptelier.sg</span>
                </a>
              </li>

              <li>
                <a
                  href="tel:+6565805411"
                  className="flex items-center justify-start gap-3 text-slate-600 hover:text-[#5BC5E2] transition-colors"
                >
                  <Phone className="w-5 h-5 text-[#5BC5E2] flex-shrink-0" />
                  <span className="text-left">(+65) 6580 5411</span>
                </a>
              </li>

              <li className="flex items-center justify-start gap-3 text-slate-600">
                <MapPin className="w-5 h-5 text-[#5BC5E2] flex-shrink-0" />
                <span className="text-left">Singapore</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-slate-500 text-sm hover:text-[#5BC5E2] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-500 text-sm hover:text-[#5BC5E2] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
