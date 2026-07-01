import React, { useState } from 'react';

const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (adminPassword && password === adminPassword) {
      setLoginError('');
      onLoginSuccess?.();
      return;
    }

    setLoginError('비밀번호가 올바르지 않습니다.');
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft sm:p-8">
      <div>
        <p className="eyebrow">관리자 인증</p>
        <h2 className="section-title mt-3">관리자 로그인</h2>
        <p className="section-copy">
          관리자 전용 화면입니다. 비밀번호를 입력해 주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:max-w-md">
        <label className="block">
          <span className="text-sm font-bold text-navy-900">비밀번호</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 outline-none transition focus:border-navy-700 focus:ring-4 focus:ring-navy-100"
            autoComplete="current-password"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-navy-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-navy-800"
        >
          로그인
        </button>
      </form>

      {loginError && (
        <p className="mt-5 rounded-md bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700">
          {loginError}
        </p>
      )}
    </div>
  );
}
