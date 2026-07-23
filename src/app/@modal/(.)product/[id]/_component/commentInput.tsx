// import { Send } from 'lucide-react';

// export default function CommentInput() {
//   return (
//     // 🌟 겉을 감싸던 <div className="pt-2"> 를 삭제하거나 아래처럼 바꿨습니다.
//     <div className="relative flex items-center w-full">
//       <input
//         type="text"
//         placeholder="댓글 추가..."
//         className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
//       />
//       <button className="absolute right-2 p-1 text-blue-500 hover:text-blue-600">
//         <Send size={18} />
//       </button>
//     </div>
//   );
// }
'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { CommentType } from '@app/@modal/(.)product/[id]/_component/commentItem';

type UserInfoProps = {
  ok: boolean;
  user: {
    image: string;
    name: string;
  };
};
type Props = {
  productId: string;
  userInfo: UserInfoProps;
};

export default function CommentInput({ productId, userInfo }: Props) {
  const [comment, setComment] = useState('');
  const queryClient = useQueryClient();
  const disabled = !!userInfo;
  // 🌟 useMutation으로 댓글 작성 구현
  const { mutate, isPending } = useMutation({
    mutationFn: async (newComment: string) => {
      // 실제 댓글 작성 API 엔드포인트에 맞게 수정하세요
      const res = await axios.post(`/api/chat/product/${productId}`, {
        description: newComment
      });
      return res.data;
    },

    // 🌟 [핵심] API 요청 직전에 실행되는 옵티미스틱 UI 로직
    onMutate: async (newComment) => {
      // 1. 기존에 진행 중이던 쿼리 취소 (덮어쓰기 방지)
      await queryClient.cancelQueries({
        queryKey: ['getProductComments', productId]
      });

      // 2. 에러 시 롤백을 위해 기존 데이터 백업
      const previousComments = queryClient.getQueryData([
        'getProductComments',
        productId
      ]);

      // 3. 임시로 보여줄 '가짜 댓글' 데이터 생성 (CommentType 모양에 맞춤)
      const optimisticComment: CommentType = {
        id: Date.now(), // 임시 ID (랜덤 숫자)
        description: newComment,
        createdAt: new Date().toISOString(),
        productId: Number(productId),
        user: {
          image: userInfo.user.image, // 현재 로그인한 유저 이미지 URL로 바꾸면 완벽합니다
          name: userInfo.user.name // 현재 로그인한 유저 닉네임
        }
      };

      // 4. 무한 스크롤 캐시 데이터의 맨 앞(pages[0])에 가짜 댓글 꽂아넣기
      queryClient.setQueryData(
        ['getProductComments', productId],
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;

          const newPages = [...oldData.pages];
          newPages[0] = {
            ...newPages[0],
            comments: [optimisticComment, ...newPages[0].comments] // 최상단 추가
          };
          return { ...oldData, pages: newPages };
        }
      );

      // 입력창 초기화 (사용자는 전송된 것처럼 느낌)
      setComment('');

      // 에러 났을 때 복구할 데이터를 반환
      return { previousComments };
    },

    // 🌟 에러 발생 시 백업해둔 이전 데이터로 롤백
    onError: (err, newComment, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['getProductComments', productId],
          context.previousComments
        );
      }
      alert('댓글 작성에 실패했습니다.');
    },

    // 🌟 성공/실패 무관하게 마지막에 진짜 서버 데이터를 다시 불러와서 동기화
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['getProductComments', productId]
      });
      // 상품 정보(댓글 갯수) 쿼리도 새로고침 하면 좋습니다
      queryClient.invalidateQueries({ queryKey: ['product', +productId] });
    }
  });

  // 폼 제출 핸들러 (버튼 클릭 or 엔터키)
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!comment.trim() || isPending) return;
    mutate(comment); // useMutation 실행!
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full">
      <input
        type="text"
        value={comment}
        disabled={!disabled || isPending}
        onChange={(e) => setComment(e.target.value)}
        placeholder="댓글 추가..."
        // disabled={isPending}
        className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!comment.trim() || isPending}
        className="absolute right-2 p-1 text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
