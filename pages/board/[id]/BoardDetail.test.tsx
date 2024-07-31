import { render, screen, waitFor } from '@testing-library/react';
import BoardUserInfo from './_component/BoardUserInfo';
import { useMutation, useQuery } from 'react-query';
import { useRouter } from 'next/router';
import BoardDetailInfo from './_component/BoardDetailInfo';
import BoardChatForm from './_component/BoardChatForm';
import userEvent from '@testing-library/user-event';
import BoardChatComments from './_component/BoardChatComments';

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn()
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
// jest.mock('next/link', () => {
//   const link = ({ children, href }: any) => {
//     return (
//       <a href={href} onClick={(e) => e.preventDefault()}>
//         {children}
//       </a>
//     );
//   };
//   link.displayName = 'mockLink';
//   return link;
// });
// jest.mock('@components/editor', () => {
//   const EditorTest = ({ children }) => {
//     return <div data-testid="editor-mock">{children}</div>;
//   };
//   EditorTest.displayName = 'editorTest';
//   return EditorTest;
// });
type MockedQuillProps = {
  value: string;
  onChange: (a: string) => void;
};
jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    const MockedQuill = ({ value, onChange }: MockedQuillProps) => (
      <textarea
        data-testid="mocked-quill"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
    return MockedQuill;
  }
}));

describe('BoardDetail Test', () => {
  let mockMutate = jest.fn();
  describe('BoardDetail information', () => {
    beforeEach(() => {
      (useRouter as jest.Mock).mockImplementation(() => ({
        query: {
          id: 1
        }
      }));
      mockMutate = jest.fn();
      (useMutation as jest.Mock).mockImplementation(() => ({
        mutate: mockMutate,
        isLoading: false
      }));
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('board userinfo', () => {
      const mockUseQuery = useQuery as jest.Mock;
      mockUseQuery.mockImplementationOnce(() => ({
        data: {
          board: {
            id: 5,
            user: {
              id: 1,
              email: 'BoardDetail email test',
              name: 'BoardDetail name test'
            }
          }
        }
      }));
      mockUseQuery.mockImplementationOnce(() => ({
        data: {
          ok: true,
          user: {
            id: 1
          }
        }
      }));

      render(<BoardUserInfo />);
      const email = screen.getByText('BoardDetail email test');
      const name = screen.getByText('BoardDetail name test');
      expect(email).toBeInTheDocument();
      expect(name).toBeInTheDocument();

      const settingButton = screen.getByRole('link', { name: '수정' });
      expect(settingButton).toBeInTheDocument();
      expect(settingButton).toHaveAttribute('href', '/board/5/setting');
    });
    it('board info', () => {
      const mockUseQuery = useQuery as jest.Mock;
      mockUseQuery.mockImplementation(() => ({
        data: {
          board: {
            id: 5,
            title: 'boardDetailInfo title test',
            description: 'boardDetailInfo description test',
            boardTag: [{ hashtag: 'aA,bB,cC,dD' }],
            user: {
              id: 1,
              email: 'BoardDetail email test',
              name: 'BoardDetail name test'
            }
          }
        }
      }));
      render(<BoardDetailInfo />);
      expect(
        screen.getByText('제목: boardDetailInfo title test')
      ).toBeInTheDocument();
      expect(
        screen.getByText('boardDetailInfo description test')
      ).toBeInTheDocument();
      expect(screen.getAllByRole('hashtag')).toHaveLength(4);
    });
    it('board chat form', async () => {
      userEvent.setup();
      (useQuery as jest.Mock).mockImplementation(() => ({
        refetch: jest.fn(),
        data: {
          user: {}
        }
      }));
      const mockMutate = jest.fn();
      (useMutation as jest.Mock).mockImplementation(() => ({
        mutate: mockMutate
      }));
      render(<BoardChatForm />);

      const button = screen.getByRole('button', { name: '작성' });
      expect(button).toBeInTheDocument();
      const dynamicComponent = await screen.findByTestId('mocked-quill');
      expect(dynamicComponent).toBeInTheDocument();
      await userEvent.type(dynamicComponent, 'quill mock test');
      expect(dynamicComponent).toHaveValue('quill mock test');
      userEvent.click(button);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith({ chat: 'quill mock test' });
      });
    });
    it('board chat comments', () => {
      (useQuery as jest.Mock).mockImplementation(() => ({
        data: {
          comments: [
            {
              id: 1,
              user: {
                name: 'name test 1'
              },
              createdAt: new Date(),
              description: 'description test 1'
            },
            {
              id: 2,
              user: {
                name: 'name test 2'
              },
              createdAt: new Date(),
              description: 'description test 2'
            },
            {
              id: 3,
              user: {
                name: 'name test 3'
              },
              createdAt: new Date(),
              description: 'description test 3'
            }
          ]
        }
      }));
      render(<BoardChatComments />);
      expect(screen.getAllByRole('listitem').length).toBe(3);
      expect(screen.getByText('name test 1')).toBeInTheDocument();
      expect(screen.getByText('description test 3')).toBeInTheDocument();
    });
  });
});
