import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ onCreateTask }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="h-screen flex flex-col bg-[#f5f7fb] overflow-hidden ">
      <Header onCreateTask={onCreateTask} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? 'md:ml-30' : 'md:ml-64'
          } ml-0`}
        >
          <div className=" sm:p-6 lg:p-10 max-w-[1600px]  w-full">
            <div className="animate-fadeIn">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
