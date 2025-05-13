import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "../../hooks/UseClickOutside";

import { Sidebar } from "./layouts/SidebarNav";
import { Header } from "../admin/layouts/Header";

import { cn } from "../../utils/cn";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import Dashboard from "./Dashboard";
import UserManagement from "./UserManagement";
import PartnerRole from "./PartnerRole";

const LayoutAdmin = () => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktopDevice);
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && !collapsed) {
      setCollapsed(true);
    }
  });

  const renderContent = () => {
    const path = location.pathname;

    if (path === "/admin/dashboard") {
      return <Dashboard />;
    } else if (path === "/admin/data-user") {
      return <UserManagement />;
    } else if (path === "/admin/data-partner") {
      return <PartnerRole />;
    }

    return <Dashboard />;
  };

  return (
    <div className="min-h-screen bg-white transition-colors">
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
          !collapsed &&
            "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30"
        )}
      />
      <Sidebar ref={sidebarRef} collapsed={collapsed} />
      <div
        className={cn(
          "transition-[margin] duration-300",
          collapsed ? "md:ml-[70px]" : "md:ml-[240px]"
        )}
      >
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
