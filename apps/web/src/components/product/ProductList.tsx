import { useEffect, useState } from 'react';
import { ProductAPI } from '@shop/core/product/api';
import { ProductSPU } from '@shop/core/product/types';
import { Table, Message } from 'tdesign-react';

export function ProductList() {
  const [products, setProducts] = useState<ProductSPU[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const api = new ProductAPI();
      const data = await api.list();
      setProducts(data);
    } catch (err) {
      Message.error('获取商品列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '商品名称',
      colKey: 'name',
    },
    {
      title: '分类',
      colKey: 'categoryId',
    },
    {
      title: '创建时间',
      colKey: 'createdAt',
    }
  ];

  return (
    <div className="card">
      <Table
        data={products}
        columns={columns}
        loading={loading}
        rowKey="spuId"
      />
    </div>
  );
}