import { useEffect, useState } from "react";
import { useAuth } from "./Context/UserContext";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!user) {
      setRedirecting(true);

      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  if (!user && redirecting) {
    return (
  <div className="flex flex-col justify-center items-center h-screen gap-4">
    {/* Animated Loader */}
    <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>

    {/* Redirecting Text */}
    <p className="text-lg font-semibold text-yellow-400">
      Need to login first...
      Redirecting to login...
    </p>
  </div>
    );
  }

  return children;
}