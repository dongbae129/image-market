import { QueryClient, QueryClientProvider } from 'react-query';
import Signin from './signin';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from 'reducers/store';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { newAxios } from '@libs/client/fetcher';

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
  it('input value set well', async () => {
    render(
      <Wrapper>
        <Signin />
      </Wrapper>
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
    it('success login - [accessToken,router]', async () => {
      render(
        <Wrapper>
          <Signin />
        </Wrapper>
      );
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

      await waitFor(() => {
        expect(newAxios.defaults.headers.common['authorization']).toBe(
          'Bearer user1_access_token_msw'
        );
      });

      await waitFor(() => {
        expect(pushMock).toHaveBeenCalledWith('/');
      });
    });
    it('fail login -[alert]', async () => {
      render(
        <Wrapper>
          <Signin />
        </Wrapper>
      );
      window.alert = jest.fn();
      userEvent.setup();
      const inputId = screen.getByRole<HTMLInputElement>('textbox', {
        name: '아이디'
      });
      const inputPw = screen.getByLabelText<HTMLInputElement>('비밀번호');
      const loginButton = screen.getByRole('button', { name: 'LOGIN' });
      await userEvent.type(inputId, 'fail id');
      await userEvent.type(inputPw, 'fail password');
      await userEvent.click(loginButton);

      await waitFor(() => {
        expect(window.alert).toHaveBeenCalledWith('login error');
      });
    });
    it('login button status text-[LOGIN,Loading...]', async () => {
      render(
        <Wrapper>
          <Signin />
        </Wrapper>
      );
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

      expect(
        screen.getByRole('button', { name: /loading.../i })
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /login/i })
        ).toBeInTheDocument();
      });
    });
  });
});
