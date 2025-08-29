import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../../hooks/useAuth';

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return mock user when no user in localStorage', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  it('should return user from localStorage when available', () => {
    const storedUser = {
      id: '2',
      name: 'Stored User',
      email: 'stored@example.com',
    };
    
    localStorage.setItem('user', JSON.stringify(storedUser));
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual(storedUser);
  });

  it('should handle invalid user data in localStorage', () => {
    localStorage.setItem('user', 'invalid json');
    
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  it('should handle empty user object in localStorage', () => {
    localStorage.setItem('user', JSON.stringify({}));
    
    const { result } = renderHook(() => useAuth());
    
    // When localStorage has an empty object, it should still use the mock user
    expect(result.current.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    });
  });
});