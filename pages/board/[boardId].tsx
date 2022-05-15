import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Input from '@components/input';
import { useForm } from 'react-hook-form';
import Button from '@components/button';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { getFetch } from '@libs/client/fetcher';
import { Chat } from '@prisma/client';

interface boardChat {
  chat: string;
}
interface UploadChatResponse {
  ok: boolean;
  chat: Chat[];
  error?: string;
  message?: string;
}
const BoardDetail: NextPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit } = useForm<boardChat>();
  const onValid = ({ chat }: boardChat) => {
    if (isLoading) return;
    mutate({ chat });
  };
  const { data } = useQuery<UploadChatResponse>(
    ['getChats'],
    getFetch('/api/chat')
  );
  const chatting = (data: boardChat) =>
    axios.post('/api/chat', data).then((res) => res.data);
  const { mutate, isLoading } = useMutation<UploadChatResponse, any, boardChat>(
    chatting,
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: (res) => {
        console.log(res, 'RES');
        queryClient.setQueryData(['getChats'], (prev: any) => ({
          ...prev,
          chat: prev.chat.concat(res.chat)
        }));
      }
    }
  );
  return (
    <div>
      {router.query.boardId}
      <form onSubmit={handleSubmit(onValid)}>
        <Input
          name="chat"
          label="chat"
          type="text"
          register={register('chat', { required: true })}
        />
        <Button isLoading={isLoading} text="등록" />
      </form>
      <div>
        {data?.chat.map((boardchat) => (
          <div key={boardchat.id}>
            <div>
              <div>img</div>
              <span>user정보</span>
            </div>
            {boardchat.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardDetail;
