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
    <div className="page-container">
      <h1 className="page-title">销售报表</h1>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2>报表筛选</h2>
          <DatePicker.RangePicker 
            value={[startDate, endDate]} 
            onChange={handleDateChange}
          />
        </div>
      </div>
      
      <div className="card">
        <h2>销售汇总</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div className="stat-card">
            <div className="stat-value">¥{totalSales.toFixed(2)}</div>
            <div className="stat-label">总销售额</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalOrders}</div>
            <div className="stat-label">总订单数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalItemsSold}</div>
            <div className="stat-label">总商品数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">¥{averageOrderValue.toFixed(2)}</div>
            <div className="stat-label">平均订单金额</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2>销售趋势</h2>
        <Table
          data={salesData}
          columns={salesColumns}
          rowKey="date"
        />
      </div>
      
      <div className="card">
        <h2>商品销售排行</h2>
        <Table
          data={rankingData}
          columns={rankingColumns}
          rowKey="productId"
        />
      </div>
    </div>
  );
}