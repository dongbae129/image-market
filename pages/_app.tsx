import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';

import store from 'reducers/store';
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
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <div>
          <Component {...pageProps} />
        </div>
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
    </Provider>
  );
}

export default MyApp;
