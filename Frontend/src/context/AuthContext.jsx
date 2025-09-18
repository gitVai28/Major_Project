import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const BACKEND_URL = "http://localhost:5000"; // Adjust if deployed

  // Load user from localStorage if token exists
  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Ensure profilePhoto has full URL
          if (parsedUser.profilePhoto && !parsedUser.profilePhoto.startsWith("http")) {
            parsedUser.profilePhoto = `${BACKEND_URL}${parsedUser.profilePhoto}`;
          }
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing stored user:", error);
          localStorage.removeItem("user");
        }
      }
    }
  }, [token]);

  const login = (userData, token) => {
    if (!userData?.name) {
      console.warn("⚠️ userData has no 'name' field, please check backend response");
    }

    // Ensure profilePhoto has full URL
    let updatedUser = { ...userData };
    if (updatedUser.profilePhoto && !updatedUser.profilePhoto.startsWith("http")) {
      updatedUser.profilePhoto = `${BACKEND_URL}${updatedUser.profilePhoto}`;
    }

    setUser(updatedUser);
    setToken(token);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
