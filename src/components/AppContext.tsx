// src/components/AppContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Definisikan tipe untuk pengguna
interface User {
  name: string;
  email: string;
  password: string;  // Pastikan password ada di dalam tipe User
}

interface AppContextType {
  currentUser: User | null;
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, password: string) => { success: boolean; message: string };
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    if (email === 'user@example.com' && password === 'password') {
      setCurrentUser({ name: 'John Doe', email, password });  // Menambahkan password
      return { success: true, message: 'Login successful' };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const register = (name: string, email: string, password: string) => {
    setCurrentUser({ name, email, password });  // Menambahkan password
    return { success: true, message: 'Registration successful' };
  };

  return (
    <AppContext.Provider value={{ currentUser, login, register }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);