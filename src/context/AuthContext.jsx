import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);

  console.log(context, 'log')
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null); // Retrieve user data from local storage
  const [isAuthenticated, setIsAuthenticated] = useState(!!user); // Set initial authentication state based on user data
  const [loading, setLoading] = useState(false);

    const login = (userData) => {
        setLoading(true); // Set loading to true when starting the login process
        try {
            localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed:", error); // Log the error
        } finally {
            setLoading(false); // Set loading to false when the process is complete
        }

  };

  const logout = () => {
    localStorage.removeItem('user'); // Clear user data from local storage
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    setLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};