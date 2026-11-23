import client from '@libs/server/client';
import { checkAuth } from '@libs/server/auth';
import { NextRequest, NextResponse } from 'next/server';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import {
  createStorageCleanupJob,
  dispatchStorageCleanupJob
} from '@libs/server/storageCleanup';
import { dispatchBoardDeletion } from '@libs/server/boardDeletion';

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
  console.log(boardId, 'boardId');
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
    const board = await client.$transaction(async (tx) => {
      const updated = await tx.board.updateMany({
        where: {
          id: +boardId,
          deletionStatus: 'ACTIVE'
        },
        data: {
          viewCount: {
            increment: 1
          }
        }
      });
      if (!updated.count) return null;
      const updatedBoard = await tx.board.findFirst({
        where: { id: +boardId, deletionStatus: 'ACTIVE' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true
            }
          },
          images: {
            select: {
              id: true,
              image: true,
              dominantColor: true,
              status: true
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
          boardTag: {
            select: {
              hashtag: true
            }
          }
        }
      });
      return updatedBoard;
    });
    if (!board)
      return NextResponse.json(
        { ok: false, message: 'Board not found' },
        { status: 404 }
      );
    return NextResponse.json({
      board
    });
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
export const PUT = async (req: NextRequest, { params }: Props) => {
  const auth = checkAuth();
  if (auth.checkError || !auth.userId) {
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
  const { boardId } = params;
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: 'invalid request body' },
      { status: 400 }
    );
  }
  const { title, description, boardtag, imageKeys, removedImageIds } = body;

  if (
    !boardId ||
    typeof title !== 'string' ||
    !title.trim() ||
    typeof description !== 'string' ||
    !description.trim() ||
    typeof boardtag !== 'string' ||
    (imageKeys !== undefined &&
      (!Array.isArray(imageKeys) ||
        imageKeys.length > 3 ||
        imageKeys.some(
          (key: unknown) =>
            typeof key !== 'string' ||
            !key.startsWith('temp/') ||
            !key.slice('temp/'.length) ||
            key.slice('temp/'.length).includes('/') ||
            key.slice('temp/'.length).includes('\\')
        ))) ||
    (removedImageIds !== undefined &&
      (!Array.isArray(removedImageIds) ||
        removedImageIds.length > 3 ||
        new Set(removedImageIds).size !== removedImageIds.length ||
        removedImageIds.some(
          (id: unknown) => !Number.isInteger(id) || Number(id) <= 0
        )))
  )
    return NextResponse.json(
      {
        ok: false,
        message: 'invalid board information'
      },
      {
        status: 400
      }
    );
  const replacementImageKeys = imageKeys as string[] | undefined;
  const requestedRemovedImageIds = removedImageIds as number[] | undefined;
  try {
    let storageCleanupDispatchFailed = false;
    const boardIdNumber = Number(boardId);
    if (!Number.isInteger(boardIdNumber) || boardIdNumber <= 0)
      return NextResponse.json(
        {
          ok: false,
          message: 'invalid boardId'
        },
        {
          status: 400
        }
      );
    const board = await client.board.findUnique({
      where: { id: boardIdNumber },
      select: {
        id: true,
        userId: true,
        title: true,
        description: true,
        boardTag: { select: { hashtag: true } },
        deletionStatus: true,
        images: { select: { id: true, image: true } }
      }
    });
    if (!board)
      return NextResponse.json(
        { ok: false, message: "doesn't have the board" },
        { status: 404 }
      );
    if (board.userId !== Number(auth.userId))
      return NextResponse.json(
        { ok: false, message: '당신의 게시물이 아닙니다' },
        { status: 403 }
      );
    if (board.deletionStatus !== 'ACTIVE')
      return NextResponse.json(
        { ok: false, message: '삭제 처리 중인 게시글은 수정할 수 없습니다.' },
        { status: 409 }
      );

    if (
      requestedRemovedImageIds?.some(
        (imageId) => !board.images.some((image) => image.id === imageId)
      )
    )
      return NextResponse.json(
        { ok: false, message: 'invalid board image' },
        { status: 400 }
      );

    const resultingImageCount =
      board.images.length -
      (requestedRemovedImageIds?.length ?? 0) +
      (replacementImageKeys?.length ?? 0);
    if (resultingImageCount > 3)
      return NextResponse.json(
        { ok: false, message: '게시글 이미지는 최대 3장까지 가능합니다' },
        { status: 400 }
      );

    const newImages = replacementImageKeys?.length
      ? await client.$transaction(async (tx) => {
          await tx.board.update({
            where: { id: board.id },
            data: { title: title.trim(), description }
          });
          await tx.boardTag.upsert({
            where: { boardId: board.id },
            create: { boardId: board.id, hashtag: boardtag },
            update: { hashtag: boardtag }
          });
          return Promise.all(
            replacementImageKeys.map((key) =>
              tx.boardImage.create({
                data: {
                  boardId: board.id,
                  image: key.slice('temp/'.length),
                  status: 'PROCESSING'
                },
                select: { id: true }
              })
            )
          );
        })
      : undefined;

    if (!replacementImageKeys?.length) {
      const cleanupJob = await client.$transaction(async (tx) => {
        await tx.board.update({
          where: { id: board.id },
          data: { title: title.trim(), description }
        });
        await tx.boardTag.upsert({
          where: { boardId: board.id },
          create: { boardId: board.id, hashtag: boardtag },
          update: { hashtag: boardtag }
        });
        if (requestedRemovedImageIds?.length) {
          const removedImages = board.images.filter((image) =>
            requestedRemovedImageIds.includes(image.id)
          );
          await tx.boardImage.deleteMany({
            where: {
              boardId: board.id,
              id: { in: requestedRemovedImageIds }
            }
          });
          return createStorageCleanupJob(tx, {
            baseKeys: removedImages.map((image) => image.image),
            temporaryKeys: []
          });
        }
        return null;
      });
      if (cleanupJob)
        storageCleanupDispatchFailed = !(await dispatchStorageCleanupJob(
          cleanupJob.id
        ));
    }

    if (newImages?.length) {
      const sqs = new SQSClient({ region: process.env.AWS_REGION });
      try {
        await sqs.send(
          new SendMessageCommand({
            QueueUrl: process.env.AWS_SQS_QUEUE_URL!,
            MessageBody: JSON.stringify({
              feenId: board.id,
              tempKeys: newImages.map((image, index) => ({
                boardImageId: { id: image.id },
                tempUrl: replacementImageKeys![index]
              })),
              tableType: 'BOARD'
            })
          })
        );
      } catch (error) {
        const cleanupJob = await client.$transaction(async (tx) => {
          await tx.boardImage.deleteMany({
            where: { id: { in: newImages.map((image) => image.id) } }
          });
          await tx.board.update({
            where: { id: board.id },
            data: {
              title: board.title,
              description: board.description
            }
          });
          if (board.boardTag) {
            await tx.boardTag.upsert({
              where: { boardId: board.id },
              create: {
                boardId: board.id,
                hashtag: board.boardTag.hashtag
              },
              update: { hashtag: board.boardTag.hashtag }
            });
          } else {
            await tx.boardTag.deleteMany({ where: { boardId: board.id } });
          }
          return createStorageCleanupJob(tx, {
            baseKeys: [],
            temporaryKeys: replacementImageKeys ?? []
          });
        });
        if (cleanupJob) await dispatchStorageCleanupJob(cleanupJob.id);
        throw error;
      }
      if (requestedRemovedImageIds?.length) {
        const cleanupJob = await client.$transaction(async (tx) => {
          const removedImages = board.images.filter((image) =>
            requestedRemovedImageIds.includes(image.id)
          );
          await tx.boardImage.deleteMany({
            where: {
              boardId: board.id,
              id: { in: requestedRemovedImageIds }
            }
          });
          return createStorageCleanupJob(tx, {
            baseKeys: removedImages.map((image) => image.image),
            temporaryKeys: []
          });
        });
        if (cleanupJob)
          storageCleanupDispatchFailed = !(await dispatchStorageCleanupJob(
            cleanupJob.id
          ));
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'updated the board',
      board: { id: board.id },
      storageCleanupDispatchFailed
    });
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

    if (auth?.checkError || !auth.userId)
      return NextResponse.json(
        {
          ok: false,
          auth
        },
        {
          status: 401
        }
      );
    const decodedId = Number(auth.userId);

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
    const boardIdNumber = Number(boardId);
    if (!Number.isInteger(boardIdNumber) || boardIdNumber <= 0)
      return NextResponse.json(
        { ok: false, message: 'invalid boardId' },
        { status: 400 }
      );
    const board = await client.board.findUnique({
      where: {
        id: boardIdNumber
      },
      select: {
        id: true,
        userId: true,
        deletionStatus: true
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
          status: 403
        }
      );
    const dispatch = await dispatchBoardDeletion(board);

    return NextResponse.json({
      ok: true,
      deletionStatus: dispatch.status,
      message:
        dispatch.status === 'DELETE_FAILED'
          ? '삭제 요청은 보관됐지만 이미지 정리 요청 전송에 실패했습니다.'
          : '게시글 삭제 요청을 접수했습니다.'
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
