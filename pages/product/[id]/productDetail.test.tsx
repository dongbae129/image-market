import { render, screen, waitFor } from '@testing-library/react';

import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient
} from 'react-query';
import ProductChat from './_component/ProductChat';
import { Product } from '@prisma/client';
import ProductInfo, {
  ProductDetailType,
  UserHashtagHit
} from './_component/ProductInfo';
import ProductImage from './_component/ProductImage';
import ProductChatForm from './_component/ProductChatForm';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn()
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
jest.mock('next/image', () => {
  const Img = ({ ...props }) => {
    // eslint-disable-next-line
    return <img {...props} />;
  };
  Img.displayName = 'NextImage';
  return Img;
});

const propData = (check: boolean) => ({
  ok: true,
  product: {
    id: 5,
    image: 'path/imageTest',
    auth: check
  } as Product & UserHashtagHit
});
describe('ProductDetail', () => {
  describe('ProductImage', () => {
    it('ProductImage with data and auth is true', () => {
      const product = propData(true).product;
      render(<ProductImage product={product} />);
      const img = screen.getByAltText(product.image);

      expect(img).toHaveAttribute(
        'src',
        `/watermark/watermark_${product.image}`
      );
      expect(img).toHaveAttribute('alt', product.image);
    });
    it('ProductImage with data and auth is false', () => {
      const product = propData(false).product;
      render(<ProductImage product={product} />);
      const img = screen.getByAltText(product.image);

      expect(img).toHaveAttribute('src', `/uploads/${product.image}`);
      expect(img).toHaveAttribute('alt', product.image);
    });
  });
  describe('ProductChat', () => {
    beforeEach(() => {
      (useQuery as jest.Mock).mockImplementation(() => ({
        data: {
          ok: true,
          comments: [
            {
              id: 1,
              user: {
                name: 'AAA'
              },
              description: 'qqq'
            },
            {
              id: 2,
              user: {
                name: 'BBB'
              },
              description: 'www'
            },
            {
              id: 3,
              user: {
                name: 'CCC'
              },
              description: 'eee'
            }
          ]
        }
      }));
      // (useMutation as jest.Mock).mockImplementation(() => ({}));
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
    it('ProductChat with data', async () => {
      render(<ProductChat data={propData(true)} />);
      expect(await screen.findByText('댓글: 3개')).toBeInTheDocument();
      expect(await screen.findByText('AAA')).toBeInTheDocument();
      expect(await screen.findByText('qqq')).toBeInTheDocument();
    });
    it('ProdcutChatForm', async () => {
      const mockMutate = jest.fn();
      const mockCancelQueries = jest.fn();
      const mockGetQueryData = jest.fn();
      const mockSetQueryData = jest.fn();

      const mockQueryClient = {
        cancelQueries: mockCancelQueries,
        getQueryData: mockGetQueryData,
        setQueryData: mockSetQueryData
      };
      const mutateResponse = {
        ok: true,
        chat: {
          description: 'chatTestt',
          id: 7,
          user: {
            name: 'chateNameTest'
          }
        }
      };
      const initialData = {
        chat: {
          description: 'chat11',
          id: 1,
          user: {
            name: 'chatName11'
          }
        }
      };
      (useQueryClient as jest.Mock).mockReturnValue(mockQueryClient);
      (useMutation as jest.Mock).mockImplementation(() => ({
        mutate: mockMutate
      }));

      userEvent.setup();
      render(<ProductChatForm data={propData(false)} />);
      const textArea = screen.getByRole('textbox');
      expect(textArea).toBeInTheDocument();
      await userEvent.type(textArea, 'chatTest');
      userEvent.click(screen.getByRole('button'));

      await waitFor(() =>
        expect(mockMutate).toHaveBeenCalledWith({ chat: 'chatTest' })
      );
      const onSuccess = (useMutation as jest.Mock).mock.calls[0][1].onSuccess;

      await onSuccess(mutateResponse, { chat: 'Test chat' });

      expect(mockGetQueryData).toHaveBeenCalledWith(['getChats', 5]);
      expect(mockSetQueryData).toHaveBeenCalled();
      const setQueryDataCall = mockSetQueryData.mock.calls[0];
      expect(setQueryDataCall[0]).toEqual(['getChats', 5]);
      expect(setQueryDataCall[1]({ comments: [initialData] })).toEqual({
        comments: [initialData, mutateResponse.chat]
      });
    });
  });

  describe('ProductInfo', () => {
    it('ProductInfo with data', async () => {
      const productId = '5';
      const pushMock = jest.fn();
      const replaceMock = jest.fn();
      (useRouter as jest.Mock).mockReturnValue({
        push: pushMock,
        replace: replaceMock,
        prefetch: jest.fn().mockResolvedValue(null),
        route: '/',
        pathname: '/',
        query: {},
        asPath: '/',
        events: {
          on: jest.fn(),
          off: jest.fn()
        },
        beforePopState: jest.fn(() => null),
        isFallback: false
      });
      const mutateMock = jest.fn();
      (useMutation as jest.Mock).mockImplementation(() => ({
        mutate: mutateMock
      }));

      (useQuery as jest.Mock).mockImplementation(() => ({
        data: {
          ok: true,
          product: {
            user: {
              email: 'infoTest email',
              name: 'infoTest name'
            },
            title: 'info title',
            hashtag: {
              hashtag: 'a,b,c,d',
              id: 1,
              productId: 1
            },
            id: 1,
            description: 'infoTest descripion',
            auth: false
          }
        },
        isSuccess: true
      }));

      userEvent.setup();
      render(<ProductInfo productId="5" />);
      expect(screen.getByText('infoTest email')).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'info title' })
      ).toBeInTheDocument();
      expect(screen.getByRole('hashtag')).toHaveTextContent('#a#b#c#d');
      expect(screen.getByText('infoTest descripion')).toBeInTheDocument();
      const modifyButton = screen.getByText('수정하기');
      expect(modifyButton).toBeInTheDocument();
      expect(modifyButton).toHaveAttribute(
        'href',
        `/product/${productId}/setting`
      );
      const deleteButton = screen.getByText('삭제하기');
      expect(deleteButton).toBeInTheDocument();
      userEvent.click(deleteButton);

      const deleteMutateButton = await screen.findByRole('button', {
        name: '삭제'
      });
      expect(deleteMutateButton).toBeInTheDocument();
      await userEvent.click(deleteMutateButton);
      const onSuccess = (useMutation as jest.Mock).mock.calls[0][1].onSuccess;
      await onSuccess();

      expect(replaceMock).toHaveBeenCalledWith('/');
    });
  });
});
