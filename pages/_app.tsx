import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect, useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';

import store from 'reducers/store';
import Layout from '@components/layout';
function MyApp({ Component, pageProps }: AppProps) {
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
