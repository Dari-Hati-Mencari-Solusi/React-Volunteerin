import React, {useState} from 'react'
import UploadKTP from '../Elements/forms/UploadKTP';

const LegalitasPage = () => {
  const [formData, setFormData] = useState({
    namaDocument: "",
    document: null,
    keterangan: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      <h1 className="title">Legalitas</h1>
      <div className="w-full">
        <div className="bg-[#0A3E54] text-white p-3 rounded-t-xl">
          <h2 className="text-lg font-semibold">Data Legalitas</h2>
        </div>
        <div className="bg-[#F7F7F7] p-6 rounded-b">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nama Dokumen <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="namaPenanggungJawab"
                value={formData.namaDocument}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white"
              />
            </div>

            <UploadKTP/>

            <div>
              <label className="block text-sm font-medium mb-2">
                Keterangan
              </label>
              <textarea id="message" rows="4" className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0a3e54]/20 focus:border-[#0a3e54] bg-white" placeholder="Tambahkan keterangan anda disini..."></textarea>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-[#0A3E54] text-white rounded-lg font-medium hover:bg-[#0a2e3e] transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LegalitasPage
