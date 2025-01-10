import { useRouter } from 'next/navigation';

type PaginationProps = {
  currentPage: number;
  boardSearch: string;
  totalPages: number | undefined;
  setCurrentPage: (page: number) => void;
};

type PageParam = number | ((prev: number) => number);

export default function Pagination({
  currentPage,
  boardSearch,
  totalPages = 1,
  setCurrentPage
}: PaginationProps) {
  const router = useRouter();
  const boardShowCount = Number(process.env.NEXT_PUBLIC_POST_COUNT);
  const total = Math.ceil(totalPages / boardShowCount);

  console.log(totalPages, 'totalPages');
  const handlePageChange = (page: PageParam) => {
    const newPage = typeof page === 'function' ? page(currentPage) : page;

    if (newPage < 1 || newPage > total) return;
    setCurrentPage(newPage);
    router.push(
      `?page=${newPage}${boardSearch === '' ? '' : `&search=${boardSearch}`}`
    );
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (total <= 5) {
      // 5페이지 이하의 경우 모든 페이지 표시
      for (let i = 1; i <= total; i++) {
        pages.push(renderPageButton(i));
      }
    } else if (currentPage < 5) {
      // currentPage가 5 미만인 경우
      for (let i = 1; i <= 5; i++) {
        pages.push(renderPageButton(i));
      }
      pages.push(<span key="start-ellipsis">...</span>);
      pages.push(renderPageButton(total));
    } else if (currentPage >= 5 && currentPage < total - 2) {
      // currentPage가 5 이상이고, 마지막 몇 페이지에 도달하지 않은 경우
      pages.push(renderPageButton(1));
      pages.push(<span key="start-ellipsis">...</span>);
      pages.push(renderPageButton(currentPage - 1));
      pages.push(renderPageButton(currentPage));
      pages.push(renderPageButton(currentPage + 1));
      pages.push(<span key="end-ellipsis">...</span>);
      pages.push(renderPageButton(total));
    } else {
      // currentPage가 마지막 5페이지 안에 있는 경우
      pages.push(renderPageButton(1));
      pages.push(<span key="start-ellipsis">...</span>);
      for (let i = total - 4; i <= total; i++) {
        pages.push(renderPageButton(i));
      }
    }

    return pages;
  };

  const renderPageButton = (page: number) => (
    <button
      key={page}
      onClick={() => handlePageChange(page)}
      className={`mx-1 px-3 py-1 font-bold text-lg ${
        page === currentPage
          ? ' text-blue-500 border-blue-500 border-t-2'
          : ' text-gray-700 hover:text-blue-500 font-bold'
      }`}
    >
      {page}
    </button>
  );

  return (
    <div className="flex items-center justify-center space-x-3 my-5">
      <button
        onClick={() =>
          handlePageChange((prev: number) => {
            if (prev - 3 < 1) return 1;
            else return prev - 3;
          })
        }
        disabled={currentPage === 1}
        className="px-3 py-1 text-gray-700  hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            ></path>
          </svg>
          <span className="ml-1">Previous</span>
        </div>
      </button>

      {renderPageNumbers()}

      <button
        onClick={() =>
          handlePageChange((prev: number) => {
            if (prev + 3 > total) return total;
            else return prev + 3;
          })
        }
        disabled={currentPage === total}
        className="px-3 py-1 text-gray-700 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center">
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true"
            data-slot="icon"
            className="h-4 w-4 ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            ></path>
          </svg>
        </div>
      </button>
    </div>
  );
}
