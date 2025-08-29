import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Table, Message, Switch } from 'tdesign-react';
import { StoreService } from '../../services/store';
import { Store } from '../../types/store';
import { useAppStore } from '../../store/useAppStore';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [form] = Form.useForm();
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const { currentStore, setCurrentStore } = useAppStore();
  const storeService = StoreService.getInstance();

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const storeList = await storeService.getAllStores();
      setStores(storeList);
    } catch (error) {
      Message.error('加载店铺列表失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      
      if (editingStore) {
        // 更新店铺
        await storeService.updateStore(editingStore.id, values);
        Message.success('店铺更新成功');
      } else {
        // 创建店铺
        await storeService.createStore(values);
        Message.success('店铺创建成功');
      }
      
      form.reset();
      setEditingStore(null);
      loadStores();
    } catch (error) {
      Message.error(editingStore ? '店铺更新失败' : '店铺创建失败');
    }
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    form.setFieldsValue(store);
  };

  const handleDelete = async (storeId: string) => {
    if (!window.confirm('确定要删除这个店铺吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await storeService.deleteStore(storeId);
      Message.success('店铺删除成功');
      loadStores();
      
      // 如果删除的是当前店铺，切换到其他店铺或清除当前店铺
      if (currentStore && currentStore.id === storeId) {
        const remainingStores = stores.filter(store => store.id !== storeId);
        if (remainingStores.length > 0) {
          setCurrentStore(remainingStores[0]);
        } else {
          setCurrentStore(null);
        }
      }
    } catch (error) {
      Message.error('店铺删除失败');
    }
  };

  const handleSetCurrentStore = (store: Store) => {
    storeService.setCurrentStore(store);
    setCurrentStore(store);
    Message.success(`已切换到店铺: ${store.name}`);
  };

  const columns = [
    {
      title: '店铺名称',
      colKey: 'name',
    },
    {
      title: '店铺编码',
      colKey: 'code',
    },
    {
      title: '地址',
      colKey: 'address',
    },
    {
      title: '联系电话',
      colKey: 'phone',
    },
    {
      title: '状态',
      colKey: 'isActive',
      cell: ({ row }: { row: Store }) => (
        <span>{row.isActive ? '启用' : '停用'}</span>
      )
    },
    {
      title: '操作',
      colKey: 'actions',
      cell: ({ row }: { row: Store }) => (
        <div className="flex gap-2">
          {(!currentStore || currentStore.id !== row.id) && (
            <Button 
              size="small" 
              onClick={() => handleSetCurrentStore(row)}
            >
              设为当前店铺
            </Button>
          )}
          <Button 
            size="small" 
            variant="outline"
            onClick={() => handleEdit(row)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            theme="danger"
            variant="outline"
            onClick={() => handleDelete(row.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">店铺管理</h1>
      
      <div className="card">
        <h2>{editingStore ? '编辑店铺' : '创建店铺'}</h2>
        <Form form={form} onSubmit={handleSubmit} labelWidth={100}>
          <div className="form-group">
            <Form.Item label="店铺名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入店铺名称" className="form-input" />
            </Form.Item>
          </div>
          
          <div className="form-group">
            <Form.Item label="店铺编码" name="code" rules={[{ required: true }]}>
              <Input placeholder="请输入店铺编码" className="form-input" />
            </Form.Item>
          </div>
          
          <div className="form-group">
            <Form.Item label="地址" name="address" rules={[{ required: true }]}>
              <Input placeholder="请输入店铺地址" className="form-input" />
            </Form.Item>
          </div>
          
          <div className="form-group">
            <Form.Item label="联系电话" name="phone">
              <Input placeholder="请输入联系电话" className="form-input" />
            </Form.Item>
          </div>
          
          <div className="form-group">
            <Form.Item label="负责人" name="manager">
              <Input placeholder="请输入负责人姓名" className="form-input" />
            </Form.Item>
          </div>
          
          <div className="form-group">
            <Form.Item label="状态" name="isActive" initialValue={true}>
              <Switch label={['启用', '停用']} />
            </Form.Item>
          </div>
          
          <div className="flex gap-2">
            <Button theme="primary" type="submit">
              {editingStore ? '更新店铺' : '创建店铺'}
            </Button>
            {editingStore && (
              <Button variant="outline" onClick={() => {
                setEditingStore(null);
                form.reset();
              }}>
                取消
              </Button>
            )}
          </div>
        </Form>
      </div>
      
      <div className="card">
        <h2>店铺列表</h2>
        {currentStore && (
          <div className="alert alert-success mb-4">
            当前店铺: {currentStore.name}
          </div>
        )}
        <Table
          data={stores}
          columns={columns}
          rowKey="id"
        />
      </div>
    </div>
  );
}