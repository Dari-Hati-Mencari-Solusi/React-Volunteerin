import { useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Calendar,
  GraduationCap,
  FileText,
  Upload,
  Check,
  ChevronRight,
} from "lucide-react";
import Logo from "../assets/images/logowhite.svg";

export default function FormPendaftaran() {
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

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen py-5 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative overflow-hidden h-36 bg-gradient-to-r from-[#0A3E54] to-[#116173]">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#0A3E54] to-teal-400 opacity-30"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-r from-teal-400 to-[#0A3E54] opacity-30"></div>

          <div className="relative flex flex-col items-center justify-center h-full px-8 text-center">
            <img src={Logo} alt="Logo" className="w-16 h-16" />
            <h2 className="text-2xl font-bold text-white">VOLUNTEERIN</h2>
            <p className="text-white/80 mt-1">
              Temukan Peluangmu, wujudkan Aksimu
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-400 to-green-500 shadow-lg">
              <Check className="h-10 w-10 text-white" />
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
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
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

                {/* Nama */}
                <div className="relative bg-gray-50 rounded-xl px-6 py-5 hover:shadow-md transition-all duration-200 group">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-all duration-200">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="nama"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama"
                      id="nama"
                      required
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>

                {/* Umur */}
                <div className="relative bg-gray-50 rounded-xl px-6 py-5 hover:shadow-md transition-all duration-200 group">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-all duration-200">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="umur"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Umur
                    </label>
                    <input
                      type="number"
                      name="umur"
                      id="umur"
                      required
                      value={formData.umur}
                      onChange={handleChange}
                      min="17"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Masukkan umur"
                    />
                  </div>
                </div>

                {/* Jenis Kelamin */}
                <div className="relative bg-gray-50 rounded-xl px-6 py-5 hover:shadow-md transition-all duration-200 group">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-all duration-200">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Jenis Kelamin
                    </label>
                    <div className="flex space-x-6">
                      <div className="flex items-center">
                        <div className="relative w-6 h-6">
                          <input
                            type="radio"
                            name="jenisKelamin"
                            id="laki"
                            value="Laki-laki"
                            checked={formData.jenisKelamin === "Laki-laki"}
                            onChange={handleChange}
                            className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:border-indigo-600 checked:border-4 transition-all duration-200"
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
                            className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:border-indigo-600 checked:border-4 transition-all duration-200"
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
                    <ChevronRight className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-md text-gray-600 mb-6">
                  Lengkapi informasi kontak dan dokumen
                </p>

                {/* No HP */}
                <div className="relative bg-gray-50 rounded-xl px-6 py-5 hover:shadow-md transition-all duration-200 group">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-all duration-200">
                      <Phone className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="noHp"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Nomor HP
                    </label>
                    <input
                      type="tel"
                      name="noHp"
                      id="noHp"
                      required
                      value={formData.noHp}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                </div>

                {/* Alamat */}
                <div className="relative bg-gray-50 rounded-xl px-6 py-5 hover:shadow-md transition-all duration-200 group">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-all duration-200">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="alamat"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Alamat
                    </label>
                    <textarea
                      name="alamat"
                      id="alamat"
                      required
                      value={formData.alamat}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Masukkan alamat lengkap"
                    />
                  </div>
                </div>

                {/* Instansi / Universitas */}
                <div className="relative bg-gray-50 rounded-xl px-6 py-5 hover:shadow-md transition-all duration-200 group">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-all duration-200">
                      <GraduationCap className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="instansi"
                      className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                      Instansi / Universitas
                    </label>
                    <input
                      type="text"
                      name="instansi"
                      id="instansi"
                      required
                      value={formData.instansi}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Nama instansi atau universitas"
                    />
                  </div>
                </div>

                {/* Dokumen Pendukung */}
                <div className="relative bg-gray-50 rounded-xl px-6 py-5 hover:shadow-md transition-all duration-200 group">
                  <div className="absolute top-5 left-6">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 group-hover:bg-indigo-200 transition-all duration-200">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-16">
                    <label
                      htmlFor="dokumen"
                      className="block text-sm font-semibold text-gray-700 mb-3"
                    >
                      Dokumen Pendukung
                    </label>
                    <div className="relative border-2 border-dashed border-indigo-300 rounded-xl bg-white hover:border-indigo-400 transition-colors p-4">
                      <div className="flex items-center justify-center">
                        {!fileName ? (
                          <div className="text-center py-4">
                            <Upload className="mx-auto h-10 w-10 text-indigo-400" />
                            <p className="mt-2 text-sm text-gray-600">
                              <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
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
                            <FileText className="h-6 w-6 text-indigo-500 mr-3" />
                            <span className="text-sm text-gray-700 truncate">
                              {fileName}
                            </span>
                            <button
                              onClick={() => setFileName("")}
                              className="ml-auto text-sm text-indigo-600 hover:text-indigo-800"
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
