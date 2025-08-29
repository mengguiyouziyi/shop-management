import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Table, Message, Select } from 'tdesign-react';
import { SupplierService } from '../../services/supplier';
import { Supplier, SupplierCategory } from '../../types/supplier';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [categories, setCategories] = useState<SupplierCategory[]>([]);
  const [form] = Form.useForm();
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const supplierService = SupplierService.getInstance();

  useEffect(() => {
    loadSuppliers();
    loadCategories();
  }, []);

  const loadSuppliers = async () => {
    try {
      const supplierList = await supplierService.getAllSuppliers();
      setSuppliers(supplierList);
    } catch (error) {
      Message.error('加载供应商列表失败');
    }
  };

  const loadCategories = async () => {
    try {
      const categoryList = await supplierService.getAllCategories();
      setCategories(categoryList);
    } catch (error) {
      Message.error('加载供应商分类失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validate();
      
      if (editingSupplier) {
        // 更新供应商
        await supplierService.updateSupplier(editingSupplier.id, values);
        Message.success('供应商更新成功');
      } else {
        // 创建供应商
        await supplierService.createSupplier(values);
        Message.success('供应商创建成功');
      }
      
      form.reset();
      setEditingSupplier(null);
      loadSuppliers();
    } catch (error) {
      Message.error(editingSupplier ? '供应商更新失败' : '供应商创建失败');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    form.setFieldsValue(supplier);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个供应商吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await supplierService.deleteSupplier(id);
      Message.success('供应商删除成功');
      loadSuppliers();
    } catch (error) {
      Message.error('供应商删除失败');
    }
  };

  const columns = [
    {
      title: '供应商名称',
      colKey: 'name',
    },
    {
      title: '联系人',
      colKey: 'contactPerson',
    },
    {
      title: '联系电话',
      colKey: 'phone',
    },
    {
      title: '分类',
      colKey: 'category',
    },
    {
      title: '评分',
      colKey: 'rating',
      cell: ({ row }: { row: Supplier }) => (
        <div>
          {[...Array(5)].map((_, i) => (
            <span key={i} style={{ color: i < row.rating ? '#faad14' : '#f0f0f0' }}>★</span>
          ))}
        </div>
      )
    },
    {
      title: '状态',
      colKey: 'status',
      cell: ({ row }: { row: Supplier }) => (
        <span>{row.status === 'active' ? '启用' : row.status === 'inactive' ? '停用' : '已暂停'}</span>
      )
    },
    {
      title: '操作',
      colKey: 'actions',
      cell: ({ row }: { row: Supplier }) => (
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

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>供应商管理</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>{editingSupplier ? '编辑供应商' : '创建供应商'}</h2>
        <Form form={form} onSubmit={handleSubmit} labelWidth={100}>
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="供应商名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入供应商名称" />
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="联系人" name="contactPerson">
              <Input placeholder="请输入联系人" />
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="联系电话" name="phone">
              <Input placeholder="请输入联系电话" />
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="地址" name="address">
              <Input placeholder="请输入地址" />
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="分类" name="categoryId">
              <Select>
                {categories.map(category => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <Form.Item label="备注" name="notes">
              <Input placeholder="请输入备注" />
            </Form.Item>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button theme="primary" type="submit">
              {editingSupplier ? '更新供应商' : '创建供应商'}
            </Button>
            {editingSupplier && (
              <Button variant="outline" onClick={() => {
                setEditingSupplier(null);
                form.reset();
              }}>
                取消
              </Button>
            )}
          </div>
        </Form>
      </div>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>供应商列表</h2>
        <Table
          data={suppliers}
          columns={columns}
          rowKey="id"
        />
      </div>
    </div>
  );
}