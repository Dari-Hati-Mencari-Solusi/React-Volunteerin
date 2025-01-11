import { useState } from "react";
import "./App.css";
import image from "./assets/images/Logo-Volunteerin.jpg";

function App() {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <img src={image} alt="" className="w-56"/>
        <h1 className="text-[#0A3E54] text-center text-7xl font-bold">
          Volun
          <span className="text-[#EB6B17]">teerin</span>
        </h1>
      </div>
    </>
  );
}

export default App;
