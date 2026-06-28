import React from 'react';
import { ArrowRight } from 'lucide-react';
import { services } from '../data/siteData.js';

export default function ServicesSection({ onServiceSelect }) {
  const handleServiceClick = (serviceTitle) => {
    onServiceSelect?.(serviceTitle);
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="bg-white py-16 lg:py-24">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">서비스 소개</p>
            <h2 className="section-title mt-3">
              필요한 서비스를 선택하고 바로 상담을 신청하세요
            </h2>
            <p className="section-copy">
              검사 예약, 구조변경 상담, 카라반 탁송, 특수 정비 연결, 중고
              위탁점검까지 핵심 서비스를 예약 진입 카드로 정리했습니다.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                id={service.id}
                className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-navy-700 hover:shadow-soft"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-900 transition group-hover:bg-navy-900 group-hover:text-white">
                    <Icon size={24} />
                  </div>
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-signal-orange">
                    {service.price}
                  </span>
                </div>

                <h3 className="mt-5 text-xl font-black text-navy-900">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>

                <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5">
                  <div>
                    <span className="text-xs font-black text-navy-900">
                      대상
                    </span>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {service.target}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-black text-navy-900">
                      진행 방식
                    </span>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {service.process}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleServiceClick(service.title)}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
                >
                  {service.cta}
                  <ArrowRight size={17} />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
