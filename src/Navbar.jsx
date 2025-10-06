import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "./Context/UserContext";
import {
  Menu,
  X,
  Home,
  MapPin,
  Mountain,
  Building,
  User,
  LogIn,
} from "lucide-react";

const Navbar = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when clicking outside or on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };

    const handleClickOutside = (e) => {
      if (
        isSidebarOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".hamburger-btn")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Close sidebar when route changes
  const handleNavLinkClick = () => {
    setIsSidebarOpen(false);
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const navigationItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/nearby", label: "Nearby Stays", icon: MapPin },
    { to: "/tour", label: "Tour Stays", icon: Mountain },
    { to: "/listProperty", label: "List Property", icon: Building },
  ];

  return (
    <>
      {/* Desktop and Mobile Navbar */}
      <div className="navbar w-full h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between shadow-md bg-white/97 fixed top-0 z-50">
        {/* Logo Section */}
        <div className="flex items-center">
          <NavLink to="/" className="flex items-center">
            <img
              src="/Images/Logo/logo3.png"
              className="w-12 h-12 sm:w-[60px] sm:h-[60px] object-contain"
              alt="NavLogo"
            />
          </NavLink>
        </div>

        {/* Desktop Navigation Links - Hidden on medium and below */}
        <div className="hidden lg:flex gap-6 items-center text-gray-700 font-medium text-base">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-500 font-semibold transition-colors duration-200"
                  : "hover:text-yellow-400 transition-colors duration-200"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {user ? (
            <NavLink
              id="account"
              to="/account"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-500 font-semibold transition-colors duration-200"
                  : "hover:text-yellow-400 transition-colors duration-200"
              }
            >
              My Account
            </NavLink>
          ) : (
            <NavLink to="/login">
              <button
                id="login"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Login
              </button>
            </NavLink>
          )}
        </div>

        {/* Mobile Hamburger Menu - Visible on medium and below */}
        <div className="lg:hidden">
          <button
            className="hamburger-btn p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`sidebar fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="/Images/Logo/logo3.png"
              className="w-10 h-10 object-contain"
              alt="Logo"
            />
            <span className="text-lg font-semibold text-gray-800">Menu</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={handleNavLinkClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-yellow-100 text-yellow-600 border-l-4 border-yellow-500"
                          : "text-gray-700 hover:bg-gray-100 hover:text-yellow-500"
                      }`
                    }
                  >
                    <IconComponent className="w-5 h-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Account Section */}
          <div className="border-t border-gray-200 p-4">
            {user ? (
              <NavLink
                to="/account"
                onClick={handleNavLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-100 text-yellow-600 border-l-4 border-yellow-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-yellow-500"
                  }`
                }
              >
                <User className="w-5 h-5" />
                My Account
              </NavLink>
            ) : (
              <NavLink
                to="/login"
                onClick={handleNavLinkClick}
                className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                Login
              </NavLink>
            )}

            {/* User Info Display (if logged in) */}
            {user && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 px-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {user.name || user.email || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
};

export default Navbar;
