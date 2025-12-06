// src/context/AuthContext.js
import { createContext, useContext, useState } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      const parsedUser = JSON.parse(storedUser);
      // ✅ Normalize _id to avoid N/A issues
      if (parsedUser.id && !parsedUser._id) {
        parsedUser._id = parsedUser.id;
        delete parsedUser.id;
      }
      return parsedUser;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const login = (userData, tokenValue) => {
    // ✅ Normalize _id immediately
    const normalizedUser = {
      ...userData,
      _id: userData._id || userData.id,
    };
    delete normalizedUser.id;
    setUser(normalizedUser);
    setToken(tokenValue);

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", tokenValue);
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
