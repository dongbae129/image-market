export default function FirstCommentSkeleton() {
  return (
    <div className="w-full h-full flex flex-col pt-1">
      <div className="flex flex-1 items-center space-x-2 w-full h-full min-w-0">
        {/* 유저 이미지 */}
        <div className="w-6 h-6 rounded-full bg-gray-200 shrink-0 overflow-hidden flex items-center justify-center">
          <div className="w-full h-full object-cover bg-gray-100 rounded-full animate-pulse shrink-0" />
        </div>

        <div className="flex items-center space-x-1.5 flex-1 min-w-0 h-full whitespace-nowrap overflow-hidden">
          <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
        </div>
      </div>
      <div className="flex items-center space-x-1.5 flex-1 min-w-0 h-full whitespace-nowrap overflow-hidden">
        <div className="h-4 bg-gray-100 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
}
