import Button from '@components/button';
import TextArea from '@components/textarea';
import { newAxios } from '@libs/client/fetcher';
import { Chat } from '@prisma/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { ProductDetailType } from './ProductInfo';
interface ChatForm {
  chat: string;
  chatErrors?: string;
  checkAuth?: boolean;
}
interface ChatMutate {
  ok: boolean;
  message: string;
  chat: CommentWithUser;
}
interface CommentWithUser extends Chat {
  user: {
    name: string;
  };
}
type ProductChatFormProps = {
  data: ProductDetailType;
};
function ProductChatForm({ data }: ProductChatFormProps) {
  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors }
  } = useForm<ChatForm>();

  const queryClient = useQueryClient();

  const chatSend = (chat: ChatForm) =>
    newAxios
      .post(`/api/chat/product/${data?.product.id}`, chat)
      .then((res) => res.data);

  const { mutate, isLoading: mutateLoading } = useMutation<
    ChatMutate,
    any,
    ChatForm
  >(chatSend, {
    onSuccess: async (res, chat) => {
      if (!res.ok && res.message === 'need to any chat') {
        alert('빈글을 작성할수 없습니다');
        return;
      }
      if (!res.ok && res.message === 'need to login for chat') {
        alert('로그인이 필요합니다');
        return;
      }
      reset({ chat: '' });
      //   setChatOpen(true);
      await queryClient.cancelQueries(['getChats', data?.product.id]);
      const prevChats = queryClient.getQueryData([
        'getChats',
        data?.product.id
      ]);
      await queryClient.setQueryData(
        ['getChats', data?.product.id],
        (prev: any) => {
          return {
            ...prev,
            comments: prev.comments.concat({
              description: res.chat?.description,
              id: res.chat?.id,
              user: {
                name: res.chat?.user.name
              }
            })
          };
        }
      );
      return {
        prevChats
      };
    }
  });
  const onValid = ({ chat }: ChatForm) => {
    if (mutateLoading) return;
    if (!chat) return setError('chatErrors', { message: 'input anything' });
    mutate({ chat });
  };
  return (
    <>
      <div className="chatregister">
        <form onSubmit={handleSubmit(onValid)}>
          <div>
            <div className="chatuserimage_outer">
              <div className="chatuserimage"></div>
            </div>
            <div className="chat-textareawrap">
              <TextArea
                className="autoTextarea"
                // onKeyDown={autoResizeTextarea}
                // onKeyUp={autoResizeTextarea}
                name="chat"
                register={register('chat')}
              ></TextArea>
            </div>
          </div>
          <div className="registerbtn_wrap">
            <div className="registerbtn_div">
              <Button
                className="registerbtn"
                isLoading={mutateLoading}
                text="작성"
              />
            </div>
          </div>
          <div className="errormsg">{errors.chatErrors?.message}</div>
        </form>
      </div>
      <style jsx>{`
        $img_inner: 32px;
        $img_outer: 50px;
        $userimg-out_mgr: 8px;
        .chatuserimage_outer {
          width: $img_outer;
          height: $img_outer;
          margin-right: 8px;
        }
        .chatuserimage {
          background: url(/localimages/emptyuser.png) center no-repeat;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          background-size: cover;
          margin-right: 5px;
        }
        .chat-textareawrap {
          width: calc(100% - (#{$img_outer} + #{$userimg-out_mgr}));
        }
        .registerbtn_wrap {
          display: flex;
          justify-content: end;
          margin-top: 0.5rem;

          .registerbtn_div {
            width: 100px;
          }
        }
        .chatregister {
          position: relative;
          width: 100%;
          min-height: 60px;
          display: flex;

          margin-top: 15px;

          form {
            width: 100%;
            height: 100%;

            > div:first-child {
              display: flex;
              position: relative;
              height: auto;
            }
          }
        }
        .errormsg {
          color: red;
        }
      `}</style>
    </>
  );
}

export default ProductChatForm;
