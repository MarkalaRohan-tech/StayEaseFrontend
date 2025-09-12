import React, {
  useEffect,
  useRef,
  useState,
} from "react";
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
  const { user,logout } = useAuth();
  const sliderRef = useRef(null);
  const [index, setIndex] = useState(0);
  const imageWidth = window.innerWidth;
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    handleSuccess("Logged out Successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
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
      <div className="relative flex bg-white justify-center pt-5 mt-5 items-center h-[100vh] w-[100vw] overflow-hidden">
        <div className="sliderContainer relative w-full h-[100vh] overflow-hidden">
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
        <div className="bg-white/50 w-full h-full flex flex-col justify-center items-center gap-3 absolute z-10">
          <img
            src="/Images/Logo/logo3.png"
            className="w-[200px] rounded-full shadow-2xl h-[200px]"
            alt="Logo"
          />
          <h1
            className="pacifico-regular text-center text-5xl font-bold text-yellow-400"
            style={{ WebkitTextStroke: "1.5px black" }}
          >
            Check-in to comfort, Checkout with ease.
          </h1>
        </div>
      </div>

      {/* Features Section */}
      <h1 className="pacifico-regular text-center text-6xl p-5 m-5 font-bold text-yellow-400 text-shadow-lg">
        Features
      </h1>
      <div className="flex flex-col justify-center items-center">
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

      {/* CTA Section */}
      <div className="flex flex-col justify-center mb-5 pb-5 items-center gap-5">
        <h1 className="pacifico-regular text-center text-4xl m-3 font-bold text-yellow-400 text-shadow-lg">
          To Explore more be one of us
        </h1>
        <div className="flex flex-row justify-center mb-5 pb-5 items-center gap-5">
          {user ? (
            <NavLink to="/login">
            <button
              onClick={handleLogout}
              className="btn btn-warning shadow-lg hover:shadow-xl"
            >
              <b>Logout</b>
            </button>
          </NavLink>
          ) : (
            <>
              <NavLink to="/login">
                <button className="btn btn-warning shadow-lg hover:shadow-xl">
                  <b>Login</b>
                </button>
              </NavLink>
              <NavLink to="/register">
                <button className="btn btn-warning shadow-lg hover:shadow-xl">
                  <b>Register</b>
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
