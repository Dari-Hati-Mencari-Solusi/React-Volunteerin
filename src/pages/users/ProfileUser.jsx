import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import FotoUser from "../../assets/images/logo.png";
import {
  PencilLine,
  Mail,
  Phone,
  User,
  MapPin,
  FileText,
  X
} from "lucide-react";

const dummyUsers = [
  {
    id: 1,
    email: "hunter.sun@example.com",
    phone: "081999888777",
    name: "Hunter Sun Jinwo",
    bio: "Software Engineer",
    address: "Tokyo, Japan"
  },
  {
    id: 2,
    email: "emily.wong@example.com",
    phone: "087654321098",
    name: "Emily Wong",
    bio: "Product Manager",
    address: "Osaka, Japan"
  }
];

const ProfileUser = () => {
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [formData, setFormData] = useState(dummyUsers[0]);
  const [editedData, setEditedData] = useState({...formData});
  const [editedProfileData, setEditedProfileData] = useState({...formData});

  const handlePersonalInfoModalOpen = () => {
    setEditedData({...formData});
    setIsPersonalInfoModalOpen(true);
  };

  const handleProfileModalOpen = () => {
    setEditedProfileData({...formData});
    setIsProfileModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePersonalInfoSave = () => {
    setFormData(editedData);
    setIsPersonalInfoModalOpen(false);
  };

  const handleProfileSave = () => {
    setFormData(editedProfileData);
    setIsProfileModalOpen(false);
  };

  const renderInfoField = (icon, label, value) => (
    <div className="bg-gray-50 rounded-lg p-3 flex items-center space-x-4">
      <div className="bg-blue-100 p-2 rounded-full">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );

  return (
    <section className="bg-gray-50 min-h-screen">
      <Navbar />
      <section className="container mx-auto px-4 py-8 lg:py-24 lg:px-16">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="bg-white shadow-lg rounded-xl p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Profile Menu
            </h2>
            <ul className="space-y-2">
              <li className="bg-blue-50 text-blue-600 rounded-lg">
                <a href="#" className="block p-3 font-medium">
                  Informasi Pribadi
                </a>
              </li>
              <li>
                <a href="#" className="block p-3 hover:bg-gray-100 rounded-lg">
                  Event Favorit
                </a>
              </li>
              <li>
                <a href="#" className="block p-3 hover:bg-gray-100 rounded-lg">
                  Riwayat
                </a>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Profile Saya</h1>

            <div className="bg-white shadow-lg rounded-lg p-6 flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                  <img
                    src={FotoUser}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {formData.name}
                  </h2>
                  <p className="text-gray-500 text-lg">{formData.bio}</p>
                  <p className="text-gray-500">{formData.address}</p>
                </div>
              </div>
              <button 
                onClick={handleProfileModalOpen}
                className="btn-secondary flex items-center gap-2"
              >
                <PencilLine size={18} />
                Edit Profil
              </button>
            </div>

            {/* Personal Information Section */}
            <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-gray-800">
                  Informasi Pribadi
                </h3>
                <button
                  onClick={handlePersonalInfoModalOpen}
                  className="btn-secondary flex items-center gap-2"
                >
                  <PencilLine size={18} />
                  Edit Profil
                </button>
              </div>

              {/* Information Grid */}
              <div className="grid md:grid-cols-2 gap-4">
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
          </div>
        </div>

        {/* Personal Information Modal */}
        {isPersonalInfoModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 space-y-6 relative">
              <button
                onClick={() => setIsPersonalInfoModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6">Edit Profil</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="input-group">
                    <label htmlFor="email" className="input-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editedData.email}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="phone" className="input-label">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={editedData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="input-group">
                    <label htmlFor="name" className="input-label">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editedData.name}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="bio" className="input-label">
                      Bio
                    </label>
                    <input
                      type="text"
                      name="bio"
                      value={editedData.bio}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="input-group">
                    <label htmlFor="address" className="input-label">
                      Alamat
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editedData.address}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsPersonalInfoModalOpen(false)}
                  className="btn-secondary"
                >
                  Batal
                </button>
                <button
                  onClick={handlePersonalInfoSave}
                  className="btn-primary"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-8 space-y-6 relative">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              >
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold mb-6">Edit Profil</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="input-group">
                    <label htmlFor="name" className="input-label">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editedProfileData.name}
                      onChange={handleProfileInputChange}
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="bio" className="input-label">
                      Bio
                    </label>
                    <input
                      type="text"
                      name="bio"
                      value={editedProfileData.bio}
                      onChange={handleProfileInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="input-group">
                    <label htmlFor="address" className="input-label">
                      Alamat
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={editedProfileData.address}
                      onChange={handleProfileInputChange}
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="btn-secondary"
                >
                  Batal
                </button>
                <button
                  onClick={handleProfileSave}
                  className="btn-primary"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export default ProfileUser;