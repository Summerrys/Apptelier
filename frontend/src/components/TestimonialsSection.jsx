import React, { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";
import axios from "axios";

const BACKEND_URL = (window?.ApptelierConfig?.apiBaseUrl || process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");

// Fallback data
const fallbackTestimonials = [
  { id: 1, name: "Daniel Tan", role: "Managing Director, Local F&B", content: "Apptelier transformed how we operate. We now have complete visibility across all our 18 outlets and our staff can focus on customer service instead of paperwork.", rating: 5, avatar: "DT" },
  { id: 2, name: "Annie", role: "Owner, Boutique Café & Bakery", content: "The system pays for itself. We've eliminated waste, improved customer satisfaction, and can now handle twice the volume with the same team.", rating: 5, avatar: "A" },
  { id: 3, name: "Sarah Chen", role: "Owner, Sakura Bistro", content: "Apptelier transformed how we handle reservations. Our no-show rate dropped by 60% and our staff can focus on what matters - serving customers.", rating: 5, avatar: "SC" },
  { id: 4, name: "Marcus Johnson", role: "CEO, TechFit Gym", content: "The booking system is incredibly intuitive. Our members love being able to book classes anytime, and we've seen a 40% increase in class attendance.", rating: 5, avatar: "MJ" },
  { id: 5, name: "Emily Rodriguez", role: "Manager, StyleCraft Salon", content: "Since implementing Apptelier, we've reduced phone time by 70%. The automated reminders have been a game-changer for reducing missed appointments.", rating: 5, avatar: "ER" },
  { id: 6, name: "David Kim", role: "Director, MedCare Clinic", content: "The professional tier gives us everything we need for our multi-location practice. The analytics help us optimise scheduling across all our clinics.", rating: 5, avatar: "DK" },
];

// Color variants for testimonial cards
const cardColors = [
  { bg: "from-cyan-50 to-blue-50", avatar: "from-cyan-400 to-blue-500" },
  { bg: "from-violet-50 to-purple-50", avatar: "from-violet-400 to-purple-500" },
  { bg: "from-amber-50 to-orange-50", avatar: "from-amber-400 to-orange-500" },
  { bg: "from-emerald-50 to-teal-50", avatar: "from-emerald-400 to-teal-500" },
  { bg: "from-rose-50 to-pink-50", avatar: "from-rose-400 to-pink-500" },
  { bg: "from-indigo-50 to-sky-50", avatar: "from-indigo-400 to-sky-500" },
];

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [loading, setLoading] = useState(true);

  // Carousel state
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Measure step width (card width + gap)
  const firstCardRef = useRef(null);
  const trackRef = useRef(null);
  const [stepPx, setStepPx] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        if (!BACKEND_URL) { setLoading(false); return; }
        const response = await axios.get(`${BACKEND_URL}/api/testimonials`);
        if (response.data && response.data.length > 0) setTestimonials(response.data);
      } catch (error) {
        console.debug("testimonials unavailable, using fallback:", error);
        setTestimonials(fallbackTestimonials);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Measure card width + gap so carousel works on mobile/desktop
  useEffect(() => {
      const measure = () => {
        const card = firstCardRef.current;
        if (!card) return;
        const cardW = card.getBoundingClientRect().width;
        setStepPx(cardW + 24); // gap-6
      };

      measure();
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }, []);


  // Auto-advance (one card per step)
  useEffect(() => {
    if (paused) return;
    if (!testimonials?.length) return;
    if (!stepPx) return;

    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);

    return () => clearInterval(t);
  }, [paused, testimonials.length, stepPx]);

  // Clamp index if list size changes
  useEffect(() => {
    if (!testimonials?.length) return;
    setIndex((prev) => Math.min(prev, testimonials.length - 1));
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="py-24 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#5BC5E2] text-sm font-semibold uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A3569] mb-6">
            Trusted by <span className="text-[#5BC5E2]">SME Businesses</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See what our customers have to say about transforming their operations.
          </p>
        </div>

        {/* Carousel Viewport (one card wide) */}
        <div
          className="relative overflow-hidden mx-auto w-[320px] sm:w-[380px] lg:w-[420px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* Track */}
          <div
            ref={trackRef}
            className="flex gap-6 transition-transform duration-700 ease-in-out will-change-transform"
            style={{
              transform: `translateX(-${index * stepPx}px)`,
            }}
          >
            {testimonials.map((testimonial, idx) => {
              const colors = cardColors[idx % cardColors.length];
              return (
                <div
                  key={testimonial.id ?? idx}
                  ref={idx === 0 ? firstCardRef : null}
                  className="w-[320px] sm:w-[380px] lg:w-[420px] flex-shrink-0"
                >
                  {/* Card (your existing JSX) */}
                  <div
                    className={`group relative bg-gradient-to-br ${colors.bg} border border-slate-200 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden`}
                  >
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10">
                      <Quote className="w-16 h-16 text-[#1A3569]" />
                    </div>

                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating || 5)].map((_, sidx) => (
                        <Star
                          key={sidx}
                          className="w-5 h-5 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>

                    {/* Testimonial Content */}
                    <p className="text-slate-700 text-lg leading-relaxed mb-8 relative z-10">
                      "{testimonial.content}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${colors.avatar} flex items-center justify-center shadow-lg`}>
                        <span className="text-white font-bold text-sm">
                          {testimonial.avatar || (testimonial.name ? testimonial.name.split(" ").map(x => x[0]).join("").slice(0,2) : "A")}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-[#1A3569] font-semibold">{testimonial.name}</h4>
                        <p className="text-slate-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fade edges (premium look) */}
          {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent" /> */}
        </div>

        {/* Dots navigation */}
        <div className="mt-10 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={[
                "h-2.5 w-2.5 rounded-full transition-all",
                i === index ? "bg-[#5BC5E2] w-6" : "bg-slate-200 hover:bg-slate-300",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
