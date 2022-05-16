import styles from '@styles/Layout.module.scss';
import Link from 'next/link';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Link href={'/'}>
        <a>HOME</a>
      </Link>

      {children}
    </div>
  );
};

export default Layout;
