'use client';
import { newAxios } from '@libs/client/fetcher';
import { Chat } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProductDetailType } from './ProductInfo';

interface ChatFormValues {
  chat: string;
  chatErrors?: string;
}
interface ChatMutate {
  ok: boolean;
  message: string;
  chat: CommentWithUser;
}
interface CommentWithUser extends Chat {
  user: { name: string };
}
type ProductChatFormProps = { data: ProductDetailType | undefined };

function ProductChatForm({ data }: ProductChatFormProps) {
  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors }
  } = useForm<ChatFormValues>();
  const queryClient = useQueryClient();
  const chatSend = ({ chat }: ChatFormValues) =>
    newAxios
      .post(`/api/chat/product/${data?.product.id}`, { description: chat })
      .then((res) => res.data);
  const { mutate, isPending } = useMutation<ChatMutate, Error, ChatFormValues>({
    mutationFn: chatSend,
    onSuccess: async (res) => {
      if (!res.ok && res.message === 'need to any chat') {
        setError('chatErrors', { message: '댓글 내용을 입력해 주세요.' });
        return;
      }
      if (!res.ok && res.message === 'need to login for chat') {
        setError('chatErrors', { message: '로그인이 필요합니다.' });
        return;
      }
      reset({ chat: '' });
      await queryClient.invalidateQueries({
        queryKey: ['getChats', data?.product.id]
      });
      queryClient.setQueryData<ProductDetailType>(
        ['product', String(data?.product.id)],
        (current) =>
          current
            ? {
                ...current,
                product: {
                  ...current.product,
                  commentsCount: (current.product.commentsCount ?? 0) + 1
                }
              }
            : current
      );
    }
  });
  const onValid = ({ chat }: ChatFormValues) => {
    if (isPending) return;
    if (!chat.trim())
      return setError('chatErrors', { message: '댓글 내용을 입력해 주세요.' });
    mutate({ chat: chat.trim() });
  };

  return (
    <div className="chatregister">
      <form onSubmit={handleSubmit(onValid)}>
        <input
          aria-label="댓글 입력"
          placeholder="따뜻한 댓글을 남겨보세요"
          {...register('chat')}
        />
        <button type="submit" disabled={isPending}>
          {isPending ? '등록 중' : '등록'}
        </button>
        {errors.chatErrors?.message && (
          <p className="comment-error" role="alert">
            {errors.chatErrors.message}
          </p>
        )}
      </form>
    </div>
  );
}

export default ProductChatForm;
