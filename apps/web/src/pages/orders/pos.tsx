          columns={[
            { 
              title: '商品', 
              colKey: 'productId',
              cell: ({ row }) => (
                <ProductSelect 
                  value={row.productId} 
                  onChange={(val) => {
                    const newItems = [...items];
                    const index = newItems.findIndex(i => i.id === row.id);
                    newItems[index].productId = val;
                    setItems(newItems);
                  }}
                />
              )
            },
            { 
              title: '数量', 
              colKey: 'quantity',
              cell: ({ row }) => (
                <InputNumber
                  value={row.quantity}
                  onChange={(val) => {
                    const newItems = [...items];
                    const index = newItems.findIndex(i => i.id === row.id);
                    newItems[index].quantity = val;
                    setItems(newItems);
                  }}
                />
              )
            },
            { title: '单价', colKey: 'price' },
            { title: '小计', colKey: 'subtotal' },
            { 
              title: '操作', 
              colKey: 'action',
              cell: ({ row }) => (
                <Button 
                  variant="text" 
                  theme="danger"
                  onClick={() => setItems(items.filter(i => i.id !== row.id))}
                >
                  删除
                </Button>
              )
            }
          ]}
