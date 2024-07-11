import { render, screen } from '@testing-library/react';
import { useQuery } from 'react-query';
import BoardHead from './_component/BoardHead';
import userEvent from '@testing-library/user-event';
import BoardList from './_component/BoardList';

jest.mock('react-query', () => ({
  useQuery: jest.fn()
}));
const boards = [
  {
    id: 1,
    user: {
      name: 'test1 name'
    },
    createdAt: new Date(),
    title: 'test1 title',
    boardHit: {
      hit: 10
    },
    _count: {
      boardChat: 11
    }
  },
  {
    id: 2,
    user: {
      name: 'test2 name'
    },
    createdAt: new Date(),
    title: 'test2 title',
    boardHit: {
      hit: 20
    },
    _count: {
      boardChat: 22
    }
  },
  {
    id: 3,
    user: {
      name: 'test3 name'
    },
    createdAt: new Date(),
    title: 'test3 title',
    boardHit: {
      hit: 30
    },
    _count: {
      boardChat: 33
    }
  }
];
describe('Board Page Test', () => {
  describe('BoardHead', () => {
    it('upload버튼 클릭시 link로 이동하는지', async () => {
      const mockSet = jest.fn();
      (useQuery as jest.Mock).mockImplementation(() => ({
        isLoading: false
      }));

      render(<BoardHead boardSearch="" setBoardSearch={mockSet} />);
      const uploadLink = screen.getByRole('link', { name: 'Upload' });
      expect(uploadLink).toBeInTheDocument();
      expect(uploadLink).toHaveAttribute('href', '/board/upload');

      const searchInput = screen.getByRole('textbox');
      await userEvent.type(searchInput, 'search input test');
      await userEvent.type(searchInput, '{enter}');
      expect(mockSet).toHaveBeenCalledWith('search input test');
    });
  });
  describe('BoardList', () => {
    it('BoardInfo', () => {
      (useQuery as jest.Mock).mockImplementation(() => ({
        data: {
          ok: true,
          boards
        }
      }));
      render(<BoardList boardSearch="" />);
      const boar_li = screen.getAllByRole('listitem');
      expect(boar_li).toHaveLength(3);

      expect(screen.getByRole('link', { name: 'test1 name' })).toHaveAttribute(
        'href',
        '/#'
      );
      const titleLink = screen.getByRole('link', { name: 'test1 title' });
      expect(titleLink).toHaveAttribute('href', `/board/${boards[0].id}`);

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('22')).toBeInTheDocument();
    });
  });
});
