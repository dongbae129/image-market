import type { Metadata } from 'next';
import ReactQueryProvider from './_utils/ReactQueryProvider';
import './globals.css';
import HeadMenu from '@app/_components/headmenu';
import Script from 'next/script';
import MswProvider from '@mocks/MswProvider';
import Header from '@app/board/_component/BoardHeader';

export const metadata: Metadata = {
  title: 'image-market'
};

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function RootLayout({ children, modal }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* <Script src="/early_masonry.js" strategy="beforeInteractive" /> */}
        <script src="/early_masonry.js" />
        {/* <Script src="/pre-hydration.js" strategy="beforeInteractive" /> */}
        {/* <script dangerouslySetInnerHTML={{ __html: preScript }} /> */}
      </head>
      <body className="h-full bg-slate-100/80" suppressHydrationWarning>
        {/* <MswProvider> */}
        <ReactQueryProvider>
          <Header />
          {/* <HeadMenu /> */}
          {children}
          {modal}
        </ReactQueryProvider>
        {/* </MswProvider> */}
      </body>
    </html>
  );
}
