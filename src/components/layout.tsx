import HeadMenu from '@/components/headmenu';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="h-full">
      <HeadMenu />

      {children}
    </div>
  );
};

export default Layout;
