import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="section-shell grid gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <strong className="text-xl font-black text-navy-900">
            RV 인증관리센터
          </strong>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            캠핑카·카라반 검사, 구조변경, 탁송, 정비 상담을 연결하는
            특수차량 예약 플랫폼
          </p>
        </div>
        <nav className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
          <a href="#services" className="hover:text-signal-orange">
            서비스 소개
          </a>
          <a href="#booking" className="hover:text-signal-orange">
            예약하기
          </a>
          <a href="#partners" className="hover:text-signal-orange">
            협력업체 모집
          </a>
          <a href="#privacy" className="hover:text-signal-orange">
            개인정보처리방침
          </a>
        </nav>
        <div className="text-sm text-slate-600">
          <p>
            <span className="font-bold text-navy-900">전화</span> 010-0000-0000
          </p>
          <p className="mt-2">
            <span className="font-bold text-navy-900">이메일</span>{' '}
            contact@example.com
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="section-shell py-5">
          <p className="text-xs leading-6 text-slate-500">
            본 서비스는 검사 합격을 보장하지 않으며, 차량 상태와 관련 법규 및
            검사 기준에 따라 결과가 달라질 수 있습니다. 사전진단과 상담은
            고객이 검사·구조변경·탁송 필요성을 미리 확인하기 위한 참고
            서비스입니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
