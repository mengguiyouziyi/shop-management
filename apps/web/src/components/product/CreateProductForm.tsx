import { useState } from 'react';
import { ProductAPI } from '@shop/core/product/api';
import { Button, Form, Input, Message } from 'tdesign-react';

export function CreateProductForm({ onCreated }: { onCreated: () => void }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validate();
      const api = new ProductAPI();
      await api.createSPU({
        tenantId: 'default',
        spuId: `spu_${Date.now()}`,
        name: values.name,
        categoryId: values.category
      });
      Message.success('商品创建成功');
      form.reset();
      onCreated();
    } catch (err) {
      Message.error('商品创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical">
      <div className="form-group">
        <Form.Item label="商品名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入商品名称" className="form-input" />
        </Form.Item>
      </div>
      <div className="form-group">
        <Form.Item label="商品分类" name="category">
          <Input placeholder="请输入商品分类" className="form-input" />
        </Form.Item>
      </div>
      <Button 
        loading={loading} 
        onClick={handleSubmit}
        className="btn btn-primary"
      >
        创建商品
      </Button>
    </Form>
  );
}