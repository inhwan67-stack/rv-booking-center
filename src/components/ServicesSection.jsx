import React from 'react';
import { services } from '../data/siteData.js';

export default function ServicesSection() {
  return (
    <section id="services" className="bg-white py-16 lg:py-24">
      <div className="section-shell">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">서비스 소개</p>
            <h2 className="section-title mt-3">
              검사 전 리스크부터 중고 구입 점검, 구조변경 상담까지 한 번에
            </h2>
            <p className="section-copy">
              차량 상태, 개조 이력, 중량 문제, 지역 정비 가능 여부와 중고
              구입 전 현장 점검까지 함께 검토해 필요한 예약과 상담으로
              연결합니다.
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
                className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-navy-700 hover:shadow-soft"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-50 text-navy-900 transition group-hover:bg-navy-900 group-hover:text-white">
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-xl font-black text-navy-900">
                  {service.title}
                </h3>
                <p className="mt-4 min-h-28 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
                <div className="mt-5 border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-500">
                    예상 가격
                  </span>
                  <strong className="mt-1 block text-lg font-black text-signal-orange">
                    {service.price}
                  </strong>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
