import React from "react";

const SyaratKetentuan = () => {
  const requirements = [
    "Peserta harus sudah berusia minimal 18 tahun saat mendaftar",
    "Bersedia memberikan yang terbaik dalam proses mengajar",
    "Penempatan selama 3 bulan di lokasi yang ditentukan",
    "Dapat berkolaborasi dengan volunteer lain dan masyarakat setempat",
    "Diutamakan yang memiliki pengalaman mengajar sebelumnya",
    "Kondisi fisik dan mental yang baik untuk menjalankan program",
    "Surat keterangan sehat dari dokter dan surat izin orang tua/wali",
    "Bersedia mengikuti seluruh rangkaian kegiatan dari awal hingga akhir",
  ];

  return (
    <div className="bg-white rounded-xl">
      <h2 className="text-xl md:text-xl font-bold text-black mb-6">
        Syarat & Ketentuan
      </h2>
      <div className="space-y-4">
        {requirements.map((description, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-shrink-0 items-center">
              <span className="text-[#0A3E54] font-bold text-md">
                {index + 1}.
              </span>
            </div>
            <div>
              <p className="text-md text-gray-600">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyaratKetentuan;
