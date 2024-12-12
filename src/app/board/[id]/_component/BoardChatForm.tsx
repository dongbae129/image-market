import React from 'react';
import NextImage from 'next/image';
import Editor from '@components/editor';
import { getFetch, newAxios } from '@libs/client/fetcher';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Chat, User } from '@prisma/client';
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
export interface boardChat {
  chat: string;
}
interface BoardUser {
  ok: boolean;
  user: User;
}
type Props = {
  boardId: string;
};
function BoardChatForm({ boardId }: Props) {
  const chatting = (data: boardChat) =>
    newAxios.post(`/api/chat/board/${boardId}`, data).then((res) => res.data);
  const { mutate, isPending } = useMutation<UploadChatResponse, any, boardChat>(
    {
      mutationFn: chatting,

      onError: (error) => {
        console.error(error);
      },
      onSuccess: (res) => {
        console.log(res, 'RES');
        refetch();
      }
    }
  );
  const { data: userInfo } = useQuery<BoardUser>({ queryKey: ['userInfo'] });
  const { refetch } = useQuery<UploadChatResponse>({
    queryKey: ['getChats'],
    queryFn: getFetch(`/api/chat/board/${boardId}`),

    enabled: !!boardId
  });
  return (
    <>
      <div className="chatformwrap">
        <div className="chatform">
          <div className="userimage">
            <NextImage
              src="/localimages/emptyuser.png"
              layout="fill"
              alt="userImage"
            />
          </div>
          <div className="chatinput">
            <div
              style={{
                minHeight: '200px',
                height: '200px',
                position: 'relative'
              }}
            >
              <Editor
                mutate={mutate}
                isLoading={isPending}
                btntrue={true}
                btnActive={userInfo?.user ? false : true}
                chatValue={''}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .chatformwrap {
          display: flex;
          justify-content: center;
          border: 1px solid rgba(0, 0, 0, 0.16);
          border-radius: 0.5rem;
          margin-top: 4rem;
          margin-bottom: 4rem;
          padding: 1rem;
        }
        .chatform {
          display: flex;
          width: 80%;
          margin-top: 2rem;
        }
        .userimage {
          width: 50px;
          min-width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 5px;
          overflow: hidden;
          position: relative;
        }
        .chatinput {
          position: relative;
          width: 80%;
          display: flex;
          flex-direction: column;
          > div:first-child {
            min-height: 200px;
            height: 200px;
            position: relative;
          }
        }
      `}</style>
    </>
  );
}

export default BoardChatForm;
