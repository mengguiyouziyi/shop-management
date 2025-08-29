import React, { useState, useEffect } from 'react';
import { Button, Input, Table, Message } from 'tdesign-react';
import { useAppStore } from '../../store/useAppStore';
import { Product } from '../../types';

export default function MobilePosPage() {
  const { products, addOrder } = useAppStore();
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [memberId, setMemberId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products.slice(0, 20)); // 限制显示数量以提高性能
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.barcode?.toLowerCase().includes(term)
      );
      setFilteredProducts(filtered.slice(0, 20)); // 限制显示数量以提高性能
    }
  }, [searchTerm, products]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Message.warning('购物车为空');
      return;
    }

    const totalAmount = calculateTotal();
    let amountReceivedNum = 0;
    
    if (paymentMethod === 'cash') {
      amountReceivedNum = parseFloat(amountReceived);
      if (isNaN(amountReceivedNum) || amountReceivedNum < totalAmount) {
        Message.warning('收款金额不足');
        return;
      }
    }

    const orderItems = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));

    addOrder({
      items: orderItems,
      totalAmount,
      memberId: memberId || undefined,
      paymentMethod,
      amountReceived: paymentMethod === 'cash' ? amountReceivedNum : totalAmount,
      change: paymentMethod === 'cash' ? amountReceivedNum - totalAmount : 0
    });

    // 清空购物车和输入
    setCart([]);
    setMemberId('');
    setAmountReceived('');
    
    Message.success('结账成功');
  };

  const cartColumns = [
    {
      title: '商品',
      colKey: 'product',
      cell: ({ row }: { row: {product: Product, quantity: number} }) => (
        <div>
          <div>{row.product.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>¥{row.product.price.toFixed(2)}</div>
        </div>
      )
    },
    {
      title: '数量',
      colKey: 'quantity',
      cell: ({ row }: { row: {product: Product, quantity: number} }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Button 
            size="small" 
            onClick={() => updateQuantity(row.product.id, row.quantity - 1)}
          >
            -
          </Button>
          <span>{row.quantity}</span>
          <Button 
            size="small" 
            onClick={() => updateQuantity(row.product.id, row.quantity + 1)}
          >
            +
          </Button>
        </div>
      )
    },
    {
      title: '小计',
      colKey: 'subtotal',
      cell: ({ row }: { row: {product: Product, quantity: number} }) => (
        `¥${(row.product.price * row.quantity).toFixed(2)}`
      )
    },
    {
      title: '操作',
      colKey: 'actions',
      cell: ({ row }: { row: {product: Product, quantity: number} }) => (
        <Button 
          size="small" 
          theme="danger" 
          variant="text"
          onClick={() => removeFromCart(row.product.id)}
        >
          删除
        </Button>
      )
    }
  ];

  const productColumns = [
    {
      title: '商品',
      colKey: 'name',
      cell: ({ row }: { row: Product }) => (
        <div>
          <div>{row.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>¥{row.price.toFixed(2)}</div>
        </div>
      )
    },
    {
      title: '库存',
      colKey: 'stock',
    },
    {
      title: '操作',
      colKey: 'actions',
      cell: ({ row }: { row: Product }) => (
        <Button 
          size="small" 
          onClick={() => addToCart(row)}
        >
          添加
        </Button>
      )
    }
  ];

  const totalAmount = calculateTotal();

  return (
    <div className="page-container" style={{ padding: '10px' }}>
      <h1 className="page-title">移动端POS收银</h1>
      
      <div className="card">
        <h2>购物车</h2>
        <Table
          data={cart}
          columns={cartColumns}
          rowKey={(row) => row.product.id}
          size="small"
        />
        
        <div style={{ marginTop: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
            <span>总计:</span>
            <span>¥{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2>结账</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input 
            placeholder="会员ID（可选）" 
            value={memberId}
            onChange={setMemberId}
          />
          
          <div>
            <div style={{ marginBottom: '8px' }}>支付方式:</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                variant={paymentMethod === 'cash' ? 'base' : 'outline'}
                onClick={() => setPaymentMethod('cash')}
              >
                现金
              </Button>
              <Button 
                variant={paymentMethod === 'card' ? 'base' : 'outline'}
                onClick={() => setPaymentMethod('card')}
              >
                刷卡
              </Button>
              <Button 
                variant={paymentMethod === 'mobile' ? 'base' : 'outline'}
                onClick={() => setPaymentMethod('mobile')}
              >
                移动支付
              </Button>
            </div>
          </div>
          
          {paymentMethod === 'cash' && (
            <Input 
              placeholder="收款金额" 
              value={amountReceived}
              onChange={setAmountReceived}
              type="number"
            />
          )}
          
          <Button 
            theme="primary" 
            size="large" 
            onClick={handleCheckout}
            style={{ height: '48px' }}
          >
            结账 (¥{totalAmount.toFixed(2)})
          </Button>
        </div>
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2>商品列表</h2>
          <Input 
            placeholder="搜索商品名称或条码" 
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <div className="table-container">
            <Table
              data={filteredProducts}
              columns={productColumns}
              rowKey="id"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  );
}