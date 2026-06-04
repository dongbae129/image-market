// import UserCard from '@app/_components/userCard';
// import UserMasnoryProducts from '@app/profile/_component/UserMasnoryProducts';

// type Props = {
//   ssrItemCount: number;
//   name: string;
// };
// export default function ProfilePage({ ssrItemCount, name }: Props) {
//   return (
//     <div>
//       <div className="main_header flex w-[94vw] h-[500px] m-auto mb-12">
//         <div className="profile shadow-lg border border-[#e3e5e8] ml-7 w-auto min-w-[320px] h-40 rounded-lg max-lg:hidden overflow-hidden p-5 flex flex-col justify-between">
//           <UserCard />
//         </div>
//       </div>
//       <div className="px-4">
//         <UserMasnoryProducts ssrItemCount={ssrItemCount} name={name} />
//       </div>
//       {/* <MasonryFeed /> */}
//       {/* <ResponsiveProducts /> */}
//       {/* <Sidebar /> */}
//     </div>
//   );
// }

import UserInfo from '@app/profile/_component/UserInfo';
import UserMasnoryProducts from '@app/profile/_component/UserMasnoryProducts';

type ProfileProps = {
  ssrItemCount: number;
  name: string;
};
export default function ProfilePage({ ssrItemCount, name }: ProfileProps) {
  return (
    <main className="min-h-screen text-slate-800 px-4 md:px-8 lg:px-12 py-10">
      <UserInfo name={name} />
      <section className="mt-8">
        <UserMasnoryProducts ssrItemCount={ssrItemCount} name={name} />
      </section>
    </main>
  );

  // return (
  //   // max-w 제한을 없애고 전체 너비를 사용하는 컨테이너
  //   <div className="min-h-screen text-slate-800 px-4 md:px-8 lg:px-12 py-10">
  //     {/* =========================================================
  //         [상단 영역] 박스를 걷어내고 컴팩트하게 밀착시킨 유저 정보 (Kick)
  //        ========================================================= */}
  //     <section className="flex flex-col items-center text-center pb-10 border-b border-slate-200/80">
  //       {/* 프로필 이미지 (너무 크지 않게 조절) */}
  //       <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm mb-4">
  //         <span className="text-2xl">🌿</span>
  //       </div>

  //       {/* 이름 및 아이디 */}
  //       <div className="space-y-1">
  //         <h1 className="text-xl font-bold tracking-tight text-slate-900">
  //           이정민
  //         </h1>
  //         <p className="text-xs text-slate-400 font-mono">@studio.jungmin</p>
  //       </div>

  //       {/* 한줄 소개 (가로 폭을 적절히 제한해 가독성 유지) */}
  //       <p className="text-sm text-slate-500 mt-3 max-w-md leading-relaxed">
  //         비우는 삶 속에서 채워지는 아름다움을 기록합니다. 공간과 오브제가 주는
  //         정서적 안정감에 대해 이야기합니다.
  //       </p>

  //       {/* 태그 리스트 */}
  //       <div className="flex flex-wrap gap-1.5 justify-center mt-3">
  //         {tags.map((tag) => (
  //           <span
  //             key={tag}
  //             className="px-2.5 py-0.5 text-[11px] text-slate-500 bg-slate-200/50 rounded-full font-medium"
  //           >
  //             #{tag}
  //           </span>
  //         ))}
  //       </div>

  //       {/* 간단한 통계 및 액션 버튼 (한 줄로 가볍게 표현) */}
  //       <div className="flex items-center gap-6 mt-6 text-xs text-slate-500">
  //         <div>
  //           <span>팔로워 </span>
  //           <span className="font-semibold text-slate-800">2,380</span>
  //         </div>
  //         <div className="w-px h-3 bg-slate-200" />
  //         <div>
  //           <span>팔로잉 </span>
  //           <span className="font-semibold text-slate-800">412</span>
  //         </div>
  //         <div className="w-px h-3 bg-slate-200" />
  //         <button className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md font-medium text-slate-700 transition duration-150">
  //           공유
  //         </button>
  //       </div>
  //     </section>

  //     {/* =========================================================
  //         [하단 영역] 화면을 가득 채우는 반응형 Pinterest 그리드
  //        ========================================================= */}
  //     <section className="mt-8">
  //       {/* 모바일 2열부터 초고해상도 6열 이상까지 화면을 가득 채우는 유동적(Fluid) 열 배치 */}
  //       <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 2xl:columns-8 gap-4 space-y-4">
  //         {/* 가변 높이를 가진 그리드 플레이스홀더들 */}
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-52 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image A
  //           </span>
  //         </div>
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-72 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image B
  //           </span>
  //         </div>
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-44 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image C
  //           </span>
  //         </div>
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-80 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image D
  //           </span>
  //         </div>
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-60 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image E
  //           </span>
  //         </div>
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-48 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image F
  //           </span>
  //         </div>
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-68 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image G
  //           </span>
  //         </div>
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-56 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image H
  //           </span>
  //         </div>
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-76 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image I
  //           </span>
  //         </div>
  //         <div className="break-inside-avoid bg-white border border-slate-200/50 rounded-2xl h-50 flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition duration-200">
  //           <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
  //             Image J
  //           </span>
  //         </div>
  //       </div>
  //     </section>
  //   </div>
  // );
}
