import React, { useState, useEffect } from 'react';
import { Button, Table, Message, Input } from 'tdesign-react';
import { InventoryService } from '../../services/inventory';
import { InventoryItem } from '../../types/inventory';

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const inventoryService = InventoryService.getInstance();

  useEffect(() => {
    loadInventoryItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchTerm, inventoryItems]);

  const loadInventoryItems = async () => {
    try {
      const items = await inventoryService.getAllInventoryItems();
      setInventoryItems(items);
    } catch (error) {
      Message.error('加载库存数据失败');
    }
  };

  const filterItems = () => {
    if (!searchTerm) {
      setFilteredItems(inventoryItems);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = inventoryItems.filter(item => 
      item.productName.toLowerCase().includes(term) || 
      (item.sku && item.sku.toLowerCase().includes(term))
    );
    
    setFilteredItems(filtered);
  };

  const handleStockMovement = async (itemId: string, type: 'in' | 'out', quantity: number) => {
    try {
      const item = inventoryItems.find(i => i.id === itemId);
      if (!item) {
        Message.error('库存项不存在');
        return;
      }

      await inventoryService.recordStockMovement({
        productId: item.productId,
        productName: item.productName,
        type,
        quantity,
        referenceType: 'adjustment',
        notes: `${type === 'in' ? '入库' : '出库'}调整`
      });

      Message.success(`${type === 'in' ? '入库' : '出库'}操作成功`);
      loadInventoryItems(); // 重新加载数据
    } catch (error) {
      Message.error(`${type === 'in' ? '入库' : '出库'}操作失败`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('确定要删除这个库存记录吗？此操作不可恢复。')) {
      return;
    }
    
    try {
      await inventoryService.deleteInventoryItem(id);
      Message.success('库存记录删除成功');
      loadInventoryItems();
    } catch (error) {
      Message.error('库存记录删除失败');
    }
  };

  const columns = [
    {
      title: '商品名称',
      colKey: 'productName',
    },
    {
      title: 'SKU',
      colKey: 'sku',
    },
    {
      title: '当前库存',
      colKey: 'quantity',
    },
    {
      title: '预留数量',
      colKey: 'reservedQuantity',
    },
    {
      title: '可用数量',
      colKey: 'availableQuantity',
    },
    {
      title: '最低库存预警',
      colKey: 'minStockLevel',
    },
    {
      title: '最高库存预警',
      colKey: 'maxStockLevel',
    },
    {
      title: '单位',
      colKey: 'unit',
    },
    {
      title: '操作',
      colKey: 'actions',
      cell: ({ row }: { row: InventoryItem }) => (
        <div className="flex gap-2">
          <Button 
            size="small" 
            variant="outline"
            onClick={() => handleStockMovement(row.id, 'in', 10)}
          >
            入库10
          </Button>
          <Button 
            size="small" 
            variant="outline"
            theme="danger"
            onClick={() => handleStockMovement(row.id, 'out', 5)}
          >
            出库5
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
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>库存管理</h1>
      
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', margin: 0 }}>库存列表</h2>
          <Input 
            placeholder="搜索商品..." 
            value={searchTerm}
            onChange={(value) => setSearchTerm(value as string)}
            style={{ width: '300px' }}
          />
        </div>
        <Table
          data={filteredItems}
          columns={columns}
          rowKey="id"
        />
      </div>
    </div>
  );
}