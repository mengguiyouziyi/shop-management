import React, { useState, useEffect } from 'react';
import { SupplierService } from '../../services/supplier';
import { Supplier, SupplierCategory } from '../../types/supplier';

interface SupplierFormData {
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
  categoryId: string;
  notes: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<SupplierCategory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    contactPerson: '',
    phone: '',
    address: '',
    categoryId: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const supplierService = SupplierService.getInstance();

  useEffect(() => {
    loadSuppliers();
    loadCategories();
  }, []);

  useEffect(() => {
    // Generate mock data if no suppliers exist
    if (suppliers.length === 0) {
      generateMockSuppliers();
    }
  }, [suppliers]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const supplierList = await supplierService.getAllSuppliers();
      setSuppliers(supplierList);
    } catch (error) {
      console.error('加载供应商列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoryList = await supplierService.getAllCategories();
      setCategories(categoryList);
    } catch (error) {
      console.error('加载供应商分类失败:', error);
    }
  };

  const generateMockSuppliers = () => {
    const mockSuppliers: Supplier[] = [
      {
        id: '1',
        name: '阿里巴巴批发网',
        contactPerson: '张经理',
        phone: '13800138000',
        address: '浙江省杭州市西湖区',
        categoryId: '1',
        rating: 5,
        status: 'active',
        notes: '主要电子产品供应商',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: '京东企业购',
        contactPerson: '李总监',
        phone: '13900139000',
        address: '北京市朝阳区',
        categoryId: '2',
        rating: 4,
        status: 'active',
        notes: '办公用品供应商',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: '苏宁易购',
        contactPerson: '王主管',
        phone: '13700137000',
        address: '江苏省南京市',
        categoryId: '1',
        rating: 4,
        status: 'inactive',
        notes: '家电产品供应商',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: '国美电器',
        contactPerson: '赵经理',
        phone: '13600136000',
        address: '北京市海淀区',
        categoryId: '1',
        rating: 3,
        status: 'suspended',
        notes: '大型家电供应商',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    const mockCategories: SupplierCategory[] = [
      { id: '1', name: '电子产品', description: '电子设备和配件' },
      { id: '2', name: '办公用品', description: '文具和办公设备' },
      { id: '3', name: '日用品', description: '日常用品和消耗品' },
      { id: '4', name: '食品饮料', description: '食品和饮料产品' }
    ];

    setSuppliers(mockSuppliers);
    setCategories(mockCategories);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('请输入供应商名称');
      return;
    }

    try {
      if (editingSupplier) {
        // 更新供应商
        const updatedSupplier = { ...editingSupplier, ...formData };
        setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? updatedSupplier : s));
      } else {
        // 创建供应商
        const newSupplier: Supplier = {
          id: Date.now().toString(),
          ...formData,
          rating: 5,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSuppliers([...suppliers, newSupplier]);
      }
      
      resetForm();
    } catch (error) {
      alert(editingSupplier ? '供应商更新失败' : '供应商创建失败');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      address: supplier.address,
      categoryId: supplier.categoryId,
      notes: supplier.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个供应商吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch (error) {
      alert('供应商删除失败');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactPerson: '',
      phone: '',
      address: '',
      categoryId: '',
      notes: ''
    });
    setEditingSupplier(null);
    setShowForm(false);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '启用';
      case 'inactive': return '停用';
      case 'suspended': return '已暂停';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#52c41a';
      case 'inactive': return '#fa8c16';
      case 'suspended': return '#ff4d4f';
      default: return '#666';
    }
  };

  // 统计数据
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const avgRating = suppliers.length > 0 ? suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length : 0;
  const topRatedSuppliers = suppliers.filter(s => s.rating >= 4).length;

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
              🏢 供应商管理
            </h1>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
              管理您的供应商信息和合作关系
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
            <span>{showForm ? '取消' : '添加供应商'}</span>
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>供应商总数</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {totalSuppliers}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>🏢</div>
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>活跃供应商</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {activeSuppliers}
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
            borderTop: '4px solid #fa8c16'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>平均评分</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {avgRating.toFixed(1)}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>⭐</div>
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
                <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>优质供应商</p>
                <p style={{ margin: '0', color: '#333', fontSize: '28px', fontWeight: 'bold' }}>
                  {topRatedSuppliers}
                </p>
              </div>
              <div style={{ fontSize: '32px' }}>🏆</div>
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
            {editingSupplier ? '编辑供应商' : '添加供应商'}
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
                  供应商名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="请输入供应商名称"
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
                  联系人
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                  placeholder="请输入联系人"
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
                  联系电话
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="请输入联系电话"
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
                  分类
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">请选择分类</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                地址
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="请输入地址"
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
                {editingSupplier ? '更新供应商' : '创建供应商'}
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

      {/* 供应商列表 */}
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
            供应商列表
          </h2>
          <input
            type="text"
            placeholder="搜索供应商..."
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
                    供应商名称
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    联系人
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    联系电话
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    评分
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    状态
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0', color: '#333', fontSize: '14px', fontWeight: 'bold' }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                      {supplier.name}
                    </td>
                    <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                      {supplier.contactPerson}
                    </td>
                    <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                      {supplier.phone}
                    </td>
                    <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {[...Array(5)].map((_, i) => (
                          <span key={i} style={{ color: i < supplier.rating ? '#faad14' : '#f0f0f0' }}>
                            ★
                          </span>
                        ))}
                        <span style={{ color: '#666', fontSize: '12px' }}>
                          ({supplier.rating})
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                      <span style={{ 
                        backgroundColor: getStatusColor(supplier.status) + '20',
                        color: getStatusColor(supplier.status),
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {getStatusText(supplier.status)}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#333', fontSize: '14px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(supplier)}
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
                          onClick={() => handleDelete(supplier.id)}
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
                ))}
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