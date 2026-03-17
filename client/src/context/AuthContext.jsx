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
  // Avatar stored separately so the large base64 string doesn't bloat the auth token object
  const [userAvatar, setUserAvatar] = useState(() => {
    try { return localStorage.getItem('triphub_avatar') || ''; }
    catch { return ''; }
  });

  const login = (userData) => {
    localStorage.setItem('triphub_token', userData.token);
    localStorage.setItem('triphub_user', JSON.stringify(userData));
    setAuth(userData);
  };

  const logout = () => {
    localStorage.removeItem('triphub_token');
    localStorage.removeItem('triphub_user');
    localStorage.removeItem('triphub_avatar');
    setAuth(null);
    setUserBalance(0);
    setUserAvatar('');
  };

  const updateUserBalance = (balance) => setUserBalance(balance);

  const updateUserAvatar = (avatar) => {
    const val = avatar || '';
    localStorage.setItem('triphub_avatar', val);
    setUserAvatar(val);
  };

  return (
    <AuthContext.Provider value={{
      auth, login, logout, userBalance, updateUserBalance,
      userAvatar, updateUserAvatar,
      // 'customer' is the legacy DB value — treat it the same as 'user'
      isUser: auth?.type === 'user' || auth?.type === 'customer',
      isHotel: auth?.type === 'hotel',
      isAdmin: auth?.type === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
