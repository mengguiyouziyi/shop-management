import React, { useState, useEffect } from 'react';
import { Button, Card, Space } from 'tdesign-react';
import { useAppStore } from '../../store/useAppStore';
import { PaymentMethod, OrderStatus } from '../../types';

export default function POSPage() {
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { 
    products, 
    members, 
    currentOrder, 
    addToOrder, 
    updateOrderItem, 
    removeFromOrder, 
    completeOrder,
    setCurrentOrder 
  } = useAppStore();

  // Initialize current order if none exists
  useEffect(() => {
    if (!currentOrder) {
      setCurrentOrder({
        id: crypto.randomUUID(),
        orderNumber: '',
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        paymentMethod: PaymentMethod.CASH,
        status: OrderStatus.PENDING,
        staffId: '',
        createdAt: new Date().toISOString(),
      });
    }
  }, [currentOrder, setCurrentOrder]);

  const handleAddToOrder = (productId: string, quantity: number = 1) => {
    addToOrder(productId, quantity);
  };

  const handleCompleteOrder = () => {
    completeOrder(paymentMethod);
    setShowConfirmDialog(false);
  };

  return (
    <div>
      <h1>POS收银台</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 2 }}>
          <h3>商品清单</h3>
          
          {/* Product Quick Add */}
          <div style={{ marginBottom: '20px' }}>
            <h4>快速添加商品</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {products.slice(0, 8).map(product => (
                <button
                  key={product.id}
                  onClick={() => handleAddToOrder(product.id)}
                  disabled={!product.isActive || product.stock <= 0}
                  style={{ 
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    background: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  {product.name} - ¥{product.price}
                </button>
              ))}
            </div>
          </div>
          
          {/* Current Order Items */}
          <div>
            <h4>当前订单</h4>
            {currentOrder?.items?.length > 0 ? (
              <div>
                {currentOrder.items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={item.id} style={{ 
                      border: '1px solid #ddd', 
                      padding: '10px', 
                      margin: '5px 0',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <strong>{product?.name || '未知商品'}</strong>
                        <p>单价: ¥{item.unitPrice.toFixed(2)}</p>
                        <p>数量: {item.quantity}</p>
                        <p>小计: ¥{item.totalPrice.toFixed(2)}</p>
                      </div>
                      <button onClick={() => removeFromOrder(item.id)}>删除</button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>暂无商品</p>
            )}
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <h3>订单汇总</h3>
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label>选择会员:</label>
              <select 
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                style={{ width: '100%', marginTop: '5px' }}
              >
                <option value="">请选择会员</option>
                {members.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.phone}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>支付方式:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                style={{ width: '100%', marginTop: '5px' }}
              >
                <option value={PaymentMethod.CASH}>现金</option>
                <option value={PaymentMethod.CARD}>银行卡</option>
                <option value={PaymentMethod.MOBILE}>移动支付</option>
                <option value={PaymentMethod.MEMBER_BALANCE}>会员余额</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <p>商品总数: {currentOrder?.items.reduce((sum, item) => sum + item.quantity, 0) || 0}</p>
              <p>小计: ¥{(currentOrder?.subtotal || 0).toFixed(2)}</p>
              <p>优惠: -¥{(currentOrder?.discount || 0).toFixed(2)}</p>
              <p><strong>总计: ¥{(currentOrder?.total || 0).toFixed(2)}</strong></p>
            </div>
            
            <button 
              disabled={!currentOrder?.items.length}
              onClick={() => setShowConfirmDialog(true)}
              style={{ 
                width: '100%',
                padding: '10px',
                background: currentOrder?.items.length ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentOrder?.items.length ? 'pointer' : 'not-allowed'
              }}
            >
              确认下单
            </button>
          </div>
        </div>
      </div>
      
      {showConfirmDialog && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          background: 'white',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <h3>确认订单</h3>
          <p>订单金额: ¥{(currentOrder?.total || 0).toFixed(2)}</p>
          <p>支付方式: {paymentMethod === PaymentMethod.CASH ? '现金' : paymentMethod === PaymentMethod.CARD ? '银行卡' : paymentMethod === PaymentMethod.MOBILE ? '移动支付' : '会员余额'}</p>
          <p>确认完成支付？</p>
          <div style={{ marginTop: '15px' }}>
            <button onClick={() => setShowConfirmDialog(false)} style={{ marginRight: '10px' }}>取消</button>
            <button onClick={handleCompleteOrder}>确认支付</button>
          </div>
        </div>
      )}
    </div>
  );
}