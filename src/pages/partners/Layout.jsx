import { useMediaQuery } from "@uidotdev/usehooks";
import { useClickOutside } from "../../hooks/UseClickOutside";

import { Sidebar } from "./layouts/SidebarNav";
import { Header } from "../partners/layouts/Header";

import { cn } from "../../utils/cn";
import { useEffect, useRef, useState, useMemo, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";

// ============================================
// OPTIMASI LCP: Eager load dashboard, lazy load others
// ============================================
import DashboardPartner from "./DashboardPartner";

// Lazy load non-critical pages
const Analytics = lazy(() => import("../../components/Fragments/AnalyticPage"));
const CreateEvent = lazy(() => import("../../pages/partners/CreateEvent"));
const ListEvents = lazy(() => import("../../components/Fragments/ListEvents"));
const CreateFormulirPage = lazy(() => import("../../components/Fragments/CreateFormulirPage"));
const VolunteerPage = lazy(() => import("../../components/Fragments/VolunteerPage"));
const WithDrawPage = lazy(() => import("../../components/Fragments/WithDrawPage"));
const ProfilePartnerPage = lazy(() => import("../../components/Fragments/ProfilePartnerPage"));
const ResponsiblePartnerPage = lazy(() => import("../../components/Fragments/ResponsiblePartner"));
const LegalitasPage = lazy(() => import("../../components/Fragments/LegalitasPage"));

// ============================================
// OPTIMASI CLS: Page Loading Skeleton
// ============================================
const PageSkeleton = () => (
  <div className="flex flex-col gap-y-4">
    <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
    </div>
    <div className="h-96 bg-gray-200 animate-pulse rounded"></div>
  </div>
);

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

  // ============================================
  // OPTIMASI: Memoize renderContent to prevent re-renders
  // ============================================
  const renderContent = useMemo(() => {
    const path = location.pathname;
    const contentKey = path.split("/").pop();

    switch (contentKey) {
      case "dashboard":
        return <DashboardPartner />;
      case "analytics":
        return (
          <Suspense fallback={<PageSkeleton />}>
            <Analytics />
          </Suspense>
        );
      case "buat-event":
        return (
          <Suspense fallback={<PageSkeleton />}>
            <ListEvents />
          </Suspense>
        );
      case "create-event":
        return (
          <Suspense fallback={<PageSkeleton />}>
            <CreateEvent />
          </Suspense>
        );
      case "create-formulir":
        return (
          <Suspense fallback={<PageSkeleton />}>
            <CreateFormulirPage />
          </Suspense>
        );
      case "pendaftar":
        return (
          <Suspense fallback={<PageSkeleton />}>
            <VolunteerPage />
          </Suspense>
        );
      case "pencairan-dana":
        return (
          <Suspense fallback={<PageSkeleton />}>
            <WithDrawPage />
          </Suspense>
        );
      case "profile-partner":
        return (
          <Suspense fallback={<PageSkeleton />}>
            <ProfilePartnerPage />
          </Suspense>
        );
      case "penanggung-jawab":
        return (
          <Suspense fallback={<PageSkeleton />}>
            <ResponsiblePartnerPage />
          </Suspense>
        );
      case "legalitas":
        return (
          <Suspense fallback={<PageSkeleton />}>
            <LegalitasPage />
          </Suspense>
        );
      default:
        return <DashboardPartner />;
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white transition-colors ">
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
          {renderContent}
        </div>
      </div>
    </div>
  );
};

export default Layout;
