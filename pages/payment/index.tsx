import type { NextPage } from 'next';
import data from '../../json/price.json';
import { MouseEvent } from 'react';

const Index: NextPage = () => {
  const { price } = data;
  const handleOnclick = (e: MouseEvent<HTMLDivElement>) => {
    let element = e.target as HTMLDivElement;
    console.log(element.dataset, 'AA');
    while (!element.classList.contains('datacard')) {
      element = element.parentNode as HTMLDivElement;
      if (element.nodeName === 'BODY') {
        return;
      }
    }
    console.log(element.children, 'class');
    console.log(element.dataset.card, 'Card dataset');
  };

  return (
    <div className="w-full bg-[#efeff0] mt-[-80px] pt-[64px]">
      <div className="w-[780px] m-auto h-full bg-white">
        <div className="px-5 pb-5 h-full flex flex-col">
          <div className="mt-5 cardparent">
            <div>
              <h2 className="text-2xl font-bold py-3">
                충전금액을 선택해 주세요
              </h2>
            </div>
            <div onClick={handleOnclick}>
              {[1, 2, 3, 4].map((v, i) => (
                <div
                  className="datacard mb-5 cursor-pointer"
                  key={v}
                  data-card={v}
                >
                  <div className="rounded-tr-2xl rounded-bl-2xl outline outline-gray-300 outline-2 overflow-hidden hover:outline-red-400 focus:outline-blue-400">
                    <div className="group hover:scale-[1.03] flex h-44 ease-in-out duration-200">
                      <div className="w-1/2 flex justify-center items-center flex-col">
                        <div
                          className="flex justify-center w-full items-center"
                          data-test={v}
                        >
                          {v === 1 && (
                            <span className="mr-[10%] rounded-xl py-1 px-2 text-white font-bold bg-gray-400">
                              기본적립
                            </span>
                          )}

                          <span className="text-5xl font-bold text-red-400">
                            {price[i].pay}원
                          </span>
                        </div>
                        <div className="border-2 border-solid border-gray-400 rounded-xl w-[90%] text-center p-1 mt-[5%] text-gray-400 font-bold group-hover:text-red-400 group-hover:border-red-400">
                          선택하기
                        </div>
                      </div>
                      <div
                        className={`bg-gray-300 w-1/2 flex flex-col justify-evenly group-hover:bg-red-400`}
                      >
                        <div className=" flex justify-center items-center text-white font-bold text-3xl">
                          {price[i].coin + price[i].bonus}코인
                        </div>
                        {price[i].bonus ? (
                          <div className="h-[50%] bg-white rounded-tr-2xl rounded-bl-2xl flex w-[80%] my-0 mx-auto">
                            <div className="flex flex-col w-full justify-evenly">
                              <div className="flex justify-center items-center w-full">
                                <span className="rounded-2xl p-1 bg-red-400 text-white font-bold text-sm mr-3">
                                  추가적립
                                </span>
                                <span className="font-bold text-sm">
                                  {price[i].bonus}코인
                                </span>
                              </div>
                              <div className="text-center">
                                <span className="text-red-400 font-bold text-sm">
                                  특별보너스{' '}
                                </span>
                                <span className="font-bold text-sm">
                                  쿠폰 {price[i].coupon}장
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

// import type { NextPage } from 'next';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';
// export interface Iamport {
//   init: (accountID: string) => void;
//   request_pay: (params: any, callback?: any) => void;
//   certification: (params: any, callback?: any) => void;
// }
// declare global {
//   interface Window {
//     IMP?: Iamport;
//   }
// }
// const Payment: NextPage = () => {
//   const router = useRouter();
//   useEffect(() => {
//     const jquery = document.createElement('script');
//     jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';
//     const iamport = document.createElement('script');
//     iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.1.7.js';
//     document.head.appendChild(jquery);
//     document.head.appendChild(iamport);
//     return () => {
//       document.head.removeChild(jquery);
//       document.head.removeChild(iamport);
//     };
//   }, []);
//   function onClickPayment() {
//     /* 1. 가맹점 식별하기 */
//     const { IMP } = window;
//     IMP?.init('imp44417695');

//     /* 2. 결제 데이터 정의하기 */
//     const data = {
//       pg: 'kakaopay', // PG사
//       pay_method: 'card', // 결제수단
//       merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
//       amount: 15000, // 결제금액
//       name: '카카오페이 테스트', // 주문명
//       buyer_name: '배동현', // 구매자 이름
//       buyer_tel: '0109174226', // 구매자 전화번호
//       buyer_email: 'dongbae129@naver.com', // 구매자 이메일
//       buyer_addr: '신사동 661-16', // 구매자 주소
//       buyer_postcode: '06018' // 구매자 우편번호
//     };

//     /* 4. 결제 창 호출하기 */
//     IMP?.request_pay(data, callback);
//   }
//   function callback(response: any) {
//     const { success, merchant_uid, error_msg } = response;

//     if (success) {
//       alert('결제 성공');
//       console.log(response, 'success');
//       // router.push('/');
//     } else {
//       alert(`결제 실패: ${error_msg}`);
//     }
//   }
//   return (
//     <div>
//       <button onClick={onClickPayment}>결제</button>
//     </div>
//   );
// };

// export default Payment;
