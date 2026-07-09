export const timeForToday = (value: any, now = new Date()) => {
  const today = now;
  const timeValue = new Date(value);

  // 분 단위 계산
  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return '방금 전';
  if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  // 시간 단위 계산
  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `약 ${betweenTimeHour}시간 전`;
  }

  // 일 단위 계산
  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);

  // 🌟 7일 미만이면 '일 전'
  if (betweenTimeDay < 7) {
    return `${betweenTimeDay}일 전`;
  }

  // 🌟 30일 미만이면 '주 전' (예: 7~29일)
  if (betweenTimeDay < 30) {
    const betweenTimeWeek = Math.floor(betweenTimeDay / 7);
    return `${betweenTimeWeek}주 전`;
  }

  // 🌟 365일 미만이면 '개월 전' (예: 30~364일)
  if (betweenTimeDay < 365) {
    const betweenTimeMonth = Math.floor(betweenTimeDay / 30);
    return `${betweenTimeMonth}개월 전`;
  }

  // 🌟 365일 이상이면 '년 전'
  return `${Math.floor(betweenTimeDay / 365)}년 전`;
};
