import { ResponseType, TokenPayload, dbNow } from '@libs/server/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { NextResponse } from 'next/server';

type Props = {
  params: {
    productId: string;
  };
};
export const GET = async (req, { params }: Props) => {
  const { productId } = params;
  if (!productId)
    return NextResponse.json(
      {
        ok: false,
        message: 'not comments'
      },
      {
        status: 401
      }
    );

  console.log(productId, '$%$');

  const comments = await client.chat.findMany({
    where: {
      productId: +productId.toString()
    },
    select: {
      id: true,
      description: true,
      createdAt: true,
      productId: true,
      user: {
        select: {
          name: true
        }
      }
    }
  });
  return NextResponse.json({
    ok: true,
    comments
  });
};

// export const POST = async (req, {params}:Props)=>{

//         if (req.body.chat === '')
//           return res.json({
//             ok: false,
//             message: 'need to any chat'
//           });
//         console.log(productId, req.body, 'productId');
//         const auth = checkAuth(req, res, 0);
//         if (auth?.checkError)
//           return res.json({
//             ok: false,
//             message: 'need to login for chat',
//             auth
//           });
//         const userId = (auth.payload as TokenPayload).id;

//         try {
//           const now = dbNow();
//           const chat = await client.chat.create({
//             data: {
//               description: req.body.chat,
//               userId,
//               productId: +productId.toString(),
//               createdAt: now,
//               updatedAt: now
//             },
//             include: {
//               user: {
//                 select: {
//                   name: true
//                 }
//               }
//             }
//           });
//           return res.json({
//             ok: true,
//             chat
//           });
//         } catch (error) {
//           console.error(error, `/api/chat/${productId}, post, create chat error`);
//           return res.json({
//             ok: false,
//             meesage: `/api/chat/${productId}, post, create chat error`
//           });
//         }

// }
