import React, { useState, useEffect } from 'react';
import { Button, Table, MessagePlugin } from 'tdesign-react';
import { StoreService } from '../../services/store';
import type { Store } from '../../types/store';
import { useAppStore } from '../../store/useAppStore';

export default function StoreHierarchyPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const { currentStore } = useAppStore();
  const storeService = StoreService.getInstance();

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const storeList = await storeService.getAllStores();
      setStores(storeList);
    } catch (error) {
      MessagePlugin.error('加载店铺列表失败');
    }
  };

  // 构建店铺层级树
  const buildStoreTree = () => {
    // 找到所有总部（level 0）
    const headquarters = stores.filter(store => store.level === 0);
    
    // 递归构建子店铺
    const buildChildren = (parentStore: Store) => {
      const children = stores.filter(store => store.parentId === parentStore.id);
      return children.map(child => ({
        ...child,
        children: buildChildren(child)
      }));
    };
    
    return headquarters.map(hq => ({
      ...hq,
      children: buildChildren(hq)
    }));
  };

  // 渲染店铺层级结构
  const renderStoreHierarchy = (stores: any[], level = 0) => {
    return stores.map(store => (
      <div key={store.id} style={{ marginLeft: `${level * 20}px`, marginBottom: '8px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '8px',
          backgroundColor: level === 0 ? '#e6f7ff' : '#fafafa',
          borderRadius: '4px',
          border: '1px solid #f0f0f0'
        }}>
          <span style={{ fontWeight: level === 0 ? 'bold' : 'normal' }}>
            {store.name} 
            {store.code && ` (${store.code})`}
          </span>
          <span style={{ 
            marginLeft: '8px', 
            fontSize: '12px', 
            color: '#888' 
          }}>
            {store.level === 0 ? '总部' : `分店 L${store.level}`}
          </span>
          {store.isActive ? (
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '12px', 
              color: '#52c41a',
              backgroundColor: '#f6ffed',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              启用
            </span>
          ) : (
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '12px', 
              color: '#ff4d4f',
              backgroundColor: '#fff2f0',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              停用
            </span>
          )}
        </div>
        {store.children && store.children.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {renderStoreHierarchy(store.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const treeData = buildStoreTree();

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>店铺层级结构</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>组织架构图</h2>
          <Button onClick={loadStores}>刷新</Button>
        </div>
        
        {treeData.length > 0 ? (
          <div>
            {renderStoreHierarchy(treeData)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
            暂无店铺数据
          </div>
        )}
      </div>
    </div>
  );
}