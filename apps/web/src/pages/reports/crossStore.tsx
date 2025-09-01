import React, { useState, useEffect } from 'react';
import { Button, Table, DatePicker, Message, Tabs } from 'tdesign-react';
import { CrossStoreReportingService, CrossStoreSalesReport, CrossStoreInventoryReport, AggregatedSalesReport } from '../../services/crossStoreReporting';

export default function CrossStoreReportPage() {
  const [salesReports, setSalesReports] = useState<CrossStoreSalesReport[]>([]);
  const [inventoryReports, setInventoryReports] = useState<CrossStoreInventoryReport[]>([]);
  const [aggregatedSalesData, setAggregatedSalesData] = useState<AggregatedSalesReport[]>([]);
  const [productRanking, setProductRanking] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState('aggregated');
  
  const crossStoreReportingService = CrossStoreReportingService.getInstance();

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
      loadData();
    }
  }, [startDate, endDate]);

  const loadData = async () => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // 获取所有数据
      const [salesData, inventoryData, aggregatedData, rankingData] = await Promise.all([
        crossStoreReportingService.getAllStoreSalesData(start, end),
        crossStoreReportingService.getAllStoreInventoryData(),
        crossStoreReportingService.getAggregatedSalesReport(start, end),
        crossStoreReportingService.getCrossStoreProductRanking()
      ]);
      
      setSalesReports(salesData);
      setInventoryReports(inventoryData);
      setAggregatedSalesData(aggregatedData);
      setProductRanking(rankingData);
    } catch (error) {
      Message.error('加载跨店铺报表数据失败');
      console.error('Error loading cross-store report data:', error);
    }
  };

  const handleDateChange = (dates: string[]) => {
    if (dates.length === 2) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    }
  };

  const aggregatedSalesColumns = [
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
      colKey: 'sales',
      render: ({ row }: { row: any }) => (
        <span>¥{row.sales.toFixed(2)}</span>
      )
    },
    {
      title: '商品数量',
      colKey: 'itemsSold',
    },
    {
      title: '占比',
      colKey: 'percentage',
      render: ({ row, rowIndex }: { row: any, rowIndex: number }) => {
        const totalSales = aggregatedSalesData[rowIndex]?.totalSales || 1;
        const percentage = ((row.sales / totalSales) * 100).toFixed(1);
        return <span>{percentage}%</span>;
      }
    }
  ];

  const storeSalesColumns = [
    {
      title: '店铺名称',
      colKey: 'storeName',
    },
    {
      title: '订单数',
      colKey: 'totalOrders',
    },
    {
      title: '销售金额',
      colKey: 'totalSales',
      render: ({ row }: { row: CrossStoreSalesReport }) => (
        <span>¥{row.totalSales.toFixed(2)}</span>
      )
    }
  ];

  const storeInventoryColumns = [
    {
      title: '店铺名称',
      colKey: 'storeName',
    },
    {
      title: '商品总数',
      colKey: 'totalProducts',
    },
    {
      title: '缺货商品数',
      colKey: 'outOfStockProducts',
    },
    {
      title: '缺货率',
      colKey: 'outOfStockRate',
      render: ({ row }: { row: CrossStoreInventoryReport }) => {
        const rate = row.totalProducts > 0 ? ((row.outOfStockProducts / row.totalProducts) * 100).toFixed(1) : '0.0';
        return <span>{rate}%</span>;
      }
    }
  ];

  const productRankingColumns = [
    {
      title: '排名',
      colKey: 'rank',
      render: ({ rowIndex }: { rowIndex: number }) => (
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
      render: ({ row }: { row: any }) => (
        <span>¥{row.totalRevenue.toFixed(2)}</span>
      )
    }
  ];

  // 计算汇总数据
  const totalAggregatedSales = aggregatedSalesData.reduce((sum, day) => sum + day.totalSales, 0);
  const totalAggregatedOrders = aggregatedSalesData.reduce((sum, day) => sum + day.totalOrders, 0);
  const totalAggregatedItems = aggregatedSalesData.reduce((sum, day) => sum + day.totalItemsSold, 0);

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>跨店铺报表</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>数据筛选</h2>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <DatePicker.RangePicker 
              value={[startDate, endDate]}
              onChange={handleDateChange}
            />
            <Button onClick={loadData}>刷新数据</Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onChange={(value: string) => setActiveTab(value)}>
          <Tabs.TabPanel value="aggregated" label="聚合销售报表">
            <div style={{ marginTop: '20px' }}>
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#f5f7fa',
                borderRadius: '8px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>总销售额</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    ¥{totalAggregatedSales.toFixed(2)}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>总订单数</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {totalAggregatedOrders}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>总商品数</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                    {totalAggregatedItems}
                  </div>
                </div>
              </div>
              
              <Table
                data={aggregatedSalesData}
                columns={aggregatedSalesColumns}
                rowKey="date"
                expandedRow={({ row }: { row: AggregatedSalesReport }) => (
                  <Table 
                    data={row.storeBreakdown} 
                    columns={storeBreakdownColumns} 
                    rowKey="storeId" 
                  />
                )}
              />
            </div>
          </Tabs.TabPanel>
          
          <Tabs.TabPanel value="stores" label="各店铺销售数据">
            <div style={{ marginTop: '20px' }}>
              <Table
                data={salesReports}
                columns={storeSalesColumns}
                rowKey="storeId"
              />
            </div>
          </Tabs.TabPanel>
          
          <Tabs.TabPanel value="inventory" label="各店铺库存数据">
            <div style={{ marginTop: '20px' }}>
              <Table
                data={inventoryReports}
                columns={storeInventoryColumns}
                rowKey="storeId"
              />
            </div>
          </Tabs.TabPanel>
          
          <Tabs.TabPanel value="ranking" label="跨店铺商品排行">
            <div style={{ marginTop: '20px' }}>
              <Table
                data={productRanking}
                columns={productRankingColumns}
                rowKey="productId"
              />
            </div>
          </Tabs.TabPanel>
        </Tabs>
      </div>
    </div>
  );
}