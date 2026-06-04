import React from 'react';
import { ArrowRight, CheckCircle2, ClipboardCheck } from 'lucide-react';
import { trustStats } from '../data/siteData.js';
import heroImage from '../assets/rv-inspection-hero.png';

const scrollToBooking = () => {
  document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-white">
      <div className="section-shell grid gap-12 py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-24">
        <div>
          <p className="eyebrow">캠핑카·카라반 전문 인증 예약</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            캠핑카·카라반 검사, 불합격 걱정되시나요?
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            검사 전 사전진단부터 정비, 구조변경, 도면 수정, 중량 검토까지
            한 번에 도와드립니다.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToBooking}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-6 py-4 text-base font-bold text-white transition hover:bg-navy-800"
            >
              검사 사전진단 예약하기
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={scrollToBooking}
              className="inline-flex items-center justify-center rounded-md border border-navy-900 px-6 py-4 text-base font-bold text-navy-900 transition hover:bg-navy-50"
            >
              구조변경 상담 신청
            </button>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {trustStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                >
                  <Icon className="text-signal-orange" size={22} />
                  <strong className="mt-3 block text-xl font-black text-navy-900">
                    {stat.value}
                  </strong>
                  <span className="mt-1 block text-sm font-medium text-slate-600">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-5 -top-5 h-28 w-28 rounded-full bg-signal-orange/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-navy-900 shadow-soft">
            <div className="relative aspect-[4/3]">
              <img
                src={heroImage}
                alt="전문가가 캠핑카를 점검하는 모습"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-navy-900/45 via-navy-800/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="max-w-sm rounded-lg bg-white/94 p-5 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3 text-navy-900">
                    <ClipboardCheck className="text-signal-orange" size={28} />
                    <strong className="text-lg font-black">
                      전문가 현장 점검
                    </strong>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    캠핑카와 카라반의 외관, 하부, 타이어, 설비 상태를 사전에
                    확인해 검사와 구입 전 리스크를 줄입니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 right-4 hidden rounded-lg bg-white p-4 shadow-soft sm:block">
            <p className="flex items-center gap-2 text-sm font-bold text-navy-900">
              <CheckCircle2 className="text-signal-blue" size={18} />
              사전진단·정비·상담 통합 접수
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
