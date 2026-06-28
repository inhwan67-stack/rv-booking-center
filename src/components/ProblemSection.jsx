import React from 'react';
import { AlertCircle } from 'lucide-react';
import { problems } from '../data/siteData.js';

export default function ProblemSection() {
  return (
    <section className="bg-slate-50 py-16 lg:py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">전문 검토가 필요한 이유</p>
          <h2 className="section-title mt-3">
            캠핑카·카라반 검사는 일반 차량과 다릅니다
          </h2>
          <p className="section-copy">
            차체 구조, 생활 설비, 견인 안전성, 개조 이력까지 함께 확인해야
            검사와 이동 과정의 리스크를 줄일 수 있습니다.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem) => (
            <article
              key={problem}
              className="rounded-lg border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-signal-orange/50 hover:shadow-soft"
            >
              <AlertCircle className="text-signal-orange" size={26} />
              <h3 className="mt-5 text-lg font-bold leading-7 text-navy-900">
                {problem}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
