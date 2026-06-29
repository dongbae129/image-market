// src/lib/tokenService.ts
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

// 🚨 [Next.js 로컬 개발 팁] 코드를 수정해도 Map 객체가 초기화되지 않게 유지하는 트릭
const globalForSession = globalThis as unknown as {
  sessionDB: Map<string, string> | undefined;
};

// 공유 메모리 DB (실무의 Redis 역할)
export const sessionDB =
  globalForSession.sessionDB ?? new Map<string, string>();

if (process.env.NODE_ENV !== 'production') {
  globalForSession.sessionDB = sessionDB;
}

// ----------------------------------------------------
// 공통 토큰 발급 & DB 저장 함수
// ----------------------------------------------------
export function generateAndSaveTokens(userId: string) {
  const familyId = uuidv4();
  const jti = uuidv4();

  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  });
  const refreshToken = jwt.sign(
    { userId, familyId, jti },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '14d' }
  );

  // Map에 최신 토큰 ID(jti) 기록
  sessionDB.set(familyId, jti);

  return { accessToken, refreshToken };
}
