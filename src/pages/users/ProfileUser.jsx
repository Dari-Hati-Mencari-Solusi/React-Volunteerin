import React, { useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import EventFavorit from "../../components/Fragments/EventFavorit";
import ProfileInfo from "../../components/Fragments/ProfileInfoUser";
import PersonalInfo from "../../components/Fragments/PersonalInfoUser";
import FotoUser from "../../assets/images/logo.png";

const dummyUsers = [
  {
    id: 1,
    email: "hunter.sun@example.com",
    phone: "081999888777",
    name: "Hunter Sun Jinwo",
    bio: "Software Engineer",
    address: "Tokyo, Japan",
    photo: FotoUser
  },
];

const ProfileUser = () => {
  const [formData, setFormData] = useState(dummyUsers[0]);
  const [activeView, setActiveView] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({ ...formData });

  const onEditProfile = () => {
    setEditedData({ ...formData });
    setIsModalOpen(true);
  };

  const onEditPersonalInfo = () => {
    setEditedData({ ...formData });
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };

  const onSave = () => {
    setFormData({ ...editedData });
    setIsModalOpen(false);
  };

  return (
    <section className="bg-gray-50 min-h-screen">
      <Navbar />
      <section className="container mx-auto px-8 py-6 lg:py-24 lg:px-8 md:px-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-4 lg:gap-8">
          {/* Sidebar */}
          <div className="bg-white shadow-lg rounded-xl p-4 lg:p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Profile Menu
            </h2>
            <ul className="space-y-2">
              <li
                className={`${
                  activeView === "profile" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                } rounded-lg`}
              >
                <button
                  onClick={() => setActiveView("profile")}
                  className="block p-3 font-medium w-full text-left text-lg"
                >
                  Informasi Pribadi
                </button>
              </li>
              <li
                className={`${
                  activeView === "favorite" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
                } rounded-lg`}
              >
                <button
                  onClick={() => setActiveView("favorite")}
                  className="block p-3 font-medium w-full text-left text-lg"
                >
                  Event Favorit
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="space-y-4 lg:space-y-6">
            {activeView === "profile" ? (
              <>
                <ProfileInfo
                  formData={formData}
                  onEditProfile={onEditProfile}
                  isModalOpen={isModalOpen}
                  onClose={onClose}
                  editedData={editedData}
                  onInputChange={onInputChange}
                  onSave={onSave}
                />
                <PersonalInfo
                  formData={formData}
                  onEditPersonalInfo={onEditPersonalInfo}
                  isModalOpen={isModalOpen}
                  onClose={onClose}
                  editedData={editedData}
                  onInputChange={onInputChange}
                  onSave={onSave}
                />
              </>
            ) : (
              <EventFavorit />
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default ProfileUser;