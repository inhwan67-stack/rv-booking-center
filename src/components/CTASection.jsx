import React from 'react';

const scrollToBooking = () => {
  document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
};

export default function CTASection() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="section-shell">
        <div className="rounded-xl bg-navy-900 px-6 py-12 text-center text-white shadow-soft sm:px-10 lg:px-16">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            검사장 이동 전, 차량 상황부터 먼저 확인하세요
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300">
            캠핑카와 카라반은 구조, 중량, 전기·가스 설비, 견인 안전성에
            따라 준비 과정이 달라집니다. 검사예약, 구조변경 상담, 탁송
            필요 여부를 한 번에 정리해 보세요.
          </p>
          <button
            type="button"
            onClick={scrollToBooking}
            className="mt-8 rounded-md bg-signal-orange px-7 py-4 text-base font-black text-white transition hover:bg-orange-600"
          >
            지금 상담 예약하기
          </button>
        </div>
      </div>
    </section>
  );
}
