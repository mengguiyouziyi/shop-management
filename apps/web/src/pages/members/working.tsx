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
      <h1>会员管理</h1>
      <p>当前会员数量: {members.length}</p>
      <input 
        type="text"
        placeholder="搜索会员姓名或手机号"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '300px', margin: '10px 0' }}
      />
      <div>
        {members.filter(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone.includes(searchTerm)
        ).map(member => (
          <div key={member.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px 0' }}>
            <h3>{member.name}</h3>
            <p>手机: {member.phone}</p>
            <p>等级: {getLevelName(member.level)}</p>
            <p>积分: {member.points}</p>
            <p>余额: ¥{member.balance.toFixed(2)}</p>
            <button onClick={() => setDeleteId(member.id)}>删除</button>
          </div>
        ))}
      </div>
      
      {deleteId && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3>确认删除</h3>
          <p>确定要删除这个会员吗？</p>
          <button onClick={() => setDeleteId(null)}>取消</button>
          <button onClick={() => deleteId && handleDelete(deleteId)}>确认</button>
        </div>
      )}
    </div>
  );
}