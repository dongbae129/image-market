import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';

import { NextRequest, NextResponse } from 'next/server';
import { dbNow } from '@libs/server/utils';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const searchQuery = searchParams.get('search');
  const id = searchParams.get('id');

  let lastId: number | null = 0;
  lastId = id ? +id.toString() : null;

  try {
    if (!lastId)
      return NextResponse.json(
        {
          ok: false
        },
        {
          status: 404
        }
      );
    const takeCount = Number(process.env.NEXT_PUBLIC_POST_COUNT);
    const skip = (lastId - 1) * takeCount;
    console.log(lastId, 'lastId');
    const boards = await client.board.findMany({
      take: takeCount,
      skip: skip,
      // skip: lastId ? takeCount * lastId : 0,
      // ...(lastId && { cursor: { id: takeCount * lastId } }),
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
        images: {
          select: {
            image: true
          }
        },
        boardTag: {
          select: {
            hashtag: true
          }
        },
        _count: {
          select: {
            boardChat: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const boardCount = await client.board.count({
      where: {
        ...(searchQuery
          ? {
              title: {
                contains: searchQuery.toString()
              }
            }
          : {})
      }
    });
    return NextResponse.json({
      ok: true,
      boards,
      boardCount
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
