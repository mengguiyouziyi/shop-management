import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 从 localStorage 获取用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        }
      } catch (e) {
        console.warn('Failed to parse stored user data:', e);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  return { user };
};