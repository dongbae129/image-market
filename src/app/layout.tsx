import type { Metadata } from 'next';
import ReactQueryProvider from './_utils/ReactQueryProvider';
import './globals.css';
import HeadMenu from '@app/_components/headmenu';
export const metadata: Metadata = {
  title: 'image-market'
};

type Props = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="h-full">
        <ReactQueryProvider>
          <HeadMenu />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
