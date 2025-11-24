import type { Metadata } from 'next';
import ReactQueryProvider from './_utils/ReactQueryProvider';
import './globals.css';
import HeadMenu from '@app/_components/headmenu';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'image-market'
};

type Props = {
  children: React.ReactNode;
};
// const preScript = `
// (function () {
//   try {
//     let w = Math.max(
//       window.innerWidth || 0,
//       document.documentElement.clientWidth || 0
//     );

//     let cols = w < 640 ? 1 : w < 1024 ? 2 : w < 1440 ? 3 : 6;
//     // document.documentElement.classList.add('cols-' + cols);
//     document.body.dataset.cols = w;
//     // document.documentElement.dataset.cols = w;
//     document.documentElement.dataset.viewport = 'tablet';

//     console.log(cols, document.body.className, 'TTTTAAA');

//     // 다음 요청용으로 저장 (옵션)
//     document.cookie =
//       'client_vw=' + w + '; path=/; max-age=' + 24 * 60 * 60 + '; SameSite=Lax';
//   } catch (e) {
//     console.error(e, 'pre Error');
//   }
// })();
// `.trim();

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <head>
        {/* <Script src="/early_masonry.js" strategy="beforeInteractive" /> */}
        <script src="/early_masonry.js" />
        {/* <Script src="/pre-hydration.js" strategy="beforeInteractive" /> */}
        {/* <script dangerouslySetInnerHTML={{ __html: preScript }} /> */}
      </head>
      <body className="h-full">
        <ReactQueryProvider>
          <HeadMenu />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
