import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const BtnHistory = () => {
  return (
    <Link to='/regis-event' className="bg-[#0A3E54] rounded-[12px] text-white font-semibold lg:w-[168px] md:w-[168px] w-[140px] py-3 text-center flex items-center justify-center gap-2">
      <Icon icon="material-symbols:fact-check-rounded" width="24" height="24" />
      <h1 className="text-sm md:text-[18px] font-normal">Riwayat</h1>
    </Link>
  );
};

export default BtnHistory;
