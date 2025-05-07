import { useState, useEffect } from "react";
import Logo from "../../src/assets/images/logo-title.png";

const LoadingAnimation = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <div className="relative flex items-center justify-center w-80 h-80">
        <div
          className="absolute w-80 h-80 rounded-full border-4 border-transparent border-t-orange-500 border-r-orange-500 animate-spin"
          style={{ animationDuration: "3s" }}
        ></div>

        <div
          className="absolute w-72 h-72 rounded-full border-4 border-transparent border-b-orange-500 border-l-orange-500 animate-spin"
          style={{ animationDuration: "4s", animationDirection: "reverse" }}
        ></div>

        <div
          className="absolute w-80 h-80 animate-spin"
          style={{ animationDuration: "3s" }}
        >
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
        </div>
        <div
          className="absolute w-80 h-80 animate-spin"
          style={{ animationDuration: "3s" }}
        >
          <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
          <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full"></div>
        </div>

        <div className="absolute flex items-center justify-center">
          <img src={Logo} alt="Logo" className="w-48 h-48 object-contain" />

          {/* <div className="absolute z-10 text-xl font-bold text-white">
            Loading{dots}
          </div> */}
        </div>

        <div
          className="absolute w-52 h-52 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(249, 115, 22, 0.6) 0%, rgba(255,255,255,0) 70%)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
