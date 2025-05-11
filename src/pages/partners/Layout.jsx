import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "../../hooks/UseClickOutside";

import { Sidebar } from "./layouts/SidebarNav";
import { Header } from "../partners/layouts/Header";

import { cn } from "../../utils/cn";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import DashboardPartner from "./DashboardPartner";
import Analytics from "../../components/Fragments/AnalyticPage";
import CreateEvent from "../../pages/partners/CreateEvent";
import ListEvents from "../../components/Fragments/ListEvents";
import CreateFormulirPage from "../../components/Fragments/CreateFormulirPage";
import VolunteerPage from "../../components/Fragments/VolunteerPage";
import WithDrawPage from "../../components/Fragments/WithDrawPage";
import ProfilePartnerPage from "../../components/Fragments/ProfilePartnerPage";
import ResponsiblePartnerPage from "../../components/Fragments/ResponsiblePartner";
import LegalitasPage from "../../components/Fragments/LegalitasPage";

const Layout = () => {
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
    // Extract the current path and use it to determine which content to display
    const path = location.pathname;
    const contentKey = path.split('/').pop(); // Get the last segment of the path

    switch (contentKey) {
      case "dashboard":
        return <DashboardPartner />;
      case "analytics":
        return <Analytics />;
      case "buat-event":
        return <ListEvents />;
      case "create-event":
        return <CreateEvent />;
      case "create-formulir":
        return <CreateFormulirPage />;
      case "pendaftar":
        return <VolunteerPage />;
      case "pencairan-dana":
        return <WithDrawPage />;
      case "profile-partner":
        return <ProfilePartnerPage />;
      case "penanggung-jawab":
        return <ResponsiblePartnerPage />;
      case "legalitas":
        return <LegalitasPage />;
      default:
        return <DashboardPartner />;
    }
  };

  return (
    <div className="min-h-screen bg-white transition-colors ">
      <div
        className={cn(
          "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
          !collapsed &&
            "max-md:pointer-events-auto max-md:z-50 max-md:opacity-30"
        )}
      />
      <Sidebar
        ref={sidebarRef}
        collapsed={collapsed}
      />
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

export default Layout;