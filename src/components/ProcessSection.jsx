import React from 'react';
import { processSteps } from '../data/siteData.js';

export default function ProcessSection() {
  return (
    <section className="bg-navy-900 py-16 text-white lg:py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="text-sm font-bold tracking-wide text-orange-300">
            진행 절차
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            상담 접수 후 차량 상황에 맞는 다음 단계를 안내합니다
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <article
              key={step}
              className="rounded-lg border border-white/15 bg-white/7 p-6 transition hover:-translate-y-1 hover:bg-white/12"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-signal-orange text-lg font-black">
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold">{step}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {index + 1}단계: 검사, 구조변경, 탁송, 정비 연결 중 필요한
                조치를 정리해 다음 진행 방향을 안내합니다.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
