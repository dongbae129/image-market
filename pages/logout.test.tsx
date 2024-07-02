import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor
} from '@testing-library/react';

// import { Wrapper } from './signin.test';
import Home from '.';
import { QueryClient, QueryClientProvider, useQueryClient } from 'react-query';
import React, { ReactElement, ReactNode } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from 'reducers/store';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { userEvent } from '@testing-library/user-event';
import { useRouter } from 'next/router';
import UserCard from '@components/userCard';
import { LinkProps } from 'next/link';
import useLogout from '@libs/client/logout';
import { newAxios } from '../libs/client/fetcher';
import axios from 'axios';
import { removeAccessToken } from '@reducers/user';
// const queryClient = new QueryClient();

// export const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
//   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
// );

// mock된 라우터 객체를 설정합니다.

const userTest = {
  ok: true,
  user: {
    name: 'dong',
    email: 'dong@email.com',
    id: 1
  }
};
// jest.mock('axios');
jest.mock('react-query', () => ({
  useQueryClient: jest.fn()
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn()
}));
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));
let push: any;
let dispatch: any;
let invalidateQueries: any;
beforeEach(() => {
  push = jest.fn();
  dispatch = jest.fn();
  invalidateQueries = jest.fn();
  // (useRouter as jest.Mock).mockReturnValue({
  //   push,
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
  // });
  (useRouter as jest.Mock).mockReturnValue({ push });
  (useDispatch as jest.Mock).mockReturnValue(dispatch);
  (useQueryClient as jest.Mock).mockReturnValue({ invalidateQueries });
});
afterEach(() => {
  jest.clearAllMocks();
});
// jest.mock(
//   'next/link',
//   () =>
//     ({ children }) =>
//       children
// );

// const pushMock = jest.fn();
describe('Logout Test', () => {
  it('logout test success', async () => {
    jest.spyOn(newAxios, 'post').mockResolvedValue({ data: { ok: true } });
    const { result } = renderHook(() => useLogout());
    await result.current();
    expect(newAxios.post).toHaveBeenCalledWith('/api/logout?type=local');
    expect(dispatch).toHaveBeenCalledWith(removeAccessToken());
    expect(invalidateQueries).toHaveBeenCalledWith(['userInfo']);
    expect(push).toHaveBeenCalledWith('/');

    // expect(push).toHaveBeenCalledWith('/');

    // expect(newAxios.post).toHaveBeenCalledWith('/api/logout?type=local');

    // pushMock = jest.fn();

    // (useRouter as jest.Mock).mockReturnValue({
    //   push: pushMock,
    //   beforePopState: jest.fn()
    // });
    // const {result}=renderHook(()=>useLogout())
    // result.current

    // render(
    //   <Wrapper>
    //     <UserCard logedIn={true} userInfo={userTest} />
    //   </Wrapper>
    // );
    // userEvent.setup();
    // mockAllIsIntersecting(true);
    // const goLogin = screen.getByText('로그아웃');

    // // const goLogin = screen.getByText(/로그아웃/i);
    // expect(goLogin).toBeInTheDocument();
    // // expect(goLogin).toHaveAttribute('href', '/logout');
    // // await waitFor(() => {
    // await userEvent.click(goLogin);
    // // // });

    // await waitFor(() => {
    //   expect(pushMock).toHaveBeenCalledWith('/logout');
    // });

    // expect(pushMock).toHaveBeenCalledWith('/logout');

    // await waitFor(async () => {
    // userEvent.click(goLogin);
    // // expect(pushMock).toHaveBeenCalledWith('/logout');
    // // });
    // await waitFor(() => {
    //   expect(pushMock).toHaveBeenCalledWith('/logout');
    // });
  });
  it('logout test fail', async () => {
    jest.spyOn(newAxios, 'post').mockRejectedValue(new Error('logout fail'));

    const consoleError = jest.spyOn(console, 'log').mockImplementation();

    const { result } = renderHook(() => useLogout());
    await result.current();
    expect(consoleError).toHaveBeenCalledWith(
      new Error('logout fail'),
      'error'
    );
    expect(push).not.toHaveBeenCalled();
  });
});
