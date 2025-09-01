import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  MessagePlugin, 
  Table, 
  Dialog, 
  Form, 
  Input, 
  Select,
  Space,
  Tag
} from 'tdesign-react';
import { ResourceSharingService } from '../../services/resourceSharing';
import { StoreService } from '../../services/store';
import { useAppStore } from '../../store/useAppStore';

const { FormItem } = Form;

export default function ResourceSharingPage() {
  const [activeTab, setActiveTab] = useState('share');
  const [resources, setResources] = useState([]);
  const [shareRequests, setShareRequests] = useState([]);
  const [stores, setStores] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const currentStore = useAppStore(state => state.currentStore);
  const [formData, setFormData] = useState({
    resourceName: '',
    resourceType: 'product',
    targetStoreId: '',
    description: ''
  });

  const resourceSharingService = ResourceSharingService.getInstance();
  const storeService = StoreService.getInstance();

  useEffect(() => {
    loadData();
    loadStores();
  }, []);

  const loadData = async () => {
    try {
      const resourcesData = await resourceSharingService.getSharedResources();
      const requestsData = await resourceSharingService.getShareRequests();
      const storesData = await storeService.getAllStores();
      
      setResources(resourcesData);
      setShareRequests(requestsData);
      setStores(storesData);
    } catch (error) {
      if (typeof Message !== 'undefined' && MessagePlugin.error) {
        MessagePlugin.error('加载数据失败');
      }
    }
  };

  const loadStores = async () => {
    try {
      const allStores = await storeService.getAllStores();
      // 排除当前店铺
      const otherStores = allStores.filter(store => 
        currentStore && store.id !== currentStore.id
      );
      setStores(otherStores);
    } catch (error) {
      MessagePlugin.error('加载店铺数据失败');
    }
  };

  const handleShare = async () => {
    if (!formData.resourceName || !formData.targetStoreId) {
      if (typeof Message !== 'undefined' && MessagePlugin.warning) {
        MessagePlugin.warning('请填写完整信息');
      }
      return;
    }

    try {
      await resourceSharingService.shareResource({
        ...formData,
        sourceStoreId: currentStore?.id || ''
      });
      if (typeof Message !== 'undefined' && MessagePlugin.success) {
        MessagePlugin.success('资源共享请求已发送');
      }
      setFormVisible(false);
      setFormData({
        resourceName: '',
        resourceType: 'product',
        targetStoreId: '',
        description: ''
      });
      loadData();
    } catch (error) {
      if (typeof Message !== 'undefined' && MessagePlugin.error) {
        MessagePlugin.error('资源共享失败');
      }
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await resourceSharingService.approveShareRequest(requestId);
      if (typeof Message !== 'undefined' && MessagePlugin.success) {
        MessagePlugin.success('已批准资源共享请求');
      }
      loadData();
    } catch (error) {
      if (typeof Message !== 'undefined' && MessagePlugin.error) {
        MessagePlugin.error('操作失败');
      }
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await resourceSharingService.rejectShareRequest(requestId);
      if (typeof Message !== 'undefined' && MessagePlugin.success) {
        MessagePlugin.success('已拒绝资源共享请求');
      }
      loadData();
    } catch (error) {
      if (typeof Message !== 'undefined' && MessagePlugin.error) {
        MessagePlugin.error('操作失败');
      }
    }
  };

  const resourceColumns = [
    {
      title: '资源名称',
      colKey: 'resourceName'
    },
    {
      title: '资源类型',
      colKey: 'resourceType',
      cell: ({ row }) => (
        <Tag theme={row.resourceType === 'product' ? 'primary' : 'warning'}>
          {row.resourceType === 'product' ? '商品' : '其他'}
        </Tag>
      )
    },
    {
      title: '目标店铺',
      colKey: 'targetStoreName'
    },
    {
      title: '状态',
      colKey: 'status',
      cell: ({ row }) => (
        <Tag theme={row.status === 'approved' ? 'success' : 
                   row.status === 'pending' ? 'warning' : 'danger'}>
          {row.status === 'approved' ? '已批准' : 
           row.status === 'pending' ? '待处理' : '已拒绝'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      colKey: 'createdAt'
    }
  ];

  const requestColumns = [
    {
      title: '资源名称',
      colKey: 'resourceName'
    },
    {
      title: '资源类型',
      colKey: 'resourceType',
      cell: ({ row }) => (
        <Tag theme={row.resourceType === 'product' ? 'primary' : 'warning'}>
          {row.resourceType === 'product' ? '商品' : '其他'}
        </Tag>
      )
    },
    {
      title: '来源店铺',
      colKey: 'sourceStoreName'
    },
    {
      title: '状态',
      colKey: 'status',
      cell: ({ row }) => (
        <Tag theme={row.status === 'approved' ? 'success' : 
                   row.status === 'pending' ? 'warning' : 'danger'}>
          {row.status === 'approved' ? '已批准' : 
           row.status === 'pending' ? '待处理' : '已拒绝'}
        </Tag>
      )
    },
    {
      title: '操作',
      colKey: 'action',
      cell: ({ row }) => (
        row.status === 'pending' && currentStore && row.targetStoreId === currentStore.id ? (
          <Space>
            <Button size="small" theme="primary" onClick={() => handleApprove(row.id)}>
              批准
            </Button>
            <Button size="small" theme="danger" onClick={() => handleReject(row.id)}>
              拒绝
            </Button>
          </Space>
        ) : null
      )
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
          资源共享管理
        </h1>
        <Button theme="primary" onClick={() => setFormVisible(true)}>
          发起资源共享
        </Button>
      </div>

      <Card style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '20px',
          borderBottom: '1px solid #eee',
          paddingBottom: '10px'
        }}>
          <div 
            onClick={() => setActiveTab('share')}
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer',
              borderBottom: activeTab === 'share' ? '2px solid #1890ff' : 'none',
              fontWeight: activeTab === 'share' ? 'bold' : 'normal'
            }}
          >
            我共享的资源
          </div>
          <div 
            onClick={() => setActiveTab('request')}
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer',
              borderBottom: activeTab === 'request' ? '2px solid #1890ff' : 'none',
              fontWeight: activeTab === 'request' ? 'bold' : 'normal'
            }}
          >
            收到的共享请求
          </div>
        </div>

        {activeTab === 'share' && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>我共享的资源</h2>
            <Table
              data={resources}
              columns={resourceColumns}
              rowKey="id"
              pagination={{ defaultPageSize: 10 }}
            />
          </div>
        )}

        {activeTab === 'request' && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>收到的共享请求</h2>
            <Table
              data={shareRequests.filter(request => 
                currentStore && request.targetStoreId === currentStore.id
              )}
              columns={requestColumns}
              rowKey="id"
              pagination={{ defaultPageSize: 10 }}
            />
          </div>
        )}
      </Card>

      <Dialog
        header="发起资源共享"
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onConfirm={handleShare}
      >
        <Form labelWidth={80}>
          <FormItem label="资源名称" name="resourceName" required>
            <Input 
              value={formData.resourceName}
              onChange={(value) => setFormData({...formData, resourceName: value})}
              placeholder="请输入资源名称"
            />
          </FormItem>
          <FormItem label="资源类型" name="resourceType" required>
            <Select
              value={formData.resourceType}
              onChange={(value) => setFormData({...formData, resourceType: value})}
              options={[
                { label: '商品', value: 'product' },
                { label: '其他', value: 'other' }
              ]}
            />
          </FormItem>
          <FormItem label="目标店铺" name="targetStoreId" required>
            <Select
              value={formData.targetStoreId}
              onChange={(value) => setFormData({...formData, targetStoreId: value})}
              placeholder="请选择目标店铺"
            >
              {stores.map(store => (
                <Select.Option key={store.id} value={store.id} label={store.name} />
              ))}
            </Select>
          </FormItem>
          <FormItem label="描述" name="description">
            <Input 
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
              placeholder="请输入资源描述"
              multiline
              rows={3}
            />
          </FormItem>
        </Form>
      </Dialog>
    </div>
  );
}