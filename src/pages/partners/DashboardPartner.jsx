import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useTheme } from "../../hooks/UseTheme";

import { overviewData } from "../../constants/index";

import { Footer } from "../partners/layouts/Footer";

import { Icon } from "@iconify/react";

const DashboardPartner = () => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title text-[#0A3E54]">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon icon="mdi:users" width="32" height="32" />
            </div>
            <p className="card-title">Pendaftar Hari Ini</p>
          </div>
          <div className="card-body">
            <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A3E54] transition-colors">
              35 Orang
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-[#1BD113]">
              Pendaftar hari ini
              <Icon icon="mdi:trending-up" width="18" height="18" />
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon icon="ph:money-wavy-bold" width="32" height="32" />
            </div>
            <p className="card-title">Pendapatan Hari Ini</p>
          </div>
          <div className="card-body">
            <p className="md:text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A3E54] transition-colors">
              Rp.160.000,00
            </p>
            <span className="md:text-[14px] lg:text-md text-md flex w-fit items-center gap-x-2 py-1 font-medium text-[#1BD113]">
              Pendapatan hari ini
              <Icon icon="mdi:trending-up" width="18" height="18" />
            </span>
          </div>
        </div>
      </div>

      {/* Second row - 4 mini cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-child">
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon
                icon="tabler:calendar-time"
                width="24"
                height="24"
                sm-width="32"
                sm-height="32"
              />
            </div>
            <p className="title-child">Sisa Waktu</p>
          </div>
          <div className="py-4">
            <p className="subtitle flex items-center flex-wrap">
              <span className="mr-1">25</span>
              <span className="text-sm sm:text-lg text-[#1BD113] px-2">
                Hari lagi
              </span>
            </p>
          </div>
        </div>
        <div className="card-child">
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon
                icon="mdi:users"
                width="24"
                height="24"
                sm-width="32"
                sm-height="32"
              />
            </div>
            <p className="title-child">Total Pendaftar</p>
          </div>
          <div className="py-4">
            <p className="subtitle flex items-center flex-wrap">
              <span className="mr-1">25</span>
              <span className="text-sm sm:text-lg text-[#1BD113] px-2">
                Pendaftar
              </span>
            </p>
          </div>
        </div>
        <div className="card-child">
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon
                icon="mdi:payment-clock"
                width="24"
                height="24"
                sm-width="32"
                sm-height="32"
              />
            </div>
            <p className="title-child">Belum Bayar</p>
          </div>
          <div className="py-4">
            <p className="subtitle flex items-center flex-wrap">
              <span className="mr-1">25</span>
              <span className="text-sm sm:text-lg text-[#1BD113] px-2">
                Pendaftar
              </span>
            </p>
          </div>
        </div>
        <div className="card-child">
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors">
              <Icon
                icon="fluent:payment-24-filled"
                width="24"
                height="24"
                sm-width="32"
                sm-height="32"
              />
            </div>
            <p className="title-child">Total Pendapatan</p>
          </div>
          <div className="py-4">
            <p className="subtitle">Rp.2.000.000,00</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4">
        <div className="card">
          <div className="card-header">
            <p className="card-title">Analisis Rentang Waktu Pendaftar</p>
          </div>
          <div className="card-body p-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={overviewData}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorTotal1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip cursor={false} formatter={(value) => `$${value}`} />

                <XAxis
                  dataKey="name"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickMargin={6}
                />
                <YAxis
                  dataKey="total"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickFormatter={(value) => `$${value}`}
                  tickMargin={6}
                />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorTotal1)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="card">
          <div className="card-header">
            <p className="card-title">Analisis Pendapatan Waktu Pendaftar</p>
          </div>
          <div className="card-body p-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={overviewData}
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorTotal2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip cursor={false} formatter={(value) => `$${value}`} />

                <XAxis
                  dataKey="name"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickMargin={6}
                />
                <YAxis
                  dataKey="total"
                  strokeWidth={0}
                  stroke={theme === "light" ? "#475569" : "#94a3b8"}
                  tickFormatter={(value) => `$${value}`}
                  tickMargin={6}
                />

                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#colorTotal2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPartner;
