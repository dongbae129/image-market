import { TokenPayload } from '@libs/server/utils';
import axios from 'axios';
import { checkAuth } from '@libs/server/auth';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  const auth = checkAuth();
  if (auth?.checkError)
    return NextResponse.json(
      {
        ok: false,
        auth
      },
      {
        status: 401
      }
    );
  const body = await req.json();
  const imp_uid = body.imp_uid;

  console.log(imp_uid, 'imp_uid');
  const { id } = auth.payload as TokenPayload;

  try {
    const dbUser = await client?.user.findUnique({
      where: {
        id
      }
    });
    if (!dbUser)
      return NextResponse.json(
        {
          ok: false,
          message: 'no user'
        },
        {
          status: 401
        }
      );
    if (!imp_uid)
      return NextResponse.json(
        {
          ok: false,
          message: 'no uid'
        },
        {
          status: 401
        }
      );
    const getToken = await axios.post('https://api.iamport.kr/users/getToken', {
      imp_key: '8091898149498656',
      imp_secret:
        '214a96ce39699d46f3a7c77a78bd73a943d3d2162d587a2460a47a6138792e9f5f0b4d0de8c5bc1d'
    });
    const { access_token } = getToken.data.response;

    const getPaymentData = await axios
      .get(`https://api.iamport.kr/payments/${imp_uid}`, {
        headers: {
          Authorization: access_token
        }
      })
      .catch((e) => console.error(e, 'EEError'));

    //   iamport에서 데이터 받아오기
    const paymentData = (getPaymentData as any).data.response;

    // db에서 데이터 받아와서 교차검증(가격)

    const { amount, merchant_uid, buyer_email, buyer_name, name, pg_provider } =
      paymentData;

    console.log(
      id,
      amount,
      merchant_uid,
      buyer_email,
      buyer_name,
      name,
      pg_provider,
      ' payload test'
    );

    const payProduct = await client?.payProduct.findFirst({
      where: {
        amount
      }
    });

    if (!payProduct)
      return NextResponse.json(
        {
          ok: false,
          message: 'failed to payment'
        },
        {
          status: 401
        }
      );

    await client?.payDetail.create({
      data: {
        userId: id,
        paid_amount: amount,
        merchant_uid: merchant_uid,
        buyer_email,
        buyer_name,
        name,
        pg_provider
      }
    });
    await client?.user.update({
      where: {
        id
      },
      data: {
        coin: dbUser.coin + payProduct.basicCoin + payProduct.bonusCoin,
        bonusCoupon: dbUser.bonusCoupon + payProduct.bonusCoupon
      }
    });

    return NextResponse.json({
      ok: true,
      message: 'success payment'
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        ok: false,
        message: 'fail pay'
      },
      {
        status: 500
      }
    );
  }
};
// const Pay = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
//   if (req.method === 'POST') {
//     const auth = checkAuth(req, res, 0);
//     if (auth?.checkError)
//       return res.status(401).json({
//         ok: false,
//         auth
//       });

//     const { id } = auth.payload as TokenPayload;

//     try {
//       const dbUser = await client?.user.findUnique({
//         where: {
//           id
//         }
//       });
//       if (!dbUser)
//         return res.status(401).json({
//           ok: false,
//           message: 'no user'
//         });
//       const { imp_uid } = req.body.response;
//       const getToken = await axios.post(
//         'https://api.iamport.kr/users/getToken',
//         {
//           imp_key: '8091898149498656',
//           imp_secret:
//             '214a96ce39699d46f3a7c77a78bd73a943d3d2162d587a2460a47a6138792e9f5f0b4d0de8c5bc1d'
//         }
//       );
//       const { access_token } = getToken.data.response;

//       const getPaymentData = await axios
//         .get(`https://api.iamport.kr/payments/${imp_uid}`, {
//           headers: {
//             Authorization: access_token
//           }
//         })
//         .catch((e) => console.error(e, 'EEError'));

//       //   iamport에서 데이터 받아오기
//       const paymentData = (getPaymentData as any).data.response;

//       // db에서 데이터 받아와서 교차검증(가격)

//       const {
//         amount,
//         merchant_uid,
//         buyer_email,
//         buyer_name,
//         name,
//         pg_provider
//       } = paymentData;

//       const payProduct = await client?.payProduct.findFirst({
//         where: {
//           amount
//         }
//       });

//       if (!payProduct)
//         return res.json({
//           ok: false,
//           message: 'failed to payment'
//         });

//       await client?.payDetail.create({
//         data: {
//           userId: id,
//           paid_amount: amount,
//           merchant_uid: merchant_uid,
//           buyer_email,
//           buyer_name,
//           name,
//           pg_provider
//         }
//       });
//       await client?.user.update({
//         where: {
//           id
//         },
//         data: {
//           coin: dbUser.coin + payProduct.basicCoin + payProduct.bonusCoin,
//           bonusCoupon: dbUser.bonusCoupon + payProduct.bonusCoupon
//         }
//       });

//       return res.json({
//         ok: true,
//         message: 'success payment'
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   }
// };

// export default Pay;
