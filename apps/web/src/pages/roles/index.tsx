import React, { useState } from 'react';
import { PermissionService } from '../../services/permission';
import type { UserRole } from '../../services/permission';

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

  const roleIcons: Record<UserRole, string> = {
    'admin': '👤',
    'cashier': '💰',
    'inventory': '📦',
    'finance': '💵'
  };

  const roleColors: Record<UserRole, string> = {
    'admin': '#1890ff',
    'cashier': '#52c41a',
    'inventory': '#fa8c16',
    'finance': '#722ed1'
  };

  // 统计数据
  const roleCounts: Record<UserRole, number> = {
    'admin': users.filter(user => user.role === 'admin').length,
    'cashier': users.filter(user => user.role === 'cashier').length,
    'inventory': users.filter(user => user.role === 'inventory').length,
    'finance': users.filter(user => user.role === 'finance').length
  };

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 页面标题 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          👤 角色管理
        </h1>
        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
          管理用户角色和权限分配
        </p>
      </div>

      {/* 角色统计卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '20px'
      }}>
        {Object.entries(roleNames).map(([role, name]) => (
          <div key={role} style={{ 
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderTop: `4px solid ${roleColors[role as UserRole]}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>{name}</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {roleCounts[role as UserRole]}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>
                {roleIcons[role as UserRole]}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 用户列表 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          👥 用户角色管理
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fafafa' }}>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>用户ID</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>用户名</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>当前角色</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} style={{ 
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                }}>
                  <td style={{ padding: '12px', color: '#666' }}>
                    {user.id}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>👤</span>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editingUser === user.id ? (
                      <select 
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value as UserRole)}
                        style={{ 
                          padding: '8px 12px', 
                          borderRadius: '6px', 
                          border: '1px solid #d9d9d9',
                          fontSize: '14px',
                          backgroundColor: '#fff'
                        }}
                      >
                        {Object.entries(roleNames).map(([role, name]) => (
                          <option key={role} value={role}>{name}</option>
                        ))}
                      </select>
                    ) : (
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        backgroundColor: `${roleColors[user.role]}20`,
                        color: roleColors[user.role],
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        <span>{roleIcons[user.role]}</span>
                        <span>{roleNames[user.role]}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {editingUser === user.id ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleRoleChange(user.id, newRole)}
                          style={{ 
                            padding: '6px 12px', 
                            backgroundColor: '#52c41a', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            transition: 'background-color 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#73d13d';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#52c41a';
                          }}
                        >
                          保存
                        </button>
                        <button 
                          onClick={() => setEditingUser(null)}
                          style={{ 
                            padding: '6px 12px', 
                            backgroundColor: '#f5f5f5', 
                            color: '#666', 
                            border: '1px solid #d9d9d9', 
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#e8e8e8';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#f5f5f5';
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
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          transition: 'background-color 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#40a9ff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#1890ff';
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

        {/* 角色说明 */}
        <div style={{ 
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f6ffed',
          border: '1px solid #b7eb8f',
          borderRadius: '6px'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#52c41a', fontSize: '14px', fontWeight: 'bold' }}>
            📋 角色权限说明
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px' }}>
            <div>
              <strong style={{ color: '#1890ff' }}>👤 管理员</strong>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>拥有所有权限，可以管理整个系统</p>
            </div>
            <div>
              <strong style={{ color: '#52c41a' }}>💰 收银员</strong>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>可以进行收银操作，管理订单</p>
            </div>
            <div>
              <strong style={{ color: '#fa8c16' }}>📦 库存管理员</strong>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理商品库存、供应商和采购</p>
            </div>
            <div>
              <strong style={{ color: '#722ed1' }}>💵 财务人员</strong>
              <p style={{ margin: '4px 0 0 0', color: '#666' }}>查看财务报表，进行财务分析</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}