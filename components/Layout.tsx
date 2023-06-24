import Sidebar2 from "./Sidebar2";
import Sidebar3 from "./Sidebar3";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar2 />
      <div className="flex flex-col flex-grow">
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
