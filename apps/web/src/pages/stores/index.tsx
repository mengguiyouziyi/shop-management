import React, { useState, useEffect } from 'react';
import { StoreService } from '../../services/store';
import type { Store } from '../../types/store';
import { useAppStore } from '../../store/useAppStore';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    parentId: '',
    address: '',
    phone: '',
    manager: '',
    isActive: true
  });
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
      console.error('加载店铺列表失败:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      // 数据验证
      if (!formData.name.trim()) {
        alert('请输入店铺名称');
        return;
      }
      if (!formData.code.trim()) {
        alert('请输入店铺编码');
        return;
      }
      if (!formData.address.trim()) {
        alert('请输入店铺地址');
        return;
      }

      // 处理层级关系
      const submitData = { ...formData };
      if (submitData.parentId) {
        const parentStore = stores.find(store => store.id === submitData.parentId);
        if (parentStore) {
          submitData.level = parentStore.level + 1;
        }
      } else {
        submitData.level = 0; // 总部层级为0
      }
      
      if (editingStore) {
        // 更新店铺
        await storeService.updateStore(editingStore.id, submitData);
        alert('店铺更新成功');
      } else {
        // 创建店铺
        await storeService.createStore(submitData);
        alert('店铺创建成功');
      }
      
      // 重置表单
      setFormData({
        name: '',
        code: '',
        parentId: '',
        address: '',
        phone: '',
        manager: '',
        isActive: true
      });
      setEditingStore(null);
      loadStores();
    } catch (error) {
      alert(editingStore ? '店铺更新失败' : '店铺创建失败');
    }
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      code: store.code,
      parentId: store.parentId || '',
      address: store.address,
      phone: store.phone || '',
      manager: store.manager || '',
      isActive: store.isActive
    });
  };

  const handleDelete = async (storeId: string) => {
    if (!window.confirm('确定要删除这个店铺吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await storeService.deleteStore(storeId);
      alert('店铺删除成功');
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
      alert('店铺删除失败');
    }
  };

  const handleSetCurrentStore = (store: Store) => {
    storeService.setCurrentStore(store);
    setCurrentStore(store);
    alert(`已切换到店铺: ${store.name}`);
  };

  // 获取可选的父级店铺
  const getParentStoreOptions = () => {
    if (!editingStore) {
      return stores;
    }
    
    // 排除当前编辑的店铺及其所有子店铺
    const excludeIds = [editingStore.id];
    
    // 简单的递归排除子店铺
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

  // 统计数据
  const totalStores = stores.length;
  const activeStores = stores.filter(s => s.isActive).length;
  const headquarters = stores.filter(s => s.level === 0).length;
  const branches = stores.filter(s => s.level > 0).length;

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
          🏬 店铺管理
        </h1>
        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
          管理店铺信息、层级结构和状态
        </p>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总店铺数</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {totalStores}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🏪</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>营业中</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {activeStores}
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
          borderTop: '4px solid #722ed1'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总部</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {headquarters}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🏢</div>
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
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>分店</p>
              <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                {branches}
              </p>
            </div>
            <div style={{ fontSize: '32px' }}>🏘️</div>
          </div>
        </div>
      </div>

      {/* 创建/编辑店铺表单 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          {editingStore ? '✏️ 编辑店铺' : '➕ 创建店铺'}
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
              店铺名称 *
            </label>
            <input
              type="text"
              placeholder="请输入店铺名称"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
              店铺编码 *
            </label>
            <input
              type="text"
              placeholder="请输入店铺编码"
              value={formData.code}
              onChange={(e) => setFormData({...formData, code: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
              父级店铺
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => setFormData({...formData, parentId: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#fff'
              }}
            >
              <option value="">无（总部）</option>
              {getParentStoreOptions().map(store => (
                <option key={store.id} value={store.id}>
                  {store.name} ({store.level === 0 ? '总部' : `分店 L${store.level}`})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
              店铺地址 *
            </label>
            <input
              type="text"
              placeholder="请输入店铺地址"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
              联系电话
            </label>
            <input
              type="text"
              placeholder="请输入联系电话"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
              负责人
            </label>
            <input
              type="text"
              placeholder="请输入负责人姓名"
              value={formData.manager}
              onChange={(e) => setFormData({...formData, manager: e.target.value})}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ color: '#333', fontSize: '14px', fontWeight: '500' }}>启用店铺</span>
          </label>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
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
            {editingStore ? '更新店铺' : '创建店铺'}
          </button>
          {editingStore && (
            <button
              onClick={() => {
                setEditingStore(null);
                setFormData({
                  name: '',
                  code: '',
                  parentId: '',
                  address: '',
                  phone: '',
                  manager: '',
                  isActive: true
                });
              }}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#666',
                border: '1px solid #d9d9d9',
                padding: '10px 20px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
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
          )}
        </div>
      </div>
      
      {/* 店铺列表 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
          📋 店铺列表
        </h2>
        
        {currentStore && (
          <div style={{ 
            backgroundColor: '#f6ffed', 
            border: '1px solid #b7eb8f', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '16px',
            color: '#52c41a',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            当前店铺: {currentStore.name}
          </div>
        )}
        
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
                }}>店铺名称</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>店铺编码</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>层级</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>父级店铺</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>地址</th>
                <th style={{ 
                  padding: '12px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e8e8e8',
                  fontWeight: 'bold',
                  color: '#333'
                }}>状态</th>
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
              {stores.map((store, index) => (
                <tr key={store.id} style={{ 
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa'
                }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>🏪</span>
                      <strong>{store.name}</strong>
                    </div>
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>
                    {store.code}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: store.level === 0 ? '#1890ff20' : '#fa8c1620',
                      color: store.level === 0 ? '#1890ff' : '#fa8c16',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {store.level === 0 ? '总部' : `分店 L${store.level}`}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>
                    {store.parentId ? (() => {
                      const parent = stores.find(s => s.id === store.parentId);
                      return parent ? parent.name : '未知';
                    })() : '无'}
                  </td>
                  <td style={{ padding: '12px', color: '#666' }}>
                    {store.address}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: store.isActive ? '#52c41a20' : '#ff4d4f20',
                      color: store.isActive ? '#52c41a' : '#ff4d4f',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {store.isActive ? '启用' : '停用'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(!currentStore || currentStore.id !== store.id) && (
                        <button 
                          onClick={() => handleSetCurrentStore(store)}
                          style={{
                            backgroundColor: '#1890ff',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
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
                          设为当前
                        </button>
                      )}
                      <button 
                        onClick={() => handleEdit(store)}
                        style={{
                          backgroundColor: '#52c41a',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
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
                        编辑
                      </button>
                      <button 
                        onClick={() => handleDelete(store.id)}
                        disabled={store.level === 0 && stores.some(s => s.parentId === store.id)}
                        style={{
                          backgroundColor: store.level === 0 && stores.some(s => s.parentId === store.id) ? '#d9d9d9' : '#ff4d4f',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: store.level === 0 && stores.some(s => s.parentId === store.id) ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                        title={store.level === 0 && stores.some(s => s.parentId === store.id) ? '该店铺下还有分店，无法删除' : '删除店铺'}
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
        
        {stores.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#999'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏪</div>
            <p>暂无店铺数据，点击上方按钮创建第一个店铺</p>
          </div>
        )}
      </div>
    </div>
  );
}