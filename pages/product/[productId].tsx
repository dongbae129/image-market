import type { NextPage } from 'next';
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Image from 'next/image';
import { Chat, HashTag, Product, ProductHit } from '@prisma/client';
import { getFetch } from '@libs/client/fetcher';
import { useForm } from 'react-hook-form';
import { useState, useRef } from 'react';

import TextArea from '@components/textarea';
import Button from '@components/button';
import Input from '@components/input';
interface UserHashtagHit {
  user: {
    email: string;
    name: string;
  };
  hashtag: HashTag;
  productHit: ProductHit;
}

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
interface ChatResponse {
  ok: boolean;
  comments: CommentWithUser[];
}
interface ProductDetail {
  product: Product & UserHashtagHit;
}

const ProductDetail: NextPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const router = useRouter();
  const arrowRef = useRef<HTMLSpanElement>(null);
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
  const watchAuth = watch('checkAuth');
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

  console.log(data, 'Data');
  const chatSend = (chat: ChatForm) =>
    axios
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
    getFetch(`/api/chat/product/${data?.product.id}`),
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
      <div className="productwrapout">
        <div className="productwrapin">
          <div className="productInfo">
            <div className="imagewrap">
              {data?.product && (
                <Image
                  src={
                    data.product.auth
                      ? `/watermark/watermark_${data?.product.image}`
                      : `/uploads/${data?.product.image}`
                  }
                  priority
                  // width={400}
                  // height={400}
                  // sizes="30vw"
                  // layout="responsive"
                  layout="fill"
                  alt=""
                />
              )}
            </div>
          </div>

          <div className="userInfo">
            <div>
              <div className="useraccountinfo">
                <div className="userimage">
                  <Image
                    src="/localimages/emptyuser.png"
                    layout="fill"
                    alt="userImage"
                  />
                </div>
                <div className="useremail">{data?.product?.user?.email}</div>
              </div>
              <div>
                <button>
                  <a
                    href={`/api/product/download?productId=${productId}&imgAuth=${watchAuth}`}
                    download
                  >
                    저장
                  </a>
                </button>
              </div>
              {/* <Input
                label="checkAuth"
                name="checkAuth"
                type="checkbox"
                register={register('checkAuth')}
              /> */}
            </div>
            <div>
              <ul>
                <li>화소 free, pay</li>
                <li>화소 free, pay</li>
                <li>화소 free, pay</li>
              </ul>
            </div>
            <div>
              {data?.product.hashtag?.hashtag.split(',').map((hash, i) => (
                <span key={i}>#{hash}</span>
              ))}
            </div>
            <div className="arrowopen">
              <span>댓글: {chats?.comments.length || 0}개</span>
              <span
                ref={arrowRef}
                onMouseDown={(e) =>
                  (e.currentTarget.style.transform = 'scale(0.9)')
                }
                onMouseUp={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
                onClick={() => setChatOpen((prev) => !prev)}
              >
                {chatOpen ? (
                  <RiArrowDownSLine size={40} />
                ) : (
                  <RiArrowRightSLine size={40} />
                )}
              </span>
            </div>

            {/* <span>{data?.product.productHit?.hit}</span> */}
            <div className="chatwrap">
              {chats?.comments.map((comment) => (
                <div key={comment?.id}>
                  <div className="chatInfo">
                    <div>
                      <div className="chatuserimage"></div>
                      <div className="chatuserInfo">
                        <div className="chatusername">
                          {comment?.user?.name}
                        </div>
                        <div className="userchat">{comment?.description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
        </div>

        <style jsx>{`
          .productwrapout {
            position: relative;
            margin-top: 30px;
            margin-bottom: 30px;
            display: flex;
            width: 100%;
            justify-content: center;
          }
          .productwrapin {
            width: 100%;
            min-height: 80vh;
            max-width: 1050px;
            display: flex;
            justify-content: center;
            border-radius: 2rem;
            overflow: hidden;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
              rgba(0, 0, 0, 0.23) 0px 3px 6px;
            > div:last-child {
              padding: 3rem;
            }
          }

          .productInfo {
            position: relative;
            width: 50%;
            padding: 1rem;
            max-height: 80vh;
            .imagewrap {
              position: relative;
              border-top-left-radius: 20px;
              border-bottom-left-radius: 20px;
              overflow: hidden;
              width: 100%;
              height: 100%;
            }
          }

          .userInfo {
            position: relative;
            width: 50%;
            > div:nth-child(1) {
              width: 100%;
              display: flex;
              justify-content: space-between;
              position: relative;

              .useraccountinfo {
                width: 80%;
                word-break: break-all;
              }

              button {
                border-radius: 24px;
                background-color: red;
                color: white;
                border: 0;
                min-width: 60px;
                font-size: 16px;
                font-weight: bold;
                height: 100%;
              }
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
            .useremail {
              margin-right: 16px;
              padding: 5px;
              font-size: 16px;
              font-weight: 600;
            }
          }
          .useraccountinfo {
            display: flex;
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
            }
          }

          .arrowopen {
            display: flex;
            justify-content: start;
            align-items: center;
            > span:first-child {
              font-size: 1.5rem;
              font-weight: 600;
            }
            > span:last-child {
              display: flex;
              cursor: pointer;
              border-radius: 50%;

              :hover {
                background-color: rgba(0, 0, 0, 0.06);
              }
            }
          }
          .chatwrap {
            display: ${chatOpen ? 'block' : 'none'};
            width: 100%;

            .chatInfo {
              > div {
                display: flex;

                .chatuserimage {
                  border-radius: 50%;
                  width: 20px;
                  height: 20px;
                  background-color: gray;
                  margin-right: 5px;
                }
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
          }

          .chatregister {
            position: relative;
            width: 100%;
            min-height: 60px;
            border: 1px solid rgb(226, 203, 203);
            display: flex;
            border-radius: 14px;
            margin-top: 15px;

            form {
              width: 100%;
              height: 100%;
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
