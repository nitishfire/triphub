import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('triphub_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [userBalance, setUserBalance] = useState(0);

  const login = (userData) => {
    localStorage.setItem('triphub_token', userData.token);
    localStorage.setItem('triphub_user', JSON.stringify(userData));
    setAuth(userData);
  };

  const logout = () => {
    localStorage.removeItem('triphub_token');
    localStorage.removeItem('triphub_user');
    setAuth(null);
    setUserBalance(0);
  };

  const updateUserBalance = (balance) => setUserBalance(balance);

  return (
    <AuthContext.Provider value={{ auth, login, logout, userBalance, updateUserBalance, isUser: auth?.type === 'user', isHotel: auth?.type === 'hotel', isAdmin: auth?.type === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
