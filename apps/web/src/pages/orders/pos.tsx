import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function POSPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Array<{product: any, quantity: number}>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);

  // 模拟商品数据
  const products = [
    { id: '1', name: '苹果iPhone 15', category: '手机', price: 5999, stock: 25, minStock: 5, image: '📱' },
    { id: '2', name: '小米手机', category: '手机', price: 1499, stock: 42, minStock: 10, image: '📱' },
    { id: '3', name: '华为平板', category: '平板', price: 999, stock: 18, minStock: 5, image: '📟' },
    { id: '4', name: 'AirPods', category: '配件', price: 299, stock: 67, minStock: 15, image: '🎧' },
    { id: '5', name: '无线充电器', category: '配件', price: 89, stock: 34, minStock: 10, image: '🔋' },
    { id: '6', name: '蓝牙音箱', category: '音响', price: 199, stock: 23, minStock: 8, image: '🔊' },
    { id: '7', name: '智能手表', category: '穿戴', price: 899, stock: 15, minStock: 5, image: '⌚' },
    { id: '8', name: '移动电源', category: '配件', price: 59, stock: 56, minStock: 20, image: '🔋' }
  ];

  // 模拟会员数据
  const members = [
    { id: '1', name: '张三', phone: '13800138001', level: '黄金会员', balance: 500, points: 1200 },
    { id: '2', name: '李四', phone: '13800138002', level: '白金会员', balance: 1200, points: 2800 },
    { id: '3', name: '王五', phone: '13800138003', level: '普通会员', balance: 200, points: 450 },
    { id: '4', name: '赵六', phone: '13800138004', level: '钻石会员', balance: 2000, points: 5200 }
  ];

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

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getDiscount = () => {
    const memberDiscount = selectedMember ? (selectedMember.level === '钻石会员' ? 0.15 : 
                                           selectedMember.level === '白金会员' ? 0.1 : 
                                           selectedMember.level === '黄金会员' ? 0.05 : 0) : 0;
    return getSubtotal() * memberDiscount + discount;
  };

  const getTotal = () => {
    return getSubtotal() - getDiscount();
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // 模拟结账成功
    alert(`结账成功！总金额：¥${getTotal().toFixed(2)}`);
    setCart([]);
    setSelectedMember(null);
    setMemberSearch('');
    setDiscount(0);
  };

  return (
    <div style={{ 
      background: '#f5f7fa',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* 头部 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '300' }}>
                💰 POS收银系统
              </h1>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: '0.9' }}>
                快速收银结账服务
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', opacity: '0.8' }}>当前时间</div>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
              <button 
                onClick={() => navigate('/')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 380px', gap: '20px' }}>
          {/* 左侧：会员选择 */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: 'fit-content'
            }}>
              <h2 style={{ margin: '0 0 16px 0', color: '#333', fontSize: '16px', fontWeight: '600' }}>
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
                  border: '1px solid #e1e8ed',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
              />
              
              {selectedMember && (
                <div style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '14px' }}>
                        {selectedMember.name}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', opacity: '0.9' }}>
                        等级: {selectedMember.level}
                      </p>
                      <p style={{ margin: '0 0 4px 0', fontSize: '11px', opacity: '0.9' }}>
                        余额: ¥{selectedMember.balance.toFixed(2)}
                      </p>
                      <p style={{ margin: '0', fontSize: '11px', opacity: '0.9' }}>
                        积分: {selectedMember.points}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedMember(null)}
                      style={{ 
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
              
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {filteredMembers.map(member => (
                  <div 
                    key={member.id} 
                    style={{ 
                      padding: '12px',
                      border: '1px solid #e1e8ed',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      background: selectedMember?.id === member.id ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                      color: selectedMember?.id === member.id ? 'white' : 'inherit',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => setSelectedMember(member)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong style={{ fontSize: '13px' }}>{member.name}</strong>
                        <div style={{ fontSize: '11px', opacity: selectedMember?.id === member.id ? 0.8 : 0.6, marginTop: '2px' }}>
                          {member.phone}
                        </div>
                        <div style={{ fontSize: '11px', marginTop: '2px' }}>
                          余额: ¥{member.balance.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        opacity: selectedMember?.id === member.id ? 0.9 : 0.6,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end'
                      }}>
                        <span style={{ 
                          background: selectedMember?.id === member.id ? 'rgba(255,255,255,0.2)' : '#667eea',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontSize: '9px'
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

          {/* 中间：商品列表 */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h2 style={{ margin: '0', color: '#333', fontSize: '16px', fontWeight: '600' }}>
                  📦 商品列表
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="搜索商品名称或分类"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                      width: '200px', 
                      padding: '8px 12px',
                      border: '1px solid #e1e8ed',
                      borderRadius: '8px',
                      fontSize: '13px',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e1e8ed'}
                  />
                  <span style={{ color: '#666', fontSize: '12px' }}>
                    {filteredProducts.length} 个商品
                  </span>
                </div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                gap: '12px'
              }}>
                {filteredProducts.map(product => (
                  <div 
                    key={product.id} 
                    style={{ 
                      border: '1px solid #e1e8ed',
                      borderRadius: '12px',
                      padding: '16px',
                      background: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      position: 'relative',
                      textAlign: 'center'
                    }}
                    onClick={() => addToCart(product)}
                  >
                    {product.stock <= 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }}>
                        缺货
                      </div>
                    )}
                    
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                      {product.image}
                    </div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600' }}>
                      {product.name}
                    </h3>
                    <p style={{ margin: '2px 0', color: '#666', fontSize: '10px' }}>
                      {product.category}
                    </p>
                    <div style={{ 
                      color: '#667eea', 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      margin: '4px 0'
                    }}>
                      ¥{product.price.toFixed(2)}
                    </div>
                    <div style={{ 
                      fontSize: '10px',
                      color: product.stock <= product.minStock ? '#ff4d4f' : '#52c41a',
                      backgroundColor: product.stock <= product.minStock ? '#fff2f0' : '#f6ffed',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      display: 'inline-block'
                    }}>
                      库存: {product.stock}
                    </div>
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

          {/* 右侧：购物车 */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h2 style={{ margin: '0', color: '#333', fontSize: '16px', fontWeight: '600' }}>
                  🛒 购物车
                </h2>
                <span style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {getTotalItems()} 件
                </span>
              </div>
              
              <div style={{ 
                border: '1px solid #e1e8ed', 
                borderRadius: '8px',
                padding: '16px',
                minHeight: '300px',
                backgroundColor: '#fafbfc'
              }}>
                {cart.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#999',
                    padding: '40px 20px'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                    <p style={{ fontSize: '14px' }}>购物车为空</p>
                    <p style={{ fontSize: '12px', marginTop: '8px' }}>点击商品添加到购物车</p>
                  </div>
                ) : (
                  <div>
                    {cart.map(item => (
                      <div key={item.product.id} style={{ 
                        marginBottom: '12px',
                        padding: '12px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e1e8ed'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <strong style={{ fontSize: '12px' }}>{item.product.name}</strong>
                          <button 
                            onClick={() => removeFromCart(item.product.id)}
                            style={{ 
                              background: '#ff4d4f',
                              color: 'white',
                              border: 'none',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px'
                            }}
                          >
                            删除
                          </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#666' }}>
                            ¥{item.product.price} × {item.quantity}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              style={{ 
                                width: '20px',
                                height: '20px',
                                border: '1px solid #e1e8ed',
                                background: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}
                            >
                              -
                            </button>
                            <span style={{ 
                              minWidth: '20px', 
                              textAlign: 'center',
                              fontSize: '11px',
                              fontWeight: 'bold'
                            }}>
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              style={{ 
                                width: '20px',
                                height: '20px',
                                border: '1px solid #e1e8ed',
                                background: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div style={{ 
                      borderTop: '2px solid #e1e8ed',
                      paddingTop: '16px',
                      marginTop: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#666' }}>商品总计:</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                          ¥{getSubtotal().toFixed(2)}
                        </span>
                      </div>
                      {selectedMember && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#666' }}>会员折扣:</span>
                          <span style={{ fontSize: '14px', color: '#52c41a', fontWeight: 'bold' }}>
                            -¥{getDiscount().toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>总计:</span>
                        <span style={{ fontSize: '18px', color: '#667eea', fontWeight: 'bold' }}>
                          ¥{getTotal().toFixed(2)}
                        </span>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>
                          支付方式:
                        </label>
                        <select 
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          style={{ 
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #e1e8ed',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                        >
                          <option value="cash">现金</option>
                          <option value="card">银行卡</option>
                          <option value="wechat">微信支付</option>
                          <option value="alipay">支付宝</option>
                        </select>
                      </div>
                      
                      <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        style={{ 
                          width: '100%',
                          background: cart.length === 0 ? '#d9d9d9' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '8px',
                          cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          transition: 'all 0.3s'
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
      </div>
    </div>
  );
}