import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Input from '@components/input';
import { useForm } from 'react-hook-form';
import Button from '@components/button';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { getFetch } from '@libs/client/fetcher';
import { Board, Chat, User } from '@prisma/client';

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
interface boardDetailResponse {
  ok: boolean;
  board: Board & {
    user: User;
  };
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
  const { boardId } = router.query;

  const { data: boardDetail } = useQuery<boardDetailResponse>(
    ['getBoard'],
    getFetch(`/api/board/${boardId}`),
    {
      enabled: !!boardId
    }
  );
  const { data, refetch } = useQuery<UploadChatResponse>(
    ['getChats'],
    getFetch(`/api/chat/${boardId}`),
    {
      enabled: !!boardId
    }
  );
  const chatting = (data: boardChat) =>
    axios.post(`/api/chat/${boardId}`, data).then((res) => res.data);
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
      <h2>제목: {boardDetail?.board.title}</h2>
      <h3>
        <span>email: {boardDetail?.board.user.email}</span>
        <br />
        <span>name: {boardDetail?.board.user.name}</span>
      </h3>
      <main>
        <div>내용: {boardDetail?.board.description}</div>
      </main>

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
