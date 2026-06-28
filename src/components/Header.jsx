import React, { useState } from 'react';
import { Menu, PhoneCall, X } from 'lucide-react';
import { navItems } from '../data/siteData.js';

const scrollToBooking = () => {
  document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="section-shell flex h-20 items-center justify-between">
        <a href="#top" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-sm font-black text-white">
            RV
          </span>
          <span>
            <strong className="block text-lg font-black text-navy-900">
              RV 인증관리센터
            </strong>
            <span className="hidden text-xs font-medium text-slate-500 sm:block">
              캠핑카·카라반 검사·구조변경·탁송 예약 플랫폼
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-semibold text-slate-700 transition hover:text-signal-orange"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={scrollToBooking}
            className="inline-flex items-center gap-2 rounded-md bg-signal-orange px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
          >
            <PhoneCall size={17} />
            상담 신청
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-navy-900 lg:hidden"
          aria-label="메뉴 열기"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <nav className="section-shell flex flex-col gap-1 py-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                scrollToBooking();
              }}
              className="mt-2 rounded-md bg-signal-orange px-4 py-3 text-sm font-bold text-white"
            >
              상담 신청
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
