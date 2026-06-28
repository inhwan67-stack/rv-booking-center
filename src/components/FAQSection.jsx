import React from 'react';

const faqs = [
  {
    question: '캠핑카와 카라반도 일반 자동차검사처럼 바로 예약하면 되나요?',
    answer:
      '차량 구조, 중량, 내부 설비, 견인 조건에 따라 사전 확인이 필요한 경우가 있습니다. 차량 정보를 먼저 남겨주시면 진행 가능 여부를 확인해 안내드립니다.',
  },
  {
    question: '구조변경이 필요한지 아직 잘 모르겠습니다.',
    answer:
      '튜닝, 내부 구조 변경, 전기·가스 설비 변경, 중량 변화가 있었다면 상담 대상입니다. 등록증과 사진을 첨부하면 검토가 더 빨라집니다.',
  },
  {
    question: '카라반을 직접 견인하지 못해도 신청할 수 있나요?',
    answer:
      '가능합니다. 출발지, 도착지, 카라반 제원, 견인장치 상태를 확인한 뒤 탁송 가능 여부와 견적을 안내드립니다.',
  },
  {
    question: '중고 구매 전 점검도 가능한가요?',
    answer:
      '판매 위치와 차량 정보를 기준으로 누수, 하부, 전기, 가스, 제동장치, 구조변경 이력 등 점검 상담을 도와드립니다.',
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="bg-slate-50 py-16 lg:py-24">
      <div className="section-shell">
        <div className="max-w-3xl">
          <p className="eyebrow">자주 묻는 질문</p>
          <h2 className="section-title mt-3">
            신청 전에 많이 확인하는 내용을 정리했습니다
          </h2>
          <p className="section-copy">
            정확한 진행 방식은 차량 상태와 자료 확인 후 안내되며, 현재
            단계에서는 상담 접수와 상태 확인 흐름을 테스트할 수 있습니다.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-base font-black leading-7 text-navy-900">
                {faq.question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
