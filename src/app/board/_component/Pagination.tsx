// components/Pagination.tsx
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  maxPageDisplay?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  maxPageDisplay = 5
}: PaginationProps) {
  const currentGroup = Math.ceil(currentPage / maxPageDisplay);
  const startPage = (currentGroup - 1) * maxPageDisplay + 1;
  const endPage = Math.min(startPage + maxPageDisplay - 1, totalPages);

  const pages = Array.from(
    { length: Math.max(0, endPage - startPage + 1) },
    (_, i) => startPage + i
  );

  const createPageUrl = (page: number) => `?page=${page}`;

  return (
    <nav
      className="flex items-center justify-center gap-1 my-6"
      aria-label="Pagination"
    >
      {/* 첫 페이지 / 이전 페이지 */}
      <Link
        href={createPageUrl(1)}
        aria-disabled={currentPage === 1}
        className={`px-2.5 py-1.5 text-sm border rounded ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
      >
        &laquo;
      </Link>
      <Link
        href={createPageUrl(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`px-3 py-1.5 text-sm border rounded ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
      >
        이전
      </Link>

      {/* 페이지 번호 목록 */}
      {pages.map((p) => {
        const isActive = p === currentPage;
        return (
          <Link
            key={p}
            href={createPageUrl(p)}
            aria-current={isActive ? 'page' : undefined}
            className={`px-3 py-1.5 text-sm rounded ${
              isActive
                ? 'bg-blue-600 text-white font-bold'
                : 'border hover:bg-gray-100 text-gray-700'
            }`}
          >
            {p}
          </Link>
        );
      })}

      {/* 다음 페이지 / 마지막 페이지 */}
      <Link
        href={createPageUrl(currentPage + 1)}
        aria-disabled={currentPage >= totalPages}
        className={`px-3 py-1.5 text-sm border rounded ${currentPage >= totalPages ? 'pointer-events-none opacity-40' : ''}`}
      >
        다음
      </Link>
      <Link
        href={createPageUrl(totalPages)}
        aria-disabled={currentPage >= totalPages}
        className={`px-2.5 py-1.5 text-sm border rounded ${currentPage >= totalPages ? 'pointer-events-none opacity-40' : ''}`}
      >
        &raquo;
      </Link>
    </nav>
  );
}
