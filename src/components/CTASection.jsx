import React from 'react';

const scrollToBooking = () => {
  document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
};

export default function CTASection() {
  return (
    <section id="contact" className="bg-white py-16 lg:py-24">
      <div className="section-shell">
        <div className="rounded-xl bg-navy-900 px-6 py-12 text-center text-white shadow-soft sm:px-10 lg:px-16">
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
            검사장 이동 전, 차량 상태부터 먼저 확인하세요
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-300">
            캠핑카·카라반은 차량 상태, 구조변경 여부, 탁송 필요 여부에
            따라 진행 방식이 달라질 수 있습니다. 먼저 상담을 신청하고
            담당자 안내를 받아보세요.
          </p>
          <button
            type="button"
            onClick={scrollToBooking}
            className="mt-8 rounded-md bg-signal-orange px-7 py-4 text-base font-black text-white transition hover:bg-orange-600"
          >
            지금 상담 신청하기
          </button>
        </div>
      </div>
    </section>
  );
}
