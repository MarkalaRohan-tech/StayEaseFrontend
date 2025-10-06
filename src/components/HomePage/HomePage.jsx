import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Context/UserContext";
import { features, images } from "./data.js";
import FeaturesRightImg from "./FeaturesRightImg";
import FeaturesLeftImg from "./FeaturesLeftImg";
import { NavLink, useNavigate } from "react-router-dom";
import Footer from "../../Footer.jsx";
import axios from "axios";
import { handleSuccess } from "../../utils.js";
import { ToastContainer } from "react-toastify";

const HomePage = () => {
  const { user, logout } = useAuth();
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [imageWidth, setImageWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    handleSuccess("Logged out Successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // Handle window resize for responsive slider
  useEffect(() => {
    const handleResize = () => {
      setImageWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("loggedInUser");
    if (storedToken && storedName) {
      setAuth({ token: storedToken, fullName: storedName });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios
      .get("/api/")
      .then((res) => {
        console.log("Backend response:", res.data);
      })
      .catch((err) => {
        console.error("Error connecting to backend:", err.message);
      });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="relative flex bg-white justify-center items-center min-h-screen w-full overflow-hidden">
        <div className="sliderContainer relative w-full h-screen overflow-hidden">
          <div
            ref={sliderRef}
            className="slider relative h-full flex transition-transform duration-700 ease-in"
            style={{
              width: `${images.length * imageWidth}px`,
              transform: `translateX(-${index * imageWidth}px)`,
            }}
          >
            {images.map((src, i) => {
              const isVisible =
                Math.abs(i - index) <= 1 ||
                (index === 0 && i === images.length - 1) ||
                (index === images.length - 1 && i === 0);

              return isVisible ? (
                <img
                  key={i}
                  src={src}
                  className="h-full w-full object-cover shrink-0"
                  alt={`slider-${i}`}
                  style={{ width: `${imageWidth}px` }}
                />
              ) : (
                <div
                  key={i}
                  className="h-full shrink-0 bg-gray-100"
                  style={{ width: `${imageWidth}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Hero Content Overlay */}
        <div className="bg-white/50 w-full h-full flex flex-col justify-center items-center gap-3 sm:gap-4 lg:gap-6 absolute z-10 px-4">
          <img
            src="/Images/Logo/logo3.png"
            className="w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-[200px] lg:h-[200px] rounded-full shadow-2xl object-contain"
            alt="Logo"
          />
          <h1
            className="pacifico-regular text-center text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 px-4 leading-tight"
            style={{
              WebkitTextStroke: "1px black",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Check-in to comfort, Checkout with ease.
          </h1>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-8 sm:py-12 lg:py-16">
        <h1 className="pacifico-regular text-center text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 lg:mb-16 font-bold text-yellow-400 text-shadow-lg">
          Features
        </h1>
        <div className="flex flex-col justify-center items-center space-y-8 sm:space-y-12 lg:space-y-16">
          {features.map((feature) =>
            feature.idx % 2 !== 0 ? (
              <FeaturesRightImg
                key={feature.idx}
                src={feature.icon}
                heading={feature.title}
                description={feature.description}
              />
            ) : (
              <FeaturesLeftImg
                key={feature.idx}
                src={feature.icon}
                heading={feature.title}
                description={feature.description}
              />
            )
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="flex flex-col justify-center items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 lg:py-16 px-4">
        <h1 className="pacifico-regular text-center text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-400 text-shadow-lg max-w-4xl leading-tight">
          To Explore more be one of us
        </h1>
        <div className="flex flex-col xs:flex-row justify-center items-center gap-3 sm:gap-4 lg:gap-6 w-full max-w-md">
          {user ? (
            <NavLink to="/login" className="w-full xs:w-auto">
              <button
                onClick={handleLogout}
                className="w-full xs:w-auto bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
              >
                Logout
              </button>
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className="w-full xs:w-auto">
                <button className="w-full xs:w-auto bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                  Login
                </button>
              </NavLink>
              <NavLink to="/register" className="w-full xs:w-auto">
                <button className="w-full xs:w-auto bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-6 py-3 sm:px-8 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                  Register
                </button>
              </NavLink>
            </>
          )}
        </div>
        <ToastContainer />
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
