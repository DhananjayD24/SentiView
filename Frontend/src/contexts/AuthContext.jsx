import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(undefined);

// Dummy user for demo
const dummyUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: undefined,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(dummyUser);
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (name, email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ ...dummyUser, name, email });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      logout, 
      signup 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}