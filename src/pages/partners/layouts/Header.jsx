import { useState } from "react";
import { useTheme } from "../../../hooks/UseTheme";
import { ChevronsLeft, ChevronDown } from "lucide-react";
import profileImg from "../../../assets/images/profile-image.jpg";
import PropTypes from "prop-types";

export const Header = ({ collapsed, setCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const [selectedOption, setSelectedOption] = useState("");

  // Data dummy untuk dropdown
  const partner = [
    {
      id: 2,
      name: "Peduli Lingkungan",
    },
  ];

  const options = [
    {
      value: "Peduli Lingkungan di Pantai Cangkring Bantul",
      label: "Peduli Lingkungan di Pantai Cangkring Bantul",
    },
    {
      value: "Volunteer Event Fotografer Pernikahan",
      label: "Volunteer Event Fotografer Pernikahan",
    },
  ];

  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors ">
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
        <div className="flex items-center relative">
          
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="h-10 w-full rounded-lg bg-transparent pr-8 font-medium text-black outline-none transition-colors appearance-none cursor-pointer px-2"
          >
            <option value="" disabled>
              Pilih Event Kamu
            </option>
            {options.map((option) => (
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
      </div>
      <div className="flex items-center gap-x-3">
        <div className="hidden lg:block lg:text-lg">
          <p className="text-black font-medium">{partner[0].name}</p>
        </div>
        <button className="size-10 overflow-hidden rounded-full">
          <img
            src={profileImg}
            alt="profile image"
            className="size-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
