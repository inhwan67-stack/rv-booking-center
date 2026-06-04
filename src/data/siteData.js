import {
  AlertTriangle,
  BadgeCheck,
  Building2,
  ClipboardCheck,
  FilePenLine,
  Gauge,
  Handshake,
  History,
  MapPinned,
  Scale,
  SearchCheck,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

export const navItems = [
  { label: '서비스 소개', href: '#services' },
  { label: '검사 사전진단', href: '#diagnosis' },
  { label: '구조변경 상담', href: '#consulting' },
  { label: '협력업체 모집', href: '#partners' },
  { label: '고객 사례', href: '#cases' },
  { label: '예약하기', href: '#booking' },
  { label: '관리자', href: '#admin' },
];

export const problems = [
  '검사 불합격 항목을 고객이 미리 알기 어렵습니다',
  '실내 개조 후 구조변경 필요 여부를 판단하기 어렵습니다',
  '중량 변경, 축하중, 제작허용총중량 문제가 발생할 수 있습니다',
  '수입 카라반은 국내 제원과 인증 기준 확인이 필요합니다',
  '보험 수리 후 구조변경이 필요한 경우가 있습니다',
  '지역별로 믿을 수 있는 대행업체를 찾기 어렵습니다',
];

export const services = [
  {
    icon: ClipboardCheck,
    title: '검사 사전진단',
    description:
      '차량 사진과 기본 정보를 바탕으로 자동차검사 전 불합격 가능 항목을 사전에 점검합니다.',
    price: '30,000원부터',
    id: 'diagnosis',
  },
  {
    icon: SearchCheck,
    title: '중고 구입 출장점검',
    description:
      '캠핑카와 카라반을 중고로 구입하기 전 전문가가 현장에 방문해 누수, 하부, 전기, 가스, 견인장치, 개조 이력, 서류 상태를 점검합니다.',
    price: '150,000원부터',
  },
  {
    icon: MapPinned,
    title: '검사 대행 예약',
    description:
      '지역별 협력업체를 통해 캠핑카와 카라반 자동차검사 대행을 연결합니다.',
    price: '100,000원부터',
  },
  {
    icon: Wrench,
    title: '검사 전 정비 연결',
    description:
      '등화장치, 타이어, 배터리 고정, 견인장치, 하부 상태 등 검사 불합격 가능 항목을 정비합니다.',
    price: '별도 견적',
  },
  {
    icon: FilePenLine,
    title: '구조변경 상담',
    description:
      '실내 개조, 부품 추가, 전기·가스 장치 변경, 중량 변경 등에 따른 구조변경 필요 여부를 상담합니다.',
    price: '100,000원부터',
    id: 'consulting',
  },
  {
    icon: Scale,
    title: '도면수정·중량검토 패키지',
    description:
      '노후 차량 개조, 보험 수리, 수입 카라반 제원 문제 등에 필요한 도면수정과 중량검토를 지원합니다.',
    price: '별도 견적',
  },
];

export const processSteps = [
  '차량 정보 입력',
  '사진 및 서류 업로드',
  '전문가 사전검토',
  '검사·정비·구조변경 방향 안내',
  '지역 협력업체 배정',
  '검사 완료 및 차량 이력 관리',
];

export const cases = [
  {
    icon: BadgeCheck,
    title: '등화장치 문제 사전 발견',
    description:
      '검사 예약 전 사진 검토 과정에서 후미등 작동 이상을 확인하고 정비 후 검사를 진행한 예시입니다.',
  },
  {
    icon: ShieldCheck,
    title: '보험 수리 후 구조변경 상담',
    description:
      '실내 설비 교체와 고정 방식 변경이 발생해 구조변경 필요 여부를 사전에 검토한 예시입니다.',
  },
  {
    icon: History,
    title: '노후 카라반 도면 수정',
    description:
      '오래된 카라반의 실내 개조 이력과 현재 상태가 달라 도면 수정 방향을 상담한 예시입니다.',
  },
  {
    icon: Gauge,
    title: '수입 카라반 제원·중량 검토',
    description:
      '국내 등록 제원과 실제 장착품, 적재 상태에 따른 중량 문제를 검토한 예시입니다.',
  },
];

export const partnerBenefits = [
  '플랫폼을 통한 고객 연결',
  '검사 전 정비 매출 창출',
  '구조변경 상담 고객 연결',
  '지역 인증 협력점 홍보',
  '향후 교육 및 매뉴얼 제공',
];

export const trustStats = [
  { value: '6단계', label: '전문 검토 프로세스', icon: Building2 },
  { value: '전국', label: '협력 네트워크 확장', icon: Handshake },
  { value: '사전', label: '불합격 위험 점검', icon: AlertTriangle },
];
