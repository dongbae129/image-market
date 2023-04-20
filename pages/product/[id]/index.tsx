import type { NextPage } from 'next';
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Image from 'next/image';
import { Chat, HashTag, Product, ProductHit } from '@prisma/client';
import { getFetch, newAxios } from '@libs/client/fetcher';
import { useForm } from 'react-hook-form';
import { useState, useRef } from 'react';

import TextArea from '@components/textarea';
import Button from '@components/button';
import SvgData from 'json/data.json';
import SvgIcon from '@components/svgIcon';
import Link from 'next/link';
import Modal from '@components/modal';
import DOMPurify from 'dompurify';
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
  ok: boolean;
  product: Product & UserHashtagHit;
}

const ProductDetail: NextPage = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
  const { modify } = SvgData.SVG;
  const watchFiled = watch('chat');
  const watchAuth = watch('checkAuth');
  const productId = router.query.id;

  const getProduct = () =>
    axios.get(`/api/product/${productId}`).then((res) => res.data);
  const { data, isLoading, isError } = useQuery<ProductDetail>(
    ['getProduct'],
    getProduct,
    {
      enabled: !!productId
    }
  );

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
      setChatOpen(true);
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
      return {
        prevChats
      };
    }
  });

  const deleteSend = () =>
    axios.delete(`/api/product/${productId}`).then((res) => res.data);
  const { mutate: deleteMutation } = useMutation(deleteSend, {
    onSuccess: (res) => {
      console.log(res, 'deleted success');
      router.replace('/');
    },
    onError: (res) => {
      console.error(res, 'deleted fail');
    }
  });
  const { data: chats, isLoading: chatLoading } = useQuery<ChatResponse>(
    ['getChats', data?.product?.id],
    getFetch(`/api/chat/product/${data?.product?.id}`),
    {
      enabled: !!data?.product?.id,
      onSuccess: ({ comments }) => {
        if (comments.length > 0) setChatOpen(true);
      }
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
  const onClickModify = () => {
    setModifyOpen((prev) => !prev);
  };
  const onClickDelete = () => {
    setModalOpen((prev) => !prev);
    // deleteMutation();
  };

  if (isLoading) return <div>Loading Data....</div>;
  if (!data?.ok) return <div>해당 상품은 존재하지 않습니다</div>;
  return (
    <div>
      {modalOpen && (
        <Modal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          deleteMutation={deleteMutation}
        />
      )}
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
                  // priority={true}
                  // width={400}
                  // height={600}
                  // layout="responsive"
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
              <div className="btnwithmodify">
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

                <div className="svgwrap_div" onClick={onClickModify}>
                  {/* <SlOptionsVertical /> */}
                  <SvgIcon svgInfo={modify} viewBox="0 0 1040 1040" />
                </div>

                <div className={`modifypost ${modifyOpen ? 'open' : ''}`}>
                  <div className="modifypost_mar">
                    <div className="modifypost_pad">
                      <Link href={`/product/${productId}/setting`}>
                        수정하기
                      </Link>
                    </div>
                    <div className="modifypost_pad" onClick={onClickDelete}>
                      <p>삭제하기</p>
                    </div>
                  </div>
                </div>
              </div>
              <Input
                label="checkAuth"
                name="checkAuth"
                type="checkbox"
                register={register('checkAuth')}
              />
            </div>
            {/* <div>
              <ul>
                <li>화소 free, pay</li>
                <li>화소 free, pay</li>
                <li>화소 free, pay</li>
              </ul>
            </div> */}
            <div>
              <h1>{data.product.title}</h1>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(data?.product.description as string)
              }}
            />
            <div className="hashtagwrap">
              {data?.product.hashtag?.hashtag.split(',').map((hash, i) => (
                <span className="hashtag" key={i}>
                  <span>#</span>
                  <span>{hash}</span>
                </span>
                // <span key={i}>#{hash}</span>
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
                      <div className="chatuserimage_inner">
                        <div className="chatuserimage"></div>
                      </div>
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
                <div>
                  <div className="chatuserimage_outer">
                    <div className="chatuserimage"></div>
                  </div>
                  <div className="chat-textareawrap">
                    <TextArea
                      className="autoTextarea"
                      onKeyDown={autoResizeTextarea}
                      onKeyUp={autoResizeTextarea}
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
          </div>
        </div>

        <style jsx>{`
          $img_inner: 32px;
          $img_outer: 50px;
          $userimg-out_mgr: 8px;

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
                background-color: #e60023;
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
          .hashtagwrap {
            padding-top: 10px;
          }
          .btnwithmodify {
            display: flex;
          }
          .svgwrap_div {
            width: 40px;
            border-radius: 15px;
            margin-left: 15px;

            :hover {
              background-color: #e9ecef;
            }
          }
          .modifypost {
            visibility: hidden;
            position: absolute;
            width: 0;
            border: 1px solid #d5d5d5;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
              rgba(0, 0, 0, 0.23) 0px 3px 6px;
            border-radius: 4px;

            top: 60px;
            right: 0;

            white-space: nowrap;
            overflow: hidden;

            transition: all 0.5s;

            > a {
              display: block;
            }

            .modifypost_mar {
              margin: 8px;
            }
            .modifypost_pad {
              padding: 8px;
              border-radius: 4px;
              font-weight: 600;
              cursor: pointer;
              &:hover {
                background-color: #e9e9e9;
              }
            }
          }
          .modifypost.open {
            background-color: white;
            visibility: visible;
            width: 163px;
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
          .hashtag {
            background-color: #f8f9fa;
            display: inline-block;
            border-radius: 1rem;
            height: 2rem;
            line-height: 2rem;
            padding-left: 1rem;
            padding-right: 1rem;
            margin-right: 0.75rem;
            margin-bottom: 1rem;
            &:hover {
              cursor: pointer;
              background-color: darkgray;
            }
            span {
              font-weight: bold;
            }

            span:nth-child(1) {
              color: #12b886;
              font-weight: bold;
              padding-right: 0.2rem;
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
            display: ${chatOpen ? 'flex' : 'none'};
            flex-direction: column;
            width: 100%;
            > div {
              margin-top: 10px;
              margin-bottom: 10px;
            }

            .chatInfo {
              > div {
                display: flex;

                .chatuserInfo {
                  width: calc(100% - (#{$img_inner} + 5px));
                }

                .chatusername {
                  font-size: 16px;
                  font-weight: bold;
                }
                .userchat {
                  padding-left: 7px;
                  width: 100%;

                  word-break: break-all;
                }
              }
            }
          }
          .chatuserimage_inner {
            width: $img_inner;
            height: $img_inner;
            margin-right: 5px;
          }
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
      </div>
    </div>
  );
};

export default ProductDetail;
