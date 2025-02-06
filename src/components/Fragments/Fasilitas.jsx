import React from "react";
import {
  Package,
  Utensils,
  Bus,
  BookOpen,
  Shirt,
  Award,
  Heart,
  GraduationCap,
  Wallet,
} from "lucide-react";

const Fasilitas = () => {
  const facilities = [
    {
      icon: <Package className="w-5 h-5" />,
      title: "Akomodasi Program",
      description: "Tempat tinggal selama program berlangsung",
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      title: "Konsumsi",
      description: "Makan 3 kali sehari selama program",
    },
    {
      icon: <Bus className="w-5 h-5" />,
      title: "Transportasi",
      description: "Transportasi dari kota terdekat ke lokasi",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Peralatan Mengajar",
      description: "Alat tulis dan material pembelajaran",
    },
    {
      icon: <Shirt className="w-5 h-5" />,
      title: "Seragam Volunteer",
      description: "Seragam resmi program volunteer",
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Sertifikat",
      description: "Sertifikat keikutsertaan program",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Asuransi Kesehatan",
      description: "Perlindungan kesehatan selama program",
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Pelatihan",
      description: "Pelatihan pengajaran sebelum penempatan",
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      title: "Tunjangan",
      description: "Tunjangan bulanan selama program",
    },
  ];

  return (
    <div className="bg-white rounded-xl">
      <h2 className="text-xl md:text-2xl font-bold text-black mb-6">
        Fasilitas Program
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {facilities.map((item, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-shrink-0 p-2 bg-[#0A3E54]/10 rounded-lg text-[#0A3E54]">
              {item.icon}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fasilitas;
