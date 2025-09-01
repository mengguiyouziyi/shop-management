import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PermissionService, UserRole } from '../services/permission';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const permissionService = PermissionService.getInstance();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单的身份验证逻辑（实际项目中应该连接后端API）
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }
    
    // 模拟不同用户角色
    let role: UserRole = 'cashier';
    if (username === 'admin') {
      role = 'admin';
    } else if (username === 'inventory') {
      role = 'inventory';
    } else if (username === 'finance') {
      role = 'finance';
    }
    
    // 创建用户对象
    const user = {
      role,
      permissions: []
    };
    
    // 设置当前用户
    permissionService.setCurrentUser(user);
    
    // 同时保存用户信息到 localStorage 供 useAuth hook 使用
    const authUser = {
      id: `user_${username}`,
      name: username,
      email: `${username}@example.com`,
      role,
      permissions: []
    };
    localStorage.setItem('user', JSON.stringify(authUser));
    
    // 重定向到之前尝试访问的页面或首页
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  const roleNames: Record<UserRole, string> = {
    'admin': '管理员',
    'cashier': '收银员',
    'inventory': '库存管理员',
    'finance': '财务人员'
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <div className="card" style={{ width: '400px', padding: '30px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>登录</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">用户名</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名 (admin, inventory, finance 或任意值)"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">密码</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>
          
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              登录
            </button>
          </div>
          
          <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            <p>登录说明:</p>
            <ul>
              <li>输入 "admin" 登录为管理员</li>
              <li>输入 "inventory" 登录为库存管理员</li>
              <li>输入 "finance" 登录为财务人员</li>
              <li>输入其他任意值登录为收银员</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}