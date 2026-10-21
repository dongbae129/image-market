import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';

import { NextRequest, NextResponse } from 'next/server';
import { dbNow } from '@libs/server/utils';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { getPostsQuerySchema } from '@app/board/types/board';

export async function GET(request: NextRequest) {
  const pageLlimit = 7;
  try {
    const { searchParams } = new URL(request.url);
    const parseResult = getPostsQuerySchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: pageLlimit
    });

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: parseResult.error.flatten()
        },
        { status: 400 }
      );
    }

    const { page, limit } = parseResult.data;
    const skip = (page - 1) * limit;

    // $transaction을 통해 데이터 목록 조회와 총 개수 조회를 일관성 있게 병렬 처리
    const [totalItems, boards] = await client.$transaction([
      client.board.count(),
      client.board.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true
            }
          },
          images: {
            select: {
              image: true
            }
          },
          boardTag: {
            select: {
              hashtag: true
            }
          }
        }
      })
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      boards,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalPages === 0 ? 1 : totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('[GET /api/posts Error]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
// export const GET = async (req: NextRequest) => {
//   const searchParams = req.nextUrl.searchParams;
//   const searchQuery = searchParams.get('search');
//   const id = searchParams.get('id');

//   let lastId: number | null = 0;
//   lastId = id ? +id.toString() : null;

//   try {
//     if (!lastId)
//       return NextResponse.json(
//         {
//           ok: false
//         },
//         {
//           status: 404
//         }
//       );
//     const takeCount = Number(process.env.NEXT_PUBLIC_POST_COUNT);
//     const skip = (lastId - 1) * takeCount;
//     console.log(lastId, 'lastId');
//     const boards = await client.board.findMany({
//       take: takeCount,
//       skip: skip,
//       // skip: lastId ? takeCount * lastId : 0,
//       // ...(lastId && { cursor: { id: takeCount * lastId } }),
//       where: {
//         ...(searchQuery
//           ? {
//               title: {
//                 contains: searchQuery.toString()
//               }
//             }
//           : {})
//       },
//       include: {
//         user: {
//           select: {
//             name: true
//           }
//         },
//         boardHit: {
//           select: {
//             hit: true
//           }
//         },
//         images: {
//           select: {
//             image: true
//           }
//         },
//         boardTag: {
//           select: {
//             hashtag: true
//           }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });

//     const boardCount = await client.board.count({
//       where: {
//         ...(searchQuery
//           ? {
//               title: {
//                 contains: searchQuery.toString()
//               }
//             }
//           : {})
//       }
//     });
//     return NextResponse.json({
//       ok: true,
//       boards,
//       boardCount
//     });
//   } catch (error) {
//     console.log(error, 'boards get error');
//     return NextResponse.json(
//       {
//         ok: false,
//         message: error
//       },
//       {
//         status: 500
//       }
//     );
//   }
// };
export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const auth = checkAuth();

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
    if (auth.userId) {
      const userId = Number(auth.userId);

      const { title, description, hashtags: boardtag, category } = body;
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
      const now = dbNow();
      const result = await client.$transaction(async (tx) => {
        const board = await tx.board
          .create({
            data: {
              title,
              description,
              userId,
              category,
              createdAt: now,
              updatedAt: now
            }
          })
          .catch((error) => {
            throw new Error(`BOARD CREATE FAIL | ${error.message}`, {
              cause: error
            });
          });
        await Promise.all([
          tx.boardHit
            .create({
              data: {
                hit: 0,
                boardId: board.id
              }
            })
            .catch((error) => {
              throw new Error(`BOARDHIT FAIL | ${error.message}`, {
                cause: error
              });
            }),
          tx.boardTag
            .create({
              data: {
                boardId: board.id,
                hashtag: boardtag
              }
            })
            .catch((error) => {
              throw new Error(`BOARDTAG FAIL | ${error.message}`, {
                cause: error
              });
            })
        ]);

        const boardImageIds = await Promise.all(
          body.urls.map(async (v: { url: string }) => {
            const boardImageId = await tx.boardImage
              .create({
                data: {
                  boardId: board.id,
                  image: v.url,
                  status: 'PROCESSING'
                },
                select: {
                  id: true
                }
              })
              .catch((error) => {
                throw new Error(`BOARDIMAGE FAIL | ${error.message}`, {
                  cause: error
                });
              });
            return {
              boardImageId,
              tempUrl: `temp/${v.url}`
            };
          })
        );
        return { board, boardImageIds };
      });
      const { board, boardImageIds } = result;
      const sqs = new SQSClient({ region: process.env.AWS_REGION });
      const s3Payloads = {
        feenId: board.id,
        tempKeys: boardImageIds,
        tableType: 'BOARD'
      };
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: process.env.AWS_SQS_QUEUE_URL!,
          MessageBody: JSON.stringify(s3Payloads)
        })
      );
      return NextResponse.json({
        ok: true,
        message: 'create the board',
        id: board.id
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    }

    return NextResponse.json(
      {
        ok: false,
        message: (error as Error).message
      },
      {
        status: 500
      }
    );
  }
};
