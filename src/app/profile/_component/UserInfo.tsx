'use client';
import { getUserInfo } from '@app/profile/_lib/getUserInfo';
import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
type Props = {
  name: string;
};
type UserResponse = {
  ok: boolean;
  user: User;
};
export default function UserInfo({ name }: Props) {
  const tags = ['이건', '나중에', '테스트', '할게'];
  const { data } = useQuery<UserResponse>({
    queryKey: ['userInfo', name],
    queryFn: () => getUserInfo(name)
  });
  if (!data?.user) return null;
  const userChecker = data.user.id === +name;
  console.log(data.user.id, name, userChecker, 'userChecker');
  return (
    <section className="flex flex-col items-center text-center pb-10 border-b border-slate-200/80">
      {/* 프로필 이미지 */}
      <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm mb-4">
        <span className="text-2xl">🌿</span>
      </div>

      {/* 이름 및 아이디 */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          {data.user.name}
        </h1>
        <p className="text-xs text-slate-400 font-mono">{data.user.email}</p>
      </div>

      {/* 태그 리스트 */}
      <div className="flex flex-wrap gap-1.5 justify-center mt-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2.5 py-0.5 text-[11px] text-slate-500 bg-slate-200/50 rounded-full font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 통계 정보 (텍스트 위주로 가볍게 표현) */}
      <div className="flex items-center gap-4 mt-5 text-xs text-slate-500">
        <div>
          <span>팔로워 </span>
          <span className="font-semibold text-slate-800">
            {data?.user?.followed}
          </span>
        </div>
        <div className="w-px h-3 bg-slate-200" />
        <div>
          <span>팔로잉 </span>
          <span className="font-semibold text-slate-800">
            {data?.user?.following}
          </span>
        </div>
      </div>

      {/* 액션 버튼 그룹 (둥근 알약 모양으로 나란히 배치) */}
      <div className="flex items-center gap-2 mt-5">
        <button className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-medium transition duration-150">
          공유
        </button>
        <button className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-full text-xs font-medium transition duration-150">
          프로필 수정
        </button>
      </div>
    </section>
  );
}
