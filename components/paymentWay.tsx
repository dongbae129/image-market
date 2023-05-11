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
const PaymentWay = (payproduct: PaymentWayProps) => {
  return (
    <div>
      <h2>충전수단을 선택해 주세요</h2>
      <div className="border-2 border-solid border-gray-500">1234</div>
    </div>
  );
};

export default PaymentWay;
