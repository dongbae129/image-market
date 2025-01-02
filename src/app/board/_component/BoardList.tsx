import BoardInfo from '@app/board/_component/BoardInfo';
import { Board, User } from '@prisma/client';
export interface BoardWithUser extends Board {
  user: User;
  boardHit: {
    hit: number;
  };
  boardTag: {
    hashtag: string;
  }[];
  _count: {
    boardChat: number;
  };
}
type BoardListProps = {
  boards: BoardWithUser[] | undefined;
};
function BoardList({ boards }: BoardListProps) {
  return (
    <div className="mb-16">
      <ul className="list-none p-0">
        {boards?.map((board: BoardWithUser) => (
          <li
            key={board.id}
            className="gap-x-4 py-4 flex justify-between border-solid border-[#ced4da] border-b"
          >
            <BoardInfo board={board} />
          </li>
        ))}
      </ul>
    </div>
  );
}
export default BoardList;
