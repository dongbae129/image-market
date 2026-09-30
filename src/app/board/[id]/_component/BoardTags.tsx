export default function BoardTags({ tags }: { tags: string[] }) {
  return (
    <>
      {tags.length > 0 && (
        <section className="rounded-[18px] border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-extrabold text-slate-800">
            이런 게시글은 어때요?
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-1.5 text-[10px] text-slate-500"
              >
                #{tag.replace(/^#/, '')}
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
