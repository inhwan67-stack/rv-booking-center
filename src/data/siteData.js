import {
  AlertTriangle,
  BadgeCheck,
  BatteryCharging,
  Building2,
  ClipboardCheck,
  FilePenLine,
  Gauge,
  Handshake,
  History,
  PlugZap,
  Scale,
  SearchCheck,
  ShieldCheck,
  Truck,
  Wrench,
} from 'lucide-react';

export const navItems = [
  { label: '서비스 소개', href: '#services' },
  { label: '상담 신청', href: '#booking' },
  { label: '진행상태 조회', href: '#lookup' },
  { label: '관리자 화면', href: '#admin' },
  { label: '자주 묻는 질문', href: '#faq' },
  { label: '문의하기', href: '#contact' },
];

export const problems = [
  '캠핑카와 카라반은 중량, 실내 구조, 전기·가스 설비를 일반 차량보다 더 세밀하게 확인해야 합니다.',
  '튜닝, 실내 개조, 적재 구조 변경, 장비 추가로 구조변경 검토가 필요할 수 있습니다.',
  '카라반은 견인면허와 운전 경험이 필요해 검사장이나 정비소 이동 자체가 부담이 될 수 있습니다.',
  '견인장치, 제동장치, 연결부, 하부 상태는 안전성과 검사 결과에 직접 영향을 줍니다.',
  '캠핑카 전기, 배터리, 히터, 냉장고, 누수 문제는 일반 정비소에서 해결이 어려울 수 있습니다.',
  '중고 캠핑카·카라반은 누수, 하부, 전기·가스, 구조변경 이력을 구매 전에 확인해야 합니다.',
];

export const services = [
  {
    icon: ClipboardCheck,
    title: '검사 예약',
    description:
      '캠핑카·카라반의 정기검사, 종합검사, 검사 대행 접수를 지원합니다.',
    target: '검사 기간이 도래했거나 직접 검사장 방문이 어려운 고객',
    process: '차량 정보 확인 → 검사 가능 여부 검토 → 일정 조율 → 검사 진행',
    price: '상담 후 안내',
    cta: '검사 예약 신청',
    id: 'diagnosis',
  },
  {
    icon: FilePenLine,
    title: '구조변경 상담',
    description:
      '튜닝, 내부 구조 변경, 중량 변경, 전기·가스 설비 변경 등으로 구조변경이 필요한지 검토합니다.',
    target:
      '캠핑카 개조, 카라반 수리, 내부 설비 변경, 총중량 변경 가능성이 있는 고객',
    process:
      '차량 정보 확인 → 사진/서류 검토 → 구조변경 가능 여부 안내 → 필요 시 대행 진행',
    price: '100,000원부터',
    cta: '구조변경 상담 신청',
    id: 'consulting',
  },
  {
    icon: Truck,
    title: '카라반 탁송',
    description:
      '견인면허와 견인 경험이 필요한 카라반을 검사장, 정비소, 보관장까지 안전하게 이동 대행합니다.',
    target: '견인면허가 없거나 카라반 운전이 부담스러운 고객',
    process: '출발지/도착지 확인 → 카라반 제원 확인 → 견적 안내 → 탁송 진행',
    price: '견적 안내',
    cta: '탁송 문의하기',
  },
  {
    icon: Wrench,
    title: '정비 상담/업체 연결',
    description:
      '캠핑카 전기, 배터리, 충전기, 히터, 냉장고, 누수, 브레이크 등 특수 정비 문제를 상담하고 지역별 전문 업체를 연결합니다.',
    target:
      '일반 정비소에서 해결하기 어려운 캠핑카·카라반 고장으로 고민하는 고객',
    process: '증상 접수 → 사진/영상 확인 → 지역 확인 → 적합한 수리업체 연결',
    price: '상담 후 안내',
    cta: '정비 상담 신청',
  },
  {
    icon: SearchCheck,
    title: '중고 위탁점검',
    description:
      '중고 캠핑카 또는 카라반 구매 전 누수, 하부, 전기, 가스, 제동장치, 구조변경 이력 등을 전문가가 점검합니다.',
    target: '중고 캠핑카·카라반 구매 예정 고객',
    process:
      '차량 정보 접수 → 판매 위치 확인 → 점검 항목 선택 → 출장 또는 현장 점검',
    price: '150,000원부터',
    cta: '위탁점검 신청',
  },
];

export const specializedReasons = [
  {
    icon: ClipboardCheck,
    title: '특수차량 검사 경험 필요',
    description:
      '캠핑카와 카라반은 일반 승용차와 구조가 달라 검사 전 확인해야 할 사항이 많습니다.',
  },
  {
    icon: FilePenLine,
    title: '구조변경 가능성 검토',
    description:
      '튜닝, 내부 구조 변경, 중량 변화, 전기·가스 설비 변경 시 구조변경이 필요할 수 있습니다.',
  },
  {
    icon: ShieldCheck,
    title: '카라반 견인 안전성',
    description:
      '카라반은 견인면허, 견인장치, 운전 경험이 중요하며 검사장 이동 자체가 고객에게 부담이 될 수 있습니다.',
  },
  {
    icon: PlugZap,
    title: '전문 정비업체 연결',
    description:
      '일반 정비소에서 해결하기 어려운 캠핑카 전기, 배터리, 히터, 냉장고, 누수 문제를 전문 업체와 연결할 수 있습니다.',
  },
  {
    icon: BatteryCharging,
    title: '중고 구매 전 점검 필요',
    description:
      '중고 캠핑카와 카라반은 누수, 하부, 전기, 가스, 제동장치, 구조변경 이력을 확인해야 합니다.',
  },
];

export const processSteps = [
  '차량 정보 입력',
  '사진 및 서류 업로드',
  '전문가 사전 검토',
  '검사·구조변경·탁송 방향 안내',
  '협력업체 연결',
  '예약 진행 및 이력 관리',
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
    title: '수입 카라반 도면 수정',
    description:
      '오래된 카라반의 실내 개조 이력과 현재 상태가 달라 도면 수정 방향을 상담한 예시입니다.',
  },
  {
    icon: Gauge,
    title: '제원·중량 이슈 검토',
    description:
      '국내 등록 제원과 실제 적재 상태에 따른 중량 문제를 검토해 검사 전 리스크를 줄인 예시입니다.',
  },
];

export const partnerBenefits = [
  '플랫폼을 통한 특수차량 고객 연결',
  '검사 전 정비 매출 창출',
  '구조변경 상담 고객 연결',
  '카라반 탁송 및 견인 네트워크 확장',
  '향후 교육 및 매뉴얼 제공',
];

export const trustStats = [
  { value: '검사', label: '중량·설비·견인 이슈 사전 확인', icon: Building2 },
  { value: '상담', label: '구조변경 가능성 검토', icon: Handshake },
  { value: '탁송', label: '카라반 이동 부담 완화', icon: AlertTriangle },
];
