import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { parseApiError } from "../utils/errorHelper";

const AuthContext = createContext(null);

const API = "http://localhost:8080/api";

// Setup global Axios interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Apply theme settings
  const applyTheme = (themeName) => {
    const root = document.documentElement;
    if (themeName === "light") {
      root.classList.add("light-theme");
    } else {
      root.classList.remove("light-theme");
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    applyTheme("dark"); // Reset to dark by default
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API}/auth/me`);
        if (response.data.success) {
          setUser(response.data.user);
          applyTheme(response.data.user.theme);
        } else {
          // Token is invalid/expired
          logout();
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, logout]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { username, password });
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);
        applyTheme(userData.theme);
        return { success: true };
      }
      return { success: false, message: response.data.message || "Login failed" };
    } catch (err) {
      return { success: false, message: parseApiError(err) };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API}/auth/profile`, profileData);
      if (response.data.success) {
        setUser(response.data.user);
        applyTheme(response.data.user.theme);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Failed to update profile" };
    } catch (error) {
      console.error("Update profile error:", error);
      const msg = error.response?.data?.message || "Failed to update profile. Server error.";
      return { success: false, message: msg };
    }
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      const response = await axios.put(`${API}/auth/password`, { currentPassword, newPassword });
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message || "Failed to update password" };
    } catch (error) {
      console.error("Update password error:", error);
      const msg = error.response?.data?.message || "Incorrect current password or server error.";
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateProfile,
    updatePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
