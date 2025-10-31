'use client';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

const WithdrawalPage = () => {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const userName = useSearchParams().get('userId');

  const handleWithdrawal = () => {
    if (isConfirmed) {
      // 탈퇴 로직
    } else {
      alert('안내사항을 확인해주세요.');
    }
  };

  return (
    <div className="container">
      <h1 className="title">
        <h3>
          <p>
            <span className="username">{userName}님</span>, 회원 탈퇴할 경우
            재사용 및 복구가 불가능합니다.
          </p>
        </h3>
        <h3>
          <p>
            <em>탈퇴한 아이디는 본인과 타인 모두 재사용 및 복구가 불가</em>
            하오니 신중하게 선택하시기 바랍니다.
          </p>
        </h3>
      </h1>

      <h1 className="title">
        <h3>
          <p>탈퇴 후 회원정보 및 개인형 서비스 이용기록은 모두 삭제됩니다.</p>
        </h3>
        <h3>
          <p>
            회원정보 및 마일리지, 쿠폰 등 개인형 서비스 이용기록은 모두
            삭제되며, <em>삭제된 데이터는 복구되지 않습니다.</em>
          </p>
        </h3>
      </h1>
      <table className="withdrawal-table">
        <thead>
          <tr>
            <th>구분</th>
            <th>삭제 내용</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>개인정보</td>
            <td>이름, 연락처, 이메일</td>
            <td>완전 삭제</td>
          </tr>
          <tr>
            <td>활동 기록</td>
            <td>게시물, 댓글</td>
            <td>복구 불가</td>
          </tr>
          <tr>
            <td>포인트</td>
            <td>마일리지, 쿠폰</td>
            <td>즉시 소멸</td>
          </tr>
          <tr>
            <td>계정</td>
            <td>로그인 정보</td>
            <td>영구 탈퇴</td>
          </tr>
        </tbody>
      </table>

      <h1 className="title">
        <h3>
          <p>
            탈퇴 후에도 게시판형 서비스에 등록한 게시물은 그대로 남아 있습니다.
          </p>
        </h3>
        <h3>
          <p>
            뉴스, 카페, 지식iN 등에 올린 게시글 및 댓글은 탈퇴 시 자동 삭제되지
            않고 그대로 남아 있습니다.
            <br />
            삭제를 원하는 게시글이 있다면{' '}
            <em>반드시 탈퇴 전 비공개 처리하거나 삭제하시기 바랍니다.</em>
            <br />
            탈퇴 후에는 회원정보가 삭제되어 본인 여부를 확인할 수 있는 방법이
            없어, 게시글을 임의로 삭제해드릴 수 없습니다.
          </p>
        </h3>
      </h1>
      <div className="confirm-section">
        <input
          type="checkbox"
          id="confirm"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
        />
        <label htmlFor="confirm">
          위 안내사항을 모두 확인하였으며, 탈퇴에 동의합니다.
        </label>
      </div>

      <button
        className="withdraw-button"
        onClick={handleWithdrawal}
        disabled={!isConfirmed}
      >
        회원 탈퇴
      </button>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          text-align: center;
        }
        .title {
          color: #333;
          margin-bottom: 30px;

          .username {
            color: #228be6;
          }

          h3 :first-child {
            font-weight: bold;
            padding-left: 13px;
            background: url('/localimages/sp_ico.png') no-repeat 0 8px;
          }

          p {
            text-align: left;

            em {
              color: #ff6000;
              font-style: normal;
            }
          }
        }
        .title :not(:first-child) {
          p {
            padding-top: 0.5rem;
          }
        }

        .withdrawal-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .withdrawal-table th,
        .withdrawal-table td {
          border: 1px solid #e0e0e0;
          padding: 12px;
          text-align: left;
        }

        .confirm-section {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          gap: 10px;
        }
        .withdraw-button {
          background-color: #dc3545;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .withdraw-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        thead {
          background-color: #f8f9fa;
        }
        tr :first-child {
          border-left: none;
        }
        tr :last-child {
          border-right: none;
        }
        .withdraw-button:hover:not(:disabled) {
          background-color: #c82333;
        }
      `}</style>
    </div>
  );
};

export default WithdrawalPage;
