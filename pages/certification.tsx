import { NextPage } from 'next';
import { useEffect } from 'react';

const Certification: NextPage = () => {
  useEffect(() => {
    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.8.js';
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);
  const onClickCertification = () => {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP?.init('imp44417695');

    /* 2. 본인인증 데이터 정의하기 */
    const data = {
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      company: '본인인증 test', // 회사명 또는 URL
      carrier: 'kt', // 통신사
      name: '배동현', // 이름
      phone: '01090274226' // 전화번호
    };

    /* 4. 본인인증 창 호출하기 */
    IMP?.certification({}, callback);
  };

  /* 3. 콜백 함수 정의하기 */
  function callback(response: any) {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      alert('본인인증 성공');
      console.log(response, '!@');
    } else {
      alert(`본인인증 실패: ${error_msg}`);
    }
  }

  return <button onClick={onClickCertification}>본인인증 하기</button>;
};

export default Certification;
