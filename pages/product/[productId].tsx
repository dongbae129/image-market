import type { NextPage } from 'next';
// import styles from '@styles/ProductDetail.module.scss';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Image from 'next/image';
import { Chat, Product, User } from '@prisma/client';
import { getFetch, postFetch } from '@libs/client/fetcher';
import { useForm } from 'react-hook-form';

import TextArea from '@components/textarea';
import Button from '@components/button';
interface OnlyemailUser {
  user: {
    email: string;
    name: string;
  };
}
interface ChatForm {
  chat: string;
  chatErrors?: string;
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
interface ChatResponse {
  ok: boolean;
  comments: CommentWithUser[];
}
interface ProductDetail {
  product: Product & OnlyemailUser;
}
const ProductDetail: NextPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    setError,
    reset,
    formState: { errors },
    watch
  } = useForm<ChatForm>();
  const watchFiled = watch('chat');
  const { productId } = router.query;

  const getProduct = () =>
    axios.get(`/api/product/${productId}`).then((res) => res.data);
  const { data, isLoading } = useQuery<ProductDetail>(
    ['getProduct'],
    getProduct,
    {
      enabled: !!productId
    }
  );
  const chatSend = (chat: ChatForm) =>
    axios.post(`/api/chat/${data?.product.id}`, chat).then((res) => res.data);
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
      await queryClient.cancelQueries(['getChats', data?.product.id]);
      const prevChats = queryClient.getQueryData<ChatResponse>([
        'getChats',
        data?.product.id
      ]);
      await queryClient.setQueryData(
        ['getChats', data?.product.id],
        (prev: any) => {
          console.log(prev, 'prev');
          console.log(res.chat, 'res.chat');
          return {
            ...prev,
            comments: prev.comments.concat({
              description: res.chat.description,
              id: res.chat.id,
              user: {
                name: res.chat.user.name
              }
            })
          };
        }
      );
      console.log(
        queryClient.getQueryData<ChatResponse>(['getChats', data?.product.id]),
        'test'
      );
      return {
        prevChats
      };
    }
  });
  const { data: chats, isLoading: chatLoading } = useQuery<ChatResponse>(
    ['getChats', data?.product.id],
    getFetch(`/api/chat/${data?.product.id}`),
    {
      enabled: !!data?.product.id
    }
  );

  if (watchFiled) {
    errors.chatErrors?.message ? reset({ chatErrors: '' }) : null;
  }
  const onValid = ({ chat }: ChatForm) => {
    if (mutateLoading) return;
    console.log(chat, 'ccc');
    if (!chat) return setError('chatErrors', { message: 'input anything' });
    mutate({ chat });
  };
  const autoResizeTextarea = () => {
    const textarea =
      document.querySelector<HTMLTextAreaElement>('.autoTextarea');

    if (textarea) {
      textarea.style.height = 'auto';
      const height = textarea.scrollHeight; // 높이
      textarea.style.height = `${height + 8}px`;
    }
  };

  if (isLoading) return <div>Loading Data....</div>;
  return (
    <div>
      <div className="productWrap">
        <div className="productInfo">
          <div className="imagewrap">
            {data?.product && (
              <Image
                src={`/uploads/${data?.product.image}`}
                width={400}
                height={400}
                layout="responsive"
                alt=""
              />
            )}
          </div>
        </div>
        <div className="spring-wrap">
          {Array(7)
            .fill(0)
            .map((v, i) => (
              <div key={i} className="spring">
                <div></div>
                <div></div>
              </div>
            ))}
        </div>
        <div className="userInfo">
          <div>
            <div className="userimage">{/* <img src="" alt="" /> */}</div>
            <div className="useremail">{data?.product?.user?.email}</div>
            <button>다운로드</button>
          </div>
          <div>
            <ul>
              <li>화소 free, pay</li>
              <li>화소 free, pay</li>
              <li>화소 free, pay</li>
            </ul>
          </div>
          {chats?.comments.map((comment) => (
            <div key={comment?.id} className="chatWrap">
              <div className="chatInfo">
                <div>
                  <div className="chatuserimage"></div>
                  <div className="chatuserInfo">
                    <div className="chatusername">{comment?.user?.name}</div>
                    <div className="userchat">{comment?.description}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="chatregister">
            <form onSubmit={handleSubmit(onValid)}>
              <div className="chatuserimage"></div>
              <TextArea
                className="autoTextarea"
                onKeyDown={autoResizeTextarea}
                onKeyUp={autoResizeTextarea}
                name="chat"
                register={register('chat')}
              ></TextArea>
              <Button
                className="registerbtn"
                isLoading={mutateLoading}
                text="작성"
              />
              <div className="errormsg">{errors.chatErrors?.message}</div>
            </form>
          </div>
        </div>

        <style jsx>{`
          @mixin spring {
            content: '';
            width: 210%;
            height: 40%;
            border-radius: 50%;

            border: 0.3rem solid black;
            border-left-width: 0.2rem;
            border-right-width: 0.2rem;
            border-bottom: none;
            position: absolute;
            transform: rotateX(45deg);
          }

          .productWrap {
            position: relative;
            margin: 0 auto;
            margin-top: 30px;

            display: flex;
            width: 60%;
            height: 90vh;

            > div:nth-child(odd) {
              border: 1px solid black;
              border-radius: 5px;
              padding: 5%;
            }
            > div:nth-child(3) {
              padding-left: 7%;
            }
          }
          .productInfo {
            position: relative;
            width: 49%;

            .imagewrap {
              position: relative;

              width: 100%;
              height: 100%;
            }
          }

          .userInfo {
            width: 49%;
            > div:nth-child(1) {
              width: 100%;
              display: flex;

              > button {
                border-radius: 24px;
                background-color: red;
                color: white;
                border: 0;
                font-size: 16px;
                font-weight: bold;
              }
            }

            .userimage {
              background-color: gray;
              width: 50px;
              height: 50px;
              border-radius: 50%;
              margin-right: 5px;
              position: relative;
            }
          }
          .spring-wrap {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 1%;
            height: 100%;

            .spring {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 20%;
            }
            .spring > div {
              position: absolute;

              width: 200%;
              height: 3%;
              box-shadow: inset -0px 0px 4px 0px gray;
              border-radius: 4px;
              &:nth-child(1) {
                right: 170%;
              }
              &:nth-child(2) {
                left: 170%;
              }

              &:nth-child(1)::after {
                @include spring;
                top: 5%;
                left: 40%;
              }
              &:nth-child(1)::before {
                @include spring;
                top: 30%;
                left: 40%;
              }
            }
          }
          .useremail {
            margin-right: 16px;
          }
          .chatuserimage {
            border-radius: 50%;
            width: 20px;
            height: 20px;
            background-color: gray;
            margin-right: 5px;
          }
          .chatInfo {
            > div {
              display: flex;

              .chatuserInfo {
                width: 100%;
              }
              .chatusername {
                font-size: 16px;
                font-weight: bold;
              }
              .userchat {
                padding-left: 7px;
                width: 100%;
                border: 1px solid black;
                word-break: break-all;
              }
            }
          }
          .chatregister {
            position: absolute;
            width: 37%;
            min-height: 5%;
            border: 1px solid rgb(226, 203, 203);
            display: flex;
            bottom: 10px;
            left: 57%;
            border-radius: 14px;

            textarea {
              height: 90%;
              border: none;
            }
            > button {
              position: relative;
              right: 0;
              border-top-right-radius: 14px;
              border-bottom-right-radius: 14px;
              border: none;
            }
          }
          .errormsg {
            color: red;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProductDetail;
