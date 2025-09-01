import * as React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { HeadquartersBranchService } from '../../services/headquartersBranch';
import { StoreService } from '../../services/store';
import { 
  Card, 
  Table, 
  Button, 
  Switch, 
  MessagePlugin,
  Tabs
} from 'tdesign-react';
import type { Store } from '../../types';
import type { TableProps } from 'tdesign-react/es/table';

interface HeadquartersBranchSettings {
  id: string;
  headquartersId: string;
  syncProducts: boolean;
  syncMembers: boolean;
  syncSuppliers: boolean;
  syncPricing: boolean;
  syncInventory: boolean;
  allowCrossStoreOrders: boolean;
  createdAt: string;
  updatedAt: string;
}

const HeadquartersBranchPage: React.FC = () => {
  const { currentStore } = useAppStore();
  const [childStores, setChildStores] = React.useState<Store[]>([]);
  const [allStores, setAllStores] = React.useState<Store[]>([]);
  const [settings, setSettings] = React.useState<HeadquartersBranchSettings>({
    id: '',
    headquartersId: '',
    syncProducts: false,
    syncMembers: false,
    syncSuppliers: false,
    syncPricing: false,
    syncInventory: false,
    allowCrossStoreOrders: false,
    createdAt: '',
    updatedAt: ''
  });
  const [loading, setLoading] = React.useState(true);
  const [syncing, setSyncing] = React.useState(false);

  const headquartersBranchService = HeadquartersBranchService.getInstance();
  const storeService = StoreService.getInstance();

  React.useEffect(() => {
    if (!currentStore) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const [childStoresData, settingsData, allStoresData] = await Promise.all([
          headquartersBranchService.getChildStores(currentStore.id),
          headquartersBranchService.getSettings(currentStore.id),
          headquartersBranchService.getAllStores()
        ]);
        
        setChildStores(childStoresData);
        setSettings(settingsData);
        setAllStores(allStoresData);
      } catch (error) {
        MessagePlugin.error('加载数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentStore]);

  const handleSyncData = async () => {
    if (!currentStore) return;
    
    try {
      setSyncing(true);
      await headquartersBranchService.syncDataToBranches(currentStore.id);
      MessagePlugin.success('数据同步成功');
    } catch (error) {
      MessagePlugin.error('数据同步失败');
    } finally {
      setSyncing(false);
    }
  };

  const handleSettingsChange = async (field: keyof HeadquartersBranchSettings, value: boolean) => {
    try {
      const updatedSettings = await headquartersBranchService.updateHeadquartersBranchSettings(
        currentStore.id,
        { ...settings, [field]: value }
      );
      setSettings(updatedSettings);
      MessagePlugin.success('设置已更新');
    } catch (error) {
      MessagePlugin.error('更新设置失败');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}><p>加载中...</p></div>;
  }

  const columns: TableProps<Store>['columns'] = [
    { title: '店铺名称', colKey: 'name' },
    { title: '店铺编码', colKey: 'code' },
    { title: '地址', colKey: 'address' },
    { title: '联系电话', colKey: 'phone' },
    { title: '负责人', colKey: 'manager' },
    { title: '状态', colKey: 'isActive', cell: ({ row }) => row.isActive ? '启用' : '停用' }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Tabs defaultValue="overview">
        <Tabs.TabPanel value="overview" label="概览">
          <Card title="总部信息" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <p><strong>店铺名称:</strong> {currentStore.name}</p>
                <p><strong>店铺编码:</strong> {currentStore.code}</p>
              </div>
              <div>
                <p><strong>地址:</strong> {currentStore.address}</p>
                <p><strong>联系电话:</strong> {currentStore.phone}</p>
              </div>
            </div>
          </Card>

          <Card title="分店列表" style={{ marginBottom: '20px' }}>
            <Table
              data={childStores}
              columns={columns}
              rowKey="id"
              pagination={{ defaultPageSize: 10 }}
            />
          </Card>
        </Tabs.TabPanel>

        <Tabs.TabPanel value="settings" label="设置">
          <Card title="总部-分店管理设置">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p><strong>数据同步</strong></p>
                <Switch
                  value={settings.syncProducts}
                  onChange={(value) => handleSettingsChange('syncProducts', value)}
                  label="产品同步"
                />
              </div>
              
              <div>
                <p><strong>库存共享</strong></p>
                <Switch
                  value={settings.syncInventory}
                  onChange={(value) => handleSettingsChange('syncInventory', value)}
                  label="库存共享"
                />
              </div>
              
              <div>
                <p><strong>价格统一</strong></p>
                <Switch
                  value={settings.syncPricing}
                  onChange={(value) => handleSettingsChange('syncPricing', value)}
                  label="价格统一"
                />
              </div>
              
              <div>
                <p><strong>会员通用</strong></p>
                <Switch
                  value={settings.syncMembers}
                  onChange={(value) => handleSettingsChange('syncMembers', value)}
                  label="会员通用"
                />
              </div>
              
              <div>
                <p><strong>跨店订单</strong></p>
                <Switch
                  value={settings.allowCrossStoreOrders}
                  onChange={(value) => handleSettingsChange('allowCrossStoreOrders', value)}
                  label="允许跨店订单"
                />
              </div>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <Button 
                theme="primary" 
                onClick={handleSyncData}
                loading={syncing}
              >
                同步数据到分店
              </Button>
            </div>
          </Card>
        </Tabs.TabPanel>
      </Tabs>
    </div>
  );
};

export default HeadquartersBranchPage;