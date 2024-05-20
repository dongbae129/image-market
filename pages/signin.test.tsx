import { QueryClient, QueryClientProvider } from 'react-query';
import Signin from './signin';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from 'reducers/store';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { newAxios } from '@libs/client/fetcher';
import axios from 'axios';

const queryClient = new QueryClient();

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </Provider>
);

// jest.mock('@libs/client/fetcher', () => ({
//   newAxios: {
//     post: jest.fn(),
//     defaults: {
//       headers: {
//         common: {}
//       }
//     }
//   }
// }));

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
let pushMock = jest.fn();
beforeEach(() => {
  pushMock = jest.fn();
  (useRouter as jest.Mock).mockReturnValue({
    push: pushMock
  });
});
afterEach(() => {
  jest.clearAllMocks();
});
describe('Signin Test', () => {
  it('Signin Render', async () => {
    render(
      <Wrapper>
        <Signin />
      </Wrapper>
      // <Provider store={store}>
      //   <QueryClientProvider client={queryClient}>
      //     <Signin />
      //   </QueryClientProvider>
      // </Provider>
    );
    userEvent.setup();

    const inputId = screen.getByRole<HTMLInputElement>('textbox', {
      name: '아이디'
    });
    const inputPw = screen.getByLabelText<HTMLInputElement>('비밀번호');
    expect(inputId).toBeInTheDocument();
    expect(inputPw).toBeInTheDocument();
    await userEvent.type(inputId, 'username');
    await userEvent.type(inputPw, 'userpassword');
    expect(inputId.value).toBe('username');
    expect(inputPw.value).toBe('userpassword');
  });
  describe('JWT Token', () => {
    const mockAccessToken = 'mocked_access_token';

    // (newAxios.post as jest.Mock).mockResolvedValueOnce({
    //   data: { accessToken: mockAccessToken }
    // });

    it('success login', async () => {
      render(
        <Wrapper>
          <Signin />
        </Wrapper>
      );
      const mockResponse = {
        data: {
          ok: true,
          message: 'login success',
          user: { id: 1, userId: 'usernametest' },
          accessToken: 'user1_access_token_msw'
        }
      };

      // (newAxios.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      // newAxios.post.mockResolvedValueOnce({
      //   data: { accessToken: mockAccessToken }
      // });
      window.alert = jest.fn();
      userEvent.setup();
      const inputId = screen.getByRole<HTMLInputElement>('textbox', {
        name: '아이디'
      });
      const inputPw = screen.getByLabelText<HTMLInputElement>('비밀번호');
      const loginButton = screen.getByRole('button', { name: 'LOGIN' });
      await userEvent.type(inputId, 'usernametest');
      await userEvent.type(inputPw, 'passwordtest');
      await userEvent.click(loginButton);

      // await waitFor(() => {
      //   expect(newAxios.post).toHaveBeenCalledWith('/api/login', {
      //     userId: 'usernametest',
      //     password: 'passwordtest'
      //   });
      // });

      await waitFor(() => {
        expect(newAxios.defaults.headers.common['authorization']).toBe(
          'Bearer user1_access_token_msw'
        );
      });
      // await waitFor(() => {
      //   expect(window.alert).toHaveBeenCalledTimes(1);
      // });
      // await waitFor(() => {
      //   expect(window.alert).toHaveBeenCalledWith('login error');
      // });
      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith('/');
      });
    });
  });
});
