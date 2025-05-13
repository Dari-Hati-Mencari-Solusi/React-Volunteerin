import {
  ChartColumn,
  Home,
  NotepadText,
  Package,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";

import ProfileImage from "../assets/images/profile-image.jpg";
import ProductImage from "../assets/images/profile-image.jpg";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "/partner/dashboard",
      },
      {
        label: "Analytics",
        icon: ChartColumn,
        path: "/partner/dashboard/analytics",
      },
    ],
  },
  {
    title: "Penyelenggara Event",
    links: [
      {
        label: "Buat Event",
        icon: Users,
        path: "/partner/dashboard/buat-event",
      },
      {
        label: "Buat Formulir",
        icon: UserPlus,
        path: "/partner/dashboard/create-formulir",
      },
    ],
  },
  {
    title: "Volunteer",
    links: [
      {
        label: "Pendaftar",
        icon: Package,
        path: "/partner/dashboard/pendaftar",
      },
    ],
  },
  {
    title: "Management Pembayaran",
    links: [
      {
        label: "Pencairan Dana",
        icon: Settings,
        path: "/partner/dashboard/pencairan-dana",
      },
    ],
  },
  {
    title: "Profile penyelenggara",
    links: [
      {
        label: "Profile",
        icon: Home,
        path: "/partner/dashboard/profile-partner",
      },
      {
        label: "Penanggung Jawab",
        icon: ChartColumn,
        path: "/partner/dashboard/penanggung-jawab",
      },
      {
        label: "Legalitas",
        icon: NotepadText,
        path: "/partner/dashboard/legalitas",
      },
    ],
  },
  {
    title: "Media Sosial",
    links: [
      {
        label: "Instagram",
        icon: Users,
        path: "/partner/dashboard/media-sosial",
      },
    ],
  },
  {
    title: "Pusat Bantuan",
    links: [
      {
        label: "FAQ",
        icon: Users,
        path: "/partner/dashboard/faq",
      },
      {
        label: "CS Partner",
        icon: Users,
        path: "/partner/dashboard/cs-partner",
      },
      {
        label: "Panduan",
        icon: Users,
        path: "/partner/dashboard/panduan",
      },
    ],
  },
];

export const overviewData = [
  {
    name: "Jan",
    total: 1500,
  },
  {
    name: "Feb",
    total: 2000,
  },
  {
    name: "Mar",
    total: 1000,
  },
  {
    name: "Apr",
    total: 5000,
  },
  {
    name: "May",
    total: 2000,
  },
  {
    name: "Jun",
    total: 5900,
  },
  {
    name: "Jul",
    total: 2000,
  },
  {
    name: "Aug",
    total: 5500,
  },
  {
    name: "Sep",
    total: 2000,
  },
  {
    name: "Oct",
    total: 4000,
  },
  {
    name: "Nov",
    total: 1500,
  },
  {
    name: "Dec",
    total: 2500,
  },
];

