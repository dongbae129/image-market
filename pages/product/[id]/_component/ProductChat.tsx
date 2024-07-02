import { getFetch } from '@libs/client/fetcher';
import React, { useRef, useState } from 'react';
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import { ProductDetailType } from './ProductInfo';
import { Chat } from '@prisma/client';

type ProductChatProps = {
  data: ProductDetailType;
};
export interface CommentWithUser extends Chat {
  user: {
    name: string;
  };
}
interface ChatResponse {
  ok: boolean;
  comments: CommentWithUser[];
}
function ProductChat({ data }: ProductChatProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const arrowRef = useRef<HTMLSpanElement>(null);

  const { data: chats } = useQuery<ChatResponse>(
    ['getChats', data?.product?.id],
    getFetch(`/api/chat/product/${data?.product?.id}`),
    {
      enabled: !!data?.product?.id,
      onSuccess: ({ comments }) => {
        if (comments.length > 0) setChatOpen(true);
      }
    }
  );

  return (
    <>
      <div className="arrowopen">
        <span data-testid="test">댓글: {chats?.comments.length || 0}개</span>
        <span
          ref={arrowRef}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onClick={() => setChatOpen((prev) => !prev)}
        >
          {chatOpen ? (
            <RiArrowDownSLine size={40} />
          ) : (
            <RiArrowRightSLine size={40} />
          )}
        </span>
      </div>
      <div className="chatwrap">
        {chats?.comments.map((comment) => (
          <div data-testid="chat" key={comment?.id}>
            <div className="chatInfo">
              <div>
                <div className="chatuserimage_inner">
                  <div className="chatuserimage"></div>
                </div>
                <div className="chatuserInfo">
                  <div className="chatusername">{comment?.user?.name}</div>
                  <div className="userchat">{comment?.description}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        $img_inner: 32px;

        .chatuserimage_inner {
          width: $img_inner;
          height: $img_inner;
          margin-right: 5px;
        }
        .chatuserimage {
          background: url(/localimages/emptyuser.png) center no-repeat;
          border-radius: 50%;
          width: 100%;
          height: 100%;
          background-size: cover;
          margin-right: 5px;
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
          opacity: ${chatOpen ? 1 : 0};
          flex-direction: column;
          width: 100%;
          height: 40%;
          overflow-y: scroll;
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
                padding: 7px 7px 0 7px;
                width: 100%;
                white-space: pre-line;
                word-break: break-all;
              }
            }
          }
        }
      `}</style>
    </>
  );
}

export default ProductChat;
