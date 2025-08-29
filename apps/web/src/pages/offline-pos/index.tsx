import React, { useState, useEffect } from 'react';
import { Card, Space, Button, Table, Input, Message } from 'tdesign-react';
import { useOfflineSupport } from '../../hooks/useOfflineSupport';
import { useAppStore } from '../../store/useAppStore';
import { NetworkService } from '../../services/network';

export default function OfflinePOSPage() {
  const [cart, setCart] = useState<Array<{product: any, quantity: number}>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const { isOnline, getOfflineData } = useOfflineSupport();
  const { addOrder } = useAppStore();
  const networkService = NetworkService.getInstance();

  useEffect(() => {
    const loadData = async () => {
      if (isOnline) {
        // 在线状态下从store获取数据
        const { products: onlineProducts, members: onlineMembers } = useAppStore.getState();
        setProducts(onlineProducts);
        setMembers(onlineMembers);
      } else {
        // 离线状态下从IndexedDB获取数据
        const offlineProducts = await getOfflineData('products');
        const offlineMembers = await getOfflineData('members');
        setProducts(offlineProducts);
        setMembers(offlineMembers);
      }
    };

    loadData();
  }, [isOnline]);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.phone.includes(memberSearch)
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(cart.map(item => 
      item.product.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      Message.warning('购物车为空');
      return;
    }
    
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const order = {
      memberId: selectedMember?.id,
      items: orderItems,
      totalAmount: getTotal(),
      paymentMethod: 'cash',
      status: 'completed'
    };

    if (isOnline) {
      // 在线状态下直接添加订单
      addOrder(order);
      Message.success('结账成功！');
    } else {
      // 离线状态下将操作添加到离线队列
      networkService.addOfflineOperation({
        type: 'ADD_ORDER',
        data: order
      });
      Message.success('已保存离线订单，将在恢复网络连接后同步');
    }

    setCart([]);
    setSelectedMember(null);
    setMemberSearch('');
  };

  const columns = [
    {
      title: '商品名称',
      colKey: 'name',
    },
    {
      title: '价格',
      colKey: 'price',
    },
    {
      title: '库存',
      colKey: 'stock',
    }
  ];

  return (
    <div className="page-container">
      <h1 className="page-title">离线POS收银</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <Card title="选择会员" bordered className="card">
            <Input
              placeholder="搜索会员姓名或手机号"
              value={memberSearch}
              onChange={setMemberSearch}
              style={{ marginBottom: '10px' }}
            />
            {selectedMember && (
              <div className="alert alert-success" style={{ marginBottom: '10px' }}>
                <p><strong>已选会员:</strong> {selectedMember.name}</p>
                <p>等级: {selectedMember.level}</p>
                <p>余额: ¥{selectedMember.balance.toFixed(2)}</p>
                <Button 
                  theme="danger"
                  variant="outline"
                  size="small"
                  onClick={() => setSelectedMember(null)}
                >
                  取消选择
                </Button>
              </div>
            )}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filteredMembers.map(member => (
                <div 
                  key={member.id} 
                  className="card"
                  style={{ 
                    marginBottom: '5px',
                    cursor: 'pointer',
                    background: selectedMember?.id === member.id ? '#e6f7ff' : 'white'
                  }}
                  onClick={() => setSelectedMember(member)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{member.name}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {member.phone} | 余额: ¥{member.balance.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {member.level}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div style={{ flex: 2 }}>
          <Card title="购物车" bordered className="card">
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>购物车为空</p>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.product.id} className="card" style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}>
                    <div>
                      <strong>{item.product.name}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        ¥{item.product.price} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Button 
                        variant="outline"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        size="small"
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button 
                        variant="outline"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        size="small"
                      >
                        +
                      </Button>
                      <Button 
                        theme="danger"
                        variant="outline"
                        size="small"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                ))}
                <div style={{ 
                  borderTop: '1px solid #ddd',
                  paddingTop: '15px',
                  marginTop: '15px',
                  textAlign: 'right'
                }}>
                  <h3>总计: ¥{getTotal().toFixed(2)}</h3>
                  <Button 
                    theme="primary"
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    style={{ marginTop: '10px' }}
                  >
                    结账
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Card title="商品列表" bordered className="card">
        <Input
          placeholder="搜索商品名称或分类"
          value={searchTerm}
          onChange={setSearchTerm}
          style={{ 
            width: '300px', 
            marginBottom: '15px'
          }}
        />
        <Table
          data={filteredProducts}
          columns={columns}
          rowKey="id"
          onRowClick={(_, record) => addToCart(record)}
        />
      </Card>
    </div>
  );
}