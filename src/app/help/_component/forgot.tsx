// src/ForgotPassword.js
import Button from '@components/button';
import Link from 'next/link';
import React from 'react';

type ForGotPasswordProps = {
  email: string;
};
function ForgotPassword({ email }: ForGotPasswordProps) {
  return (
    <>
      <div className="wrapper">
        <div className="forgot-password-container">
          <div className="icon-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="check-icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="4"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2>
            <p className="mailinfo_container">
              <span>{email}</span>
              <span>으로 안내 메일을 발송하였습니다.</span>
            </p>
          </h2>

          <div className="subtext_contatiner">
            <p className="subtext">
              해당 이메일을 확인 하시고, 비밀번호 변경이 필요하신 경우 해당
              이메일을 통해 변경 가능합니다.
            </p>
            <p className="subtext">
              * 서비스에 따라 스팸으로 분류되어 있을 수 있습니다. 스팸함도 꼭
              확인해 주시기 바랍니다.
            </p>
          </div>
          <div className="button_container">
            <Link href={'/signin'}>
              <Button isLoading={false} text="로그인" />
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .wrapper {
          display: flex;
          justify-content: center;
          margin-top: 8rem;
        }
        .forgot-password-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .icon-container {
          background-color: #4caf50;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .check-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        h2 {
          color: #0073e6;
          margin-bottom: 10px;
        }

        p {
          font-size: 16px;
          color: #333;
        }
        .mailinfo_container {
          display: flex;
          flex-direction: column;
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 2.25rem;
          > span:first-child {
            color: #228be6;
          }
        }
        .subtext_contatiner {
          padding: 1rem;
          margin-top: 1.5rem;
          background-color: #f1f3f5;
          border-radius: 5px;
          font-weight: 600;
        }

        .subtext {
          font-size: 14px;
          color: #888;
        }

        .login-button {
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color: #0073e6;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .login-button:hover {
          background-color: #005bb5;
        }
        .button_container {
          margin-top: 1.25rem;
          width: 25%;
        }
      `}</style>
    </>
  );
}

export default ForgotPassword;
