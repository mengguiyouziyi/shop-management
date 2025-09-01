import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Button, Message, Card } from 'tdesign-react';
import { SystemSettingsService, SystemSettings } from '../../services/systemSettings';

const { FormItem } = Form;

const SystemSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const systemSettingsService = SystemSettingsService.getInstance();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await systemSettingsService.getSystemSettings();
      setSettings(currentSettings);
      form.setFieldsValue(currentSettings);
    } catch (error) {
      if (typeof Message !== 'undefined' && Message.error) {
        Message.error('加载系统设置失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    setSaving(true);
    try {
      const values = await form.validate();
      await systemSettingsService.updateSystemSettings(values);
      if (typeof Message !== 'undefined' && Message.success) {
        Message.success('系统设置已保存');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (typeof Message !== 'undefined' && Message.error) {
          Message.error(error.message || '保存系统设置失败');
        }
      } else {
        if (typeof Message !== 'undefined' && Message.error) {
          Message.error('保存系统设置失败');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>
          系统设置
        </h1>
      </div>

      <Card>
        <Form 
          form={form} 
          labelWidth={120}
          onSubmit={onSubmit}
        >
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <FormItem label="公司名称" name="companyName">
              <Input placeholder="请输入公司名称" />
            </FormItem>
            <FormItem label="公司地址" name="companyAddress">
              <Input placeholder="请输入公司地址" />
            </FormItem>
            <FormItem label="联系电话" name="companyPhone">
              <Input placeholder="请输入联系电话" />
            </FormItem>
            <FormItem label="默认税率 (%)" name="defaultTaxRate">
              <Input type="number" placeholder="请输入默认税率" />
            </FormItem>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <FormItem label="打印小票" name="printReceipt" valuePropName="checked">
              <Switch />
            </FormItem>
            <FormItem label="启用会员积分" name="enableMemberPoints" valuePropName="checked">
              <Switch />
            </FormItem>
            <FormItem label="启用库存预警" name="enableInventoryAlert" valuePropName="checked">
              <Switch />
            </FormItem>
            <FormItem label="启用离线模式" name="enableOfflineMode" valuePropName="checked">
              <Switch />
            </FormItem>
          </div>

          <FormItem label="小票标题" name="receiptTitle">
            <Input placeholder="请输入小票标题" />
          </FormItem>
          <FormItem label="小票底部信息" name="receiptFooter">
            <Input.Textarea placeholder="请输入小票底部信息" rows={3} />
          </FormItem>

          <FormItem style={{ textAlign: 'right' }}>
            <Button theme="primary" type="submit" loading={saving}>
              保存设置
            </Button>
          </FormItem>
        </Form>
      </Card>
    </div>
  );
};

export default SystemSettingsPage;