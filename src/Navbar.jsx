import React, { useState,useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./Context/UserContext";

const Navbar = () => {
  const { user } = useAuth();
  
  
  return (
    <div className="navbar w-full h-20 px-6 flex items-center justify-between shadow-md bg-white/97 fixed top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center">
        <NavLink to="/">
          <img
            src="/Images/Logo/logo3.png"
            className="w-[60px] h-[60px] object-contain"
            alt="NavLogo"
          />
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6 items-center text-gray-700 font-medium text-base">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "text-yellow-500 font-semibold" : "hover:text-yellow-400"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/nearby"
          className={({ isActive }) =>
            isActive ? "text-yellow-500 font-semibold" : "hover:text-yellow-400"
          }
        >
          Nearby Stays
        </NavLink>
        <NavLink
          to="/tour"
          className={({ isActive }) =>
            isActive ? "text-yellow-500 font-semibold" : "hover:text-yellow-400"
          }
        >
          Explore Tour Stays
        </NavLink>
        <NavLink
          to="/listProperty"
          className={({ isActive }) =>
            isActive ? "text-yellow-500 font-semibold" : "hover:text-yellow-400"
          }
        >
          List Property
        </NavLink>
        {user ? (
          <NavLink
            id="account"
            to="/account"
            className={({ isActive }) =>
              isActive
                ? "text-yellow-500 font-semibold"
                : "hover:text-yellow-400"
            }
          >
            My Account
          </NavLink>
        ) : (
          <NavLink to="/login">
            <button id="login" className="btn btn-warning px-4 py-1 rounded shadow-md hover:shadow-lg transition-all duration-300">
              <b>Login</b>
            </button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Navbar;
