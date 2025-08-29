import React, { useState } from 'react';
import { PermissionService, UserRole } from '../../services/permission';

export default function RolesPage() {
  const [users, setUsers] = useState<Array<{id: string, name: string, role: UserRole}>>([
    { id: '1', name: '张三', role: 'admin' },
    { id: '2', name: '李四', role: 'cashier' },
    { id: '3', name: '王五', role: 'inventory' },
    { id: '4', name: '赵六', role: 'finance' }
  ]);
  
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('cashier');

  const handleRoleChange = (userId: string, role: UserRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role } : user
    ));
    setEditingUser(null);
  };

  const roleNames: Record<UserRole, string> = {
    'admin': '管理员',
    'cashier': '收银员',
    'inventory': '库存管理员',
    'finance': '财务人员'
  };

  return (
    <div className="page-container">
      <h1 className="page-title">角色管理</h1>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>用户ID</th>
              <th>用户名</th>
              <th>角色</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  {editingUser === user.id ? (
                    <select 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      className="form-input"
                    >
                      {Object.entries(roleNames).map(([role, name]) => (
                        <option key={role} value={role}>{name}</option>
                      ))}
                    </select>
                  ) : (
                    roleNames[user.role]
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <div className="flex gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleRoleChange(user.id, newRole)}
                      >
                        保存
                      </button>
                      <button 
                        className="btn btn-outline"
                        onClick={() => setEditingUser(null)}
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setEditingUser(user.id);
                        setNewRole(user.role);
                      }}
                    >
                      编辑角色
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}