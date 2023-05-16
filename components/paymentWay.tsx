import SvgData from 'json/data.json';
import SvgIcon from '@components/svgIcon';
// import Link from 'next/link';
import { useEffect } from 'react';

interface PaymentWayProps {
  payproduct:
    | {
        pay: number;
        coin: number;
        bonus: number;
        coupon?: number;
      }
    | Record<string, never>;
}
// declare global {
//   interface Window {
//     IMP?: Iamport;
//   }
// }
const PaymentWay = ({ payproduct }: PaymentWayProps) => {
  const { bonus, pay, coin, coupon } = payproduct;
  const { kakao } = SvgData.SVG;
  console.log(payproduct, 'pro');
  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.7.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      console.log(pay, '사라집니다~');
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  function onClickPayment() {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP?.init('imp44417695');

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'kakaopay', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: pay, // 결제금액
      name: `포인트충전: ${pay}`, // 주문명
      buyer_name: '테스트중', // 구매자 이름
      buyer_tel: '테테테스트', // 구매자 전화번호
      buyer_email: 'dongbae129@naver.com', // 구매자 이메일
      buyer_addr: '신사동 661-16', // 구매자 주소
      buyer_postcode: '06018' // 구매자 우편번호
    };

    /* 4. 결제 창 호출하기 */
    IMP?.request_pay(data, callback);
  }
  function callback(response: any) {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      alert('결제 성공');
      console.log(response, 'success');
      // router.push('/');
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  }
  return (
    <div className="my-3">
      <h1 className="font-bold text-xl mb-2">충전수단을 선택해 주세요</h1>
      <div className="border border-solid border-gray-300 flex h-16">
        <div className="bg-gray-100 w-[145px] flex items-center pl-[10px] h-full text-sm font-bold">
          간편결제
        </div>
        <div className="grow flex items-center pl-[10px] h-full">
          <div>
            <div
              className="border-1 border border-gray-300 rounded shadow-lg p-2 h-full flex  cursor-pointer"
              onClick={onClickPayment}
            >
              <div className="w-6 h-6 m-auto flex items-center">
                <SvgIcon svgInfo={kakao} viewBox="0 0 25 25" />
              </div>
              <div className="font-bold">카카오페이</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentWay;
