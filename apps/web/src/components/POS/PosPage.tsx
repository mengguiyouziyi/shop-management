import { Card, Space, Button } from 'tdesign-react';
import Numpad from './NumPad';
import { useState } from 'react';

export default function PosPage() {
  const [amount, setAmount] = useState('0.00');

  const handlePress = (key: string) => {
    if (key === '清除') {
      setAmount('0.00');
    } else if (key === '.') {
      // 防止多次输入小数点
      if (!amount.includes('.')) {
        setAmount(prev => prev === '0.00' ? '0.' : prev + key);
      }
    } else {
      // 处理数字输入
      setAmount(prev => {
        if (prev === '0.00') {
          return key;
        }
        
        // 限制小数点后最多两位
        const parts = prev.split('.');
        if (parts.length > 1 && parts[1].length >= 2) {
          return prev;
        }
        
        return prev + key;
      });
    }
  };

  const formatAmount = (value: string) => {
    if (!value) return '0.00';
    
    // 确保格式化为货币格式
    if (value.endsWith('.')) {
      return value + '00';
    }
    
    const parts = value.split('.');
    if (parts.length === 1) {
      return value + '.00';
    }
    
    if (parts[1].length === 1) {
      return value + '0';
    }
    
    return value;
  };

  return (
    <Card bordered title="POS收银台">
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div className="amount-display">
          <div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
            ¥ {formatAmount(amount)}
          </div>
        </div>
        
        <Numpad onPress={handlePress} />

        <Space size={16} style={{ width: '100%', justifyContent: 'center' }}>
          <Button theme="primary" style={{ width: '120px' }}>
            确认收款
          </Button>
          <Button variant="outline" style={{ width: '120px' }}>
            挂单
          </Button>
        </Space>
      </Space>
    </Card>
  );
}