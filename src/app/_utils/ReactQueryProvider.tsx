'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import store from '@reducers/store';
type Props = {
  children: React.ReactNode;
};

function ReactQueryProvider({ children }: Props) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: false
        }
      }
    })
  );
  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        {children}
        <ReactQueryDevtools
          initialIsOpen={process.env.NEXT_PUBLIC_MODE === 'local'}
        />
      </QueryClientProvider>
    </Provider>
  );
}

export default ReactQueryProvider;

// 'use client';
// import '@styles/globals.css';
// // import 'react-quill/dist/quill.snow.css';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useState } from 'react';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// // import { Provider } from 'react-redux';
// // import store from '@reducers/store';
// import Layout from '@components/layout';

// // import worker from '@/mocks/browser';
// function ReactQueryProvider({ children }: React.PropsWithChildren) {
//   // const { restoreState } = store.getState().user;

//   // useEffect(() => {
//   //   if (worker) {
//   //     worker
//   //       .start()
//   //       .then(() => console.log('Mock Service Worker started'))
//   //       .catch((error) =>
//   //         console.error('Failed to start Mock Service Worker', error)
//   //       );
//   //   }
//   // }, []);

//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             refetchOnWindowFocus: false
//           }
//         }
//       })
//   );

//   return (
//     // <Provider store={store}>
//     <QueryClientProvider client={queryClient}>
//       <Layout>
//         {/* <MSWComponent /> */}
//         {children}
//         {/* <SessionProvider session={pageProps.session}> */}
//         {/* <Component {...pageProps} /> */}
//         {/* </SessionProvider> */}
//       </Layout>
//       <ReactQueryDevtools initialIsOpen />
//     </QueryClientProvider>
//     // </Provider>
//   );
// }

// export default ReactQueryProvider;
