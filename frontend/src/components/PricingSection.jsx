import React, { useState, useEffect } from "react";
import { Check, X, Sparkles } from "lucide-react";
import axios from "axios";

const BACKEND_URL = (window?.ApptelierConfig?.apiBaseUrl || process.env.REACT_APP_BACKEND_URL || "").replace(/\/$/, "");
// Fallback data
const fallbackPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 79,
    period: "month",
    description: "Perfect for small businesses just getting started",
    popular: false,
    features: [
      { name: "1 user account", included: true },
      { name: "Up to 100 orders/month", included: true },
      { name: "Basic booking system", included: true },
      { name: "Email notifications", included: true },
      { name: "Standard support", included: true },
      { name: "Basic analytics", included: true },
      { name: "Custom branding", included: false },
      { name: "Custom Integrations (API, etc.)", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 139,
    period: "month",
    description: "Ideal for growing businesses with higher demands",
    popular: true,
    features: [
      { name: "5 user accounts", included: true },
      { name: "Up to 1,000 orders/month", included: true },
      { name: "Advanced booking system", included: true },
      { name: "SMS & Email notifications", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "White-label  branding", included: true },
      { name: "Custom Integrations (API, etc.)", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 199,
    period: "month",
    description: "Enterprise-grade solution for maximum scalability",
    popular: false,
    features: [
      { name: "Unlimited user accounts", included: true },
      { name: "Unlimited orders", included: true },
      { name: "Customised booking suite", included: true },
      { name: "Multi-channel notifications", included: true },
      { name: "Dedicated support", included: true },
      { name: "Real-time analytics & reports", included: true },
      { name: "Custom branding", included: true },
      { name: "Custom Integrations (API, etc.)", included: true },
    ],
  },
];

// Card color variants
const planColors = [
  { gradient: "from-slate-50 to-slate-100", button: "border-slate-300 hover:border-[#5BC5E2] hover:bg-cyan-50" },
  { gradient: "from-cyan-50 to-blue-50", button: "bg-[#1A3569] text-white hover:bg-[#0f2347]" },
  { gradient: "from-blue-50 to-blue-100", button: "border-blue-300 hover:border-[#5BC5E2] hover:bg-cyan-50" },
];

export const PricingSection = () => {
  const [plans, setPlans] = useState(fallbackPlans);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        if (!BACKEND_URL) { setLoading(false); return; }
        const response = await axios.get(`${BACKEND_URL}/api/plans`);
        if (response.data && response.data.length > 0) {
          setPlans(response.data);
        }
      } catch (error) {
        console.debug("plans unavailable, using fallback:", error);
        setPlans(fallbackPlans);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[#5BC5E2] text-sm font-semibold uppercase tracking-wider mb-4">
            Pricing Plans
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A3569] mb-6">
            Choose Your <span className="text-[#5BC5E2]">Perfect Plan</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Flexible pricing that scales with your business. Start now and upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, idx) => {
            const colors = planColors[idx % planColors.length];
            return (
              <div
                key={plan.id}
                className={`relative bg-gradient-to-br ${colors.gradient} border rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  plan.popular
                    ? "border-[#5BC5E2] shadow-[0_0_40px_rgba(91,197,226,0.2)]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1.5 bg-[#1A3569] text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-[#1A3569] mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm mb-6">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-bold text-[#1A3569]">${plan.price}</span>
                    <span className="text-slate-500">/{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-4 mb-8 max-w-xs mx-auto text-left">
                  {plan.features && plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start justify-start gap-3 w-full">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 text-slate-400" />
                        </div>
                      )}

                      <span
                        className={`text-sm leading-snug flex-1 ${
                          feature.included ? "text-slate-700" : "text-slate-400"
                        }`}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 ${
                    plan.popular
                      ? "bg-[#1A3569] text-white hover:bg-[#0f2347] hover:shadow-[0_8px_25px_rgba(26,53,105,0.3)] hover:-translate-y-0.5"
                      : "bg-white text-[#1A3569] border-2 border-slate-200 hover:border-[#5BC5E2] hover:bg-cyan-50"
                  }`}
                >
                  Get Started
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-slate-500 text-sm">
            All plans included GST and VAT.
          </p>
        </div>
      </div>
    </section>
  );
};
