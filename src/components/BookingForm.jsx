import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  ImagePlus,
  RotateCcw,
  UploadCloud,
  X,
} from 'lucide-react';
import { createBooking } from '../services/bookingRepository.js';
import { serviceOptions, vehicleTypes } from '../types/booking.js';

const MAX_PHOTO_COUNT = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const deliveryPurposeOptions = [
  '검사장 이동',
  '정비소 이동',
  '보관장 이동',
  '고객 인도',
  '기타',
];

const repairSymptomOptions = [
  '전기',
  '배터리',
  '충전',
  '히터',
  '냉장고',
  '누수',
  '브레이크',
  '차축/타이어',
  '기타',
];

const usedInspectionOptions = [
  '누수',
  '하부 상태',
  '전기 시스템',
  '가스 시설',
  '배터리',
  '냉장고/히터',
  '제동장치',
  '타이어',
  '구조변경 이력',
  '기타',
];

const recommendedAttachments = [
  '자동차등록증',
  '차량 전체 사진',
  '차대번호 또는 제작명판 사진',
  '실내 구조 사진',
  '전기·가스 설비 사진',
  '튜닝 또는 수리 전후 사진',
  '도면 또는 제원표',
  '수리 내역서',
  '중량 관련 자료',
];

const serviceAttachmentGuides = {
  '검사 예약': [
    '자동차등록증',
    '차량 전체 사진',
    '검사 안내 문자 또는 검사 만료일 정보',
  ],
  '구조변경 상담': [
    '자동차등록증',
    '변경 전 사진',
    '변경 후 사진',
    '도면 또는 제원표',
    '수리/튜닝 내역',
  ],
  '카라반 탁송': [
    '카라반 전체 사진',
    '견인장치 사진',
    '연결 커플러 사진',
    '차대번호 또는 제작명판 사진',
    '출발지/도착지 위치 정보',
  ],
  '정비 상담/업체 연결': [
    '고장 부위 사진',
    '증상 영상',
    '계기판 또는 경고등 사진',
    '배터리/전기장치 사진',
    '수리 이력',
  ],
  '중고 위탁점검': [
    '판매 차량 사진',
    '자동차등록증 또는 차량 정보',
    '판매글 링크',
    '점검 희망 부위 사진',
    '판매자 위치 정보',
  ],
};

const serviceCompletionMessages = {
  '검사 예약': '검사 가능 여부와 가까운 검사장 일정 확인 후 안내드립니다.',
  '구조변경 상담':
    '차량 변경 내용과 등록증, 사진 자료를 검토한 뒤 구조변경 필요 여부를 안내드립니다.',
  '카라반 탁송':
    '출발지, 도착지, 카라반 제원, 견인장치 상태를 확인한 뒤 탁송 가능 여부와 견적을 안내드립니다.',
  '정비 상담/업체 연결':
    '증상과 지역을 확인한 뒤 연결 가능한 캠핑카·카라반 전문 정비업체를 검토합니다.',
  '중고 위탁점검':
    '구매 예정 차량의 위치와 점검 희망 항목을 확인한 뒤 위탁점검 가능 일정을 안내드립니다.',
};

const nextSteps = [
  '접수 내용 확인',
  '차량 정보 및 첨부자료 검토',
  '추가자료 필요 여부 안내',
  '예상 비용 및 일정 안내',
  '예약 확정 후 검사/탁송/점검 진행',
];

const initialFormData = {
  name: '',
  phone: '',
  vehicleType: '',
  service: '',
  region: '',
  desiredDate: '',
  vehicleNumber: '',
  vehicleModel: '',
  message: '',
  hasTowVehicle: false,
  hasTrailerLicense: false,
  needsDelivery: false,
  departure: '',
  destination: '',
  deliveryPurpose: '',
  repairSymptoms: [],
  usedInspectionItems: [],
  photos: [],
  noAttachments: false,
  privacy: false,
};

