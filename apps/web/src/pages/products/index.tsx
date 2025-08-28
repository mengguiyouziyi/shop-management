        footer={
          <Space>
            <Button onClick={() => setDeleteId(null)}>取消</Button>
            <Button 
              theme="danger" 
              onClick={async () => {
                try {
                  await deleteProduct(deleteId);
                  setProducts(products.filter(p => p.id !== deleteId));
                  setDeleteId(null);
                } catch (err) {
                  console.error('删除失败:', err);
                }
              }}
            >
              确认删除
            </Button>
          </Space>
        }
      >
        确定要删除这个商品吗？删除后无法恢复。
