import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function MembersPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { members, deleteMember, addMember } = useAppStore();

  // Initialize sample data if empty
  useEffect(() => {
    if (members.length === 0) {
      addMember({
        name: '张三',
        phone: '13800138000',
        level: 'gold' as const,
        points: 150,
        balance: 200,
        totalSpent: 1500,
        isActive: true
      });
      
      addMember({
        name: '李四',
        phone: '13800138001',
        level: 'silver' as const,
        points: 80,
        balance: 100,
        totalSpent: 800,
        isActive: true
      });
    }
  }, [members.length, addMember]);

  const handleDelete = (id: string) => {
    deleteMember(id);
    setDeleteId(null);
  };

  const getLevelName = (level: string) => {
    switch (level) {
      case 'bronze': return '铜卡会员';
      case 'silver': return '银卡会员';
      case 'gold': return '金卡会员';
      case 'diamond': return '钻石会员';
      default: return '普通会员';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'bronze': return '#CD7F32';
      case 'silver': return '#C0C0C0';
      case 'gold': return '#FFD700';
      case 'diamond': return '#B9F2FF';
      default: return '#999999';
    }
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  // 统计数据
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.isActive).length;
  const totalPoints = members.reduce((sum, m) => sum + m.points, 0);
  const totalBalance = members.reduce((sum, m) => sum + m.balance, 0);

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 页面标题和操作栏 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ margin: '0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
            会员管理
          </h1>
          <button
            onClick={() => {
              const name = prompt('请输入会员姓名:');
              if (name) {
                const phone = prompt('请输入手机号:');
                if (phone) {
                  addMember({
                    name,
                    phone,
                    level: 'bronze' as const,
                    points: 0,
                    balance: 0,
                    totalSpent: 0,
                    isActive: true
                  });
                }
              }
            }}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>➕</span>
            新增会员
          </button>
        </div>

        {/* 搜索栏 */}
        <div style={{ 
          display: 'flex', 
          gap: '16px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="搜索会员姓名或手机号"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '300px',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
          <span style={{ color: '#666', fontSize: '14px' }}>
            找到 {filteredMembers.length} 个会员
          </span>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #1890ff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>会员总数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalMembers}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>👥</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #52c41a'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>活跃会员</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {activeMembers}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>✅</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #fa8c16'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总积分</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalPoints}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🎯</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderTop: '4px solid #722ed1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总余额</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                ¥{totalBalance.toFixed(2)}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>💰</div>
          </div>
        </div>
      </div>

      {/* 会员列表 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          会员列表
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
                }}>姓名</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>手机号</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>等级</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>积分</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>余额</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>加入日期</th>
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
              {filteredMembers.map(member => (
                <tr key={member.id} style={{ 
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background-color 0.3s'
                }} 
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {member.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: '500' }}>{member.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>{member.phone}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: getLevelColor(member.level),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getLevelName(member.level)}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>
                    <span style={{ fontWeight: 'bold' }}>{member.points}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>
                    <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                      ¥{member.balance.toFixed(2)}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>
                    {new Date(member.joinDate).toLocaleDateString('zh-CN')}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setDetailId(member.id)}
                        style={{
                          backgroundColor: '#1890ff',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        查看
                      </button>
                      <button
                        onClick={() => setDeleteId(member.id)}
                        style={{
                          backgroundColor: '#ff4d4f',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#999'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p>没有找到匹配的会员</p>
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      {deleteId && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>确认删除</h3>
            <p style={{ margin: '0 0 24px 0', color: '#666' }}>
              确定要删除这个会员吗？删除后无法恢复。
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button
                onClick={() => deleteId && handleDelete(deleteId)}
                style={{
                  backgroundColor: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 会员详情对话框 */}
      {detailId && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#333' }}>会员详情</h3>
            <div style={{ color: '#666', lineHeight: '1.6' }}>
              <p>会员详情功能待实现</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setDetailId(null)}
                style={{
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
