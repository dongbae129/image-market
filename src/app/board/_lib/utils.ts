export function getCategoryData(category: string) {
  const categoryDatas: Record<string, { color: string; name: string }> = {
    작품피드백: {
      color: 'bg-rose-50 text-rose-600',
      name: '🎨 작품 피드백'
    },
    노하우팁: {
      color: 'bg-emerald-50 text-emerald-600',
      name: '💡 노하우 & 팁'
    },
    자유수다: {
      color: 'bg-indigo-50 text-indigo-600',
      name: '💬 자유수다'
    },
    협업구인: {
      color: 'bg-amber-50 text-amber-600',
      name: '🤝 협업/구인'
    },
    공지사항: {
      color: 'bg-slate-50 text-slate-600',
      name: '📢 공지사항'
    }
  };
  return categoryDatas[category];
}
