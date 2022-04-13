import styles from "@styles/Layout.module.scss";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div className={styles.headtab}>
        <div>logo</div>
        <div>search</div>
        <div>게시판</div>
        <div>cart</div>
        <div>user</div>
      </div>
      {children}
    </div>
  );
};

export default Layout;
