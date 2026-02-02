import React, { useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export const WhatsAppCTA = ({
  phone = "6592209445",
  threshold = 0.7, // 70%
  message = "Hi Apptélier! I’d like to learn more about your customised solutions.",
  label = "Chat on WhatsApp", // change to "Talk to us" if you prefer
}) => {
  const [visible, setVisible] = useState(false);

  const href = useMemo(() => {
    const base = `https://wa.me/${phone}`;
    const txt = (message || "").trim();
    return txt ? `${base}?text=${encodeURIComponent(txt)}` : base;
  }, [phone, message]);

  useEffect(() => {
    let rafId = null;

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;

        const doc = document.documentElement;
        const scrollTop = window.scrollY || doc.scrollTop || 0;
        const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
        const progress = scrollTop / maxScroll;

        setVisible(progress >= threshold);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [threshold]);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={[
        "fixed z-[9999] right-5 bottom-5",
        "md:right-7 md:bottom-7",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-3 pointer-events-none",
      ].join(" ")}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:brightness-95 active:scale-[0.98] transition">
        <FaWhatsapp size={22} aria-hidden="true" />
        <span className="font-semibold">{label}</span>
      </div>
    </a>
  );
};