export default function BookingForm({ selectedService, onBookingCreated }) {
  const [formData, setFormData] = useState(initialFormData);
  const [submittedBooking, setSubmittedBooking] = useState(null);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoPreviewsRef = useRef([]);

  const isCaravan =
    formData.vehicleType === '카라반' || formData.vehicleType === '수입 카라반';
  const isStructureService = formData.service === '구조변경 상담';
  const isDeliveryService = formData.service === '카라반 탁송';
  const isRepairService = formData.service === '정비 상담/업체 연결';
  const isUsedInspectionService = formData.service === '중고 위탁점검';
  const selectedAttachmentGuide = useMemo(
    () => serviceAttachmentGuides[formData.service] ?? [],
    [formData.service],
  );

  useEffect(() => {
    photoPreviewsRef.current = photoPreviews;
  }, [photoPreviews]);

  useEffect(() => {
    if (!selectedService) {
      return;
    }

    setSubmittedBooking(null);
    setFormData((current) => ({
      ...current,
      service: selectedService,
    }));
  }, [selectedService]);

  useEffect(() => {
    return () => {
      photoPreviewsRef.current.forEach((preview) =>
        URL.revokeObjectURL(preview.url),
      );
    };
  }, []);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const updateMultiCheckbox = (name, option) => {
    setFormData((current) => {
      const selectedOptions = current[name];
      const nextOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option];

      return {
        ...current,
        [name]: nextOptions,
      };
    });
  };

  const updatePhotos = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    event.target.value = '';

    if (!selectedFiles.length) {
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const isSupportedFile =
        file.type.startsWith('image/') || file.type === 'application/pdf';

      if (!isSupportedFile) {
        setError('JPG, PNG, PDF 형식의 파일을 첨부해 주세요.');
        return false;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        setError('첨부 파일은 1개당 5MB 이하로 업로드해 주세요.');
        return false;
      }

      return true;
    });

    setFormData((current) => {
      const nextPhotos = [...current.photos, ...validFiles].slice(
        0,
        MAX_PHOTO_COUNT,
      );

      if (current.photos.length + validFiles.length > MAX_PHOTO_COUNT) {
        setError(`첨부 파일은 최대 ${MAX_PHOTO_COUNT}개까지 선택할 수 있습니다.`);
      } else {
        setError('');
      }

      return {
        ...current,
        noAttachments: false,
        photos: nextPhotos,
      };
    });

    setPhotoPreviews((current) => {
      const combinedPreviews = [
        ...current,
        ...validFiles.map((file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        })),
      ];
      const nextPreviews = combinedPreviews.slice(0, MAX_PHOTO_COUNT);

      combinedPreviews
        .slice(MAX_PHOTO_COUNT)
        .forEach((preview) => URL.revokeObjectURL(preview.url));

      return nextPreviews;
    });
  };

  const removePhoto = (indexToRemove) => {
    setFormData((current) => ({
      ...current,
      photos: current.photos.filter((_, index) => index !== indexToRemove),
    }));

    setPhotoPreviews((current) => {
      const removedPreview = current[indexToRemove];
      if (removedPreview) {
        URL.revokeObjectURL(removedPreview.url);
      }

      return current.filter((_, index) => index !== indexToRemove);
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'name',
      'phone',
      'vehicleType',
      'service',
      'region',
      'desiredDate',
      'vehicleNumber',
      'vehicleModel',
    ];

    const hasMissingField = requiredFields.some((field) => !formData[field]);
    if (hasMissingField) {
      return '필수 입력 항목을 모두 작성해 주세요.';
    }

    if (isDeliveryService) {
      const hasMissingDeliveryField =
        !formData.departure ||
        !formData.destination ||
        !formData.deliveryPurpose;

      if (hasMissingDeliveryField) {
        return '탁송 문의는 출발지, 도착지, 탁송 목적을 입력해 주세요.';
      }
    }

    if (!formData.privacy) {
      return '개인정보 수집 및 이용에 동의해 주세요.';
    }

    return '';
  };

  const resetForm = () => {
    photoPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    setPhotoPreviews([]);
    setFormData(initialFormData);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const submittedSummary = buildSubmittedSummary(formData);
      const result = await createBooking(formData);
      setSubmittedBooking({
        ...submittedSummary,
        receiptId: result.booking.id,
        createdAt: result.booking.createdAt,
      });
      resetForm();
      onBookingCreated?.(result.booking);
    } catch (submitError) {
      console.error('상담 신청 저장 오류:', submitError);
      setError(
        submitError.message ||
          '상담 신청 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const startAnotherRequest = () => {
    setSubmittedBooking(null);
    setError('');
    resetForm();
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="booking" className="bg-slate-50 py-16 lg:py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow">통합 상담/예약 신청</p>
          <h2 className="section-title mt-3">
            검사·구조변경·탁송 상담 신청하기
          </h2>
          <p className="section-copy">
            차량 정보와 필요한 서비스를 남겨주시면 담당자가 확인 후 가능
            여부, 예상 비용, 진행 일정을 안내드립니다.
          </p>
          <div className="mt-8 rounded-lg border border-navy-100 bg-white p-6">
            <strong className="text-lg font-black text-navy-900">
              첨부 안내
            </strong>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              자동차등록증, 차량 사진, 도면, 수리 내역, 변경 전후 사진 등을
              첨부하면 상담이 더 정확해집니다. 자료가 없다면 담당자 안내 후
              추가 제출할 수 있습니다.
            </p>
          </div>
        </div>

        {submittedBooking ? (
          <SubmissionComplete
            booking={submittedBooking}
            onStartAnother={startAnotherRequest}
            onShowServices={scrollToServices}
          />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8"
          >
            <FormGroup title="기본 정보">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="이름" name="name" value={formData.name} onChange={updateField} />
                <Field label="연락처" name="phone" value={formData.phone} onChange={updateField} />
                <SelectField
                  label="차량 종류"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={updateField}
                  options={vehicleTypes}
                />
                <SelectField
                  label="서비스 종류"
                  name="service"
                  value={formData.service}
                  onChange={updateField}
                  options={serviceOptions}
                />
                <Field label="지역" name="region" value={formData.region} onChange={updateField} />
                <Field
                  label="희망 날짜"
                  name="desiredDate"
                  type="date"
                  value={formData.desiredDate}
                  onChange={updateField}
                />
                <Field
                  label="차량번호"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={updateField}
                />
                <Field
                  label="차량 모델명"
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={updateField}
                />
              </div>
            </FormGroup>

            <ConditionalGuides
              formData={formData}
              isCaravan={isCaravan}
              isStructureService={isStructureService}
              isDeliveryService={isDeliveryService}
              isRepairService={isRepairService}
              isUsedInspectionService={isUsedInspectionService}
              updateField={updateField}
              updateMultiCheckbox={updateMultiCheckbox}
            />

            <FormGroup title="문의 내용">
              <label className="block">
                <span className="text-sm font-bold text-navy-900">문의 내용</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={updateField}
                  rows="5"
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
                  placeholder="차량 상태, 검사 일정, 개조 이력, 증상, 탁송 요청 사항 등을 자유롭게 작성해 주세요."
                />
              </label>
            </FormGroup>

            <FormGroup title="상담에 필요한 서류와 사진을 첨부해주세요">
              <p className="text-sm leading-6 text-slate-600">
                자동차등록증, 차량 사진, 도면, 수리 내역, 구조변경 전후 사진
                등을 첨부하면 담당자가 더 정확하게 검토할 수 있습니다.
              </p>

              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
                <AttachmentGuideCard
                  title="첨부하면 좋은 자료"
                  items={recommendedAttachments}
                />
                <AttachmentGuideCard
                  title={
                    formData.service
                      ? `${formData.service} 권장 자료`
                      : '서비스별 권장 자료'
                  }
                  items={
                    selectedAttachmentGuide.length
                      ? selectedAttachmentGuide
                      : ['서비스 종류를 선택하면 권장 첨부자료가 표시됩니다.']
                  }
                  highlighted
                />
              </div>

              <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
                <label className="flex cursor-pointer flex-col items-center text-center">
                  <UploadCloud className="text-navy-700" size={34} />
                  <strong className="mt-3 block text-base font-black text-navy-900">
                    파일을 드래그하거나 클릭해서 첨부하세요
                  </strong>
                  <span className="mt-2 text-sm leading-6 text-slate-500">
                    JPG, PNG, PDF 파일을 권장합니다. 여러 장의 사진을 첨부하면
                    상담 정확도가 높아집니다.
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-navy-800">
                    <ImagePlus size={17} />
                    파일 선택하기
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    multiple
                    onChange={updatePhotos}
                    className="sr-only"
                  />
                </label>

                {photoPreviews.length > 0 && (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {photoPreviews.map((preview, index) => (
                      <AttachmentPreview
                        key={`${preview.name}-${preview.size}`}
                        preview={preview}
                        onRemove={() => removePhoto(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <label className="mt-4 flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
                <input
                  type="checkbox"
                  name="noAttachments"
                  checked={formData.noAttachments}
                  onChange={updateField}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-900"
                />
                <span>
                  현재 첨부할 자료가 없습니다. 담당자 안내 후 추가 제출하겠습니다.
                </span>
              </label>

              {formData.noAttachments && (
                <p className="mt-3 rounded-md bg-blue-50 px-4 py-3 text-sm font-semibold leading-6 text-blue-700">
                  첨부자료가 없어도 상담 신청은 가능합니다. 담당자가 확인 후 필요한
                  자료와 제출 방법을 안내드립니다.
                </p>
              )}
            </FormGroup>

            <label className="mt-6 flex items-start gap-3 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <input
                type="checkbox"
                name="privacy"
                checked={formData.privacy}
                onChange={updateField}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-900"
              />
              <span>
                상담 신청을 위한 개인정보 수집 및 이용에 동의합니다. 입력한
                정보는 상담 목적으로만 사용합니다.
              </span>
            </label>

            {error && (
              <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-md bg-signal-orange px-6 py-4 text-base font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? '상담 신청 중...' : '상담 신청하기'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function SubmissionComplete({ booking, onStartAnother, onShowServices }) {
  const summaryItems = [
    ['고객명', booking.name],
    ['연락처', booking.phone],
    ['차량 종류', booking.vehicleType],
    ['서비스 종류', booking.service],
    ['지역', booking.region],
    ['희망 날짜', booking.desiredDate],
    ['차량번호', booking.vehicleNumber],
    ['차량 모델명', booking.vehicleModel],
    ['첨부자료 여부', booking.attachmentStatus],
    ['문의 내용', booking.message || '입력된 문의 내용이 없습니다.'],
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
      <div className="rounded-xl border border-orange-100 bg-orange-50/70 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-signal-orange text-white">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-signal-orange">접수 완료</p>
            <h3 className="mt-2 text-2xl font-black text-navy-900">
              상담 신청이 접수되었습니다
            </h3>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
              <p>
                입력해주신 차량 정보와 상담 내용을 확인한 후 담당자가 연락드릴
                예정입니다.
              </p>
              <p>
                캠핑카·카라반은 차량 상태, 구조변경 가능성, 탁송 필요 여부에
                따라 진행 방식과 비용이 달라질 수 있습니다.
              </p>
              <p>
                정확한 안내를 위해 담당자가 추가 서류나 사진을 요청할 수
                있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-navy-100 bg-navy-50 p-5">
        <div className="flex gap-3">
          <ClipboardCheck className="mt-1 shrink-0 text-navy-900" size={22} />
          <div>
            <strong className="text-sm font-black text-navy-900">
              {booking.service} 안내
            </strong>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {serviceCompletionMessages[booking.service]}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-black text-navy-900">접수 요약</h4>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {summaryItems.map(([label, value]) => (
            <div
              key={label}
              className={label === '문의 내용' ? 'md:col-span-2' : undefined}
            >
              <span className="text-xs font-black text-slate-500">{label}</span>
              <p className="mt-1 rounded-md bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-black text-navy-900">다음 진행 단계</h4>
        <div className="mt-4 grid gap-3">
          {nextSteps.map((step, index) => (
            <div
              key={step}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-black text-white">
                {index + 1}
              </span>
              <span className="text-sm font-bold text-slate-700">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onStartAnother}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-navy-900 px-5 py-3 text-sm font-bold text-navy-900 transition hover:bg-navy-50"
        >
          <RotateCcw size={17} />
          다른 상담 신청하기
        </button>
        <button
          type="button"
          onClick={onShowServices}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
        >
          메인 서비스 보기
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

function ConditionalGuides({
  formData,
  isCaravan,
  isStructureService,
  isDeliveryService,
  isRepairService,
  isUsedInspectionService,
  updateField,
  updateMultiCheckbox,
}) {
  const hasGuide =
    isCaravan ||
    isStructureService ||
    isDeliveryService ||
    isRepairService ||
    isUsedInspectionService;

  if (!hasGuide) {
    return null;
  }

  return (
    <FormGroup title="서비스별 확인 사항">
      <div className="grid gap-4">
        {isCaravan && (
          <GuideCard title="카라반 진행 안내">
            <p>
              카라반은 견인면허, 견인장치, 견인 가능 차량 여부에 따라 탁송
              또는 검사 진행 방식이 달라질 수 있습니다. 담당자 확인 후
              정확한 진행 방법을 안내드립니다.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <CheckboxField
                label="견인차 보유 여부"
                name="hasTowVehicle"
                checked={formData.hasTowVehicle}
                onChange={updateField}
              />
              <CheckboxField
                label="트레일러 견인면허 보유 여부"
                name="hasTrailerLicense"
                checked={formData.hasTrailerLicense}
                onChange={updateField}
              />
              <CheckboxField
                label="탁송 필요 여부"
                name="needsDelivery"
                checked={formData.needsDelivery}
                onChange={updateField}
              />
            </div>
          </GuideCard>
        )}

        {isStructureService && (
          <GuideCard title="구조변경 상담 안내">
            <p>
              튜닝, 내부 구조 변경, 중량 변경, 전기·가스 설비 변경이 있는
              경우 구조변경 대상이 될 수 있습니다. 등록증, 차량 사진, 변경
              전후 내용을 함께 첨부하면 검토가 빠릅니다.
            </p>
          </GuideCard>
        )}

        {isDeliveryService && (
          <GuideCard title="카라반 탁송 안내">
            <p>
              탁송 서비스는 출발지, 도착지, 카라반 길이와 중량, 견인장치
              상태를 확인한 후 견적을 안내드립니다.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="출발지"
                name="departure"
                value={formData.departure}
                onChange={updateField}
              />
              <Field
                label="도착지"
                name="destination"
                value={formData.destination}
                onChange={updateField}
              />
              <SelectField
                label="탁송 목적"
                name="deliveryPurpose"
                value={formData.deliveryPurpose}
                onChange={updateField}
                options={deliveryPurposeOptions}
              />
            </div>
          </GuideCard>
        )}

        {isRepairService && (
          <GuideCard title="정비 상담/업체 연결 안내">
            <p>
              전기, 배터리, 충전기, 히터, 냉장고, 누수, 브레이크 등 증상을
              남겨주시면 지역과 증상에 맞는 전문 업체 연결 가능 여부를
              확인합니다.
            </p>
            <CheckboxGroup
              name="repairSymptoms"
              options={repairSymptomOptions}
              selectedOptions={formData.repairSymptoms}
              onChange={updateMultiCheckbox}
            />
          </GuideCard>
        )}

        {isUsedInspectionService && (
          <GuideCard title="중고 위탁점검 안내">
            <p>
              중고 캠핑카·카라반 구매 전 누수, 하부, 전기, 가스, 제동장치,
              구조변경 이력 등을 확인할 수 있도록 점검 상담을 도와드립니다.
            </p>
            <CheckboxGroup
              name="usedInspectionItems"
              options={usedInspectionOptions}
              selectedOptions={formData.usedInspectionItems}
              onChange={updateMultiCheckbox}
            />
          </GuideCard>
        )}
      </div>
    </FormGroup>
  );
}

function FormGroup({ title, children }) {
  return (
    <div className="mt-6 first:mt-0">
      <h3 className="text-base font-black text-navy-900">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function GuideCard({ title, children }) {
  return (
    <div className="rounded-lg border border-orange-100 bg-orange-50/70 p-5 text-sm leading-6 text-slate-700">
      <strong className="block text-sm font-black text-navy-900">{title}</strong>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function AttachmentGuideCard({ title, items, highlighted = false }) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        highlighted
          ? 'border-orange-100 bg-orange-50/70'
          : 'border-slate-200 bg-slate-50'
      }`}
    >
      <strong className="text-sm font-black text-navy-900">{title}</strong>
      <ul className="mt-4 grid gap-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2
              className="mt-0.5 shrink-0 text-signal-orange"
              size={16}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AttachmentPreview({ preview, onRemove }) {
  const isImage = preview.type?.startsWith('image/');

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
      {isImage ? (
        <img
          src={preview.url}
          alt={`${preview.name} 미리보기`}
          className="h-32 w-full object-cover"
        />
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-navy-50 text-navy-900">
          <FileText size={34} />
        </div>
      )}
      <div className="p-3">
        <p className="truncate text-xs font-bold text-navy-900">
          {preview.name}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {formatFileSize(preview.size)}
        </p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600"
        aria-label="첨부 파일 삭제"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-navy-900">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
        placeholder={type === 'date' ? undefined : `${label} 입력`}
      />
    </label>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-navy-900">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
      >
        <option value="">선택해 주세요</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({ label, name, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-orange-100 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-navy-900"
      />
      {label}
    </label>
  );
}

function CheckboxGroup({ name, options, selectedOptions, onChange }) {
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((option) => (
        <label
          key={option}
          className="flex items-center gap-2 rounded-md border border-orange-100 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-700"
        >
          <input
            type="checkbox"
            checked={selectedOptions.includes(option)}
            onChange={() => onChange(name, option)}
            className="h-4 w-4 rounded border-slate-300 text-navy-900"
          />
          {option}
        </label>
      ))}
    </div>
  );
}

function buildSubmittedSummary(formData) {
  return {
    name: formData.name,
    phone: formData.phone,
    vehicleType: formData.vehicleType,
    service: formData.service,
    region: formData.region,
    desiredDate: formData.desiredDate,
    vehicleNumber: formData.vehicleNumber,
    vehicleModel: formData.vehicleModel,
    message: formData.message,
    attachmentStatus: getAttachmentStatus(formData),
  };
}

function getAttachmentStatus(formData) {
  if (formData.noAttachments) {
    return '현재 첨부자료 없음, 담당자 안내 후 추가 제출 예정';
  }

  if (formData.photos.length > 0) {
    return `${formData.photos.length}개 첨부`;
  }

  return '첨부자료 없음';
}

function formatFileSize(size) {
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}
