import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  console.log(context, "log");
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  ); // Retrieve user data from local storage
  const [isAuthenticated, setIsAuthenticated] = useState(!!user); // Set initial authentication state based on user data
  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    setLoading(true); // Set loading to true when starting the login process
    try {
      localStorage.setItem("user", JSON.stringify(userData)); // Store user data in local storage
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error); // Log the error
    } finally {
      setLoading(false); // Set loading to false when the process is complete
    }
  };

  const logout = (navigate) => {
    // Simpan role pengguna sebelum menghapus data
    const userRole = user?.role;
    
    // Hapus data user dan token
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect ke halaman login yang sesuai jika navigate tersedia
    if (navigate) {
      switch(userRole) {
        case 'ADMIN':
          navigate('/login-admin');
          break;
        case 'PARTNER':
          navigate('/login-partner');
          break;
        default:
          // Untuk USER atau VOLUNTEER
          navigate('/login');
          break;
      }
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    setLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};