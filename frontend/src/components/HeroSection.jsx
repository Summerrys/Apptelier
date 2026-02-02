import React, { useState, useEffect } from "react";
import { companyInfo } from "../data/mock";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { DemoVideoModal } from "./DemoVideoModal"; // ✅ add this
import { DashboardPreview } from "./DashboardPreview";

const BACKEND_URL = (window?.ApptelierConfig?.apiBaseUrl || process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");

// Fallback stats
const fallbackStats = [
  { value: "10K+", label: "Active Businesses" },
  { value: "2M+", label: "Orders Processed" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Customer Rating" },
];

export const HeroSection = () => {
  const [heroStats, setHeroStats] = useState(fallbackStats);
  const [loading, setLoading] = useState(true);

  const [showDemo, setShowDemo] = useState(false); // ✅ modal state
  const demoVideoUrl = "https://apptelier.sg/wp-content/uploads/2026/01/Apptelier_Video_Demo.mp4"; // ✅ change to your real URL

  useEffect(() => {
    const fetchHeroStats = async () => {
      try {
        if (!BACKEND_URL) { setHeroStats(fallbackStats); setLoading(false); return; }
        const response = await axios.get(`${BACKEND_URL}/api/hero-stats`);
        if (response.data && response.data.length > 0) setHeroStats(response.data);
      } catch (error) {
        console.debug("Hero stats unavailable, using fallback.");
        setHeroStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroStats();
  }, [BACKEND_URL]);

  const highlights = [
    "No setup fees",
    "Customised to your workflow",
    "Automates manual processes",
  ];

  return (
    <section
      id="home"
      className="pt-16 md:pt-20 pb-20 px-6 bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/50"
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Badge stays centered */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200 rounded-full px-4 py-2 mb-10 animate-fade-in">
            <span className="w-2 h-2 bg-[#5BC5E2] rounded-full animate-pulse" />
            <span className="text-[#1A3569] text-sm font-medium">
              New: AI-Powered Scheduling Now Available
            </span>
          </div>
        </div>

        {/* Two-column hero AFTER the badge */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT: content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A3569] leading-[1.0] tracking-tight mb-6 animate-fade-in">
              Customised Digital Solutions
              <span className="block mt-2 text-[#5BC5E2]">with AI-Powered Ordering & Booking</span>
            </h1>

            <div className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl lg:max-w-none mx-auto lg:mx-0 mb-8 animate-fade-in">
              <p>{companyInfo.description}</p>
              <p className="mt-2">
                <span className="font-semibold text-[#5BC5E2]">real-time visibility</span>,{" "}
                <span className="font-semibold text-[#5BC5E2]">consistency</span>{" "}
                <span className="font-semibold text-[#5BC5E2]">& control</span>.
              </p>
            </div>

            {/* Highlights */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-500">
                  <CheckCircle2 className="w-5 h-5 text-[#5BC5E2]" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center gap-2 bg-[#1A3569] text-white px-8 py-4 rounded-xl font-semibold text-base hover:bg-[#0f2347] hover:shadow-[0_8px_25px_rgba(26,53,105,0.3)] transition-all duration-200 hover:-translate-y-0.5 min-w-[200px]"
              >
                Get FREE Quotation
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <button
                type="button"
                onClick={() => {
                  window.gtag?.("event", "demo_video_open", {
                    source: "hero_section",
                    cta: "watch_demo",
                    page_location: window.location.href,
                  });
                  setShowDemo(true);
                }}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1A3569] border-2 border-slate-200 px-8 py-4 rounded-xl font-semibold text-base hover:border-[#5BC5E2] hover:bg-cyan-50 transition-all duration-200 hover:-translate-y-0.5 min-w-[200px] shadow-sm"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
          </div>

          {/* RIGHT: animated dashboard */}
          <DashboardPreview />
        </div>
      </div>

      <DemoVideoModal
        open={showDemo}
        onClose={() => setShowDemo(false)}
        videoUrl={demoVideoUrl}
      />
    </section>
  );
};
