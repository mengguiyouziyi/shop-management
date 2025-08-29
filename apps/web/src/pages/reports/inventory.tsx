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
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>库存报表</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>库存数据</h2>
          <Input 
            placeholder="搜索商品..." 
            value={searchTerm}
            onChange={(value) => setSearchTerm(value as string)}
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