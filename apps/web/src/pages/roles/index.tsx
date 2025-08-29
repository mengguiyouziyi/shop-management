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
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>角色管理</h1>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>用户ID</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>用户名</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>角色</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{user.id}</td>
                <td style={{ padding: '12px' }}>{user.name}</td>
                <td style={{ padding: '12px' }}>
                  {editingUser === user.id ? (
                    <select 
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as UserRole)}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
                    >
                      {Object.entries(roleNames).map(([role, name]) => (
                        <option key={role} value={role}>{name}</option>
                      ))}
                    </select>
                  ) : (
                    roleNames[user.role]
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  {editingUser === user.id ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleRoleChange(user.id, newRole)}
                        style={{ 
                          padding: '6px 12px', 
                          backgroundColor: '#1890ff', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        保存
                      </button>
                      <button 
                        onClick={() => setEditingUser(null)}
                        style={{ 
                          padding: '6px 12px', 
                          backgroundColor: '#fff', 
                          color: '#333', 
                          border: '1px solid #ddd', 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setEditingUser(user.id);
                        setNewRole(user.role);
                      }}
                      style={{ 
                        padding: '6px 12px', 
                        backgroundColor: '#1890ff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      修改角色
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