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
    if (product.stock <= 0) {
      alert('该商品库存不足');
      return;
    }
    
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      if (existingItem.quantity + 1 > product.stock) {
        alert('库存不足');
        return;
      }
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
    const item = cart.find(item => item.product.id === productId);
    if (!item) return;
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (quantity > item.product.stock) {
      alert('库存不足');
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

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      unitPrice: item.product.price,
      totalPrice: item.product.price * item.quantity
    }));

    addOrder({
      memberId: selectedMember?.id,
      items: orderItems,
      subtotal: getTotal(),
      discount: 0,
      tax: 0,
      total: getTotal(),
      paymentMethod: 'cash' as const,
      status: 'completed' as const
    });

    setCart([]);
    setSelectedMember(null);
    setMemberSearch('');
    alert('结账成功！');
  };

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
        <h1 style={{ margin: '0', color: '#333', fontSize: '24px', fontWeight: 'bold' }}>
          💰 POS收银系统
        </h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
          快速收银结账服务
        </p>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {/* 左侧：会员选择 */}
        <div style={{ flex: 1 }}>
          <div style={{ 
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
              👤 选择会员
            </h2>
            
            <input
              type="text"
              placeholder="搜索会员姓名或手机号"
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '10px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                marginBottom: '12px',
                fontSize: '14px'
              }}
            />
            
            {selectedMember && (
              <div style={{ 
                background: '#e6f7ff',
                border: '1px solid #91d5ff',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}>
                      {selectedMember.name}
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                      等级: {selectedMember.level}
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#666' }}>
                      余额: ¥{selectedMember.balance.toFixed(2)}
                    </p>
                    <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                      积分: {selectedMember.points}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedMember(null)}
                    style={{ 
                      background: '#ff4d4f',
                      color: 'white',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
            
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {filteredMembers.map(member => (
                <div 
                  key={member.id} 
                  style={{ 
                    padding: '12px',
                    border: '1px solid #e8e8e8',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    background: selectedMember?.id === member.id ? '#e6f7ff' : 'white',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => setSelectedMember(member)}
                  onMouseEnter={(e) => {
                    if (selectedMember?.id !== member.id) {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedMember?.id !== member.id) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '14px' }}>{member.name}</strong>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        {member.phone}
                      </div>
                      <div style={{ fontSize: '12px', color: '#52c41a', marginTop: '2px' }}>
                        余额: ¥{member.balance.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '12px', 
                      color: '#666',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end'
                    }}>
                      <span style={{ 
                        backgroundColor: '#1890ff',
                        color: 'white',
                        padding: '2px 6px',
                        borderRadius: '10px',
                        fontSize: '10px'
                      }}>
                        {member.level}
                      </span>
                      <span style={{ marginTop: '4px' }}>
                        {member.points} 积分
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：购物车 */}
        <div style={{ flex: 2 }}>
          <div style={{ 
            backgroundColor: '#fff',
            border: '1px solid #e8e8e8',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h2 style={{ margin: '0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
                🛒 购物车
              </h2>
              <span style={{ 
                backgroundColor: '#1890ff',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {getTotalItems()} 件商品
              </span>
            </div>
            
            <div style={{ 
              border: '1px solid #e8e8e8', 
              borderRadius: '6px',
              padding: '16px',
              minHeight: '350px',
              backgroundColor: '#fafafa'
            }}>
              {cart.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  color: '#999',
                  padding: '60px 20px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                  <p style={{ fontSize: '16px' }}>购物车为空</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>点击下方商品添加到购物车</p>
                </div>
              ) : (
                <div>
                  {cart.map(item => (
                    <div key={item.product.id} style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '12px',
                      padding: '12px',
                      background: 'white',
                      borderRadius: '6px',
                      border: '1px solid #e8e8e8',
                      transition: 'transform 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                      <div style={{ flex: 1 }}>
                        <strong style={{ fontSize: '14px' }}>{item.product.name}</strong>
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                          ¥{item.product.price} × {item.quantity}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          style={{ 
                            width: '28px',
                            height: '28px',
                            border: '1px solid #d9d9d9',
                            background: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          -
                        </button>
                        <span style={{ 
                          minWidth: '30px', 
                          textAlign: 'center',
                          fontWeight: 'bold'
                        }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          style={{ 
                            width: '28px',
                            height: '28px',
                            border: '1px solid #d9d9d9',
                            background: 'white',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold'
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
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div style={{ 
                    borderTop: '2px solid #e8e8e8',
                    paddingTop: '16px',
                    marginTop: '16px',
                    textAlign: 'right'
                  }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#666' }}>商品总计: </span>
                      <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        ¥{getTotal().toFixed(2)}
                      </span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      disabled={cart.length === 0}
                      style={{ 
                        background: cart.length === 0 ? '#d9d9d9' : '#52c41a',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '6px',
                        cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        transition: 'background-color 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        if (cart.length > 0) {
                          e.currentTarget.style.backgroundColor = '#73d13d';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (cart.length > 0) {
                          e.currentTarget.style.backgroundColor = '#52c41a';
                        }
                      }}
                    >
                      💳 结账 (¥{getTotal().toFixed(2)})
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div style={{ 
        backgroundColor: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 style={{ margin: '0', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
            📦 商品列表
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input
              type="text"
              placeholder="搜索商品名称或分类"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '250px', 
                padding: '8px 12px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            <span style={{ color: '#666', fontSize: '14px' }}>
              找到 {filteredProducts.length} 个商品
            </span>
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
          gap: '16px'
        }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              style={{ 
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                padding: '16px',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s',
                position: 'relative'
              }}
              onClick={() => addToCart(product)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {product.stock <= 0 && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  backgroundColor: 'rgba(255, 77, 79, 0.8)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                缺货
                </div>
              )}
              
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                {product.name}
              </h3>
              <p style={{ margin: '4px 0', color: '#666', fontSize: '12px' }}>
                {product.category}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                margin: '8px 0'
              }}>
                <span style={{ 
                  color: '#52c41a', 
                  fontSize: '16px', 
                  fontWeight: 'bold' 
                }}>
                  ¥{product.price.toFixed(2)}
                </span>
                <span style={{ 
                  color: '#666', 
                  fontSize: '12px',
                  backgroundColor: product.stock <= product.minStock ? '#fff7e6' : '#f6ffed',
                  padding: '2px 6px',
                  borderRadius: '10px'
                }}>
                  库存: {product.stock}
                </span>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={product.stock <= 0}
                style={{ 
                  width: '100%',
                  background: product.stock <= 0 ? '#d9d9d9' : '#1890ff',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: product.stock <= 0 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (product.stock > 0) {
                    e.currentTarget.style.backgroundColor = '#40a9ff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (product.stock > 0) {
                    e.currentTarget.style.backgroundColor = '#1890ff';
                  }
                }}
              >
                {product.stock <= 0 ? '缺货' : '加入购物车'}
              </button>
            </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#999'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p>没有找到匹配的商品</p>
          </div>
        )}
      </div>
    </div>
  );
}
