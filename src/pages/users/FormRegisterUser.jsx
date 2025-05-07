import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Logo from "../../assets/images/logowhite.svg";

export default function FormPendaftaran() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: "",
    umur: "",
    alamat: "",
    noHp: "",
    jenisKelamin: "",
    dokumen: null,
    instansi: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        dokumen: file,
      });
      setFileName(file.name);
    }
  };

  const handleSubmit = () => {
    console.log("Data pendaftaran:", formData);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        nama: "",
        umur: "",
        alamat: "",
        noHp: "",
        jenisKelamin: "",
        dokumen: null,
        instansi: "",
      });
      setFileName("");
      setCurrentStep(1);
    }, 3000);
  };

  const navigateToHome = () => {
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen py-5 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative overflow-hidden h-40 md:h-36 lg:h-36 bg-gradient-to-r from-[#0A3E54] to-[#116173]">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#0A3E54] to-teal-400 opacity-30"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-r from-teal-400 to-[#0A3E54] opacity-30"></div>

          <div className="relative flex flex-col items-center justify-center h-full px-8 text-center" >
            <img src={Logo} alt="Logo" className="w-16 h-16" />
            <h2 className="text-2xl font-bold text-white">VOLUNTEERIN</h2>
            <p className="text-white/80 mt-1">
              Temukan Peluangmu, Wujudkan Aksimu
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-lg">
              <Icon icon="mdi:check" className="h-10 w-10 text-white" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-gray-800">
              Pendaftaran Sukses!
            </h3>
            <p className="mt-3 text-md text-gray-600">
              Terima kasih telah mendaftar sebagai relawan. Kami akan
              menghubungi Anda segera untuk informasi selanjutnya.
            </p>
            <div className="mt-8">
              <button
                onClick={navigateToHome}
                className="px-6 py-3 bg-[#0A3E54] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="mb-8 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                Form Pendaftaran
              </h3>
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentStep >= 1 ? "bg-[#0A3E54]" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`w-10 h-1 ${
                    currentStep >= 2 ? "bg-[#0A3E54]" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentStep >= 2 ? "bg-[#0A3E54]" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            </div>

            {currentStep === 1 ? (
              <div className="space-y-6">
                <p className="text-md text-gray-600 mb-6">
                  Isi data pribadi Anda untuk mulai mendaftar sebagai relawan
                </p>

                <div className="relative bg-gray-50 rounded-xl px-6 py-5">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75]">
                      <Icon icon="mdi:user" className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="nama"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Nama Lengkap <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="nama"
                      id="nama"
                      required
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white rounded-lg"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                <div className="relative bg-gray-50 rounded-xl px-6 py-5">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75]">
                      <Icon icon="mdi:calendar" className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="umur"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Umur <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      name="umur"
                      id="umur"
                      required
                      value={formData.umur}
                      onChange={handleChange}
                      min="17"
                      className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white rounded-lg"
                      placeholder="Masukkan umur"
                    />
                  </div>
                </div>

                <div className="relative bg-gray-50 rounded-xl px-6 py-5">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75] ">
                      <Icon icon="mdi:gender-male-female" className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Jenis Kelamin <span className="text-red-600">*</span>
                    </label>
                    <div className="flex md:space-x-6 lg:space-x-6 gap-3 md:space-y-0 lg:space-y-0 flex-wrap">
                      <div className="flex items-center">
                        <div className="relative w-6 h-6">
                          <input
                            type="radio"
                            name="jenisKelamin"
                            id="laki"
                            value="Laki-laki"
                            checked={formData.jenisKelamin === "Laki-laki"}
                            onChange={handleChange}
                            className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:border-[#155D75] checked:border-4 transition-all duration-200"
                          />
                        </div>
                        <label
                          htmlFor="laki"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Laki-laki
                        </label>
                      </div>
                      <div className="flex items-center">
                        <div className="relative w-6 h-6">
                          <input
                            type="radio"
                            name="jenisKelamin"
                            id="perempuan"
                            value="Perempuan"
                            checked={formData.jenisKelamin === "Perempuan"}
                            onChange={handleChange}
                            className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:border-[#155D75] checked:border-4 transition-all duration-200"
                          />
                        </div>
                        <label
                          htmlFor="perempuan"
                          className="ml-2 text-sm text-gray-700"
                        >
                          Perempuan
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 bg-[#0A3E54] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
                  >
                    Selanjutnya
                    <Icon icon="mdi:chevron-right" className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-md text-gray-600 mb-6">
                  Lengkapi informasi kontak dan dokumen
                </p>

                <div className="relative bg-gray-50 rounded-xl px-6 py-5">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75]">
                      <Icon icon="mdi:phone" className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="noHp"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Nomor HP <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      name="noHp"
                      id="noHp"
                      required
                      value={formData.noHp}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white rounded-lg"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                </div>

                <div className="relative bg-gray-50 rounded-xl px-6 py-5 ">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75]">
                      <Icon icon="mdi:map-marker" className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="alamat"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Alamat <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      name="alamat"
                      id="alamat"
                      required
                      value={formData.alamat}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white rounded-lg"
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>
                </div>

                <div className="relative bg-gray-50 rounded-xl px-6 py-5">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75]">
                      <Icon icon="mdi:school" className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="instansi"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Instansi / Universitas <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="instansi"
                      id="instansi"
                      required
                      value={formData.instansi}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white rounded-lg"
                      placeholder="Nama instansi atau universitas"
                    />
                  </div>
                </div>

                <div className="relative bg-gray-50 rounded-xl px-6 py-5">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#155D75]">
                      <Icon icon="mdi:file-document-outline" className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="dokumen"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Dokumen Pendukung
                    </label>
                    <div className="relative border-2 border-dashed border-[#0A3E54] rounded-xl bg-white transition-colors p-4">
                      <div className="flex items-center justify-center">
                        {!fileName ? (
                          <div className="text-center py-4">
                            <Icon icon="mdi:upload" className="mx-auto h-10 w-10 text-[#0A3E54]" />
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-medium text-[#0A3E54] cursor-pointer">
                                Klik untuk upload
                              </span>{" "}
                              atau drag & drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, DOC hingga 10MB
                            </p>
                          </div>
                        ) : (
                          <div className="bg-indigo-50 p-3 rounded-lg flex items-center w-full">
                            <Icon icon="mdi:file-document-outline" className="h-6 w-6 text-[#088FB2] mr-3" />
                            <span className="text-sm text-gray-700 truncate">
                              {fileName}
                            </span>
                            <button
                              onClick={() => setFileName("")}
                              className="ml-auto text-sm text-[#0A3E54]"
                            >
                              Ganti
                            </button>
                          </div>
                        )}
                        <input
                          id="dokumen"
                          name="dokumen"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-[#0A3E54] text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}