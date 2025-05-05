import React from 'react';
import { Icon } from '@iconify/react';

const VolunteerinRequirements = ({ setIsLogin, handleNext }) => {
  const requirements = [
    {
      id: 1,
      text: "Volunteerin merupakan platform untuk menghubungkan antara pencari volunteer dengan penyelenggara volunteer resmi."
    },
    {
      id: 2,
      text: "Partner harus merupakan organisasi resmi yang terdaftar, seperti LSM, komunitas, perusahaan CSR, atau instansi pemerintah."
    },
    {
      id: 3,
      text: "Kegiatan yang ditawarkan harus bersifat sosial, pendidikan, lingkungan, atau kemanusiaan."
    },
    {
      id: 4,
      text: "Wajib memberikan informasi yang jelas dan lengkap terkait kegiatan, seperti tujuan, jadwal, lokasi, serta hak dan kewajiban volunteer."
    },
    {
      id: 5,
      text: "Menjamin keamanan dan kesejahteraan para volunteer selama kegiatan berlangsung."
    },
    {
      id: 6,
      text: "Bersedia bekerja sama dalam jangka panjang dengan Volunteerin untuk menyediakan peluang volunteer yang berkualitas."
    },
    {
      id: 7,
      text: "Mematuhi kebijakan dan pedoman yang telah ditetapkan oleh Volunteerin."
    },
    {
      id: 8,
      text: "Mematuhi kebijakan dan pedoman yang telah ditetapkan oleh Volunteerin."
    }
  ];

  const handlePrevious = () => {
    setIsLogin(true); // This should switch back to the form
  };

  return (
    <div className="space-y-4">      
      <div className="bg-white border border-[#DEDEDE] p-5 rounded-xl">
        <div className="h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="space-y-4 py-4">
            {requirements.map((requirement) => (
              <div key={requirement.id} className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                <span className="text-teal-700 font-medium min-w-[20px]">
                  {requirement.id}.
                </span>
                <p className="text-gray-700">
                  {requirement.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <input type="checkbox" className="w-6 h-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
        <p className='text-md font-medium'>Saya telah membaca dan menyetujui ketentuan yang berlaku.<span className='text-red-600' >*</span></p>
      </div>

      <div className="flex justify-between py-6 gap-2">
        <button
          onClick={handlePrevious}
          type="button"
          className="w-full md:w-[150px] lg:w-[150px] flex flex-row-reverse justify-center items-center gap-2 bg-white border border-[#0A3E54] text-[#0A3E54] py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
        >
          Sebelumnya
          <Icon icon="ic:round-keyboard-arrow-left" width="24" height="24" />
        </button>
        
        <button
          type="button"
          className="w-full md:w-[150px] lg:w-[150px] flex justify-center items-center gap-2 bg-[#0A3E54] text-white py-2 rounded-xl font-medium hover:bg-[#0A3E54]/90 transition-colors duration-200"
        >
          Daftar Partner
        </button>
      </div>
    </div>
  );
};

export default VolunteerinRequirements;