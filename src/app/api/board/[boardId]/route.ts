import client from '@libs/server/client';
import { TokenPayload } from '@libs/server/utils';
import { checkAuth } from '@libs/server/auth';
import { NextRequest, NextResponse } from 'next/server';

export interface PostBoardInfo {
  title: string;
  description: string;
  boardtag: string;
}
type Props = {
  params: {
    boardId: string;
  };
};
export const GET = async (req: NextRequest, { params }: Props) => {
  const { boardId } = params;
  if (!boardId)
    return NextResponse.json(
      {
        ok: false,
        message: 'does not existing the board'
      },
      {
        status: 401
      }
    );
  try {
    const board = await client.board.findUnique({
      where: {
        id: +boardId.toString()
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        boardChat: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        },
        boardHit: {
          select: {
            hit: true
          }
        },
        boardTag: {
          select: {
            hashtag: true
          }
        }
      }
    });
    if (board) {
      await client.boardHit.update({
        where: {
          boardId: board.id
        },
        data: {
          hit: {
            increment: 1
          }
        }
      });
      if (board.boardHit) board.boardHit.hit++;
      return NextResponse.json({
        ok: true,
        board
      });
    } else {
      return NextResponse.json(
        {
          ok: false,
          message: 'fail to find the board'
        },
        {
          status: 401
        }
      );
    }
  } catch (error) {
    console.error(error, 'getBoardDetail Error');
    return NextResponse.json(
      {
        ok: false,
        meesage: error
      },
      {
        status: 500
      }
    );
  }
};
export const POST = async (req: NextRequest, { params }: Props) => {
  const auth = checkAuth();
  if (auth.checkError) {
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
  const { searchParams } = new URL(req.url);
  const paramsObject = Object.fromEntries(searchParams.entries());
  const { title, description, boardtag } = paramsObject;
  const { boardId } = params;

  if (!boardId)
    return NextResponse.json(
      {
        ok: false,
        message: 'does not existing the board'
      },
      {
        status: 401
      }
    );
  try {
    const board = await client.board.findUnique({
      where: {
        id: +boardId.toString()
      }
    });
    console.log(board, 'board find');
    if (board) {
      await client.board.update({
        where: {
          id: board.id
        },
        data: {
          title: title,
          description: description
        }
      });
      const boardTag = await client.boardTag.findUnique({
        where: {
          boardId: board.id
        }
      });
      if (boardTag) {
        await client.boardTag.update({
          where: {
            boardId: board.id
          },
          data: {
            hashtag: boardtag
          }
        });
      } else {
        await client.boardTag.create({
          data: {
            boardId: board.id,
            hashtag: boardtag
          }
        });
      }

      return NextResponse.json({
        ok: true,
        message: 'updated the board',
        board: {
          id: board.id
        }
      });
    } else {
      return NextResponse.json(
        {
          ok: false,
          message: "doesn't have the board"
        },
        {
          status: 401
        }
      );
    }
  } catch (error) {
    console.error(error, 'the baord error');
    return NextResponse.json(
      {
        ok: false,
        error
      },
      {
        status: 500
      }
    );
  }
};
export const DELETE = async (req: NextRequest, { params }: Props) => {
  const { boardId } = params;
  try {
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
    const decodedId = (auth.payload as TokenPayload).id;

    if (!boardId)
      return NextResponse.json(
        {
          ok: false,
          message: 'no boardId'
        },
        {
          status: 404
        }
      );
    const board = await client.board.findUnique({
      where: {
        id: +boardId.toString()
      }
    });
    if (!board)
      return NextResponse.json(
        {
          ok: false,
          message: "doesn't exit the board"
        },
        {
          status: 404
        }
      );
    if (board.userId !== decodedId)
      return NextResponse.json(
        {
          ok: false,
          message: '당신의 게시물이 아닙니다'
        },
        {
          status: 401
        }
      );
    await client.board.delete({
      where: {
        id: +boardId.toString()
      }
    });

    return NextResponse.json({
      ok: true,
      message: 'success delete the board'
    });
  } catch (error) {
    console.error(error, `${boardId} board error`);
    return NextResponse.json(
      {
        ok: false,
        error
      },
      {
        status: 500
      }
    );
  }
};
// const BoardDetail = async (
//   req: NextApiRequest,
//   res: NextApiResponse<ResponseType>
// ) => {
//   if (req.method === 'GET') {
//     const { boardId } = req.query;
//     if (!boardId)
//       return res.status(401).json({
//         ok: false,
//         message: 'does not existing the board'
//       });
//     try {
//       const board = await client.board.findUnique({
//         where: {
//           id: +boardId.toString()
//         },
//         include: {
//           user: {
//             select: {
//               id: true,
//               email: true,
//               name: true
//             }
//           },
//           boardChat: {
//             include: {
//               user: {
//                 select: {
//                   name: true,
//                   image: true
//                 }
//               }
//             }
//           },
//           boardHit: {
//             select: {
//               hit: true
//             }
//           },
//           boardTag: {
//             select: {
//               hashtag: true
//             }
//           }
//         }
//       });
//       if (board) {
//         await client.boardHit.update({
//           where: {
//             boardId: board.id
//           },
//           data: {
//             hit: {
//               increment: 1
//             }
//           }
//         });
//         if (board.boardHit) board.boardHit.hit++;
//         return res.json({
//           ok: true,
//           board
//         });
//       } else {
//         return res.status(401).json({
//           ok: false,
//           message: 'fail to find the board'
//         });
//       }
//     } catch (error) {
//       console.error(error, 'getBoardDetail Error');
//       return res.status(500).json({
//         ok: false,
//         meesage: error
//       });
//     }
//   } else if (req.method === 'POST') {
//     const auth = checkAuth(req, res, 0);
//     if (auth.checkError) {
//       return res.status(401).json({
//         ok: false,
//         auth
//       });
//     }
//     const { title, description, boardtag }: PostBoardInfo = req.body;
//     const { boardId } = req.query;
//     console.log(title, description, boardtag, boardId, 'Board update');

//     if (!boardId)
//       return res.status(401).json({
//         ok: false,
//         message: 'does not existing the board'
//       });
//     try {
//       const board = await client.board.findUnique({
//         where: {
//           id: +boardId.toString()
//         }
//       });
//       console.log(board, 'board find');
//       if (board) {
//         await client.board.update({
//           where: {
//             id: board.id
//           },
//           data: {
//             title: title,
//             description: description
//           }
//         });
//         const boardTag = await client.boardTag.findUnique({
//           where: {
//             boardId: board.id
//           }
//         });
//         if (boardTag) {
//           await client.boardTag.update({
//             where: {
//               boardId: board.id
//             },
//             data: {
//               hashtag: boardtag
//             }
//           });
//         } else {
//           await client.boardTag.create({
//             data: {
//               boardId: board.id,
//               hashtag: boardtag
//             }
//           });
//         }

//         return res.json({
//           ok: true,
//           message: 'updated the board',
//           board: {
//             id: board.id
//           }
//         });
//       } else {
//         return res.status(401).json({
//           ok: false,
//           message: "doesn't have the board"
//         });
//       }
//     } catch (error) {
//       console.error(error, 'the baord error');
//       return res.status(500).json({
//         ok: false,
//         error
//       });
//     }
//   } else if (req.method === 'DELETE') {
//     const { boardId } = req.query;
//     try {
//       const auth = checkAuth(req, res, 0);
//       console.log(auth, 'auth');

//       if (auth?.checkError)
//         return res.status(401).json({
//           ok: false,
//           auth
//         });
//       const decodedId = (auth.payload as TokenPayload).id;

//       if (!boardId)
//         return res.status(404).json({
//           ok: false,
//           message: 'no boardId'
//         });
//       const board = await client.board.findUnique({
//         where: {
//           id: +boardId.toString()
//         }
//       });
//       if (!board)
//         return res.status(404).json({
//           ok: false,
//           message: "doesn't exit the board"
//         });
//       if (board.userId !== decodedId)
//         return res.status(401).json({
//           ok: false,
//           message: '당신의 게시물이 아닙니다'
//         });
//       await client.board.delete({
//         where: {
//           id: +boardId.toString()
//         }
//       });

//       return res.json({
//         ok: true,
//         message: 'success delete the board'
//       });
//     } catch (error) {
//       console.error(error, `${boardId} board error`);
//       return res.status(500).json({
//         ok: false,
//         error
//       });
//     }
//   }
// };
// export default BoardDetail;
