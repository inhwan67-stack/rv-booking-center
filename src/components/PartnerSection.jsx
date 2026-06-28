import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { partnerBenefits } from '../data/siteData.js';

const scrollToBooking = () => {
  document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
};

export default function PartnerSection() {
  return (
    <section id="partners" className="bg-slate-50 py-16 lg:py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">협력업체 모집</p>
          <h2 className="section-title mt-3">
            전국 캠핑카·카라반 전문 협력업체를 연결합니다
          </h2>
          <p className="section-copy">
            캠핑카 정비업체, 카라반 판매점, 검사 대행업체, 튜닝업체,
            견인장치 장착점, 탁송 가능 업체와 함께 특수차량 네트워크를
            구축합니다.
          </p>
          <button
            type="button"
            onClick={scrollToBooking}
            className="mt-8 rounded-md bg-navy-900 px-6 py-4 text-base font-bold text-white transition hover:bg-navy-800"
          >
            협력업체 문의하기
          </button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <h3 className="text-xl font-black text-navy-900">협력업체 장점</h3>
          <div className="mt-6 grid gap-4">
            {partnerBenefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckCircle2 className="shrink-0 text-signal-orange" size={22} />
                <span className="font-semibold text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
