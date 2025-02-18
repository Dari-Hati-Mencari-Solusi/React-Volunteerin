import React from "react";
import IconMarket from "../../assets/images/icon.png";
import { Icon } from "@iconify/react";

const Marketing = () => {
  return (
    <section>
      <div className="py-5">
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="bg-[#FBFBFB] border border-gray-200 space-y-2 rounded-[12px] p-6 w-full md:w-1/2 text-[#0A3E54]">
            <div className="flex items-center gap-4 ">
              <div>
                <h1 className="font-semibold text-xl">
                  Masih Bingung Daftar Volunteer?
                </h1>
                <p>
                  Dengan platform volunteer kami, kamu bisa menemukan berbagai
                  peluang relawan sesuai minat dan keahlianmu.
                </p>
                <a
                  href="#"
                  className="flex items-center gap-2 mt-4 text-sm font-medium"
                >
                  Coba gabung volunteerin
                  <span className="bg-[#0A3E54] p-[4px] text-white rounded-full">
                    <Icon icon="ph:handshake-fill" width="22" height="22" />
                  </span>
                </a>
              </div>
              <div className="hidden lg:block">
                <img src={IconMarket} alt="market" className="md:w-40" />
              </div>
            </div>
          </div>
          <div className="bg-[#FBFBFB] border border-gray-200 space-y-2 rounded-[12px] p-6 w-full md:w-1/2 text-[#0A3E54]">
            <div className="flex items-center gap-4 ">
              <div>
                <h1 className="font-semibold text-xl">
                  Masih Bingung Daftar Volunteer?
                </h1>
                <p>
                  Dengan platform volunteer kami, kamu bisa menemukan berbagai
                  peluang relawan sesuai minat dan keahlianmu.
                </p>
                <a
                  href="#"
                  className="flex items-center gap-2 mt-4 text-sm font-medium"
                >
                  Coba gabung volunteerin
                  <span className="bg-[#0A3E54] p-[4px] text-white rounded-full">
                    <Icon icon="ph:handshake-fill" width="22" height="22" />
                  </span>
                </a>
              </div>
              <div className="hidden lg:block">
                <img src={IconMarket} alt="market" className="md:w-40" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#FBFBFB] border border-gray-200 mt-4 space-y-2 rounded-[12px] p-6 w-full text-[#0A3E54]">
          <div className="flex items-center gap-4 text-center">
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ullam
              nisi sed quia veniam vel accusamus voluptas qui aliquam. Similique
              commodi laudantium repellat dignissimos earum possimus placeat
              veniam quam ea incidunt?
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketing;
