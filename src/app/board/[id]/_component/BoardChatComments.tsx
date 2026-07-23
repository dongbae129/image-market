import React from 'react';
import { timeForToday } from '@libs/client/timeForToday';
import sanitizeHtml from 'sanitize-html';

import { useQuery } from '@tanstack/react-query';
import { getFetch } from '@libs/client/fetcher';
import { Chat } from '@prisma/client';
interface chatWithUser extends Chat {
  user: {
    name: string;
  };
}
export interface UploadChatResponse {
  ok: boolean;
  comments: chatWithUser[];
  error?: string;
  message?: string;
}
type Props = {
  boardId: string;
};
function BoardChatComments({ boardId }: Props) {
  const { data } = useQuery<UploadChatResponse>({
    queryKey: ['getChats'],
    queryFn: getFetch(`/api/chat/board/${boardId}`),

    enabled: !!boardId
  });
  return (
    <div>
      {data?.comments.map((comment) => (
        <div key={comment.id} className="comment_list" role="listitem">
          <div>
            <div className="userimage">
              <img src="/localimages/emptyuser.png" alt="userimage" />
            </div>
            <div>
              <div className="comment_list_name">{comment.user.name}</div>

              <span className="comment_time">
                {timeForToday(
                  comment.createdAt
                    .toString()
                    .slice(0, comment.createdAt.toString().indexOf('.'))
                )}
              </span>
            </div>
          </div>
          {typeof window && (
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(comment.description)
              }}
            />
          )}
        </div>
      ))}
      <style jsx>{`
        .userimage {
          width: 50px;
          min-width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 5px;
          overflow: hidden;
          position: relative;

          img {
            width: 100%;
            height: 100%;
          }
        }
        .comment_list {
          border-bottom: 1px solid rgba(0, 0, 0, 0.16);
          padding-top: 1rem;
          padding-bottom: 1rem;

          > div:first-child {
            display: flex;
          }
        }
        .comment_list_name {
          font-weight: bold;
        }
        .comment_time {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}

export default BoardChatComments;
