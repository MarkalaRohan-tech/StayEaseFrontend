import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { NavLink } from "react-router";

const ErrorPage = () => {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center font-montserrat">
      {/* Icon */}
      <div className="animate-bounce mb-6">
        <FaExclamationTriangle size={80} className="text-yellow-400" />
      </div>

      {/* Title */}
      <h1 className="text-6xl font-bold text-yellow-400 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-center max-w-md mb-6">
        Oops! The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Button */}
      <NavLink to="/" className="btn btn-warning rounded-full shadow-md">
        Go Home
      </NavLink>
    </div>
  );
};

export default ErrorPage;
