import React, { useState, useEffect } from 'react';
import { Form, Input, Switch, Button, Message, Row, Col, InputNumber } from 'tdesign-react';
import { SystemSettingsService, SystemSettings } from '../../services/systemSettings';

export default function SystemSettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const systemSettingsService = SystemSettingsService.getInstance();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await systemSettingsService.getSystemSettings();
      
      if (settings) {
        form.setFieldsValue(settings);
      } else {
        // 如果没有设置，使用默认值
        const defaultSettings = systemSettingsService.getDefaultSettings();
        form.setFieldsValue(defaultSettings);
      }
    } catch (error) {
      Message.error('加载系统设置失败');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: SystemSettings) => {
    try {
      setSaving(true);
      await systemSettingsService.updateSystemSettings(values);
      Message.success('系统设置已保存');
    } catch (error) {
      Message.error('保存系统设置失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        系统设置
      </h1>
      
      <Form 
        form={form} 
        onSubmit={onSubmit}
        labelWidth={120}
        disabled={loading}
      >
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>公司信息</h2>
          
          <Row gutter={20}>
            <Col span={6}>
              <Form.FormItem label="公司名称" name="companyName">
                <Input placeholder="请输入公司名称" />
              </Form.FormItem>
            </Col>
            
            <Col span={6}>
              <Form.FormItem label="公司地址" name="companyAddress">
                <Input placeholder="请输入公司地址" />
              </Form.FormItem>
            </Col>
            
            <Col span={6}>
              <Form.FormItem label="联系电话" name="companyPhone">
                <Input placeholder="请输入联系电话" />
              </Form.FormItem>
            </Col>
            
            <Col span={6}>
              <Form.FormItem label="电子邮箱" name="companyEmail">
                <Input placeholder="请输入电子邮箱" />
              </Form.FormItem>
            </Col>
          </Row>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>货币设置</h2>
          
          <Row gutter={20}>
            <Col span={6}>
              <Form.FormItem label="货币单位" name="currency">
                <Input placeholder="例如: CNY" />
              </Form.FormItem>
            </Col>
            
            <Col span={6}>
              <Form.FormItem label="货币符号" name="currencySymbol">
                <Input placeholder="例如: ¥" />
              </Form.FormItem>
            </Col>
          </Row>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>打印设置</h2>
          
          <Row gutter={20}>
            <Col span={6}>
              <Form.FormItem label="打印小票" name="printReceipt" valueType="boolean">
                <Switch />
              </Form.FormItem>
            </Col>
            
            <Col span={6}>
              <Form.FormItem label="打印发票" name="printInvoice" valueType="boolean">
                <Switch />
              </Form.FormItem>
            </Col>
          </Row>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>税收设置</h2>
          
          <Row gutter={20}>
            <Col span={6}>
              <Form.FormItem label="启用税收" name="taxEnabled" valueType="boolean">
                <Switch />
              </Form.FormItem>
            </Col>
            
            <Col span={6}>
              <Form.FormItem label="税率 (%)" name="taxRate">
                <InputNumber min={0} max={100} step={0.1} />
              </Form.FormItem>
            </Col>
          </Row>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>库存设置</h2>
          
          <Row gutter={20}>
            <Col span={6}>
              <Form.FormItem label="启用库存跟踪" name="enableStockTracking" valueType="boolean">
                <Switch />
              </Form.FormItem>
            </Col>
            
            <Col span={6}>
              <Form.FormItem label="低库存阈值" name="lowStockThreshold">
                <InputNumber min={0} step={1} />
              </Form.FormItem>
            </Col>
          </Row>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>会员设置</h2>
          
          <Row gutter={20}>
            <Col span={6}>
              <Form.FormItem label="启用会员计划" name="enableLoyaltyProgram" valueType="boolean">
                <Switch />
              </Form.FormItem>
            </Col>
            
            <Col span={6}>
              <Form.FormItem label="积分兑换比例" name="pointsPerCurrency">
                <InputNumber min={0} step={1} />
              </Form.FormItem>
            </Col>
            
            <Col span={6}>
              <Form.FormItem label="货币兑换比例" name="currencyPerPoint">
                <InputNumber min={0} step={1} />
              </Form.FormItem>
            </Col>
          </Row>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>多店铺设置</h2>
          
          <Row gutter={20}>
            <Col span={6}>
              <Form.FormItem label="启用多店铺" name="enableMultiStore" valueType="boolean">
                <Switch />
              </Form.FormItem>
            </Col>
          </Row>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <Button 
            theme="primary" 
            type="submit" 
            loading={saving}
            style={{ marginRight: '10px' }}
          >
            保存设置
          </Button>
          <Button 
            variant="outline" 
            onClick={loadSettings}
          >
            重置
          </Button>
        </div>
      </Form>
    </div>
  );
}