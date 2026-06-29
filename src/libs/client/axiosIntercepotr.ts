import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// -----------------------------------------------------------------
// [타입 정의] 기본 Axios 설정 객체에 우리가 필요한 커스텀 속성 추가
// -----------------------------------------------------------------
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 무한 루프 방지용 (이미 재시도했는지 여부)
  _startTime?: number; // 지연된 401 응답 방어용 (요청이 출발한 시간)
}

// -----------------------------------------------------------------
// 1. 인가가 필요한 API용 전용 인스턴스 생성
// -----------------------------------------------------------------
export const privateApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true // ⭐️ 브라우저 엔진이 httpOnly 쿠키를 자동으로 싣고 가도록 허락
});

// -----------------------------------------------------------------
// 2. 동시성 방어 및 상태 공유를 위한 모듈 레벨 전역 변수 (Singleton)
// -----------------------------------------------------------------
let isRefreshing = false; // 현재 토큰 재발급 진행 여부
let refreshSubscribers: ((value?: unknown) => void)[] = []; // 대기열(Queue)
let lastRefreshTime = 0; // 마지막으로 토큰 갱신이 완료된 타임스탬프

// 대기열에 쌓인 요청들을 다시 실행(Resolve)하는 함수
const onRefreshed = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = []; // 큐 비우기
};

// 재발급 진행 중일 때, 들어오는 요청들을 대기열에 담는 함수
const addSubscriber = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// =================================================================
// 🚀 [요청(Request) 인터셉터] - 모든 요청의 출발 시간을 기록
// =================================================================
privateApi.interceptors.request.use((config: CustomAxiosRequestConfig) => {
  config._startTime = Date.now(); // 요청이 브라우저를 떠나는 정확한 시간 기록
  return config;
});

// =================================================================
// 🛡️ [응답(Response) 인터셉터] - 401 감지 및 쿠키 자동 갱신
// =================================================================
privateApi.interceptors.response.use(
  (response) => {
    // 정상 응답이면 그대로 통과
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | CustomAxiosRequestConfig
      | undefined;

    // 401 에러(인가 실패)이고, 설정 객체가 있으며, 아직 재시도를 안 한 요청일 때
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // 🚨 [방어 1: 지연된 401 응답 처리]
      // 이 요청이 출발한 시간(startTime)이, 최근에 갱신이 완료된 시간(lastRefreshTime)보다 과거라면?
      // (예: 백엔드 처리가 늦어져서 뒤늦게 401을 받았는데, 이미 다른 API가 갱신을 끝내놓은 상태)
      if (
        originalRequest._startTime &&
        originalRequest._startTime < lastRefreshTime
      ) {
        // console.log('🔄 이미 갱신된 토큰이 존재합니다. 갱신 없이 즉시 재시도합니다.');
        originalRequest._retry = true;
        // 재발급 API를 찌르지 않고, 브라우저가 가진 최신 쿠키를 믿고 즉시 재발사!
        return privateApi(originalRequest);
      }

      // 🚨 [방어 2: 동시성 대기열 처리]
      // 이미 다른 API가 총대를 메고 재발급을 진행 중이라면?
      if (isRefreshing) {
        // console.log('⏳ 갱신이 진행 중입니다. 대기열에 합류합니다.');
        return new Promise((resolve) => {
          addSubscriber(() => {
            // 재발급이 성공하여 신호가 오면, 원래 요청을 다시 발사
            resolve(privateApi(originalRequest));
          });
        });
      }

      // 🚨 [방어 3: 내가 총대를 멘다 (최초 401 에러)]
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // console.log('🚀 토큰 만료! 프론트 BFF로 재발급(Restore)을 요청합니다.');

        // 1. Next.js BFF로 토큰 재발급 요청 (브라우저가 알아서 구형 쿠키를 보냄)
        // ⚠️ 주의: 무한 루프를 막기 위해 인터셉터가 없는 "기본 axios"를 사용합니다.
        await axios.post(
          '/api/auth/restore',
          {},
          {
            baseURL: process.env.NEXT_PUBLIC_API_URL || '',
            withCredentials: true
          }
        );

        // console.log('✅ 토큰 갱신 성공! 대기열을 깨우고 내 요청도 재시도합니다.');

        // 2. 갱신 완료 시간 기록 (지연된 401 방어용 기준점 생성)
        lastRefreshTime = Date.now();
        isRefreshing = false;

        // 3. 내 뒤에서 기다리던 대기열(Queue) 친구들에게 모두 재시작 신호 보냄
        onRefreshed();

        // 4. 총대를 멘 나 자신(최초 에러 요청)도 재시도 발사
        return privateApi(originalRequest);
      } catch (refreshError) {
        // RefreshToken 마저 죽은 경우 (진짜 14일 만료, 혹은 탈취 감지로 인한 파기)
        // console.error('❌ 토큰 갱신 실패. 완전 만료됨. 로그인 페이지로 이동합니다.');

        isRefreshing = false;
        refreshSubscribers = []; // 대기열 초기화

        // 브라우저 환경에서만 강제 이동 처리
        if (typeof window !== 'undefined') {
          window.location.href = '/signin';
        }
        return Promise.reject(refreshError);
      }
    }

    // 401이 아니거나, 1번 재시도했는데도 또 에러가 나면 그냥 에러를 뱉음
    return Promise.reject(error);
  }
);
