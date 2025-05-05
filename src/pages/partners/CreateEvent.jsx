import React, { useState } from "react";
import EventForm from "../../components/Elements/forms/Event";
import Date from "../../components/Elements/forms/Date";
import Location from "../../components/Elements/forms/Location";
import Volunteer from "../../components/Elements/forms/Volunteer";
import RegistrationFee from "../../components/Elements/forms/RegistrationFee";
import BannerUpload from "../../components/Elements/forms/BannerUpload";
import Swal from "sweetalert2";

const CreateEvent = ({ onBack }) => {
  const [isReadyToPublish, setIsReadyToPublish] = useState(false);

  const handleToggle = () => {
    setIsReadyToPublish(!isReadyToPublish);
  };

  const handleCreateEvent = () => {
    Swal.fire({
      title: "Memproses...",
      text: "Sedang membuat event, harap tunggu.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setTimeout(() => {
      Swal.close();
      if (isReadyToPublish) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Event berhasil dibuat dan dipublish!",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Berhasil!",
          text: "Event berhasil dibuat tetapi belum dipublish.",
          confirmButtonText: "OK",
        });
      }
    }, 2000);
  };

  return (
    <section className="space-y-6">
      <h1 className="title">Events</h1>
      <EventForm />
      <Date />
      <Location />
      <Volunteer />
      <RegistrationFee />
      <BannerUpload />

      {/* Toggle Switch */}
      <div className="flex items-center space-x-2">
        <label
          htmlFor="publish-toggle"
          className="text-sm font-medium text-gray-700"
        >
          Siap dipublish?
        </label>
        <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            id="publish-toggle"
            checked={isReadyToPublish}
            onChange={handleToggle}
            className="hidden"
          />
          <button
            onClick={handleToggle}
            className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 focus:outline-none ${
              isReadyToPublish ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                isReadyToPublish ? "translate-x-7" : "translate-x-1"
              }`}
            ></div>
          </button>
        </div>
      </div>

      <button
        onClick={onBack}
        className="bg-[#0A3E54] py-2 px-4 text-white rounded-lg mt-4"
      >
        Kembali
      </button>

      <button
        onClick={handleCreateEvent}
        className="bg-[#0A3E54] py-2 px-4 text-white rounded-lg mt-4 ml-4"
      >
        Buat Event
      </button>

    </section>
  );
};

export default CreateEvent;
