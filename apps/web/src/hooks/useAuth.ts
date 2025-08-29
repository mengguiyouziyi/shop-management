import { useState, useEffect } from 'react';

// 模拟用户数据
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
};

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 模拟从 localStorage 或 API 获取用户信息
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
        } else {
          setUser(mockUser);
        }
      } catch (e) {
        console.warn('Failed to parse stored user data:', e);
        setUser(mockUser);
      }
    } else {
      setUser(mockUser);
    }
  }, []);

  return { user };
};