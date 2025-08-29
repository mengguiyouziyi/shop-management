import React, { useState, useEffect } from 'react';
import { Button, Table, Message, Tabs, Switch, Form, Input } from 'tdesign-react';
import { HeadquartersBranchService, HeadquartersBranchSettings } from '../../services/headquartersBranch';
import { StoreService } from '../../services/store';
import { Store } from '../../types/store';
import { useAppStore } from '../../store/useAppStore';

export default function HeadquartersBranchPage() {
  const { currentStore } = useAppStore();
  const [headquarters, setHeadquarters] = useState<Store | null>(null);
  const [branches, setBranches] = useState<Store[]>([]);
  const [allStores, setAllStores] = useState<Store[]>([]);
  const [settings, setSettings] = useState<HeadquartersBranchSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncLoading, setSyncLoading] = useState(false);
  
  const headquartersBranchService = HeadquartersBranchService.getInstance();
  const storeService = StoreService.getInstance();

  useEffect(() => {
    if (currentStore) {
      loadData();
    }
  }, [currentStore]);

  const loadData = async () => {
    if (!currentStore) return;
    
    setLoading(true);
    try {
      // 获取所有店铺
      const stores = await storeService.getAllStores();
      setAllStores(stores);
      
      // 确定当前店铺是否为总部
      const isHeadquarters = !currentStore.parentId;
      setHeadquarters(isHeadquarters ? currentStore : null);
      
      // 获取子店铺
      const childStores = isHeadquarters 
        ? await headquartersBranchService.getChildStores(currentStore.id)
        : [];
      setBranches(childStores);
      
      // 获取总部-分店设置
      const branchSettings = isHeadquarters
        ? await headquartersBranchService.getHeadquartersBranchSettings(currentStore.id)
        : null;
      setSettings(branchSettings);
    } catch (error) {
      Message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = async (field: keyof HeadquartersBranchSettings, value: any) => {
    if (!currentStore) return;
    
    try {
      const updatedSettings = await headquartersBranchService.updateHeadquartersBranchSettings(
        currentStore.id,
        { [field]: value }
      );
      
      setSettings(updatedSettings);
      Message.success('设置已更新');
    } catch (error) {
      Message.error('更新设置失败');
    }
  };

  const handleSyncProducts = async () => {
    if (!currentStore) return;
    
    setSyncLoading(true);
    try {
      await headquartersBranchService.syncProductsToBranches(currentStore.id);
      Message.success('产品数据同步完成');
    } catch (error) {
      Message.error('产品数据同步失败');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSyncMembers = async () => {
    if (!currentStore) return;
    
    setSyncLoading(true);
    try {
      await headquartersBranchService.syncMembersToBranches(currentStore.id);
      Message.success('会员数据同步完成');
    } catch (error) {
      Message.error('会员数据同步失败');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSyncSuppliers = async () => {
    if (!currentStore) return;
    
    setSyncLoading(true);
    try {
      await headquartersBranchService.syncSuppliersToBranches(currentStore.id);
      Message.success('供应商数据同步完成');
    } catch (error) {
      Message.error('供应商数据同步失败');
    } finally {
      setSyncLoading(false);
    }
  };

  const branchesColumns = [
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
      title: '经理',
      colKey: 'manager',
    },
    {
      title: '层级',
      colKey: 'level',
      cell: ({ row }: { row: Store }) => (
        row.level === 1 ? '一级分店' : 
        row.level === 2 ? '二级分店' : 
        `${row.level}级分店`
      )
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        {headquarters ? '总部管理' : '分店信息'}
      </h1>
      
      {headquarters ? (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>总部信息</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div><strong>店铺名称:</strong> {headquarters.name}</div>
                <div><strong>店铺编码:</strong> {headquarters.code}</div>
                <div><strong>地址:</strong> {headquarters.address}</div>
              </div>
              <div>
                <div><strong>联系电话:</strong> {headquarters.phone}</div>
                <div><strong>经理:</strong> {headquarters.manager}</div>
                <div><strong>创建时间:</strong> {new Date(headquarters.createdAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="settings">
            <Tabs.TabPanel value="settings" label="管理设置">
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>总部-分店管理设置</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <span>同步产品数据</span>
                    <Switch 
                      value={settings?.syncProducts || false}
                      onChange={(value) => handleSettingsChange('syncProducts', value)}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <span>同步会员数据</span>
                    <Switch 
                      value={settings?.syncMembers || false}
                      onChange={(value) => handleSettingsChange('syncMembers', value)}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <span>同步供应商数据</span>
                    <Switch 
                      value={settings?.syncSuppliers || false}
                      onChange={(value) => handleSettingsChange('syncSuppliers', value)}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <span>同步价格信息</span>
                    <Switch 
                      value={settings?.syncPricing || false}
                      onChange={(value) => handleSettingsChange('syncPricing', value)}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <span>同步库存信息</span>
                    <Switch 
                      value={settings?.syncInventory || false}
                      onChange={(value) => handleSettingsChange('syncInventory', value)}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #eee', borderRadius: '4px' }}>
                    <span>允许跨店铺订单</span>
                    <Switch 
                      value={settings?.allowCrossStoreOrders || false}
                      onChange={(value) => handleSettingsChange('allowCrossStoreOrders', value)}
                    />
                  </div>
                </div>
              </div>
              
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>数据同步</h2>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <Button 
                    theme="primary" 
                    loading={syncLoading}
                    onClick={handleSyncProducts}
                  >
                    同步产品数据
                  </Button>
                  <Button 
                    theme="primary" 
                    loading={syncLoading}
                    onClick={handleSyncMembers}
                  >
                    同步会员数据
                  </Button>
                  <Button 
                    theme="primary" 
                    loading={syncLoading}
                    onClick={handleSyncSuppliers}
                  >
                    同步供应商数据
                  </Button>
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  注意：数据同步会将总部的数据覆盖到所有分店，请谨慎操作。
                </div>
              </div>
            </Tabs.TabPanel>
            
            <Tabs.TabPanel value="branches" label="分店管理">
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
                <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>分店列表</h2>
                <Table
                  data={branches}
                  columns={branchesColumns}
                  rowKey="id"
                  loading={loading}
                />
              </div>
            </Tabs.TabPanel>
          </Tabs>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>分店信息</h2>
          {currentStore && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div><strong>店铺名称:</strong> {currentStore.name}</div>
                  <div><strong>店铺编码:</strong> {currentStore.code}</div>
                  <div><strong>地址:</strong> {currentStore.address}</div>
                </div>
                <div>
                  <div><strong>联系电话:</strong> {currentStore.phone}</div>
                  <div><strong>经理:</strong> {currentStore.manager}</div>
                  <div><strong>创建时间:</strong> {new Date(currentStore.createdAt).toLocaleString()}</div>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>所属总部</h3>
                {allStores
                  .filter(store => store.id === currentStore.parentId)
                  .map(parentStore => (
                    <div key={parentStore.id} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '4px' }}>
                      <div><strong>总部名称:</strong> {parentStore.name}</div>
                      <div><strong>总部编码:</strong> {parentStore.code}</div>
                      <div><strong>地址:</strong> {parentStore.address}</div>
                      <div><strong>联系电话:</strong> {parentStore.phone}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}