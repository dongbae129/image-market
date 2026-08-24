// import type { NextPage } from 'next';
// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient
// } from '@tanstack/react-query';
// import { getBoardsServer } from '@app/board/_lib/getBoardsServer';
// import BoardContainer from '@app/board/_component/BoardContainer';
// import { Suspense } from 'react';

// const Boards: NextPage = async () => {
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ['boards', 1, ''],
//     queryFn: getBoardsServer
//   });

//   const dehydratedState = dehydrate(queryClient);
//   console.log(queryClient.getQueryData(['getProducts']), 'ABCDE', '!!!!');
//   return (
//     <div className="board w-[60%] m-auto">
//       <HydrationBoundary state={dehydratedState}>
//         <Suspense>
//           <BoardContainer />
//         </Suspense>
//       </HydrationBoundary>
//     </div>
//   );
// };

// export default Boards;
import Header from './_component/BoardHeader';
import BoardHero from './_component/BoardHero';
import BoardCategoryNav from './_component/BoardCategoryNav';
import BoardPostList from './_component/BoardPostList';
import BoardSidebar from './_component/BoardSidebar';
import { Post, BestPost } from './_component/boardTypes';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient
} from '@tanstack/react-query';
import { getBoardsServer } from '@app/board/_lib/getBoardsServer';
import { Suspense } from 'react';

// [SSR 데이터 페칭 비즈니스 로직 함수]
async function getBoardData() {
  // 실제 서비스 시: const res = await fetch('https://api.pinz.com/posts', { cache: 'no-store' });
  // SSR을 보장하려면 cache: 'no-store' 또는 revalidate 설정을 적용합니다.

  // id          Int         @id @default(autoincrement())
  // title       String
  // description String
  // createdAt   DateTime    @default(now())
  // updatedAt   DateTime    @updatedAt
  // userId      Int
  // user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  // boardChat   BoardChat[]
  // boardHit    BoardHit?
  // boardTag    BoardTag?
  // board 작성할때 category 선택하게 하기(피드백,노하우&팁,자유수다,이미지 요청,공지사항(관리자용))
  const posts: Post[] = [
    {
      id: 'post-1',
      category: '🎨 작품 피드백',
      categoryColor: 'bg-rose-50 text-rose-600',
      title:
        '이번에 작업한 3D 가상 공간 배경 시그니처 조명 피드백 부탁드립니다!',
      summary:
        '옥테인 렌더로 실내 사이버펑크 스타일 조명을 세팅해봤는데, 좌측 네온 사인이 너무 번져보이는지 궁금합니다. 실무 디자이너 분들의 가감 없는 조언 부탁드립니다.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
      author: {
        name: '푸른하늘',
        //image
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'
        // isPro: true
      },
      timeAgo: '10분 전', //createdAt
      views: 248, //viewCount
      comments: 18, //commentCount
      likes: 32 //likeCount
    },
    {
      id: 'post-2',
      category: '💡 노하우 & 팁',
      categoryColor: 'bg-emerald-50 text-emerald-600',
      title:
        'Blender 3D 초보자를 위한 렌더링 속도 2배 향상시키는 속성 세팅 모음집',
      summary:
        '노트북이나 저사양 PC에서 Cycles 렌더링 돌릴 때 퀄리티 손실 없이 샘플링과 Denoise 옵션만 조정해서 시간을 반으로 줄이는 5가지 설정 꿀팁을 정리했습니다.',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&auto=format&fit=crop&q=80',
      author: { name: '3D마스터', avatar: '3D' },
      timeAgo: '1시간 전',
      views: 1120,
      comments: 45,
      likes: 142
    },
    {
      id: 'post-3',
      category: '💬 자유수다',
      categoryColor: 'bg-indigo-50 text-indigo-600',
      title:
        '프리랜서 디자이너 분들 보통 견적 산정할 때 작업 시간 기준으로 하시나요?',
      summary:
        '이번에 브랜드 캐릭터 디자인 외주 문의가 들어왔는데 난이도 대비 견적 책정이 고민되네요. 다들 계약서 작성 시 미팅 비용이나 수정 횟수 제한 어떻게 두시는지 궁금합니다.',
      author: { name: '디자인연구소', avatar: '디' },
      timeAgo: '3시간 전',
      views: 530,
      comments: 29,
      likes: 19
    }
  ];

  const bestPosts: BestPost[] = [
    {
      id: 'best-1',
      rank: 1,
      title: '외주 계약서 작성할 때 무조건 확인해야 하는 5가지',
      author: '디자인연구소',
      likes: 210
    },
    {
      id: 'best-2',
      rank: 2,
      title: 'Blender 3D 렌더링 속도 2배 높이는 세팅법',
      author: '3D마스터',
      likes: 142
    },
    {
      id: 'best-3',
      rank: 3,
      title: '2026 하반기 UI/UX 디자인 트렌드 리포트 공유',
      author: 'PixelArt',
      likes: 98
    }
  ];

  const keywords = [
    '외주견적',
    'Blender3D',
    '포트폴리오',
    '옥테인',
    '캐릭터외주',
    'UI트렌드'
  ];

  return { posts, bestPosts, keywords, totalPostCount: 1420 };
}

// Next.js App Router - Server Component (SSR)
export default async function BoardPage() {
  // 서버에서 데이터 즉시 페칭 (SSR)
  const { posts, bestPosts, keywords, totalPostCount } = await getBoardData();
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: ['boards', 1, ''],
  //   queryFn: getBoardsServer
  // });
  // const dehydratedState = dehydrate(queryClient);
  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20">
      <main className="max-w-[1440px] mx-auto px-6 py-8 space-y-6">
        <BoardHero totalPostCount={totalPostCount} />
        <BoardCategoryNav />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          <div className="lg:col-span-8 w-full">
            <BoardPostList posts={posts} />
          </div>

          <div className="lg:col-span-4 w-full">
            <BoardSidebar bestPosts={bestPosts} keywords={keywords} />
          </div>
        </div>
      </main>
    </div>
  );
  // return (
  //   <div className="min-h-screen bg-[#f8f9fa] text-slate-800 pb-20">
  //     {/* 헤더 */}
  //     <Header />

  //     {/* 메인 컨테이너 */}
  //     <main className="max-w-[1440px] mx-auto px-6 py-8 space-y-6">
  //       {/* 게시판 타이틀 히어로 */}
  //       <BoardHero totalPostCount={totalPostCount} />

  //       {/* 카테고리 탭 (클라이언트 인터랙션) */}
  //       <BoardCategoryNav />

  //       {/* 메인 리스트 & 사이드바 */}
  //       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
  //         <BoardPostList posts={posts} />
  //         <BoardSidebar bestPosts={bestPosts} keywords={keywords} />
  //         {/* <HydrationBoundary state={dehydratedState}>
  //           <Suspense>
  //             <BoardPostList posts={posts} />
  //             <BoardSidebar bestPosts={bestPosts} keywords={keywords} />
  //           </Suspense>
  //         </HydrationBoundary> */}
  //       </div>
  //     </main>
  //   </div>
  // );
}
