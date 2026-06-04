import React from 'react';
import { cases } from '../data/siteData.js';

export default function CaseStudies() {
  return (
    <section id="cases" className="bg-white py-16 lg:py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">고객 사례</p>
          <h2 className="section-title mt-3">이런 문제를 해결할 수 있습니다</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {cases.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-lg border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-soft"
              >
                <Icon className="text-signal-blue" size={28} />
                <h3 className="mt-5 text-lg font-black leading-7 text-navy-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
