import SvgIcon from '@components/svgIcon';
import Link from 'next/link';
import SvgData from '@/json/data.json';

const redirect_uri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code`;

type Props = {
  snsMessage: string;
  separationMessage: string;
};
function SnsSign({ snsMessage, separationMessage }: Props) {
  const { google, kakao, naver } = SvgData.SVG;
  return (
    <div className="mb-10">
      <Link href="/">
        <img
          className="mx-auto h-12"
          src="/localimages/emptyuser2.png"
          alt="logo"
        />
      </Link>
      <div className="mt-6 sign-head text-2xl font-bold">
        <h2 data-testid="testh">환영합니다</h2>
      </div>
      <div className="sign-login-sns">
        <span className="text-sm font-medium">SNS {snsMessage}</span>
        <div className="sign-login-sns_main">
          <span className="sns_wrap sns_main_link">
            <Link href={KAKAO_AUTH_URL}>
              <div style={{ width: '25px', height: '25px', margin: 'auto' }}>
                <SvgIcon svgInfo={kakao} viewBox="0 0 25 25" />
              </div>
            </Link>
          </span>
          <span className="sns_wrap sns_main_link">
            <Link href={'#'}>
              <div style={{ width: '25px', height: '25px', margin: 'auto' }}>
                <SvgIcon svgInfo={naver} viewBox="0 0 25 25" />
              </div>
            </Link>
          </span>
          <span className="sns_wrap sns_main_link">
            <Link href={'#'}>
              <div style={{ width: '25px', height: '25px', margin: 'auto' }}>
                <SvgIcon svgInfo={google} viewBox="0 0 48 48" />
              </div>
            </Link>
          </span>
        </div>
        <div className="sign-login-local_text">
          <span>{separationMessage}</span>
        </div>
      </div>
      <style jsx>{`
        .sign-head {
          text-align: center;
        }
        .sign-login-sns > span {
          font-weight: 500;
          line-height: 1.25rem;
        }
        .sign-login-sns_main {
          margin-top: 0.5rem;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0.75rem;
        }
        .sns_main_link {
          box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
          text-align: center;
          border-radius: 5px;
          padding: 0.5rem;
        }
        .sign-login-local_text {
          display: flex;
          justify-content: center;
          margin-top: 1.75rem;
          position: relative;
          font-size: 0.875rem;
          > span {
            background-color: white;
            color: rgba(0, 0, 0, 0.45);
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            font-weight: 600;
          }
          > span::before {
            content: '';
            position: absolute;

            z-index: -1;
            width: 100%;
            top: 50%;
            left: 0;
            border-top: 1px solid rgba(0, 0, 0, 0.16);
          }
        }
      `}</style>
    </div>
  );
}

export default SnsSign;
