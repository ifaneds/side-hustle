// AuthContext.js
import React, { createContext, useState, useContext } from "react";
import authService from "./AuthService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setIsLoggedIn(true);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    setIsLoggedIn, // Add setIsLoggedIn to context
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
