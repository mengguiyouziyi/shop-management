import React, { useState, useEffect } from 'react';
import { Table, Input, Message } from 'tdesign-react';
import { useAppStore } from '../../store/useAppStore';
import { ReportingService, InventoryReportData } from '../../services/reporting';

export default function InventoryReportPage() {
  const { products } = useAppStore();
  const [inventoryData, setInventoryData] = useState<InventoryReportData[]>([]);
  const [filteredData, setFilteredData] = useState<InventoryReportData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const reportingService = ReportingService.getInstance();

  useEffect(() => {
    try {
      // 获取库存报表数据
      const inventoryReport = reportingService.getInventoryReportData(products);
      setInventoryData(inventoryReport);
    } catch (error) {
      Message.error('生成库存报表数据失败');
    }
  }, [products]);

  useEffect(() => {
    // 根据搜索词过滤数据
    if (!searchTerm) {
      setFilteredData(inventoryData);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = inventoryData.filter(item => 
        item.productName.toLowerCase().includes(term)
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, inventoryData]);

  const columns = [
    {
      title: '商品名称',
      colKey: 'productName',
    },
    {
      title: '当前库存',
      colKey: 'currentStock',
    },
    {
      title: '预留库存',
      colKey: 'reservedStock',
    },
    {
      title: '可用库存',
      colKey: 'availableStock',
    },
    {
      title: '最低库存',
      colKey: 'minStockLevel',
    },
    {
      title: '最高库存',
      colKey: 'maxStockLevel',
    },
    {
      title: '状态',
      colKey: 'status',
      cell: ({ row }: { row: InventoryReportData }) => {
        switch (row.status) {
          case 'out':
            return <span style={{ color: '#ff4d4f' }}>缺货</span>;
          case 'low':
            return <span style={{ color: '#faad14' }}>低库存</span>;
          case 'over':
            return <span style={{ color: '#1890ff' }}>超储</span>;
          default:
            return <span style={{ color: '#52c41a' }}>正常</span>;
        }
      }
    }
  ];

  // 计算汇总数据
  const totalProducts = inventoryData.length;
  const outOfStockProducts = inventoryData.filter(item => item.status === 'out').length;
  const lowStockProducts = inventoryData.filter(item => item.status === 'low').length;
  const overStockProducts = inventoryData.filter(item => item.status === 'over').length;

  return (
    <div className="page-container">
      <h1 className="page-title">库存报表</h1>
      
      <div className="card">
        <h2>库存汇总</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="stat-card">
            <div className="stat-value">{totalProducts}</div>
            <div className="stat-label">商品总数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#ff4d4f' }}>{outOfStockProducts}</div>
            <div className="stat-label">缺货商品</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#faad14' }}>{lowStockProducts}</div>
            <div className="stat-label">低库存商品</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#1890ff' }}>{overStockProducts}</div>
            <div className="stat-label">超储商品</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2>库存详情</h2>
          <Input 
            placeholder="搜索商品名称" 
            value={searchTerm}
            onChange={setSearchTerm}
            style={{ width: '300px' }}
          />
        </div>
        
        <Table
          data={filteredData}
          columns={columns}
          rowKey="productId"
        />
      </div>
    </div>
  );
}