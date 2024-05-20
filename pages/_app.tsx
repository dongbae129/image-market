import '../styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';

import store from 'reducers/store';
import Layout from '@components/layout';
import { getFetch } from '@libs/client/fetcher';
import MSWComponent from '../mocks/MSWComponent';
// import worker from '@/mocks/browser';
function MyApp({ Component, pageProps }: AppProps) {
  // const { restoreState } = store.getState().user;

  // useEffect(() => {
  //   if (worker) {
  //     worker
  //       .start()
  //       .then(() => console.log('Mock Service Worker started'))
  //       .catch((error) =>
  //         console.error('Failed to start Mock Service Worker', error)
  //       );
  //   }
  // }, []);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
          }
        }
      })
  );
  // queryClient.getQueryData(['userInfo']);
  // useQuery(['userInfo'], getFetch('/api/user'), {
  //   enabled: !restoreState
  // });
  // useEffect(() => {
  //   // window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
  //   // const kakao = document.createElement('script');
  //   // kakao.src = 'https://developers.kakao.com/sdk/js/kakao.js';
  //   // document.head.appendChild(kakao);
  //   // window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_KEY);
  //   // return () => {
  //   //   document.head.removeChild(kakao);
  //   // };
  // }, []);
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <MSWComponent />
          {/* <SessionProvider session={pageProps.session}> */}
          <Component {...pageProps} />
          {/* </SessionProvider> */}
        </Layout>
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
