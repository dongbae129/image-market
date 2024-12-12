// import { dbNow, ResponseType, TokenPayload } from '@libs/server/utils';
// import { NextApiRequest, NextApiResponse } from 'next';
import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
// // import { decode } from 'jsonwebtoken';
// import { PostBoardInfo } from './[boardId]';
import { NextRequest, NextResponse } from 'next/server';
import { dbNow, TokenPayload } from '@libs/server/utils';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const searchQuery = searchParams.get('search');
  console.log(searchQuery, 'board query');
  try {
    const boards = await client.board.findMany({
      where: {
        ...(searchQuery
          ? {
              title: {
                contains: searchQuery.toString()
              }
            }
          : {})
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        boardHit: {
          select: {
            hit: true
          }
        },
        _count: {
          select: {
            boardChat: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    return NextResponse.json({
      ok: true,
      boards
    });
  } catch (error) {
    console.log(error, 'boards get error');
    return NextResponse.json(
      {
        ok: false,
        message: error
      },
      {
        status: 500
      }
    );
  }
};
export const POST = async (req: NextRequest) => {
  try {
    const auth = checkAuth();
    console.log(auth, 'res');
    if (auth?.checkError) {
      return NextResponse.json(
        {
          ok: false,
          auth
        },
        {
          status: 401
        }
      );
    }
    if (auth.payload) {
      const decoded = auth.payload as TokenPayload;
      console.log(decoded, 'decoded');
      const body = await req.json();
      const { title, description, boardtag } = body;
      console.log(title, description, boardtag, 'Body');
      if (title === '' || description === '')
        return NextResponse.json(
          {
            ok: false,
            error: 'input board informations'
          },
          {
            status: 401
          }
        );
      if (decoded.id) {
        const Id = decoded.id;
        console.log(Id, 'IID');
        const now = dbNow();
        const board = await client.board.create({
          data: {
            title,
            description,
            userId: Id,
            createdAt: now,
            updatedAt: now
          }
        });
        console.log(board, 'Boardsd');
        await client.boardHit.create({
          data: {
            hit: 0,
            boardId: board.id
          }
        });
        await client.boardTag.create({
          data: {
            boardId: board.id,
            hashtag: boardtag
          }
        });
        return NextResponse.json({
          ok: true,
          message: 'create the board',
          board
        });
      } else
        return NextResponse.json(
          {
            ok: false,
            message: 'need to login , /api/board/index, post'
          },
          {
            status: 403
          }
        );
    }
  } catch (error) {
    console.log(error, 'board create error');
    return NextResponse.json(
      {
        ok: false,
        message: error
      },
      {
        status: 500
      }
    );
  }
};
// const Board = async (
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseType>
// ) => {
//   if (req.method === 'POST') {
//     try {
//       const auth = checkAuth(req, res, 0);
//       console.log(auth, 'res');
//       if (auth?.checkError) {
//         return res.status(401).json({
//           ok: false,
//           auth
//         });
//       }
//       if (auth.payload) {
//         const decoded = auth.payload as TokenPayload;
//         console.log(decoded, 'decoded');
//         const { title, description, boardtag }: PostBoardInfo = req.body;
//         console.log(title, description, boardtag, 'Body');
//         if (title === '' || description === '')
//           return res.json({
//             ok: false,
//             error: 'input board informations'
//           });
//         if (decoded.id) {
//           const Id = decoded.id;
//           console.log(Id, 'IID');
//           const now = dbNow();
//           const board = await client.board.create({
//             data: {
//               title,
//               description,
//               userId: Id,
//               createdAt: now,
//               updatedAt: now
//             }
//           });
//           console.log(board, 'Boardsd');
//           await client.boardHit.create({
//             data: {
//               hit: 0,
//               boardId: board.id
//             }
//           });
//           await client.boardTag.create({
//             data: {
//               boardId: board.id,
//               hashtag: boardtag
//             }
//           });
//           return res.json({
//             ok: true,
//             message: 'create the board',
//             board
//           });
//         } else
//           return res.json({
//             ok: false,
//             message: 'need to login , /api/board/index, post'
//           });
//       }
//     } catch (error) {
//       console.log(error, 'board create error');
//       return res.status(401).json({
//         ok: false,
//         message: error
//       });
//     }
//   }
//   if (req.method === 'GET') {
//     const searchQuery = req.query.search;
//     console.log(req.query, 'board query');
//     try {
//       const boards = await client.board.findMany({
//         where: {
//           ...(searchQuery
//             ? {
//                 title: {
//                   contains: searchQuery.toString()
//                 }
//               }
//             : {})
//         },
//         include: {
//           user: {
//             select: {
//               name: true
//             }
//           },
//           boardHit: {
//             select: {
//               hit: true
//             }
//           },
//           _count: {
//             select: {
//               boardChat: true
//             }
//           }
//         },
//         orderBy: {
//           updatedAt: 'desc'
//         }
//       });
//       return res.json({
//         ok: true,
//         boards
//       });
//     } catch (error) {
//       console.log(error, 'boards get error');
//       return res.status(500).json({
//         ok: false,
//         message: error
//       });
//     }
//   }
// };
// export default Board;
