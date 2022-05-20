import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export interface Iamport {
  init: (accountID: string) => void;
  request_pay: (params: any, callback?: any) => void;
  certification: (params: any, callback?: any) => void;
}
declare global {
  interface Window {
    IMP?: Iamport;
  }
}
const Payment: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.7.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
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
      amount: 100, // 결제금액
      name: '카카오페이 테스트', // 주문명
      buyer_name: '배동현', // 구매자 이름
      buyer_tel: '01090274226', // 구매자 전화번호
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
      console.log('success');
      router.push('/');
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  }
  return (
    <div>
      <button onClick={onClickPayment}>결제</button>
    </div>
  );
};

export default Payment;
