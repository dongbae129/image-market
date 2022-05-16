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
interface chatWithUser extends Chat {
  user: {
    name: string;
  };
}
interface UploadChatResponse {
  ok: boolean;
  comments: chatWithUser[];
  error?: string;
  message?: string;
}
const BoardDetail: NextPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { register, handleSubmit } = useForm<boardChat>();
  const onValid = ({ chat }: boardChat) => {
    if (isLoading) return;
    console.log(chat, '!!@@');
    mutate({ chat });
  };

  const { data, refetch } = useQuery<UploadChatResponse>(
    ['getChats'],
    getFetch(`/api/chat/${router.query.boardId}`),
    {
      enabled: !!router.query.boardId
    }
  );
  const chatting = (data: boardChat) =>
    axios
      .post(`/api/chat/${router.query.boardId}`, data)
      .then((res) => res.data);
  const { mutate, isLoading } = useMutation<UploadChatResponse, any, boardChat>(
    chatting,
    {
      onError: (error) => {
        console.error(error);
      },
      onSuccess: (res) => {
        console.log(res, 'RES');
        refetch();
        // queryClient.setQueryData(['getChats'], (prev: any) => ({
        //   ...prev,
        //   comments: res.comments
        // }));
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
          required
          register={register('chat', { required: true })}
        />
        <Button isLoading={isLoading} text="등록" />
      </form>
      <div
        style={{
          width: '500px',
          margin: '0 auto'
        }}
      >
        {data?.comments.map((comment) => (
          <div key={comment.id} style={{ borderBottom: '1px solid black' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: '20px' }}>img</div>
              <span>{comment.user.name}</span>
            </div>
            {comment.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardDetail;
