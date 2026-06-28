import React from 'react';
import { specializedReasons } from '../data/siteData.js';

export default function SpecializedSection() {
  return (
    <section id="specialized" className="bg-slate-50 py-16 lg:py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">전문 플랫폼의 역할</p>
          <h2 className="section-title mt-3">
            왜 캠핑카·카라반 전문 플랫폼이 필요한가?
          </h2>
          <p className="section-copy">
            캠핑카와 카라반은 일반 자동차검사처럼 예약만으로 끝나지 않는
            경우가 많습니다. 구조, 설비, 견인, 정비, 중고 점검까지 한 흐름에서
            검토해야 고객의 시간과 비용 부담을 줄일 수 있습니다.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {specializedReasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <article
                key={reason.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-signal-orange/50 hover:shadow-soft"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-navy-50 text-navy-900">
                    <Icon size={24} />
                  </div>
                  <span className="text-sm font-black text-slate-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-black leading-7 text-navy-900">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {reason.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
