import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "../../hooks/UseClickOutside";

import { Sidebar } from "./layouts/SidebarNav";
import { Header } from "../partners/layouts/Header";

import { cn } from "../../utils/cn";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

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
  const params = useParams();
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
    console.log("Layout - Current path:", path);
    console.log("Layout - URL params:", params);
    
    // Handle route dengan parameter eventId ATAU route pendaftar biasa
    if (path.includes("/pendaftar")) {
      console.log("Layout - Rendering VolunteerPage (with or without eventId)");
      return <VolunteerPage />;
    }
    
    const contentKey = path.split("/").pop();
    console.log("Layout - Content key:", contentKey);

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
      case "pencairan-dana":
        return <WithDrawPage />;
      case "profile-partner":
        return <ProfilePartnerPage />;
      case "penanggung-jawab":
        return <ResponsiblePartnerPage />;
      case "legalitas":
        return <LegalitasPage />;
      case "media-sosial":
        return <div>Media Sosial Page</div>;
      case "faq":
        return <div>FAQ Page</div>;
      case "cs-partner":
        return <div>CS Partner Page</div>;
      case "panduan":
        return <div>Panduan Page</div>;
      default:
        console.log("Layout - Rendering default dashboard");
        return <DashboardPartner />;
    }
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

export default Layout;