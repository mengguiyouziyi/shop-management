import React, { useState, useEffect } from 'react';
import { Button, Dialog, Table, Space, Tag, Input } from 'tdesign-react';
import { UserIcon, EditIcon, DeleteIcon } from 'tdesign-icons-react';
import { useAppStore } from '../../store/useAppStore';
import { MemberLevel } from '../../types';

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

  const getLevelColor = (level: MemberLevel) => {
    switch (level) {
      case MemberLevel.BRONZE: return 'brown';
      case MemberLevel.SILVER: return 'silver';
      case MemberLevel.GOLD: return 'gold';
      case MemberLevel.DIAMOND: return 'cyan';
      default: return 'gray';
    }
  };

  const columns = [
    { key: 'name', title: '姓名', dataIndex: 'name' },
    { key: 'phone', title: '手机号', dataIndex: 'phone' },
    { key: 'points', title: '积分', dataIndex: 'points' },
    { 
      key: 'balance', 
      title: '余额', 
      dataIndex: 'balance',
      render: (balance: number) => `¥${balance.toFixed(2)}`
    },
    { 
      key: 'level', 
      title: '等级', 
      dataIndex: 'level',
      render: (level: MemberLevel) => (
        <Tag color={getLevelColor(level)}>
          {getLevelName(level)}
        </Tag>
      )
    },
    { 
      key: 'joinDate', 
      title: '加入日期', 
      dataIndex: 'joinDate',
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN')
    },
    {
      key: 'actions',
      title: '操作',
      render: (record: Member) => (
        <Space>
          <Button 
            size="small" 
            icon={<EditIcon />}
            variant="outline"
          >
            编辑
          </Button>
          <Button 
            size="small" 
            icon={<DeleteIcon />}
            variant="outline"
            theme="danger"
            onClick={() => setDeleteId(record.id)}
          >
            删除
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">会员管理</h1>
        <Button icon={<UserIcon />}>新增会员</Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="搜索会员姓名或手机号"
          value={searchTerm}
          onChange={setSearchTerm}
          style={{ width: 300 }}
        />
      </div>

      <Table
        data={members.filter(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.phone.includes(searchTerm)
        )}
        columns={columns}
        rowKey="id"
        pagination={{
          total: members.length,
          pageSize: 10,
          current: 1
        }}
      />

      <Dialog
        header="确认删除"
        visible={!!deleteId}
        onClose={() => setDeleteId(null)}
        footer={
          <Space>
            <Button onClick={() => setDeleteId(null)}>取消</Button>
            <Button 
              theme="danger"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              确认删除
            </Button>
          </Space>
        }
      >
        确定要删除这个会员吗？删除后无法恢复。
      </Dialog>

      <Dialog
        header="会员详情"
        visible={!!detailId}
        onClose={() => setDetailId(null)}
        footer={
          <Button onClick={() => setDetailId(null)}>关闭</Button>
        }
      >
        {/* 详情内容待实现 */}
        <p>会员详情功能待实现</p>
      </Dialog>
    </div>
  );
}
