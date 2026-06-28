import React from 'react';
import { ArrowRight, CheckCircle2, ClipboardCheck, Truck } from 'lucide-react';
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
          <p className="eyebrow">캠핑카·카라반 전문 검사인증 플랫폼</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-6xl">
            캠핑카·카라반 검사, 구조변경, 탁송까지 한 번에
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            일반 차량과 다른 캠핑카·카라반의 검사, 구조변경, 탁송,
            정비 상담, 중고 위탁점검을 전문적으로 연결하는 특수차량
            예약 플랫폼입니다.
          </p>
          <div className="mt-6 grid gap-3 text-sm leading-6 text-slate-700">
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              캠핑카와 카라반은 무게, 내부 구조, 전기·가스 설비, 견인
              안전성에 따라 검사와 구조변경 이슈가 발생할 수 있습니다.
            </p>
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              특히 카라반은 견인면허와 운전 경험이 필요해 검사장 이동이나
              정비소 이동이 고객에게 부담이 될 수 있습니다.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToBooking}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-6 py-4 text-base font-bold text-white transition hover:bg-navy-800"
            >
              검사·구조변경 상담하기
              <ArrowRight size={18} />
            </button>
            <button
              type="button"
              onClick={scrollToBooking}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-navy-900 px-6 py-4 text-base font-bold text-navy-900 transition hover:bg-navy-50"
            >
              카라반 탁송 문의하기
              <Truck size={18} />
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
                alt="캠핑카와 카라반 검사 상담을 준비하는 모습"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-navy-900/45 via-navy-800/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="max-w-sm rounded-lg bg-white/94 p-5 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3 text-navy-900">
                    <ClipboardCheck className="text-signal-orange" size={28} />
                    <strong className="text-lg font-black">
                      특수차량 예약 지원
                    </strong>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    검사예약, 구조변경 상담, 카라반 탁송, 정비업체 연결,
                    중고 위탁점검까지 단계적으로 지원하는 서비스를
                    목표로 합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 right-4 hidden rounded-lg bg-white p-4 shadow-soft sm:block">
            <p className="flex items-center gap-2 text-sm font-bold text-navy-900">
              <CheckCircle2 className="text-signal-blue" size={18} />
              검사·구조변경·탁송 통합 상담
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
