import React, { useMemo, useRef, useState } from "react";
import { ArrowRight, Calendar, Mail } from "lucide-react";
import { toast } from "sonner";

/**
 * ContactSection
 * - React-themed CTA + Form (below Testimonials)
 * - Validates inputs client-side
 * - Submits to your existing WP endpoint (POST)
 * - Anti-spam: 10s cooldown
 */
export const ContactSection = () => {
    const waPhone = "6592209445";

    const waScheduleHref = useMemo(() => {
    const text =
        "Hi Apptélier! I'd like to schedule a call to discuss a customised AI ordering & booking solution.";
    return `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
        }, []); 
    const endpoint = useMemo(() => {
        // keep using your existing WP handler
        return "https://cart.apptelier.sg/wp-content/themes/woostify-child/apptelier-contact.php";
    }, []);

    const fireScheduleAnalytics = () => {
        const eventName = "whatsapp_schedule_call_click";

        // GA4 gtag
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("event", eventName, {
            cta: "whatsapp",
            intent: "schedule_call",
            placement: "contact_section",
            page_location: window.location.href,
            });
            return;
        }

        // GTM dataLayer
        if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
            window.dataLayer.push({
            event: eventName,
            cta: "whatsapp",
            intent: "schedule_call",
            placement: "contact_section",
            page: window.location.href,
            });
            return;
        }

        console.debug("[ContactSection] analytics:", {
            event: eventName,
            cta: "whatsapp",
            intent: "schedule_call",
            placement: "contact_section",
        });
    };

  const lastSubmitRef = useRef(0);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    business: "",
    message: "",
  });

  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const rules = useMemo(
    () => ({
      name: {
        validate: (v) => /^[A-Za-z][A-Za-z\s'\-]{1,58}[A-Za-z]$/.test(v.trim()),
        message: "Enter a valid full name.",
      },
      mobile: {
        validate: (v) => /^[986]\d{7}$/.test(v.trim()),
        message: "Enter a valid mobile number (Singapore).",
      },
      email: {
        validate: (v) =>
          v.trim() === "" ||
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v.trim()),
        message: "Enter a valid email.",
      },
      business: {
        validate: (v) => v.trim() !== "",
        message: "Select your business type.",
      },
      message: {
        validate: (v) => v.trim().length >= 10,
        message: "Message must be at least 10 characters.",
      },
    }),
    []
  );

  const errors = useMemo(() => {
    const e = {};
    Object.keys(rules).forEach((k) => {
      if (!rules[k].validate(form[k])) e[k] = rules[k].message;
    });
    return e;
  }, [form, rules]);

  const isValid = Object.keys(errors).length === 0;

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onBlur = (key) => setTouched((prev) => ({ ...prev, [key]: true }));

  const submit = async (e) => {
    e.preventDefault();

    // touch everything so errors show
    setTouched({
      name: true,
      mobile: true,
      email: true,
      business: true,
      message: true,
    });

    if (!isValid) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    // 10s cooldown
    const now = Date.now();
    if (now - lastSubmitRef.current < 10000) {
      toast.error("You're submitting too fast. Please wait 10 seconds.");
      return;
    }
    lastSubmitRef.current = now;

    setSubmitting(true);

    try {
      // WordPress PHP endpoint likely expects standard form fields
      const body = new URLSearchParams();
      body.set("name", form.name.trim());
      body.set("mobile", form.mobile.trim());
      body.set("email", form.email.trim());
      body.set("business", form.business.trim());
      body.set("message", form.message.trim());

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: body.toString(),
      });

      // Some WP handlers redirect or return HTML; treat non-2xx as error
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      toast.success("Thank you! We’ve received your enquiry. We’ll get back to you soon.");

      setForm({
        name: "",
        mobile: "",
        email: "",
        business: "",
        message: "",
      });
      setTouched({});
    } catch (err) {
      console.error("Contact submit failed:", err);
      toast.error("Sorry, something went wrong. Please try again or WhatsApp us.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-24 px-6 bg-gradient-to-br from-[#0f2347] via-[#1A3569] to-[#0b1a34] relative overflow-hidden"
      aria-labelledby="contact-title"
    >
      {/* soft blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#5BC5E2]/15 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left CTA */}
          <div className="text-left flex flex-col items-start">
            <span className="text-[#5BC5E2] text-sm font-semibold tracking-wider uppercase">
              Get Started Today
            </span>

            <h2
              id="contact-title"
              className="text-4xl md:text-5xl font-extrabold text-white mt-4 mb-6 leading-tight"
            >
              Ready to streamline your business with{" "}
              <span className="bg-gradient-to-r from-[#5BC5E2] via-[#5BC5E2] to-[#5BC5E2] bg-clip-text text-transparent">
                customised AI solutions
              </span>
              ?
            </h2>

            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Tell us your workflow and goals — we’ll recommend the right modules for ordering,
              booking, automation, and real-time visibility.
            </p>

            <div className="space-y-4 mb-8 text-left w-full max-w-xl">
              {[
                { title: "Free Consultation", desc: "Discuss your needs at no cost." },
                { title: "Customised Solutions", desc: "Tailored to your business workflows." },
                { title: "Ongoing Support", desc: "We’ll support you as you scale." },
              ].map((item) => (
                <div key={item.title} className="flex items-start justify-start gap-4 w-full">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                    <ArrowRight className="w-5 h-5 text-[#5BC5E2]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-white/70 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a
            href={waScheduleHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={fireScheduleAnalytics}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white px-6 py-3 rounded-xl hover:bg-white/15 transition font-semibold"
            aria-label="Talk to us on WhatsApp"
            >
            <Calendar className="w-5 h-5 text-[#5BC5E2]" />
            Talk to Us
            </a>
          </div>

          {/* Right Form */}
          <div id="contact-form" className="bg-white rounded-2xl p-8 lg:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#5BC5E2]/15 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-[#1A3569]" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-[#1A3569]">Get in Touch</h3>
                <p className="text-sm text-slate-500">We’ll respond within 24 hours</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Full Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  onBlur={() => onBlur("name")}
                  autoComplete="name"
                  placeholder="John Lee"
                  className={[
                    "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2",
                    touched.name && errors.name
                      ? "border-red-400 bg-red-50 focus:ring-red-200"
                      : "border-slate-200 focus:ring-[#5BC5E2]/40",
                  ].join(" ")}
                />
                {touched.name && errors.name && (
                  <p className="text-xs text-red-600 mt-2">{errors.name}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Mobile No *
                </label>
                <input
                  value={form.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                  onBlur={() => onBlur("mobile")}
                  autoComplete="tel"
                  inputMode="numeric"
                  placeholder="91234567"
                  className={[
                    "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2",
                    touched.mobile && errors.mobile
                      ? "border-red-400 bg-red-50 focus:ring-red-200"
                      : "border-slate-200 focus:ring-[#5BC5E2]/40",
                  ].join(" ")}
                />
                {touched.mobile && errors.mobile && (
                  <p className="text-xs text-red-600 mt-2">{errors.mobile}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Email Address (optional)
                </label>
                <input
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => onBlur("email")}
                  autoComplete="email"
                  placeholder="john@company.com"
                  className={[
                    "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2",
                    touched.email && errors.email
                      ? "border-red-400 bg-red-50 focus:ring-red-200"
                      : "border-slate-200 focus:ring-[#5BC5E2]/40",
                  ].join(" ")}
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-600 mt-2">{errors.email}</p>
                )}
              </div>
              

              {/* Business */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Business Type *
                </label>
                <select
                  value={form.business}
                  onChange={(e) => setField("business", e.target.value)}
                  onBlur={() => onBlur("business")}
                  className={[
                    "w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2",
                    touched.business && errors.business
                      ? "border-red-400 bg-red-50 focus:ring-red-200"
                      : "border-slate-200 focus:ring-[#5BC5E2]/40",
                  ].join(" ")}
                >
                  <option value="">Select your industry</option>
                  <option value="fb">Food & Beverage</option>
                  <option value="retail">Retail</option>
                  <option value="services">Healthcare / Services</option>
                  <option value="other">Others</option>
                </select>
                {touched.business && errors.business && (
                  <p className="text-xs text-red-600 mt-2">{errors.business}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Tell us about your needs *
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  onBlur={() => onBlur("message")}
                  rows={4}
                  placeholder="Describe your current challenges and what you're looking to achieve..."
                  className={[
                    "w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 resize-none",
                    touched.message && errors.message
                      ? "border-red-400 bg-red-50 focus:ring-red-200"
                      : "border-slate-200 focus:ring-[#5BC5E2]/40",
                  ].join(" ")}
                />
                {touched.message && errors.message && (
                  <p className="text-xs text-red-600 mt-2">{errors.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !isValid}
                className={[
                  "w-full px-6 py-4 rounded-xl font-semibold text-base transition-all",
                  submitting || !isValid
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-[#1A3569] text-white hover:bg-[#0f2347] hover:shadow-[0_10px_30px_rgba(26,53,105,0.25)] hover:-translate-y-0.5",
                ].join(" ")}
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>

              <p className="text-xs text-center text-slate-500">
                By submitting this form, you agree to our privacy policy and terms of service.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
