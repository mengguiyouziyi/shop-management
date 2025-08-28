import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Card, Input, Dialog } from 'tdesign-react';
import { ShopIcon, EditIcon, DeleteIcon, PlusIcon } from 'tdesign-icons-react';
import { productColumns } from './columns';
import { useAppStore } from '../../store/useAppStore';

export default function ProductsPage() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { products, deleteProduct: deleteProductFromStore, addProduct } = useAppStore();

  // Initialize sample data if empty
  useEffect(() => {
    if (products.length === 0) {
      addProduct({
        name: '苹果',
        category: '水果',
        unit: 'piece',
        price: 5.5,
        cost: 3.0,
        stock: 100,
        minStock: 10,
        isActive: true,
        description: '新鲜苹果'
      });
      
      addProduct({
        name: '香蕉',
        category: '水果',
        unit: 'piece',
        price: 3.8,
        cost: 2.0,
        stock: 150,
        minStock: 20,
        isActive: true,
        description: '进口香蕉'
      });
    }
  }, [products.length, addProduct]);

  const handleDelete = async (id: string) => {
    try {
      deleteProductFromStore(id);
      setDeleteId(null);
    } catch (err) {
      console.error('删除失败:', err);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">商品管理</h1>
        <Button icon={<PlusIcon />}>新增商品</Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="搜索商品名称"
          value={searchTerm}
          onChange={setSearchTerm}
          style={{ width: 300 }}
        />
      </div>

      <Card bordered>
        <Table
          data={products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          columns={productColumns}
          rowKey="id"
          pagination={{
            total: products.length,
            pageSize: 10,
            current: 1
          }}
        />
      </Card>

      <Dialog
        header="确认删除"
        visible={!!deleteId}
        onClose={() => setDeleteId(null)}
        footer={
          <Space>
            <Button onClick={() => setDeleteId(null)}>取消</Button>
            <Button 
              theme="danger" 
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              确认删除
            </Button>
          </Space>
        }
      >
        确定要删除这个商品吗？删除后无法恢复。
      </Dialog>
    </div>
  );
}
