import React from "react";
import { Product } from "../../types";
import { EditIcon, DeleteIcon } from "tdesign-icons-react";

export const productColumns = [
  {
    key: "name",
    title: "商品名称",
    dataIndex: "name"
  },
  {
    key: "category",
    title: "分类",
    dataIndex: "category"
  },
  {
    key: "price",
    title: "价格",
    dataIndex: "price",
    render: (price: number) => `¥${price}`
  },
  {
    key: "stock",
    title: "库存",
    dataIndex: "stock"
  },
  {
    key: "actions",
    title: "操作",
    render: (record: Product) => {
      return React.createElement('div', { 
        style: { display: 'flex', gap: '8px' } 
      }, [
        React.createElement('button', {
          key: 'edit',
          onClick: () => console.log('Edit', record.id),
          style: {
            padding: '4px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: '#fff',
            cursor: 'pointer'
          }
        }, React.createElement(EditIcon)),
        React.createElement('button', {
          key: 'delete',
          onClick: () => console.log('Delete', record.id),
          style: {
            padding: '4px 8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: '#fff',
            color: '#f5222d',
            cursor: 'pointer'
          }
        }, React.createElement(DeleteIcon))
      ]);
    }
  }
];