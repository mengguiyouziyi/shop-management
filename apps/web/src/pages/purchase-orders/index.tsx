import React, { useState, useEffect } from 'react';
import { PurchaseService } from '../../services/purchase';
import { SupplierService } from '../../services/supplier';
import { PurchaseOrder, PurchaseOrderItem } from '../../types/purchase';
import { Supplier } from '../../types/supplier';

interface PurchaseOrderFormData {
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: string;
  notes: string;
}

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [showItems, setShowItems] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<PurchaseOrderFormData>({
    supplierId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    status: 'pending',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const purchaseService = PurchaseService.getInstance();
  const supplierService = SupplierService.getInstance();

  useEffect(() => {
    loadOrders();
    loadSuppliers();
  }, []);

  useEffect(() => {
    // Generate mock data if no orders exist
    if (orders.length === 0) {
      generateMockOrders();
    }
  }, [orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const orderList = await purchaseService.getAllPurchaseOrders();
      setOrders(orderList);
    } catch (error) {
      console.error('加载采购订单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSuppliers = async () => {
    try {
      const supplierList = await supplierService.getAllSuppliers();
      setSuppliers(supplierList);
    } catch (error) {
      console.error('加载供应商列表失败:', error);
    }
  };

  const generateMockOrders = () => {
    const mockOrders: PurchaseOrder[] = [
      {
        id: '1',
        orderNumber: 'PO-2024-001',
        supplierId: '1',
        orderDate: new Date('2024-01-15').toISOString(),
        expectedDeliveryDate: new Date('2024-01-20').toISOString(),
        status: 'received',
        totalAmount: 12500.00,
        items: [
          {
            id: '1',
            productId: '1',
            productName: 'iPhone 15 Pro',
            sku: 'IP15P-256-BLK',
            quantity: 10,
            unitPrice: 899.00,
            totalPrice: 8990.00,
            receivedQuantity: 10
          },
          {
            id: '2',
            productId: '2',
            productName: 'AirPods Pro',
            sku: 'APP-3RD-GEN',
            quantity: 20,
            unitPrice: 179.00,
            totalPrice: 3580.00,
            receivedQuantity: 20
          }
        ],
        notes: '第一季度采购订单',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        orderNumber: 'PO-2024-002',
        supplierId: '2',
        orderDate: new Date('2024-01-18').toISOString(),
        expectedDeliveryDate: new Date('2024-01-25').toISOString(),
        status: 'approved',
        totalAmount: 8500.00,
        items: [
          {
            id: '3',
            productId: '3',
            productName: 'MacBook Pro 14"',
            sku: 'MBP14-16GB-512GB',
            quantity: 5,
            unitPrice: 1700.00,
            totalPrice: 8500.00,
            receivedQuantity: 0
          }
        ],
        notes: '办公设备采购',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        orderNumber: 'PO-2024-003',
        supplierId: '3',
        orderDate: new Date('2024-01-20').toISOString(),
        expectedDeliveryDate: new Date('2024-01-28').toISOString(),
        status: 'pending',
        totalAmount: 3200.00,
        items: [
          {
            id: '4',
            productId: '4',
            productName: 'iPad Air',
            sku: 'IPA-64GB-WIFI',
            quantity: 8,
            unitPrice: 400.00,
            totalPrice: 3200.00,
            receivedQuantity: 0
          }
        ],
        notes: '平板设备补充采购',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const mockSuppliers: Supplier[] = [
      { id: '1', name: '阿里巴巴批发网', contactPerson: '张经理', phone: '13800138000', address: '浙江省杭州市', categoryId: '1', rating: 5, status: 'active', notes: '电子产品供应商', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '2', name: '京东企业购', contactPerson: '李总监', phone: '13900139000', address: '北京市朝阳区', categoryId: '2', rating: 4, status: 'active', notes: '办公用品供应商', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: '3', name: '苏宁易购', contactPerson: '王主管', phone: '13700137000', address: '江苏省南京市', categoryId: '1', rating: 4, status: 'active', notes: '家电产品供应商', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    ];

    setOrders(mockOrders);
    setSuppliers(mockSuppliers);
  };

  const filteredOrders = orders.filter(order => {
    const supplier = suppliers.find(s => s.id === order.supplierId);
    return order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (supplier && supplier.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplierId || !formData.orderDate) {
      alert('请填写必填字段');
      return;
    }

    try {
      if (editingOrder) {
        // 更新采购订单
        const updatedOrder = { 
          ...editingOrder, 
          ...formData,
          expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate).toISOString() : undefined,
          orderDate: new Date(formData.orderDate).toISOString()
        };
        setOrders(orders.map(o => o.id === editingOrder.id ? updatedOrder : o));
      } else {
        // 创建采购订单
        const newOrder: PurchaseOrder = {
          id: Date.now().toString(),
          orderNumber: `PO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
          ...formData,
          expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate).toISOString() : undefined,
          orderDate: new Date(formData.orderDate).toISOString(),
          totalAmount: 0,
          items: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setOrders([...orders, newOrder]);
      }
      
      resetForm();
    } catch (error) {
      alert(editingOrder ? '采购订单更新失败' : '采购订单创建失败');
    }
  };

  const handleEdit = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setFormData({
      supplierId: order.supplierId,
      orderDate: new Date(order.orderDate).toISOString().split('T')[0],
      expectedDeliveryDate: order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toISOString().split('T')[0] : '',
      status: order.status,
      notes: order.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个采购订单吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      setOrders(orders.filter(o => o.id !== id));
    } catch (error) {
      alert('采购订单删除失败');
    }
  };

  const resetForm = () => {
    setFormData({
      supplierId: '',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: '',
      status: 'pending',
      notes: ''
    });
    setEditingOrder(null);
    setShowForm(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return '草稿';
      case 'pending': return '待审批';
      case 'approved': return '已审批';
      case 'ordered': return '已下单';
      case 'received': return '已收货';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#8c8c8c';
      case 'pending': return '#fa8c16';
      case 'approved': return '#1890ff';
      case 'ordered': return '#722ed1';
      case 'received': return '#52c41a';
      case 'cancelled': return '#ff4d4f';
      default: return '#666';
    }
  };

  const toggleItems = (orderId: string) => {
    setShowItems(showItems === orderId ? null : orderId);
  };

  // 统计数据
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const approvedOrders = orders.filter(o => o.status === 'approved').length;
  const receivedOrders = orders.filter(o => o.status === 'received').length;
  const totalValue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* 页面标题 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
              📋 采购订单
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              管理您的采购订单和供应商交易
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#40a9ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1890ff';
            }}
          >
            <span>➕</span>
            <span>{showForm ? '取消' : '创建订单'}</span>
          </button>
        </div>

        {/* 统计卡片 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px'
        }}>
          <div style={{ 
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderTop: '4px solid #1890ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>订单总数</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {totalOrders}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>📋</div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderTop: '4px solid #fa8c16'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>待审批</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {pendingOrders}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>⏳</div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderTop: '4px solid #52c41a'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>已收货</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {receivedOrders}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>✅</div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderTop: '4px solid #722ed1'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>总金额</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  ¥{totalValue.toLocaleString()}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>💰</div>
            </div>
          </div>
        </div>
      </div>

      {/* 表单 */}
      {showForm && (
        <div style={{ 
          backgroundColor: '#fff',
          border: '1px solid #e8e8e8',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
            {editingOrder ? '编辑采购订单' : '创建采购订单'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                  供应商 *
                </label>
                <select
                  value={formData.supplierId}
                  onChange={(e) => setFormData({...formData, supplierId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">请选择供应商</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                  订单日期 *
                </label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({...formData, orderDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                  预计到货日期
                </label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({...formData, expectedDeliveryDate: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                  状态
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="draft">草稿</option>
                  <option value="pending">待审批</option>
                  <option value="approved">已审批</option>
                  <option value="ordered">已下单</option>
                  <option value="received">已收货</option>
                  <option value="cancelled">已取消</option>
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                备注
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="请输入备注"
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#1890ff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#40a9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1890ff';
                }}
              >
                {editingOrder ? '更新订单' : '创建订单'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: '1px solid #d9d9d9',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e8e8e8';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 采购订单列表 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: '0', color: '#333', fontSize: '20px', fontWeight: 'bold' }}>
            采购订单列表
          </h2>
          <input
            type="text"
            placeholder="搜索订单号或供应商..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '300px',
              padding: '8px 12px',
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #1890ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
            <p style={{ color: '#666', marginTop: '16px' }}>加载中...</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#fafafa' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    订单号
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    供应商
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    下单日期
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    预计到货
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    状态
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    总金额
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    商品项
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const supplier = suppliers.find(s => s.id === order.supplierId);
                  return (
                    <React.Fragment key={order.id}>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                          {order.orderNumber}
                        </td>
                        <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                          {supplier ? supplier.name : '未知供应商'}
                        </td>
                        <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                          {order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate).toLocaleDateString() : '-'}
                        </td>
                        <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                          <span style={{ 
                            backgroundColor: getStatusColor(order.status) + '20',
                            color: getStatusColor(order.status),
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                          ¥{order.totalAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                          <button
                            onClick={() => toggleItems(order.id)}
                            style={{
                              backgroundColor: '#f0f0f0',
                              color: '#666',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold',
                              transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#e0e0e0';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#f0f0f0';
                            }}
                          >
                            {order.items.length} 项 {showItems === order.id ? '▲' : '▼'}
                          </button>
                        </td>
                        <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleEdit(order)}
                              style={{
                                backgroundColor: '#1890ff',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#40a9ff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#1890ff';
                              }}
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
                              style={{
                                backgroundColor: '#ff4d4f',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#ff7875';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#ff4d4f';
                              }}
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                      {showItems === order.id && (
                        <tr>
                          <td colSpan={8} style={{ padding: '0', backgroundColor: '#fafafa' }}>
                            <div style={{ padding: '16px' }}>
                              <h4 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                                商品明细
                              </h4>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>
                                      商品名称
                                    </th>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>
                                      SKU
                                    </th>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>
                                      数量
                                    </th>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>
                                      单价
                                    </th>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>
                                      总价
                                    </th>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px', fontWeight: 'bold' }}>
                                      已收货
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item) => (
                                    <tr key={item.id}>
                                      <td style={{ padding: '8px', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px' }}>
                                        {item.productName}
                                      </td>
                                      <td style={{ padding: '8px', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px' }}>
                                        {item.sku}
                                      </td>
                                      <td style={{ padding: '8px', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px' }}>
                                        {item.quantity}
                                      </td>
                                      <td style={{ padding: '8px', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px' }}>
                                        ¥{item.unitPrice.toFixed(2)}
                                      </td>
                                      <td style={{ padding: '8px', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px' }}>
                                        ¥{item.totalPrice.toFixed(2)}
                                      </td>
                                      <td style={{ padding: '8px', border: '1px solid #e0e0e0', color: '#333', fontSize: '12px' }}>
                                        {item.receivedQuantity}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}