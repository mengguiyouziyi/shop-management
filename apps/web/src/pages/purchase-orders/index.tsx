import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Table, Message, Select, DatePicker } from 'tdesign-react';
import { PurchaseService } from '../../services/purchase';
import { SupplierService } from '../../services/supplier';
import { PurchaseOrder, PurchaseOrderItem } from '../../types/purchase';
import { Supplier } from '../../types/supplier';

export default function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form] = Form.useForm();
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [showItems, setShowItems] = useState<string | null>(null); // 显示订单项的订单ID
  const purchaseService = PurchaseService.getInstance();
  const supplierService = SupplierService.getInstance();

  useEffect(() => {
    loadOrders();
    loadSuppliers();
  }, []);

  const loadOrders = async () => {
    try {
      const orderList = await purchaseService.getAllPurchaseOrders();
      setOrders(orderList);
    } catch (error) {
      Message.error('加载采购订单列表失败');
    }
  };

  const loadSuppliers = async () => {
    try {
      const supplierList = await supplierService.getAllSuppliers();
      setSuppliers(supplierList);
    } catch (error) {
      Message.error('加载供应商列表失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      
      // 处理日期格式
      const orderData = {
        ...values,
        orderDate: values.orderDate ? new Date(values.orderDate).toISOString() : new Date().toISOString(),
        expectedDeliveryDate: values.expectedDeliveryDate ? new Date(values.expectedDeliveryDate).toISOString() : undefined,
      };
      
      if (editingOrder) {
        // 更新采购订单
        await purchaseService.updatePurchaseOrder(editingOrder.id, orderData);
        Message.success('采购订单更新成功');
      } else {
        // 创建采购订单
        await purchaseService.createPurchaseOrder(orderData);
        Message.success('采购订单创建成功');
      }
      
      form.reset();
      setEditingOrder(null);
      loadOrders();
    } catch (error) {
      Message.error(editingOrder ? '采购订单更新失败' : '采购订单创建失败');
    }
  };

  const handleEdit = (order: PurchaseOrder) => {
    setEditingOrder(order);
    form.setFieldsValue({
      ...order,
      orderDate: order.orderDate ? new Date(order.orderDate) : null,
      expectedDeliveryDate: order.expectedDeliveryDate ? new Date(order.expectedDeliveryDate) : null,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个采购订单吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await purchaseService.deletePurchaseOrder(id);
      Message.success('采购订单删除成功');
      loadOrders();
    } catch (error) {
      Message.error('采购订单删除失败');
    }
  };

  const toggleItems = (orderId: string) => {
    setShowItems(showItems === orderId ? null : orderId);
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

  const columns = [
    {
      title: '订单号',
      colKey: 'orderNumber',
    },
    {
      title: '供应商',
      colKey: 'supplierId',
      cell: ({ row }: { row: PurchaseOrder }) => {
        const supplier = suppliers.find(s => s.id === row.supplierId);
        return supplier ? supplier.name : '未知供应商';
      }
    },
    {
      title: '下单日期',
      colKey: 'orderDate',
      cell: ({ row }: { row: PurchaseOrder }) => (
        row.orderDate ? new Date(row.orderDate).toLocaleDateString() : ''
      )
    },
    {
      title: '预计到货日期',
      colKey: 'expectedDeliveryDate',
      cell: ({ row }: { row: PurchaseOrder }) => (
        row.expectedDeliveryDate ? new Date(row.expectedDeliveryDate).toLocaleDateString() : ''
      )
    },
    {
      title: '状态',
      colKey: 'status',
      cell: ({ row }: { row: PurchaseOrder }) => (
        getStatusText(row.status)
      )
    },
    {
      title: '总金额',
      colKey: 'totalAmount',
      cell: ({ row }: { row: PurchaseOrder }) => (
        `¥${row.totalAmount.toFixed(2)}`
      )
    },
    {
      title: '商品项数',
      colKey: 'items',
      cell: ({ row }: { row: PurchaseOrder }) => (
        <Button 
          size="small" 
          variant="text"
          onClick={() => toggleItems(row.id)}
        >
          {row.items.length} 项 {showItems === row.id ? '▲' : '▼'}
        </Button>
      )
    },
    {
      title: '操作',
      colKey: 'actions',
      cell: ({ row }: { row: PurchaseOrder }) => (
        <div className="flex gap-2">
          <Button 
            size="small" 
            variant="outline"
            onClick={() => handleEdit(row)}
          >
            编辑
          </Button>
          <Button 
            size="small" 
            theme="danger"
            variant="outline"
            onClick={() => handleDelete(row.id)}
          >
            删除
          </Button>
        </div>
      )
    }
  ];

  const itemColumns = [
    {
      title: '商品名称',
      colKey: 'productName',
    },
    {
      title: 'SKU',
      colKey: 'sku',
    },
    {
      title: '数量',
      colKey: 'quantity',
    },
    {
      title: '单价',
      colKey: 'unitPrice',
      cell: ({ row }: { row: PurchaseOrderItem }) => (
        `¥${row.unitPrice.toFixed(2)}`
      )
    },
    {
      title: '总价',
      colKey: 'totalPrice',
      cell: ({ row }: { row: PurchaseOrderItem }) => (
        `¥${row.totalPrice.toFixed(2)}`
      )
    },
    {
      title: '已收货数量',
      colKey: 'receivedQuantity',
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>采购订单</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>{editingOrder ? '编辑采购订单' : '创建采购订单'}</h2>
        <Form form={form} onSubmit={handleSubmit} labelWidth={120}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <Form.Item label="供应商" name="supplierId" rules={[{ required: true }]}>
              <Select>
                {suppliers.map(supplier => (
                  <Select.Option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item label="订单日期" name="orderDate" rules={[{ required: true }]}>
              <DatePicker />
            </Form.Item>
            
            <Form.Item label="预计到货日期" name="expectedDeliveryDate">
              <DatePicker />
            </Form.Item>
            
            <Form.Item label="状态" name="status" initialValue="pending">
              <Select>
                <Select.Option value="pending">待处理</Select.Option>
                <Select.Option value="confirmed">已确认</Select.Option>
                <Select.Option value="shipped">已发货</Select.Option>
                <Select.Option value="received">已收货</Select.Option>
                <Select.Option value="cancelled">已取消</Select.Option>
              </Select>
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <Button theme="primary" type="submit">
              {editingOrder ? '更新订单' : '创建订单'}
            </Button>
            {editingOrder && (
              <Button variant="outline" onClick={() => {
                setEditingOrder(null);
                form.reset();
              }}>
                取消
              </Button>
            )}
          </div>
        </Form>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>采购订单列表</h2>
        <Table
          data={orders}
          columns={columns}
          rowKey="id"
        />
      </div>
    </div>
  );
}