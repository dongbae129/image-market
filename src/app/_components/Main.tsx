import style from './main.module.scss';
import UserCard from '@app/_components/userCard';
import Banner from '@components/Banner';
import MasonryGrid from '@components/MasonryFeed';
import TrendingCarousel from '@app/_components/TrendingCarousel';

type Props = {
  ssrItemCount: number;
};
export default function Main({ ssrItemCount }: Props) {
  const categories = [
    '🔥 인기',
    '🎨 일러스트',
    '📷 사진',
    '🎬 3D',
    '🎵 음악',
    '🎮 게임',
    '📱 디자인',
    '✈️ 여행',
    '📚 아트',
    '💡 아이디어',
    '✨ 전체보기'
  ];

  return (
    <main
      className={`${style.main_wrap} mx-auto max-w-[1440px] space-y-6 px-4 py-6 sm:px-6`}
    >
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="h-[320px] lg:col-span-8 [&>div]:h-full [&>div]:w-full">
          <Banner />
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4">
          <div className="min-h-40 overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <UserCard />
          </div>

          <TrendingCarousel />
        </aside>
      </section>

      <section className="flex flex-col items-center justify-between gap-4 border-b border-slate-200/60 pb-4 sm:flex-row">
        <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto sm:w-auto">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                index === 0
                  ? 'bg-slate-900 font-bold text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            최신순 <span className="text-slate-400">⌄</span>
          </button>
          <button
            type="button"
            aria-label="격자 보기"
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
          >
            ▦
          </button>
        </div>
      </section>

      <section className="pt-2">
        <MasonryGrid ssrItemCount={ssrItemCount} />
      </section>
    </main>
  );
}
