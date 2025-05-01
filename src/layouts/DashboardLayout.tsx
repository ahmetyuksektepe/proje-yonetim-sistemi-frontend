import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../Header';
import Sidebar from '../Sidebar';

const DashboardLayout: React.FC = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = React.useState(false);
  const OpenSidebar = () => setOpenSidebarToggle(!openSidebarToggle);

  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />

      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />

      {/* Burada yalnızca sayfaya özgü içerik değişir */}
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
