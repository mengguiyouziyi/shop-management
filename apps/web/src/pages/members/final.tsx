import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MemberLevel } from '../../types';

export default function MembersPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { members, deleteMember, addMember } = useAppStore();

  // Initialize sample data if empty
  useEffect(() => {
    if (members.length === 0) {
      addMember({
        name: '张三',
        phone: '13800138000',
        level: MemberLevel.GOLD,
        points: 150,
        balance: 200,
        totalSpent: 1500,
        isActive: true
      });
      
      addMember({
        name: '李四',
        phone: '13800138001',
        level: MemberLevel.SILVER,
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

  const getLevelName = (level: MemberLevel) => {
    switch (level) {
      case MemberLevel.BRONZE: return '铜卡会员';
      case MemberLevel.SILVER: return '银卡会员';
      case MemberLevel.GOLD: return '金卡会员';
      case MemberLevel.DIAMOND: return '钻石会员';
      default: return '普通会员';
    }
  };

  return (
    <div>
      <h2>会员管理</h2>
      <p>当前会员数量: {members.length}</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          type="text"
          placeholder="搜索会员姓名或手机号"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '300px', 
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div>
        {members.filter(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone.includes(searchTerm)
        ).map(member => (
          <div key={member.id} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            margin: '10px 0',
            borderRadius: '8px',
            background: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0' }}>{member.name}</h3>
                <p style={{ margin: '5px 0' }}>手机: {member.phone}</p>
                <p style={{ margin: '5px 0' }}>等级: {getLevelName(member.level)}</p>
                <p style={{ margin: '5px 0' }}>积分: {member.points}</p>
                <p style={{ margin: '5px 0' }}>余额: ¥{member.balance.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => setDeleteId(member.id)}
                style={{ 
                  padding: '8px 16px',
                  background: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {deleteId && (
        <div style={{ 
          position: 'fixed', 
          top: '0', 
          left: '0', 
          right: '0',
          bottom: '0',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <h3>确认删除</h3>
            <p>确定要删除这个会员吗？删除后无法恢复。</p>
            <div style={{ marginTop: '20px' }}>
              <button 
                onClick={() => setDeleteId(null)}
                style={{ 
                  marginRight: '10px',
                  padding: '8px 16px',
                  background: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
              <button 
                onClick={() => deleteId && handleDelete(deleteId)}
                style={{ 
                  padding: '8px 16px',
                  background: '#ff4d4f',
                  color: 'white',
                  border: 'none',
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
    </div>
  );
}