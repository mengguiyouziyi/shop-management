import { useEffect, useState } from 'react';
import { Table, MessagePlugin } from 'tdesign-react';
import { useAppStore } from '../../store/useAppStore';

export function ProductList() {
  const [loading, setLoading] = useState(false);
  const { products } = useAppStore();

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
        rowKey="id"
      />
    </div>
  );
}