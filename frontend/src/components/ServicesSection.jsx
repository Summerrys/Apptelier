import React, { useState, useEffect } from "react";
import { ShoppingCart, Calendar, Utensils, Users, Plug, BarChart3, ArrowRight } from "lucide-react";
import axios from "axios";

const BACKEND_URL = (window?.ApptelierConfig?.apiBaseUrl || process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
const iconMap = {
  ShoppingCart,
  Calendar,
  Utensils,
  Users,
  Plug,
  BarChart3,
};

// Color variants for cards
const cardColors = [
  { bg: "from-cyan-50 to-blue-50", icon: "bg-gradient-to-br from-cyan-400 to-blue-500", border: "hover:border-cyan-400" },
  { bg: "from-violet-50 to-purple-50", icon: "bg-gradient-to-br from-violet-400 to-purple-500", border: "hover:border-violet-400" },
  { bg: "from-amber-50 to-orange-50", icon: "bg-gradient-to-br from-amber-400 to-orange-500", border: "hover:border-amber-400" },
  { bg: "from-emerald-50 to-teal-50", icon: "bg-gradient-to-br from-emerald-400 to-teal-500", border: "hover:border-emerald-400" },
  { bg: "from-rose-50 to-pink-50", icon: "bg-gradient-to-br from-rose-400 to-pink-500", border: "hover:border-rose-400" },
  { bg: "from-sky-50 to-indigo-50", icon: "bg-gradient-to-br from-sky-400 to-indigo-500", border: "hover:border-sky-400" },
];

// Fallback data
const fallbackServices = [
  { id: 1, title: "Online Ordering System", description: "Accept and manage orders seamlessly with our intuitive ordering platform. Works across web and mobile.", icon: "ShoppingCart" },
  { id: 2, title: "Appointment Booking", description: "Let customers book appointments 24/7 with automated scheduling and reminders.", icon: "Calendar" },
  { id: 3, title: "Table Reservations", description: "Manage restaurant bookings efficiently with real-time availability and waitlist management.", icon: "Utensils" },
  { id: 4, title: "Queue Management", description: "Reduce wait times and improve customer experience with smart queue systems.", icon: "Users" },
  { id: 5, title: "Custom Integrations", description: "Connect with your existing tools - POS, CRM, payment gateways, and more.", icon: "Plug" },
  { id: 6, title: "Analytics Dashboard", description: "Gain insights into your business with real-time data and comprehensive reports.", icon: "BarChart3" },
];

export const ServicesSection = () => {
  const [services, setServices] = useState(fallbackServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (!BACKEND_URL) { setLoading(false); return; }
        const response = await axios.get(`${BACKEND_URL}/api/services`);
        if (response.data && response.data.length > 0) {
          setServices(response.data);
        }
      } catch (error) {
        console.debug("services unavailable, using fallback:", error);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#5BC5E2] text-sm font-semibold uppercase tracking-wider mb-4">
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A3569] mb-6">
            Everything You Need to <span className="text-[#5BC5E2]">Scale</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Apptelier offers comprehensive solutions designed to streamline your operations and enhance customer experience.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const IconComponent = iconMap[service.icon];
            const colors = cardColors[idx % cardColors.length];
            return (
              <div
                key={service.id}
                className={`group relative bg-gradient-to-br ${colors.bg} border border-slate-200 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${colors.border} hover:shadow-xl overflow-hidden`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${colors.icon} flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                  {IconComponent && (
                    <IconComponent className="w-7 h-7 text-white" />
                  )}
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[#1A3569] mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[#1A3569] font-medium text-sm opacity-0 transition-all duration-300 group-hover:opacity-100"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
