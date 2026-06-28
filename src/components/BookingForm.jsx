import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, UploadCloud, X } from 'lucide-react';
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
  privacy: false,
};

export default function BookingForm({ selectedService, onBookingCreated }) {
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoPreviewsRef = useRef([]);

  const isCaravan =
    formData.vehicleType === '카라반' || formData.vehicleType === '수입 카라반';
  const isStructureService = formData.service === '구조변경 상담';
  const isDeliveryService = formData.service === '카라반 탁송';
  const isRepairService = formData.service === '정비 상담/업체 연결';
  const isUsedInspectionService = formData.service === '중고 위탁점검';

  useEffect(() => {
    photoPreviewsRef.current = photoPreviews;
  }, [photoPreviews]);

  useEffect(() => {
    if (!selectedService) {
      return;
    }

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
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드할 수 있습니다.');
        return false;
      }

      if (file.size > MAX_PHOTO_SIZE) {
        setError('사진은 1장당 5MB 이하로 업로드해 주세요.');
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
        setError(`사진은 최대 ${MAX_PHOTO_COUNT}장까지 업로드할 수 있습니다.`);
      } else {
        setError('');
      }

      return {
        ...current,
        photos: nextPhotos,
      };
    });

    setPhotoPreviews((current) => {
      const combinedPreviews = [
        ...current,
        ...validFiles.map((file) => ({
          name: file.name,
          size: file.size,
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
    setSuccess('');

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createBooking(formData);
      console.log('상담 신청 데이터:', result.booking);
      setSuccess(
        result.storage === 'local'
          ? '테스트 상담이 접수되었습니다. 현재는 브라우저 임시 저장 상태입니다.'
          : '상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.',
      );
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
              첨부하면 상담이 더 정확해집니다. 사진은 최대 5장까지 업로드할
              수 있습니다.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8"
        >
          <FormGroup title="기본 정보">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="이름"
                name="name"
                value={formData.name}
                onChange={updateField}
              />
              <Field
                label="연락처"
                name="phone"
                value={formData.phone}
                onChange={updateField}
              />
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
              <Field
                label="지역"
                name="region"
                value={formData.region}
                onChange={updateField}
              />
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

          <FormGroup title="첨부 자료">
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
              <label className="flex cursor-pointer flex-col items-center text-center">
                <UploadCloud className="text-navy-700" size={32} />
                <strong className="mt-3 block text-sm font-bold text-navy-900">
                  상담 자료 첨부
                </strong>
                <span className="mt-2 text-sm leading-6 text-slate-500">
                  자동차등록증, 차량 사진, 도면, 수리 내역, 변경 전후 사진
                  등을 첨부하면 상담이 더 정확해집니다.
                </span>
                <span className="mt-4 inline-flex items-center gap-2 rounded-md bg-navy-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-navy-800">
                  <ImagePlus size={17} />
                  사진 선택하기
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={updatePhotos}
                  className="sr-only"
                />
              </label>

              {photoPreviews.length > 0 && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {photoPreviews.map((preview, index) => (
                    <div
                      key={`${preview.name}-${preview.size}`}
                      className="relative overflow-hidden rounded-lg border border-slate-200 bg-white"
                    >
                      <img
                        src={preview.url}
                        alt={`${preview.name} 미리보기`}
                        className="h-32 w-full object-cover"
                      />
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
                        onClick={() => removePhoto(index)}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-600"
                        aria-label="사진 삭제"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
          {success && (
            <p className="mt-5 rounded-md bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
              {success}
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
      </div>
    </section>
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

function formatFileSize(size) {
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}
