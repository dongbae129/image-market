export function getColumnsCount(userAgent: string | null): number {
  if (!userAgent) return 3;
  const ua = userAgent.toLowerCase();
  console.log(ua, 'uauaua');

  if (/mobile|iphone|android/.test(ua)) return 2;
  if (/ipad|tablet/.test(ua)) return 4;
  return 6; // desktop 기본값
}
