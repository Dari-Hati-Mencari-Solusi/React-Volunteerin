import React from "react";

const Marquee = () => {
  const partners = [
    {
      name: "Traveloka",
      logo: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrGOwlQ4wcVSdr2rmAytBD3VoFfA9Ca-pxvhPdT2RtlFMWvHlJ2zfqpEX1gBU5i90DItF15IjFXtCaH1IyxlImja_DccCIj_dMaBcf4HOkBOGgntNGi1PtMJA2FWpPdFiuBGipvw4l2MNK/s16000/logo-traveloka.png",
    },
    {
      name: "Tokopedia",
      logo: "https://tropipedia.com/wp-content/uploads/2023/03/Tokopedia-Logo.png",
    },
    {
      name: "Bluebird",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSS380e_U4y3wmB0wcYklswHkBqwXvFgIzXw&s",
    },
    {
      name: "Bank Mandiri",
      logo: "https://vectorez.biz.id/wp-content/uploads/2023/10/Logo-Bank-Mandiri.png",
    },
    {
      name: "BCA",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwghoFHzlS_WYWWYH6UWWb34RVin7IY-6KWA&s",
    },
    {
      name: "Gojek",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Gojek_logo_2022.svg/2560px-Gojek_logo_2022.svg.png",
    },
    {
      name: "Grab",
      logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmLR20MuodbOOg8TjXkVL1Yry9G5YQkhvCzQ&s",
    },
    {
      name: "Tiket.com",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Tiket.com_logo.png",
    },
  ];

  return (
    <div className="bg-transparent py-8 overflow-hidden">
      <div className="marquee-container">
        <div className="marquee-content">
          {/* Content 1 */}
          {partners.map((partner, index) => (
            <div key={index} className="logo-container">
              <img src={partner.logo} alt={`${partner.name} logo`} className="logo" />
            </div>
          ))}
          {/* Content 2 - duplicate of Content 1 */}
          {partners.map((partner, index) => (
            <div key={index + partners.length} className="logo-container">
              <img src={partner.logo} alt={`${partner.name} logo`} className="logo" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
