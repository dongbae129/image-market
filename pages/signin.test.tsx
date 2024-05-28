import { QueryClient, QueryClientProvider } from 'react-query';
import Signin from './signin';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Provider } from 'react-redux';
import store from 'reducers/store';
// import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { newAxios } from '@libs/client/fetcher';
import Link from 'next/link';
import { RouterContext } from 'next/dist/shared/lib/router-context';
const queryClient = new QueryClient();

export const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </Provider>
);
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

useRouter.mockImplementation(() => ({
  route: '/',
  pathname: '',
  query: '',
  asPath: '',
  push: jest.fn().mockResolvedValue(true),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn()
  },
  scroll: false
}));
function createMockRouter() {
  return {
    route: '/',
    pathname: '',
    query: '',
    asPath: '',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn()
    }
  };
}
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

// jest.mock('next/router', () => ({
//   useRouter: jest.fn()
// }));
// let pushMock = jest.fn();
// beforeEach(() => {
//   pushMock = jest.fn();
//   (useRouter as jest.Mock).mockReturnValue({
//     push: pushMock,
//     prefetch: jest.fn().mockResolvedValue(null),
//     route: '/',
//     pathname: '/',
//     query: {},
//     asPath: '/',
//     events: {
//       on: jest.fn(),
//       off: jest.fn()
//     },
//     beforePopState: jest.fn(() => null),
//     isFallback: false
//   });
// });
afterEach(() => {
  jest.clearAllMocks();
});
// jest.mock(
//   'next/link',
//   () =>
//     ({ children }: any) =>
//       children
// );

// jest.mock(
//   'next/link',
//   () =>
//     ({ children }) =>
//       children
// );
describe('Signin Test', () => {
  it('input value set well', async () => {
    render(
      <Wrapper>
        <Signin />
      </Wrapper>
    );

    // render(
    //   <div>
    //     <Link href="/signup">
    //       <a>signup test</a>
    //     </Link>
    //   </div>
    // );
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
    it.only('success login - [accessToken,router]', async () => {
      // pushMock = jest.fn();

      // (useRouter as jest.Mock).mockImplementation(() => ({
      //   push: pushMock,
      //   prefetch: jest.fn().mockResolvedValue(null),
      //   route: '/',
      //   pathname: '/',
      //   query: {},
      //   asPath: '/',
      //   events: {
      //     on: jest.fn(),
      //     off: jest.fn()
      //   },
      //   beforePopState: jest.fn(() => null),
      //   isFallback: false
      // }));
      // render(
      //   <Wrapper>
      //     <Signin />
      //   </Wrapper>
      // );
      const router = createMockRouter();
      render(
        <RouterContext.Provider value={router}>
          <Wrapper>
            <Signin />
          </Wrapper>
        </RouterContext.Provider>
      );
      // window.alert = jest.fn();
      const user = userEvent.setup();

      const atest = screen.getByRole('link', { name: /signup test/i });
      // expect(atest).toBeInTheDocument();
      // expect(atest).toHaveAttribute('href', '/register');

      await user.click(atest);
      await waitFor(() =>
        expect(router.push).toHaveBeenCalledWith('/register')
      );
      // expect(router.push).toHaveBeenCalledWith(
      //   expect.stringContaining('/register')
      // );
      // expect(router.push).toHaveBeenCalledTimes(1);
      // await user.click(atest);
      // await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/si'));

      // await waitFor(() => {
      //   expect(screen.getByText('회원가입')).toBeInTheDocument();
      // });
      // await waitFor(() =>
      //   expect(useRouter().pathname).toHaveBeenCalledWith('/signup')
      // );
      // await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/signup'));

      // await waitFor(() =>
      //   expect(
      //     screen.getByText(/signup test/i).closest('link')
      //   ).toHaveAttribute('href', '/signup')
      // );
      // await userEvent.click(atest);
      // await waitFor(() => expect(window.location.pathname).toEqual('/si'));
      // await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/signup'));
      // const inputId = screen.getByRole<HTMLInputElement>('textbox', {
      //   name: '아이디'
      // });
      // const inputPw = screen.getByLabelText<HTMLInputElement>('비밀번호');
      // const loginButton = screen.getByRole('button', { name: 'LOGIN' });

      // await userEvent.type(inputId, 'usernametest');
      // await userEvent.type(inputPw, 'passwordtest');
      // await userEvent.click(loginButton);

      // await waitFor(() => {
      //   expect(newAxios.defaults.headers.common['authorization']).toBe(
      //     'Bearer user1_access_token_msw'
      //   );
      // });

      // await waitFor(() => {
      //   expect(pushMock).toHaveBeenCalledWith('/');
      // });
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
