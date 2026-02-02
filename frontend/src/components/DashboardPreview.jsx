import React from "react";
import { motion } from "framer-motion";

export const DashboardPreview = () => {
  return (
    <motion.div
    className="relative block mx-auto max-w-sm sm:max-w-md lg:max-w-none mt-12 lg:mt-0"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="relative">
        <div className="bg-gradient-to-br from-[#0f2347]/95 via-[#1A3569]/95 to-[#0b1a34]/95 
            ring-1 ring-[#5BC5E2]/30
            backdrop-blur-xl 
            border border-[#5BC5E2]/20 
            rounded-2xl p-6 
            shadow-[0_30px_80px_rgba(26,53,105,0.35)]">
          <div className="flex items-center justify-start gap-2 mb-6 pl-1 opacity-90">
            <div className="w-3 h-3 rounded-full bg-[#5BC5E2]" />
            <div className="w-3 h-3 rounded-full bg-[#F472B6]" />   
            <div className="w-3 h-3 rounded-full bg-[#FACC15] shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
          </div>
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"
            alt="Dashboard Preview"
            className="rounded-lg w-full"
          />
        </div>

        <motion.div
        className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-xl scale-90 sm:scale-100"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="text-sm text-slate-500 mb-1">Orders Today</div>
          <div className="text-2xl font-bold text-slate-900">1,284</div>
          <div className="text-emerald-600 text-sm font-medium">+24% vs yesterday</div>
        </motion.div>

        <motion.div
        className="absolute -top-3 -right-3 bg-[#5BC5E2] text-[#0f2347] rounded-xl px-3 py-2 shadow-xl scale-90 sm:scale-100"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          <div className="text-sm font-semibold">New booking received! 🎉</div>
        </motion.div>
      </div>
    </motion.div>
  );
};
