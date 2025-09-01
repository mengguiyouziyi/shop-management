import { useState } from 'react';
import { Button, Form, Input, MessagePlugin, InputNumber } from 'tdesign-react';
import { useAppStore } from '../../store/useAppStore';

export function CreateProductForm({ onCreated }: { onCreated: () => void }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { addProduct } = useAppStore();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validate();
      
      // 数据验证
      if (!values.name || values.name.trim().length === 0) {
        throw new Error('商品名称不能为空');
      }
      
      if (values.price <= 0) {
        throw new Error('商品价格必须大于0');
      }
      
      if (values.stock < 0) {
        throw new Error('商品库存不能为负数');
      }
      
      addProduct({
        name: values.name.trim(),
        category: values.category?.trim() || 'default',
        price: values.price,
        stock: values.stock,
        description: values.description?.trim() || ''
      });
      
      MessagePlugin.success('商品创建成功');
      form.reset();
      onCreated();
    } catch (err: any) {
      MessagePlugin.error(err.message || '商品创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical">
      <div className="form-group">
        <Form.FormItem 
          label="商品名称" 
          name="name" 
          rules={[
            { required: true, message: '请输入商品名称' },
            { min: 1, message: '商品名称不能为空' },
            { max: 50, message: '商品名称不能超过50个字符' }
          ]}
        >
          <Input placeholder="请输入商品名称" className="form-input" />
        </Form.FormItem>
      </div>
      
      <div className="form-group">
        <Form.FormItem 
          label="商品分类" 
          name="category"
          rules={[
            { max: 30, message: '商品分类不能超过30个字符' }
          ]}
        >
          <Input placeholder="请输入商品分类" className="form-input" />
        </Form.FormItem>
      </div>
      
      <div className="form-group">
        <Form.FormItem 
          label="商品价格" 
          name="price"
          rules={[
            { required: true, message: '请输入商品价格' },
            { type: 'number', min: 0.01, message: '商品价格必须大于0' }
          ]}
        >
          <InputNumber placeholder="请输入商品价格" className="form-input" min={0} step={0.01} />
        </Form.FormItem>
      </div>
      
      <div className="form-group">
        <Form.FormItem 
          label="商品库存" 
          name="stock"
          rules={[
            { required: true, message: '请输入商品库存' },
            { type: 'integer', min: 0, message: '商品库存不能为负数' }
          ]}
        >
          <InputNumber placeholder="请输入商品库存" className="form-input" min={0} step={1} />
        </Form.FormItem>
      </div>
      
      <div className="form-group">
        <Form.FormItem 
          label="商品描述" 
          name="description"
          rules={[
            { max: 200, message: '商品描述不能超过200个字符' }
          ]}
        >
          <Input placeholder="请输入商品描述" className="form-input" />
        </Form.FormItem>
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