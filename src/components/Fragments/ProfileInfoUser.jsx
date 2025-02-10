import React from "react";
import { PencilLine, X } from "lucide-react";

const ProfileInfo = ({ formData, onEditProfile, isModalOpen, onClose, editedData, onInputChange, onSave }) => {
  return (
    <>
      <div className="space-y-4 lg:space-y-6 w-full">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Profile Saya</h1>

        <div className="bg-white shadow-lg rounded-xl lg:rounded-2xl p-4 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-4 lg:gap-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-6 w-full">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-blue-100 flex-shrink-0">
                <img
                  src={formData.photo || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center lg:text-left">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800">{formData.name}</h2>
                <p className="text-gray-500 text-base lg:text-lg">{formData.bio}</p>
                <p className="text-gray-500">{formData.address}</p>
              </div>
            </div>
            <button
              onClick={onEditProfile}
              className="btn-secondary flex items-center gap-2 w-full lg:w-auto justify-center"
            >
              <PencilLine size={18} />
              Edit bio
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Profil</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                      <img
                        src={editedData.photo || "https://via.placeholder.com/150"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <PencilLine size={18} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedData.name}
                    onChange={onInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editedData.bio}
                    onChange={onInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={editedData.address}
                    onChange={onInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
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

export default ProfileInfo;