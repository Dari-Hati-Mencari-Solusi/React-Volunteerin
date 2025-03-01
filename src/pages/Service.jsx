import React from "react";
import LogoHero from "../assets/images/logo-hero.png";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const Service = () => {
  const stats = [
    { number: "50+", label: "Partner" },
    { number: "55+", label: "Pengguna" },
    { number: "512+", label: "Event dibuat" },
  ];

  return (
    <section className="min-h-screen flex flex-col">
      <Navbar />
      <div className="mx-auto max-w-screen-xl w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center mt-8">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-400">
              Mau Gabung Event?
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
              di Volunteerin Aja
            </h2>
            <h3 className="text-xl text-slate-600">Slogan Volunteerin</h3>
            <p className="text-gray-600">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s.
            </p>

            <div className="flex gap-4">
              <button className="bg-slate-800 text-white px-6 py-2 rounded-md hover:bg-slate-700 transition-colors">
                Buat Event Kamu
              </button>
              <button className="border border-slate-800 text-slate-800 px-6 py-2 rounded-md hover:bg-slate-50 transition-colors">
                Jadi Volunteer
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-12 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-slate-800">
                    {stat.number}
                  </div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="flex items-end gap-4">
                <img src={LogoHero} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Service;
