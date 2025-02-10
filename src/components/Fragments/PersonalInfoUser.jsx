import React from "react";
import { Mail, Phone, User, FileText, MapPin, PencilLine, X } from "lucide-react";

const PersonalInfo = ({ formData, onEditPersonalInfo, isModalOpen, onClose, editedData, onInputChange, onSave }) => {
  const renderInfoField = (icon, label, value) => (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-4">
      <div className="bg-blue-100 p-2 rounded-full">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Main Content */}
      <div className="bg-white shadow-lg rounded-xl lg:rounded-2xl p-4 lg:p-8 w-full">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0 mb-6">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">Informasi Pribadi</h3>
          <button
            onClick={onEditPersonalInfo}
            className="btn-secondary flex items-center gap-2 w-full lg:w-auto justify-center"
          >
            <PencilLine size={18} />
            Edit Profil
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInfoField(
            <Mail size={18} className="text-blue-500" />,
            "Email",
            formData.email
          )}
          {renderInfoField(
            <Phone size={18} className="text-green-500" />,
            "Nomor Telepon",
            formData.phone
          )}
          {renderInfoField(
            <User size={18} className="text-purple-500" />,
            "Nama",
            formData.name
          )}
          {renderInfoField(
            <FileText size={18} className="text-indigo-500" />,
            "Bio",
            formData.bio
          )}
          {renderInfoField(
            <MapPin size={18} className="text-red-500" />,
            "Alamat",
            formData.address
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Informasi Pribadi</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-4">
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Mail size={18} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editedData.email}
                      onChange={onInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Phone size={18} className="text-green-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedData.phone}
                      onChange={onInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User size={18} className="text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editedData.name}
                      onChange={onInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileText size={18} className="text-indigo-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={editedData.bio}
                      onChange={onInputChange}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <MapPin size={18} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editedData.address}
                      onChange={onInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </form>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={onSave}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PersonalInfo;