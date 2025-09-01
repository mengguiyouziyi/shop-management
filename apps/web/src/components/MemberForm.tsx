import React, { useState, useEffect } from 'react';
import { Form, Input, Button, MessagePlugin, Select } from 'tdesign-react';
import type { Member } from '../types/shop';

interface MemberFormProps {
  onSuccess: () => void;
}

export default function MemberForm({ onSuccess }: MemberFormProps) {
  const [form] = Form.useForm();
  const [levels, setLevels] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    // 模拟获取会员等级
    setLevels([
      { id: '1', name: '普通会员' },
      { id: '2', name: '银卡会员' },
      { id: '3', name: '金卡会员' }
    ]);
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      // 这里应该调用API创建会员
      console.log('创建会员:', values);
      MessagePlugin.success('会员添加成功');
      form.reset();
      onSuccess();
    } catch (err) {
      MessagePlugin.error('会员添加失败');
    }
  };

  return (
    <Form form={form} onSubmit={handleSubmit} layout="vertical">
      <Form.FormItem label="会员姓名" name="name" rules={[{ required: true }]}>
        <Input placeholder="请输入会员姓名" />
      </Form.FormItem>
      
      <Form.FormItem label="手机号码" name="mobile" rules={[{ required: true, pattern: /^1\d{10}$/ }]}>
        <Input placeholder="请输入手机号码" />
      </Form.FormItem>
      
      <Form.FormItem label="会员等级" name="levelId">
        <Select options={levels.map(l => ({ label: l.name, value: l.id }))} />
      </Form.FormItem>
      
      <Form.FormItem>
        <Button type="submit" theme="primary">
          添加会员
        </Button>
      </Form.FormItem>
    </Form>
  );
}