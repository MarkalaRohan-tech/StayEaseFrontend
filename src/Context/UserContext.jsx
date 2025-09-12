import { createContext, useContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Just clear state and storage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const setupAutoLogout = (jwtToken) => {
    if (!jwtToken) return;

    try {
      const decoded = jwtDecode(jwtToken);
      const expiry = decoded.exp * 1000;
      const timeout = expiry - Date.now();

      if (timeout > 0) {
        setTimeout(() => {
          logout();
        }, timeout);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Failed to decode token:", err);
      logout();
    }
  };

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);

    console.log("User logged in:", userData);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);

    setupAutoLogout(jwtToken);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setupAutoLogout(storedToken);
    }
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setupAutoLogout(storedToken);
      } else {
        setUser(null);
        setToken(null);
      }
    };

    syncAuth();

    window.addEventListener("storage", syncAuth);

    return () => window.removeEventListener("storage", syncAuth);
  }, []);


  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
