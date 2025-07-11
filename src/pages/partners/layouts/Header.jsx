import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../hooks/UseTheme";
import { ChevronsLeft, ChevronDown, LogOut } from "lucide-react";
import { Icon } from "@iconify/react";
import profileImg from "../../../assets/images/profile-image.jpg";
import PropTypes from "prop-types";
import { authService } from "../../../services/authService";
import { partnerService } from "../../../services/partnerService";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const Header = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const [selectedOption, setSelectedOption] = useState("");
  const [partnerData, setPartnerData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(profileImg);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [firstName, setFirstName] = useState("Partner");
  const [fullName, setFullName] = useState("Partner");
  const [role, setRole] = useState("PARTNER");
  
  const navigate = useNavigate();
  const location = useLocation();
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Ambil data partner dan events saat komponen dimuat
  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        setLoading(true);

        // 1. Dapatkan data user dari auth service
        const user = authService.getStoredUser();
        if (user) {
          setUserData(user);
          
          // Set name data for display
          if (user.name) {
            const nameParts = user.name.split(" ");
            setFirstName(nameParts[0]);
            setFullName(user.name);
          }
          
          if (user.role) {
            setRole(user.role);
          }
          
          // Jika user memiliki profileImage, gunakan
          if (user.profileImage) {
            setProfileImage(user.profileImage);
          }
        }

        // 2. Dapatkan profil partner
        const partnerProfile = await partnerService.getPartnerProfile();
        if (partnerProfile?.data) {
          setPartnerData(partnerProfile.data);
          
          // Use organization name if available
          if (partnerProfile.data.organizationName) {
            setFullName(partnerProfile.data.organizationName);
            
            // Extract first part for firstName
            const nameParts = partnerProfile.data.organizationName.split(" ");
            setFirstName(nameParts[0]);
          }
        }

        // 3. Dapatkan daftar event partner
        const partnerEvents = await partnerService.getPartnerEvents();
        if (partnerEvents?.data?.events) {
          setEvents(partnerEvents.data.events);
          
          // Jika ada events dan belum ada yang dipilih, pilih event pertama
          if (partnerEvents.data.events.length > 0 && !selectedOption) {
            setSelectedOption(partnerEvents.data.events[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching partner data:", error);
        toast.error("Gagal memuat data penyelenggara dan event");
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, [selectedOption]);

  // Format event options untuk dropdown
  const eventOptions = events.map(event => ({
    value: event.id,
    label: event.title || "Event tanpa judul"
  }));

  // Handle event selection change
  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedOption(eventId);
    
    console.log("Selected event:", eventId);
    console.log("Current location:", location.pathname);
    
    // Navigasi ke halaman pendaftar dengan eventId
    if (eventId) {
      const targetPath = `/partner/dashboard/pendaftar/${eventId}`;
      console.log("Navigating to:", targetPath);
      navigate(targetPath);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    toast.success("Berhasil keluar dari akun");
    navigate("/login-partner");
  };

  // Toggle dropdown
  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors">
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost group size-10 rounded-full p-2 hover:bg-[#0A3E54]"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronsLeft
            size={20}
            className={`text-black transition-transform group-hover:text-white ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
        
        {loading ? (
          <div className="flex items-center h-10 px-4">
            <div className="w-4 h-4 border-2 border-t-transparent border-[#0A3E54] rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-500">Memuat...</span>
          </div>
        ) : events.length > 0 ? (
          <div className="flex items-center relative min-w-[250px]">
            <select
              value={selectedOption}
              onChange={handleEventChange}
              className="h-10 w-full rounded-lg bg-transparent pr-8 font-medium text-black outline-none transition-colors appearance-none cursor-pointer px-2"
            >
              <option value="" disabled>
                Pilih Event Kamu
              </option>
              {eventOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-white"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute right-0 pointer-events-none">
              <ChevronDown size={20} className="text-black" />
            </div>
          </div>
        ) : (
          <div className="text-gray-500 px-2">
            Belum ada event yang dibuat
          </div>
        )}
      </div>
      
      {/* Profile Section - Styled like User Navbar */}
      <div className="flex items-center gap-4 relative" ref={profileMenuRef}>
        <div className="hidden lg:flex gap-4 items-center">
          <Link
            to="/partner/dashboard/notification"
            className="text-gray-600 hover:text-[#0A3E54]"
          >
            <Icon icon="mdi:bell-outline" className="w-6 h-6" />
          </Link>
          
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center gap-2"
            >
              <div className="flex items-center bg-[#0A3E54] text-white rounded-full px-4 py-2 shadow-lg border border-gray-300">
                <Icon
                  icon="mdi:account-circle"
                  className="w-8 h-8 mr-2"
                />
                <span className="font-medium">
                  {loading ? "Loading..." : firstName || "Partner"}
                </span>
              </div>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                <div className="bg-white px-6 py-4">
                  <p className="text-xl font-semibold">
                    {fullName || "Partner"}
                  </p>
                  <p className="text-gray-500 text-sm">{role}</p>
                </div>

                <div className="flex flex-col border-t border-gray-100">
                  <Link
                    to="/partner/dashboard/profile-partner"
                    className="flex items-center gap-2 px-6 py-3 text-[#0A3E54] hover:bg-gray-50 transition duration-150"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <Icon icon="mdi:cog" className="w-6 h-6" />
                    <span className="font-medium">Pengaturan Akun</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-gray-50 transition duration-150 w-full text-left border-t border-gray-100"
                  >
                    <Icon icon="mdi:logout" className="w-6 h-6" />
                    <span className="font-medium">Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile version of profile */}
        <div className="block lg:hidden">
          <button 
            className="flex items-center bg-[#0A3E54] text-white rounded-full px-3 py-2"
            onClick={toggleProfileMenu}
          >
            <Icon icon="mdi:account-circle" className="w-7 h-7" />
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg overflow-hidden z-50">
              <div className="bg-white px-6 py-4">
                <p className="text-xl font-semibold">
                  {fullName || "Partner"}
                </p>
                <p className="text-gray-500 text-sm">{role}</p>
              </div>

              <div className="flex flex-col border-t border-gray-100">
                <Link
                  to="/partner/dashboard/profile-partner"
                  className="flex items-center gap-2 px-6 py-3 text-[#0A3E54] hover:bg-gray-50 transition duration-150"
                  onClick={() => setShowProfileMenu(false)}
                >
                  <Icon icon="mdi:cog" className="w-6 h-6" />
                  <span className="font-medium">Pengaturan Akun</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-gray-50 transition duration-150 w-full text-left border-t border-gray-100"
                >
                  <Icon icon="mdi:logout" className="w-6 h-6" />
                  <span className="font-medium">Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};