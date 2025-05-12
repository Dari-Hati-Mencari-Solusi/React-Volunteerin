import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { Icon } from "@iconify/react";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";

const ProfileUser = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const missionVolunteer = {
    type: "Point Volunteer",
    points: 1300,
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
          return;
        }

        let user = null;
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          user = JSON.parse(storedUser);
        } else {
          const profile = await authService.getUserProfile();
          user = profile.data.user;
          localStorage.setItem("user", JSON.stringify(user));
        }

        setUserData(user);
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phoneNumber: user.phoneNumber || "",
          bio: user.bio || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.updateUserProfile(formData);
      setUserData({ ...userData, ...formData });
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userData, ...formData })
      );
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    try {
      await authService.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword
      );
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.error("Failed to update password");
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Loading profile...</p>
        </div>
        <Footer />
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <section className="mx-auto w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl py-12">
        <div className="flex items-center text-[#0A3E54] lg:flex-row gap-4 py-10 lg:pt-12">
          <Link to="/">
            <Icon icon="solar:home-2-linear" width="32" height="32" />
          </Link>
          <Icon icon="weui:arrow-filled" width="24" height="28" />
          <span className="text-[#0A3E54] text-xl font-medium">
            Pengaturan Akun
          </span>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-10"></div>

        <div className="shadow-md bg-white rounded-lg">
          <div className="bg-orange-500 rounded-t-lg p-7">
            <div className="justify-center flex items-center flex-col text-center space-y-4">
              <div className="bg-orange-400 rounded-full w-32 h-32 flex items-center justify-center mr-4">
                <Icon icon="lucide:users" className="text-white w-20 h-20" />
              </div>
              <div>
                <p className="text-white text-xl font-bold">
                  {missionVolunteer.type}
                </p>
                <p className="text-white text-2xl font-bold">
                  {missionVolunteer.points.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 flex justify-center items-center">
            <Link
              to="/misi-kamu"
              className="flex items-center text-[#0A3E54] text-lg"
            >
              Lihat misi
              <span>
                <Icon icon="weui:arrow-filled" width="24" height="28" />
              </span>
            </Link>
          </div>
        </div>

        <div className="mx-auto space-y-6 mt-6">
          <div className="space-y-4">
            <div className="bg-[#FBFBFB] p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <Icon
                  icon="bxs:user"
                  width="24"
                  height="24"
                  className="text-[#0A3E54]"
                />
                <h2 className="text-xl font-medium text-[#0A3E54]">
                  Akun Saya
                </h2>
              </div>
              <div className="h-[1px] bg-gray-200 w-full mb-6"></div>
              <h3 className="text-lg mb-2 font-medium">
                Informasi Profil Anda
              </h3>
              <p className="text-md text-[#A1A1A1] mb-4">
                Lengkapi data diri anda, yuk.
              </p>

              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      className="w-full p-2 border rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                      placeholder="Alamat telah terdaftar"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Bio Anda</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      No. Handphone (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={userData ? userData.phoneNumber : ""}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                    />

                    <button
                      type="submit"
                      className="mt-6 px-12 py-3 bg-[#0A3E54] text-white rounded-[12px]"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Password Section */}
          <div className="space-y-4">
            <div className="bg-[#FBFBFB] p-6 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4 text-[#0A3E54]">
                <Icon icon="si:lock-fill" width="24" height="24" />
                <h2 className="text-xl font-medium text-[#0A3E54]">
                  Kata Sandi
                </h2>
              </div>
              <div className="h-[1px] bg-gray-200 w-full mb-6"></div>

              <h3 className="text-lg mb-2 font-medium">Ubah Kata Sandi</h3>
              <p className="text-md text-[#A1A1A1] mb-4">
                Pastikan akun kamu menggunakan kata sandi yang kuat dan aman.
              </p>

              <form onSubmit={handlePasswordUpdate}>
                <div className="gap-4 md:grid md:grid-cols-2 lg:grid lg:grid-cols-2 block">
                  <div>
                    <label className="block text-sm mb-2">
                      Kata Sandi Lama
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPassword ? "text" : "password"}
                        name="oldPassword"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2.5"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                      >
                        <Icon
                          icon={
                            showOldPassword
                              ? "heroicons:eye-slash"
                              : "heroicons:eye"
                          }
                          className="w-5 h-5 text-gray-500"
                        />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">
                      Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2.5"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <Icon
                          icon={
                            showNewPassword
                              ? "heroicons:eye-slash"
                              : "heroicons:eye"
                          }
                          className="w-5 h-5 text-gray-500"
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Konfirmasi Kata Sandi Baru
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#14464B]/20 focus:border-[#14464B]"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2.5"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <Icon
                          icon={
                            showConfirmPassword
                              ? "heroicons:eye-slash"
                              : "heroicons:eye"
                          }
                          className="w-5 h-5 text-gray-500"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-6 px-10 py-3 bg-[#0A3E54] text-white rounded-xl"
                >
                  Ubah Sandi
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </section>
  );
};

export default ProfileUser;
