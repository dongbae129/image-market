import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react';

// import { Wrapper } from './signin.test';
import Home from '.';
import { QueryClient, QueryClientProvider } from 'react-query';
import React, { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import store from 'reducers/store';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { userEvent } from '@testing-library/user-event';
import { useRouter } from 'next/router';
import UserCard from '@components/userCard';
import { LinkProps } from 'next/link';
const queryClient = new QueryClient();

export const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// mock된 라우터 객체를 설정합니다.

const userTest = {
  ok: true,
  user: {
    name: 'dong',
    email: 'dong@email.com',
    id: 1
  }
};

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
jest.mock(
  'next/link',
  () =>
    ({ children }) =>
      children
);
// jest.mock('next/link', () => {
//   const { cloneElement } = jest.requireActual('react');
//   return ({ children, ...rest }: LinkProps) =>
//     cloneElement(children, { ...rest });
// });

const pushMock = jest.fn();
it.skip('logout test', async () => {
  // pushMock = jest.fn();

  (useRouter as jest.Mock).mockReturnValue({
    push: pushMock,
    beforePopState: jest.fn()
  });

  render(
    <Wrapper>
      <UserCard logedIn={true} userInfo={userTest} />
    </Wrapper>
  );
  userEvent.setup();
  mockAllIsIntersecting(true);
  const goLogin = screen.getByText('로그아웃');

  // const goLogin = screen.getByText(/로그아웃/i);
  expect(goLogin).toBeInTheDocument();
  // expect(goLogin).toHaveAttribute('href', '/logout');
  // await waitFor(() => {
  await userEvent.click(goLogin);
  // // });

  await waitFor(() => {
    expect(pushMock).toHaveBeenCalledWith('/logout');
  });

  // expect(pushMock).toHaveBeenCalledWith('/logout');

  // await waitFor(async () => {
  // userEvent.click(goLogin);
  // // expect(pushMock).toHaveBeenCalledWith('/logout');
  // // });
  // await waitFor(() => {
  //   expect(pushMock).toHaveBeenCalledWith('/logout');
  // });
});
