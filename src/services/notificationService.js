export async function notifyAdminBookingCreated(booking) {
  await Promise.allSettled([
    sendAdminEmailNotification(booking),
    sendKakaoNotification(booking),
  ]);
}

export async function sendAdminEmailNotification(booking) {
  const adminEmail = import.meta.env.VITE_ADMIN_NOTIFICATION_EMAIL;

  if (!adminEmail) {
    console.info('관리자 이메일 알림 설정이 없습니다.', booking);
    return;
  }

  // 추후 EmailJS, Supabase Edge Function, 자체 API 등으로 교체합니다.
  console.info('관리자 이메일 알림 준비:', {
    to: adminEmail,
    subject: `[RV 인증관리센터] 신규 예약: ${booking.name}`,
    booking,
  });
}

export async function sendKakaoNotification(booking) {
  const webhookUrl = import.meta.env.VITE_KAKAO_NOTIFICATION_WEBHOOK_URL;

  if (!webhookUrl) {
    console.info('카카오톡 알림 웹훅 설정이 없습니다.', booking);
    return;
  }

  // 추후 카카오 알림톡 API 또는 중계 서버 웹훅으로 교체합니다.
  console.info('카카오톡 알림 준비:', {
    webhookUrl,
    message: `${booking.name} 고객의 ${booking.service} 예약이 접수되었습니다.`,
  });
}
