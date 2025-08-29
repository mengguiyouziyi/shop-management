import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Statistic, Tabs } from 'tdesign-react';
import { StoreService } from '../services/store';
import { CrossStoreReportingService } from '../services/crossStoreReporting';
import { ResourceSharingService } from '../services/resourceSharing';
import { HeadquartersBranchService } from '../services/headquartersBranch';
import { useAppStore } from '../store/useAppStore';

export default function DashboardPage() {
  const { currentStore } = useAppStore();
  const [storesCount, setStoresCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [sharedResourcesCount, setSharedResourcesCount] = useState(0);
  const [branchesCount, setBranchesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const storeService = StoreService.getInstance();
  const crossStoreReportingService = CrossStoreReportingService.getInstance();
  const resourceSharingService = ResourceSharingService.getInstance();
  const headquartersBranchService = HeadquartersBranchService.getInstance();

  useEffect(() => {
    loadData();
  }, [currentStore]);

  const loadData = async () => {
    if (!currentStore) return;
    
    setLoading(true);
    try {
      // 获取店铺总数
      const stores = await storeService.getAllStores();
      setStoresCount(stores.length);
      
      // 获取销售总额
      const aggregatedReport = await crossStoreReportingService.getAggregatedSalesReport();
      setTotalSales(aggregatedReport.totalSales);
      
      // 获取共享资源数量
      const sharedResources = await resourceSharingService.getAllSharedResources();
      setSharedResourcesCount(sharedResources.length);
      
      // 如果是总部，获取分店数量
      if (!currentStore.parentId) {
        const branches = await headquartersBranchService.getChildStores(currentStore.id);
        setBranchesCount(branches.length);
      }
    } catch (error) {
      console.error('加载仪表板数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const isHeadquarters = currentStore && !currentStore.parentId;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        多店铺管理仪表板
      </h2>
      
      <Row gutter={20} style={{ marginBottom: '20px' }}>
        <Col flex="1">
          <Card>
            <Statistic 
              title="店铺总数" 
              value={storesCount} 
              loading={loading}
              unit="个"
            />
          </Card>
        </Col>
        
        <Col flex="1">
          <Card>
            <Statistic 
              title="总销售额" 
              value={totalSales} 
              loading={loading}
              unit="元"
              precision={2}
            />
          </Card>
        </Col>
        
        <Col flex="1">
          <Card>
            <Statistic 
              title="共享资源" 
              value={sharedResourcesCount} 
              loading={loading}
              unit="个"
            />
          </Card>
        </Col>
        
        <Col flex="1">
          <Card>
            <Statistic 
              title={isHeadquarters ? "分店数量" : "所属总部"} 
              value={isHeadquarters ? branchesCount : (currentStore?.parentId ? 1 : 0)} 
              loading={loading}
              unit={isHeadquarters ? "个" : ""}
            />
          </Card>
        </Col>
      </Row>
      
      <Tabs defaultValue="overview">
        <Tabs.TabPanel value="overview" label="系统概览">
          <div style={{ 
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>系统状态</h3>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <p><strong>系统版本:</strong> v1.0.0</p>
                <p><strong>运行时间:</strong> 7天 12小时</p>
                <p><strong>内存使用:</strong> 45%</p>
              </div>
              <div style={{ flex: 1 }}>
                <p><strong>数据库状态:</strong> 正常</p>
                <p><strong>备份状态:</strong> 已完成</p>
                <p><strong>安全状态:</strong> 正常</p>
              </div>
            </div>
          </div>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="stores" label="店铺管理">
          <div style={{ 
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>店铺管理概览</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Button 
                theme="primary" 
                style={{ flex: 1, minWidth: '200px' }}
                onClick={() => window.location.hash = '#/stores'}
              >
                店铺列表
              </Button>
              <Button 
                theme="primary" 
                style={{ flex: 1, minWidth: '200px' }}
                onClick={() => window.location.hash = '#/stores/hierarchy'}
              >
                店铺层级
              </Button>
              {isHeadquarters && (
                <Button 
                  theme="primary" 
                  style={{ flex: 1, minWidth: '200px' }}
                  onClick={() => window.location.hash = '#/headquarters-branch'}
                >
                  总部-分店管理
                </Button>
              )}
            </div>
          </div>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="reports" label="报表分析">
          <div style={{ 
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>报表分析概览</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Button 
                theme="primary" 
                style={{ flex: 1, minWidth: '200px' }}
                onClick={() => window.location.hash = '#/reports/sales'}
              >
                销售报表
              </Button>
              <Button 
                theme="primary" 
                style={{ flex: 1, minWidth: '200px' }}
                onClick={() => window.location.hash = '#/reports/inventory'}
              >
                库存报表
              </Button>
              <Button 
                theme="primary" 
                style={{ flex: 1, minWidth: '200px' }}
                onClick={() => window.location.hash = '#/reports/cross-store'}
              >
                跨店铺报表
              </Button>
            </div>
          </div>
        </Tabs.TabPanel>
        
        <Tabs.TabPanel value="sharing" label="资源共享">
          <div style={{ 
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0' }}>资源共享概览</h3>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <Button 
                theme="primary" 
                style={{ flex: 1, minWidth: '200px' }}
                onClick={() => window.location.hash = '#/resource-sharing'}
              >
                资源共享管理
              </Button>
            </div>
          </div>
        </Tabs.TabPanel>
      </Tabs>
    </div>
  );
}