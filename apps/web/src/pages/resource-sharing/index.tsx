import React, { useState, useEffect } from 'react';
import { Button, Table, Message, Tabs, Input, Select, Form } from 'tdesign-react';
import { ResourceSharingService, SharedResource, ResourceShareRequest } from '../../services/resourceSharing';
import { StoreService } from '../../services/store';
import { Store } from '../../types/store';
import { useAppStore } from '../../store/useAppStore';

export default function ResourceSharingPage() {
  const { currentStore } = useAppStore();
  const [sharedResources, setSharedResources] = useState<SharedResource[]>([]);
  const [shareRequests, setShareRequests] = useState<ResourceShareRequest[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [form] = Form.useForm();
  const [requestForm] = Form.useForm();
  
  const resourceSharingService = ResourceSharingService.getInstance();
  const storeService = StoreService.getInstance();

  useEffect(() => {
    if (currentStore) {
      loadData();
    }
  }, [currentStore]);

  const loadData = async () => {
    try {
      const [sharedResourcesData, shareRequestsData, storesData] = await Promise.all([
        resourceSharingService.getAllSharedResources(),
        resourceSharingService.getShareRequestsForStore(currentStore!.id),
        storeService.getAllStores()
      ]);
      
      setSharedResources(sharedResourcesData);
      setShareRequests(shareRequestsData);
      setStores(storesData);
    } catch (error) {
      Message.error('加载数据失败');
    }
  };

  const handleShareResource = async () => {
    if (!currentStore) return;
    
    try {
      const values = await form.validate();
      
      await resourceSharingService.shareResource(
        values.resourceId,
        values.resourceType,
        currentStore.id,
        values.targetStores
      );
      
      Message.success('资源共享成功');
      form.reset();
      loadData();
    } catch (error) {
      Message.error('资源共享失败');
    }
  };

  const handleCreateShareRequest = async () => {
    if (!currentStore) return;
    
    try {
      const values = await requestForm.validate();
      
      await resourceSharingService.createShareRequest(
        values.resourceId,
        values.resourceType,
        values.resourceName,
        currentStore.id,
        values.targetStore
      );
      
      Message.success('共享请求已发送');
      requestForm.reset();
      loadData();
    } catch (error) {
      Message.error('发送共享请求失败');
    }
  };

  const handleProcessRequest = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      await resourceSharingService.processShareRequest(requestId, status);
      Message.success(`共享请求已${status === 'approved' ? '批准' : '拒绝'}`);
      loadData();
    } catch (error) {
      Message.error(`${status === 'approved' ? '批准' : '拒绝'}共享请求失败`);
    }
  };

  const handleStopSharing = async (resourceId: string, sourceStoreId: string, targetStoreId: string) => {
    if (!currentStore) return;
    
    try {
      await resourceSharingService.stopSharingResource(resourceId, sourceStoreId, targetStoreId);
      Message.success('已停止资源共享');
      loadData();
    } catch (error) {
      Message.error('停止资源共享失败');
    }
  };

  const sharedResourcesColumns = [
    {
      title: '资源名称',
      colKey: 'name',
    },
    {
      title: '资源类型',
      colKey: 'type',
      cell: ({ row }: { row: SharedResource }) => (
        row.type === 'product' ? '商品' : 
        row.type === 'member' ? '会员' : '供应商'
      )
    },
    {
      title: '来源店铺',
      colKey: 'sourceStoreName',
    },
    {
      title: '共享给',
      colKey: 'sharedWith',
      cell: ({ row }: { row: SharedResource }) => (
        <div>
          {row.sharedWith.map((share, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>{share.storeName}</span>
              {currentStore && row.sourceStoreId === currentStore.id && (
                <Button 
                  size="small" 
                  theme="danger" 
                  variant="text"
                  onClick={() => handleStopSharing(row.id, row.sourceStoreId, share.storeId)}
                >
                  停止共享
                </Button>
              )}
            </div>
          ))}
        </div>
      )
    }
  ];

  const shareRequestsColumns = [
    {
      title: '资源名称',
      colKey: 'resourceName',
    },
    {
      title: '资源类型',
      colKey: 'resourceType',
      cell: ({ row }: { row: ResourceShareRequest }) => (
        row.resourceType === 'product' ? '商品' : 
        row.resourceType === 'member' ? '会员' : '供应商'
      )
    },
    {
      title: '请求店铺',
      colKey: 'requestingStoreName',
    },
    {
      title: '目标店铺',
      colKey: 'targetStoreId',
      cell: ({ row }: { row: ResourceShareRequest }) => {
        const targetStore = stores.find(store => store.id === row.targetStoreId);
        return targetStore ? targetStore.name : '未知';
      }
    },
    {
      title: '状态',
      colKey: 'status',
      cell: ({ row }: { row: ResourceShareRequest }) => (
        row.status === 'pending' ? '待处理' : 
        row.status === 'approved' ? '已批准' : '已拒绝'
      )
    },
    {
      title: '操作',
      colKey: 'actions',
      cell: ({ row }: { row: ResourceShareRequest }) => (
        row.status === 'pending' && currentStore && row.targetStoreId === currentStore.id ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button 
              size="small" 
              theme="primary"
              onClick={() => handleProcessRequest(row.id, 'approved')}
            >
              批准
            </Button>
            <Button 
              size="small" 
              theme="danger"
              variant="outline"
              onClick={() => handleProcessRequest(row.id, 'rejected')}
            >
              拒绝
            </Button>
          </div>
        ) : null
      )
    }
  ];

  const myRequestsColumns = [
    {
      title: '资源名称',
      colKey: 'resourceName',
    },
    {
      title: '资源类型',
      colKey: 'resourceType',
      cell: ({ row }: { row: ResourceShareRequest }) => (
        row.resourceType === 'product' ? '商品' : 
        row.resourceType === 'member' ? '会员' : '供应商'
      )
    },
    {
      title: '目标店铺',
      colKey: 'targetStoreId',
      cell: ({ row }: { row: ResourceShareRequest }) => {
        const targetStore = stores.find(store => store.id === row.targetStoreId);
        return targetStore ? targetStore.name : '未知';
      }
    },
    {
      title: '状态',
      colKey: 'status',
      cell: ({ row }: { row: ResourceShareRequest }) => (
        row.status === 'pending' ? '待处理' : 
        row.status === 'approved' ? '已批准' : '已拒绝'
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>资源共享管理</h1>
      
      <Tabs defaultValue="shared">
        <Tabs.TabPanel value="shared" label="共享资源">
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>共享我的资源</h2>
            <Form form={form} onSubmit={handleShareResource} labelWidth={100}>
              <div style={{ marginBottom: '16px' }}>
                <Form.Item label="资源ID" name="resourceId" rules={[{ required: true }]}>
                  <Input placeholder="请输入资源ID" />
                </Form.Item>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Form.Item label="资源类型" name="resourceType" rules={[{ required: true }]}>
                  <Select placeholder="请选择资源类型">
                    <Select.Option value="product">商品</Select.Option>
                    <Select.Option value="member">会员</Select.Option>
                    <Select.Option value="supplier">供应商</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Form.Item label="共享给" name="targetStores" rules={[{ required: true }]}>
                  <Select multiple placeholder="请选择目标店铺">
                    {stores
                      .filter(store => currentStore && store.id !== currentStore.id)
                      .map(store => (
                        <Select.Option key={store.id} value={store.id}>
                          {store.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              
              <Button theme="primary" type="submit">
                共享资源
              </Button>
            </Form>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>已共享资源</h2>
            <Table
              data={sharedResources.filter(resource => 
                currentStore && resource.sourceStoreId === currentStore.id
              )}
              columns={sharedResourcesColumns}
              rowKey="id"
            />
          </div>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="requests" label="共享请求">
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>请求共享资源</h2>
            <Form form={requestForm} onSubmit={handleCreateShareRequest} labelWidth={100}>
              <div style={{ marginBottom: '16px' }}>
                <Form.Item label="资源ID" name="resourceId" rules={[{ required: true }]}>
                  <Input placeholder="请输入资源ID" />
                </Form.Item>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Form.Item label="资源名称" name="resourceName" rules={[{ required: true }]}>
                  <Input placeholder="请输入资源名称" />
                </Form.Item>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Form.Item label="资源类型" name="resourceType" rules={[{ required: true }]}>
                  <Select placeholder="请选择资源类型">
                    <Select.Option value="product">商品</Select.Option>
                    <Select.Option value="member">会员</Select.Option>
                    <Select.Option value="supplier">供应商</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Form.Item label="目标店铺" name="targetStore" rules={[{ required: true }]}>
                  <Select placeholder="请选择目标店铺">
                    {stores
                      .filter(store => currentStore && store.id !== currentStore.id)
                      .map(store => (
                        <Select.Option key={store.id} value={store.id}>
                          {store.name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>
              
              <Button theme="primary" type="submit">
                发送请求
              </Button>
            </Form>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>收到的共享请求</h2>
            <Table
              data={shareRequests.filter(request => 
                currentStore && request.targetStoreId === currentStore.id
              )}
              columns={shareRequestsColumns}
              rowKey="id"
            />
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>我发起的请求</h2>
            <Table
              data={shareRequests.filter(request => 
                currentStore && request.requestingStoreId === currentStore.id
              )}
              columns={myRequestsColumns}
              rowKey="id"
            />
          </div>

        </Tabs.TabPanel>
      </Tabs>
    </div>
  );
}