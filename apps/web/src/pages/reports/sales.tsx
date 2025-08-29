import React, { useState, useEffect } from 'react';
import { Button, Table, DatePicker, Message } from 'tdesign-react';
import { useAppStore } from '../../store/useAppStore';
import { ReportingService, SalesReportData, ProductSalesRanking } from '../../services/reporting';

export default function SalesReportPage() {
  const { orders, products } = useAppStore();
  const [salesData, setSalesData] = useState<SalesReportData[]>([]);
  const [rankingData, setRankingData] = useState<ProductSalesRanking[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const reportingService = ReportingService.getInstance();

  useEffect(() => {
    // 默认显示最近30天的数据
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // 获取销售报表数据
        const salesReport = reportingService.getSalesReportData(orders, start, end);
        setSalesData(salesReport);
        
        // 获取商品销售排行
        const ranking = reportingService.getProductSalesRanking(orders, products);
        setRankingData(ranking);
      } catch (error) {
        Message.error('生成报表数据失败');
      }
    }
  }, [startDate, endDate, orders, products]);

  const handleDateChange = (dates: string[]) => {
    if (dates.length === 2) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    }
  };

  const salesColumns = [
    {
      title: '日期',
      colKey: 'date',
    },
    {
      title: '订单数',
      colKey: 'totalOrders',
    },
    {
      title: '销售金额',
      colKey: 'totalSales',
      cell: ({ row }: { row: SalesReportData }) => (
        `¥${row.totalSales.toFixed(2)}`
      )
    },
    {
      title: '商品数量',
      colKey: 'totalItemsSold',
    }
  ];

  const rankingColumns = [
    {
      title: '排名',
      colKey: 'rank',
      cell: ({ rowIndex }: { rowIndex: number }) => (
        rowIndex + 1
      )
    },
    {
      title: '商品名称',
      colKey: 'productName',
    },
    {
      title: '销售数量',
      colKey: 'quantitySold',
    },
    {
      title: '销售金额',
      colKey: 'totalRevenue',
      cell: ({ row }: { row: ProductSalesRanking }) => (
        `¥${row.totalRevenue.toFixed(2)}`
      )
    }
  ];

  // 计算汇总数据
  const totalSales = salesData.reduce((sum, day) => sum + day.totalSales, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.totalOrders, 0);
  const totalItemsSold = salesData.reduce((sum, day) => sum + day.totalItemsSold, 0);
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>销售报表</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>销售数据</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <DatePicker.RangePicker 
              value={[startDate, endDate]}
              onChange={handleDateChange}
            />
          </div>
        </div>
        <Table
          data={salesData}
          columns={salesColumns}
          rowKey="date"
        />
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>商品销售排行</h2>
        <Table
          data={rankingData}
          columns={rankingColumns}
          rowKey="productId"
        />
      </div>
    </div>
  );
}