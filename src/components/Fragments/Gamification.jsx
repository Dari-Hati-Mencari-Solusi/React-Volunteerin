import React, { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { Icon } from "@iconify/react";
import Navbar from "../../components/navbar/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import { toast } from "react-toastify";
import Coin from "../../assets/images/coin.png";

const Gamification = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    bio: "",
  });

  const missions = [
    {
      id: 1,
      title: "Login setiap hari",
      description: "Masuk ke website volunteerin setiap hari",
      points: 10,
      icon: Coin,
      completed: false,
    },
    {
      id: 2,
      title: "Mengikuti event relawan",
      description: "Ikuti kegiatan relawan minimal 1 kali",
      points: 100,
      icon: Coin,
      completed: false,
    },
    {
      id: 3,
      title: "Jelajahi website volunteerin",
      description: "Akses website ini selama 10 menit",
      points: 50,
      icon: Coin,
      completed: false,
    },
    {
      id: 4,
      title: "Share event kerelawanan",
      description: "Bagikan kegiatan relawan sebanyak 3 kali",
      points: 0,
      icon: null,
      completed: true,
    },
  ];

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
          <span className="text-[#0A3E54] text-xl font-medium">Misi Event</span>
        </div>
        <div className="h-[1px] bg-gray-200 w-full mb-10"></div>
        <div className="space-y-8">
          <h1 className="text-2xl font-bold text-[#0A3E54]">
            Misi yang Tersedia
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-4">
            {missions.map((mission) => (
              <div
                key={mission.id}
                className={`
                  flex items-center justify-between 
                  p-4 rounded-lg 
                  ${mission.completed ? "bg-gray-100" : "bg-white"}
                  border border-gray-200 shadow-[0px_0px_15px_-1px_rgba(0,_0,_0,_0.1)]
                  min-h-[72px]
                `}
              >
                <div className="flex-grow items-center">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm md:text-lg text-[#0A3E54] mr-2">
                      {mission.title}
                    </h3>
                    {mission.points > 0 && (
                      <div className="flex items-center text-[#FFCC29] px-2  rounded-full">
                        <span className="lg:text-2xl md:text-2xl text-lg font-bold mr-2 drop-shadow-[0_2px_2px_rgba(255,204,41,0.5)]">
                          + {mission.points}
                        </span>
                        {mission.icon && (
                          <img
                            src={mission.icon}
                            alt="Coin"
                            className="md:w-8 md:h-8 lg:w-8 lg:h-8 h-6 w-6"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs md:text-sm lg:text-sm text-gray-600 leading-relaxed">
                      {mission.description}
                    </p>
                  </div>
                </div>

                {mission.completed ? (
                  <Icon
                    icon="mdi:check-circle"
                    className="text-green-500 w-8 h-8"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10">
          <Link
            to="/profile-user"
            className="px-10 py-3 bg-[#0A3E54] text-white rounded-xl"
          >
            Lihat Perolehan Points
          </Link>
        </div>
      </section>
      <Footer />
    </section>
  );
};

export default Gamification;
