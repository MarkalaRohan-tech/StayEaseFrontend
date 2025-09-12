import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";

const LoginRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 300);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-yellow-400 font-semibold">Redirecting...</p>
    </div>
  );
};

export default LoginRedirect;
