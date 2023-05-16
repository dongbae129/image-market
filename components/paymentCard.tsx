import { MouseEvent, useState, useRef, SetStateAction, Dispatch } from 'react';
import data from '../json/price.json';
import PaymentWay from './paymentWay';

interface PaymentCardProps {
  v: number;
  i: number;
  cardNumber: string;
  setCardNumber: Dispatch<SetStateAction<string>>;
}
const PaymentCard = ({ v, i, cardNumber, setCardNumber }: PaymentCardProps) => {
  const priceRef = useRef({});
  const { price } = data;

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    let element = e.target as HTMLDivElement;

    while (!element.classList.contains('datacard')) {
      element = element.parentNode as HTMLDivElement;
      if (element.nodeName === 'BODY') {
        return;
      }
    }
    if (!element.dataset.card) return;
    priceRef.current = price[Number(element.dataset.card) - 1];
    setCardNumber(element.dataset.card);
  };

  return (
    <div>
      <div className="datacard mb-5 cursor-pointer" key={v} data-card={v}>
        <div
          onClick={handleClick}
          className={`card rounded-tr-2xl rounded-bl-2xl outline ${
            cardNumber === v.toString() ? 'outline-red-400' : 'outline-gray-300'
          } outline-2 overflow-hidden`}
        >
          <div
            className={`group ${
              cardNumber === v.toString() && 'scale-[1.03]'
            } hover:scale-[1.03] flex h-44 ease-in-out duration-200`}
          >
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
              <div
                className={`border-2 border-solid border-gray-400 rounded-xl w-[90%] text-center p-1 mt-[5%] text-gray-400 font-bold ${
                  cardNumber === v.toString() && 'text-red-400 border-red-400'
                }`}
              >
                선택하기
              </div>
            </div>
            <div
              className={`w-1/2 flex flex-col justify-evenly ${
                cardNumber === v.toString() ? 'bg-red-400' : 'bg-gray-300'
              }`}
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
      {cardNumber === v.toString() && (
        <PaymentWay payproduct={priceRef.current} />
      )}
    </div>
  );
};

export default PaymentCard;
