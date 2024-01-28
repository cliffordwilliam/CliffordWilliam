import TokenGuard from "@/components/tokenGuard";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <TokenGuard>{children}</TokenGuard>;
};

export default Layout;
