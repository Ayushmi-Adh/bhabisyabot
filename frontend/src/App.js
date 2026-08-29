import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/stars.css";
import ConstellationBackground from "./ConstellationBackground";

function App() {
  const navigate = useNavigate();
  const titleRef = useRef(null);

  // Parallax mouse effect for title
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (titleRef.current) {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 20;
        const y = (e.clientY / innerHeight - 0.5) * 20;
        titleRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden 
                bg-gradient-to-b from-indigo-950 via-purple-950 to-black 
                flex items-center justify-center">

      {/* Constellation Background */}
      <ConstellationBackground />

      {/* Star layers */}
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Nebula Fog overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-purple-900 via-indigo-900 to-black opacity-20 animate-nebula"></div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">

        {/* Title */}
        <h1 ref={titleRef} className="text-5xl md:text-7xl font-extrabold mb-4 text-white tracking-tight animate-fadeIn drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">
          Welcome to
          <span className="ml-3 bg-clip-text text-transparent 
                           bg-gradient-to-r from-indigo-300 to-purple-400 
                           font-extrabold drop-shadow-[0_0_6px_rgba(150,120,255,0.4)]">
            BhabisyaBot
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-xl md:text-2xl mb-12 animate-fadeIn delay-200">
          Discover your future with AI-powered guidance
        </p>

        {/* Underline */}
        <div className="mx-auto w-40 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 opacity-60 mb-12 animate-expand" />

        {/* Button */}
        <button
          onClick={() => navigate("/chat")}
          className="px-12 py-4 text-2xl font-semibold rounded-full text-white 
                     bg-gradient-to-r from-indigo-600 to-purple-600
                     shadow-[0_0_20px_rgba(120,80,255,0.55)]
                     hover:shadow-[0_0_35px_rgba(130,90,255,0.85)]
                     hover:scale-[1.04]
                     transition-all duration-300 animate-fadeIn delay-300"
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );
}

export default App;
