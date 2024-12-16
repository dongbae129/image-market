'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  return (
    <>
      <div className="container">
        <h1 className="title">404</h1>
        <p className="message">죄송합니다, 해당 페이지를 찾을 수 없습니다.</p>
        <button className="button" onClick={() => router.push('/')}>
          홈으로 돌아가기
        </button>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 100%;
          height: 100vh;
          color: #343a40; /* 어두운 텍스트 색상 */
          text-align: center;
        }

        .title {
          font-size: 6rem; /* 큰 제목 */
          font-weight: bold;
        }

        .message {
          font-size: 1.5rem; /* 메시지 크기 */
          margin-bottom: 20px; /* 아래 여백 */
        }

        .button {
          padding: 10px 20px; /* 버튼 패딩 */
          font-size: 1rem; /* 버튼 텍스트 크기 */
          color: white; /* 버튼 텍스트 색상 */
          background-color: #007bff; /* 버튼 배경색 */
          border: none; /* 테두리 없음 */
          border-radius: 5px; /* 둥근 모서리 */
          cursor: pointer; /* 커서 포인터 변경 */
          transition: background-color 0.3s ease; /* 배경색 전환 효과 */
        }

        .button:hover {
          background-color: #0056b3; /* 호버 시 색상 변화 */
        }
      `}</style>
    </>
  );
};

export default NotFound;
