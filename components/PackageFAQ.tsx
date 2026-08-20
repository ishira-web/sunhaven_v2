"use client";

import React, { useState } from "react";
import { FAQItem } from "@/data/longDayPackages";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface PackageFAQProps {
  faqs: FAQItem[];
}

export default function PackageFAQ({ faqs }: PackageFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-200 hover:border-[#cca45b]/50"
          >
            <button
              type="button"
              onClick={() => toggleFAQ(index)}
              className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 transition-colors"
            >
              <span className="font-playfair text-base sm:text-lg font-bold text-[#0a2118] flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#cca45b] shrink-0" />
                <span>{faq.question}</span>
              </span>
              <div className="shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[#0a2118]">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-stone-100 animate-in fade-in duration-200">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
