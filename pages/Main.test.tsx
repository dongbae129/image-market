import UserCard from '@components/userCard';
import { render, screen, waitFor } from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
  useQuery,
  useQueryClient
} from 'react-query';
import { ReactNode } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '@reducers/store';
import ResponsiveProducts from '@components/ResponsiveProducts';
import { useInView } from 'react-intersection-observer';

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
  useInfiniteQuery: jest.fn()
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));
jest.mock('react-intersection-observer', () => ({
  useInView: jest.fn()
}));
describe('Main Page Test', () => {
  describe('UserCard Test', () => {
    it('when logged in', async () => {
      //   const queryClient = new QueryClient();

      //   const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
      //     <Provider store={store}>
      //       <QueryClientProvider client={queryClient}>
      //         {children}
      //       </QueryClientProvider>
      //     </Provider>
      //   );
      (useQuery as jest.Mock).mockImplementation(() => ({
        data: {
          ok: true,
          user: {
            id: 1,
            name: 'usercard name test',
            email: 'usercard email test',
            coin: 10000,
            bonusCoupon: 3
          }
        }
      }));
      (useSelector as jest.Mock).mockImplementation((selector) =>
        selector({
          user: {
            accessToken: 'usercard mock access token'
          }
        })
      );
      render(<UserCard />);

      expect(screen.getByText('usercard name test님')).toBeInTheDocument();
      expect(screen.getByText('usercard email test')).toBeInTheDocument();
      const myLink = screen.getByRole('link', { name: '내정보' });
      const myProduct = screen.getByRole('link', { name: '게시물' });
      expect(myLink).toBeInTheDocument();
      expect(myLink).toHaveAttribute('href', '/profile/1');
      expect(myProduct).toBeInTheDocument();
      expect(myProduct).toHaveAttribute('href', '/profile/1/myproducts');
      expect(screen.getByText('코인: 10000')).toBeInTheDocument();
      expect(screen.getByText('쿠폰: 3')).toBeInTheDocument();
    });
    it('when logged out', () => {
      (useQuery as jest.Mock).mockImplementation(() => ({
        data: {
          ok: false
        }
      }));
      render(<UserCard />);
      expect(screen.getByText('로그인')).toBeInTheDocument();
      expect(screen.getByText('비밀번호 찾기')).toBeInTheDocument();
    });
  });
  describe('Main Products', () => {
    it('products come out well', () => {
      (useInfiniteQuery as jest.Mock).mockImplementation(() => ({
        data: {
          pages: [
            {
              products: [
                {
                  id: 1,
                  ratio: 1.0,
                  image: 'image test 1',
                  title: 'title test 1'
                },
                {
                  id: 2,
                  ratio: 2.0,
                  image: 'image test 2',
                  title: 'title test 2'
                },
                {
                  id: 3,
                  ratio: 3.0,
                  image: 'image test 3',
                  title: 'title test 3'
                }
              ]
            }
          ]
        },
        hasNextPage: false,
        fetchNextPage: jest.fn(),
        isFetchingNextPage: false
      }));
      (useInView as jest.Mock).mockImplementation(() => ({
        ref: jest.fn(),
        inView: false
      }));
      render(<ResponsiveProducts />);
      expect(screen.getAllByRole('link')).toHaveLength(3);
      expect(screen.getAllByText(/title/g)).toHaveLength(3);
    });
  });
});
