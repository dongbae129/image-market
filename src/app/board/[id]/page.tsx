'use client';
import { useQuery } from '@tanstack/react-query';
import { getFetch } from '@libs/client/fetcher';
import { Chat } from '@prisma/client';

import BoardUserInfo from './_component/BoardUserInfo';
import BoardDetailInfo from './_component/BoardDetailInfo';
import BoardChatForm from './_component/BoardChatForm';
import BoardChatComments from './_component/BoardChatComments';

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
  params: {
    id: string;
  };
};
const BoardDetail = ({ params }: Props) => {
  const boardId = params.id;
  console.log(boardId, 'boardId');
  const { data } = useQuery<UploadChatResponse>({
    queryKey: ['getChats'],
    queryFn: getFetch(`/api/chat/board/${boardId}`),

    enabled: !!boardId
  });

  return (
    <div className="articlewrap">
      <div className="infoline">
        <span>게시판</span>
      </div>
      <div>
        <BoardUserInfo boardId={boardId} />

        <BoardDetailInfo boardId={boardId} />

        <div className="infoline">
          <span></span>
        </div>
        <h3>{data?.comments.length}개의 댓글</h3>
        <BoardChatForm boardId={boardId} />
        <BoardChatComments boardId={boardId} />
      </div>
      <style jsx>
        {`
          .articlewrap {
            margin: auto;
            width: 50vw;
          }
          .infoline {
            display: flex;
            justify-content: center;
            margin-top: 1.75rem;
            position: relative;
            > span {
              background-color: white;
              color: rgba(0, 0, 0, 0.45);
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              font-weight: 600;
            }
            > span::before {
              content: '';
              position: absolute;

              z-index: -1;
              width: 100%;
              top: 50%;
              left: 0;
              border-top: 1px solid rgba(0, 0, 0, 0.16);
            }
          }

          .chatinput_btn {
            display: flex;
            justify-content: flex-end;
            margin-top: 0.8rem;

            > div {
              width: 15%;
              min-width: 90px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BoardDetail;
