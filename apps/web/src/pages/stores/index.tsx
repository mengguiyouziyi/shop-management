import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Table, Message, Switch, Select } from 'tdesign-react';
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
      
      // 处理层级关系
      if (values.parentId) {
        const parentStore = stores.find(store => store.id === values.parentId);
        if (parentStore) {
          values.level = parentStore.level + 1;
        }
      } else {
        values.level = 0; // 总部层级为0
      }
      
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
      title: '层级',
      colKey: 'level',
      cell: ({ row }: { row: Store }) => (
        <span>{row.level === 0 ? '总部' : `分店 L${row.level}`}</span>
      )
    },
    {
      title: '父级店铺',
      colKey: 'parentId',
      cell: ({ row }: { row: Store }) => {
        if (!row.parentId) return <span>无</span>;
        const parent = stores.find(store => store.id === row.parentId);
        return <span>{parent ? parent.name : '未知'}</span>;
      }
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
        <div style={{ display: 'flex', gap: '8px' }}>
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
            disabled={row.level === 0 && stores.some(store => store.parentId === row.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ];

  // 获取可选的父级店铺（不能选择自己或自己的子店铺作为父级）
  const getParentStoreOptions = () => {
    if (!editingStore) {
      return stores;
    }
    
    // 排除当前编辑的店铺及其所有子店铺
    const excludeIds = [editingStore.id];
    
    // 简单的递归排除子店铺（实际项目中可能需要更复杂的逻辑）
    const addChildStores = (parentId: string) => {
      const children = stores.filter(store => store.parentId === parentId);
      children.forEach(child => {
        excludeIds.push(child.id);
        addChildStores(child.id);
      });
    };
    
    addChildStores(editingStore.id);
    
    return stores.filter(store => !excludeIds.includes(store.id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>店铺管理</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>{editingStore ? '编辑店铺' : '创建店铺'}</h2>
        <Form form={form} onSubmit={handleSubmit} labelWidth={100}>
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="店铺名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入店铺名称" />
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="店铺编码" name="code" rules={[{ required: true }]}>
              <Input placeholder="请输入店铺编码" />
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="父级店铺" name="parentId">
              <Select placeholder="请选择父级店铺">
                <Select.Option key="" value="">无（总部）</Select.Option>
                {getParentStoreOptions().map(store => (
                  <Select.Option key={store.id} value={store.id}>
                    {store.name} ({store.level === 0 ? '总部' : `分店 L${store.level}`})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="地址" name="address" rules={[{ required: true }]}>
              <Input placeholder="请输入店铺地址" />
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="联系电话" name="phone">
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="负责人" name="manager">
              <Input placeholder="请输入负责人姓名" />
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="状态" name="isActive" initialValue={true}>
              <Switch label={['启用', '停用']} />
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
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
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>店铺列表</h2>
        {currentStore && (
          <div style={{ 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '16px',
            color: '#52c41a'
          }}>
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