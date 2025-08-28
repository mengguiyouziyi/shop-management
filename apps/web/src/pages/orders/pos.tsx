import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';

export default function POSPage() {
  const [cart, setCart] = useState<Array<{product: any, quantity: number}>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const { products, members, addOrder } = useAppStore();

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
    if (cart.length === 0) return;
    
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    addOrder({
      memberId: selectedMember?.id,
      items: orderItems,
      totalAmount: getTotal(),
      paymentMethod: 'cash',
      status: 'completed'
    });

    setCart([]);
    setSelectedMember(null);
    setMemberSearch('');
    alert('结账成功！');
  };

  return (
    <div>
      <h2>POS收银</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>选择会员</h3>
          <input
            type="text"
            placeholder="搜索会员姓名或手机号"
            value={memberSearch}
            onChange={(e) => setMemberSearch(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '10px'
            }}
          />
          {selectedMember && (
            <div style={{ 
              background: '#e6f7ff',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '10px'
            }}>
              <p><strong>已选会员:</strong> {selectedMember.name}</p>
              <p>等级: {selectedMember.level}</p>
              <p>余额: ¥{selectedMember.balance.toFixed(2)}</p>
              <button 
                onClick={() => setSelectedMember(null)}
                style={{ 
                  background: '#ff4d4f',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                取消选择
              </button>
            </div>
          )}
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {filteredMembers.map(member => (
              <div 
                key={member.id} 
                style={{ 
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
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
        </div>

        <div style={{ flex: 2 }}>
          <h3>购物车</h3>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            padding: '15px',
            minHeight: '300px'
          }}>
            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>购物车为空</p>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.product.id} style={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    padding: '10px',
                    background: '#f9f9f9',
                    borderRadius: '4px'
                  }}>
                    <div>
                      <strong>{item.product.name}</strong>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        ¥{item.product.price} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        style={{ 
                          width: '25px',
                          height: '25px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        style={{ 
                          width: '25px',
                          height: '25px',
                          border: '1px solid #ddd',
                          background: 'white',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        style={{ 
                          background: '#ff4d4f',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        删除
                      </button>
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
                  <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    style={{ 
                      background: cart.length === 0 ? '#ccc' : '#52c41a',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    结账
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3>商品列表</h3>
        <input
          type="text"
          placeholder="搜索商品名称或分类"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '300px', 
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginBottom: '15px'
          }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                background: 'white',
                cursor: 'pointer'
              }}
              onClick={() => addToCart(product)}
            >
              <h4 style={{ margin: '0 0 10px 0' }}>{product.name}</h4>
              <p style={{ margin: '5px 0', color: '#666' }}>{product.category}</p>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>¥{product.price}</p>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                库存: {product.stock}
              </p>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                style={{ 
                  width: '100%',
                  background: '#1890ff',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                加入购物车
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
