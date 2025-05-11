import { forwardRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navbarLinks } from "../../../constants";
import LogoVolunter from "../../../assets/images/logowhite.svg";
import { cn } from "../../../utils/cn";
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(null);

  useEffect(() => {
    // Extract the content key from the current path
    const path = location.pathname;
    const contentKey = path.split('/').pop(); // Get the last segment of the path
    
    if (contentKey) {
      setActiveLink(contentKey);
    } else {
      setActiveLink("dashboard");
    }
  }, [location]);

  const handleNavClick = (e, path) => {
    e.preventDefault();
    navigate(path); // Use React Router's navigate to change routes
  };

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-00[transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1),_background-color_150ms_cubic-bezier(0.4,_0,_0.2,_1),_border_150ms_cubic-bezier(0.4,_0,_0.2,_1)] bg-[#0A3E54]",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      <div className="flex gap-x-3 p-3">
        <img src={LogoVolunter} alt="" className="w-8"/>
        {!collapsed && (
          <p className="text-2xl font-medium text-white transition-colors">
            Volunteerin
          </p>
        )}
      </div>
      <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
        {navbarLinks.map((navbarLink) => (
          <nav
            key={navbarLink.title}
            className={cn("sidebar-group", collapsed && "md:items-center")}
          >
            <p
              className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}
            >
              {navbarLink.title}
            </p>
            {navbarLink.links.map((link) => {
              // Extract the last part of the path for comparison
              const pathSegments = link.path.split('/');
              const contentKey = pathSegments[pathSegments.length - 1];
              const isActive = activeLink === contentKey;

              return (
                <a
                  key={link.label}
                  href={link.path}
                  className={cn(
                    "sidebar-item",
                    collapsed && "md:w-[45px]",
                    isActive && "active"
                  )}
                  onClick={(e) => handleNavClick(e, link.path)}
                >
                  <link.icon size={22} className="flex-shrink-0" />
                  {!collapsed && (
                    <p className="whitespace-nowrap">{link.label}</p>
                  )}
                </a>
              );
            })}
          </nav>
        ))}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool
};  