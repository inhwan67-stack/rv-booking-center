import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, UploadCloud, X } from 'lucide-react';
import { createBooking } from '../services/bookingRepository.js';
import {
  serviceOptions,
  vehicleStatusOptions,
  vehicleTypes,
} from '../types/booking.js';

const MAX_PHOTO_COUNT = 5;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

const initialFormData = {
  name: '',
  phone: '',
  region: '',
  vehicleType: '',
  vehicleModel: '',
  year: '',
  service: '',
  status: '',
  message: '',
  photos: [],
  privacy: false,
};

export default function BookingForm({ onBookingCreated }) {
  const [formData, setFormData] = useState(initialFormData);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoPreviewsRef = useRef([]);

  useEffect(() => {
    photoPreviewsRef.current = photoPreviews;
  }, [photoPreviews]);

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
      'region',
      'vehicleType',
      'vehicleModel',
      'year',
      'service',
      'status',
    ];

    const hasMissingField = requiredFields.some((field) => !formData[field]);
    if (hasMissingField) {
      return '필수 입력 항목을 모두 작성해 주세요.';
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
      console.log('예약 신청 데이터:', result.booking);
      setSuccess(
        result.storage === 'local'
          ? '테스트 예약이 접수되었습니다. 현재는 브라우저 임시 저장 상태입니다.'
          : '예약 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.',
      );
      resetForm();
      onBookingCreated?.(result.booking);
    } catch (submitError) {
      console.error('예약 신청 저장 오류:', submitError);
      setError(
        submitError.message ||
          '예약 신청 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="bg-slate-50 py-16 lg:py-24">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow">예약하기</p>
          <h2 className="section-title mt-3">검사·구조변경 상담 예약하기</h2>
          <p className="section-copy">
            차량 사진을 함께 올리면 등화장치, 하부 상태, 실내 개조 이력,
            견인장치 등 사전 검토에 필요한 정보를 더 정확히 확인할 수
            있습니다.
          </p>
          <div className="mt-8 rounded-lg border border-navy-100 bg-white p-6">
            <strong className="text-lg font-black text-navy-900">
              사진 업로드 안내
            </strong>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              사진은 최대 5장까지 업로드할 수 있습니다. Supabase가 연결되면
              Storage 버킷에 저장되고, 테스트 모드에서는 현재 브라우저에만
              임시 저장됩니다.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="이름" name="name" value={formData.name} onChange={updateField} />
            <Field label="연락처" name="phone" value={formData.phone} onChange={updateField} />
            <Field label="지역" name="region" value={formData.region} onChange={updateField} />
            <SelectField
              label="차량 종류"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={updateField}
              options={vehicleTypes}
            />
            <Field
              label="차량 모델명"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={updateField}
            />
            <Field label="연식" name="year" value={formData.year} onChange={updateField} />
            <SelectField
              label="서비스 선택"
              name="service"
              value={formData.service}
              onChange={updateField}
              options={serviceOptions}
            />
            <SelectField
              label="현재 차량 상태"
              name="status"
              value={formData.status}
              onChange={updateField}
              options={vehicleStatusOptions}
            />
          </div>

          <label className="mt-5 block">
            <span className="text-sm font-bold text-navy-900">상담 내용</span>
            <textarea
              name="message"
              value={formData.message}
              onChange={updateField}
              rows="5"
              className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
              placeholder="차량 상태, 검사 일정, 개조 이력, 중량 문제 등을 자유롭게 작성해 주세요."
            />
          </label>

          <div className="mt-5 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6">
            <label className="flex cursor-pointer flex-col items-center text-center">
              <UploadCloud className="text-navy-700" size={32} />
              <strong className="mt-3 block text-sm font-bold text-navy-900">
                차량 사진 업로드
              </strong>
              <span className="mt-2 text-sm text-slate-500">
                JPG, PNG, WEBP 등 이미지 파일을 최대 5장까지 선택하세요.
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

          <label className="mt-5 flex items-start gap-3 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <input
              type="checkbox"
              name="privacy"
              checked={formData.privacy}
              onChange={updateField}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-900"
            />
            <span>
              예약 상담을 위한 개인정보 수집 및 이용에 동의합니다. 입력한
              정보는 상담 목적에만 사용됩니다.
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
            {isSubmitting ? '예약 신청 중...' : '예약 신청하기'}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-navy-900">{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
        placeholder={`${label} 입력`}
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

function formatFileSize(size) {
  return `${(size / 1024 / 1024).toFixed(1)}MB`;
}
