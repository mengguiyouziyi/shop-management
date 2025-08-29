import { Card, Space } from 'tdesign-react';
import Numpad from './NumPad';
import { useState } from 'react';

export default function PosPage() {
  const [amount, setAmount] = useState('0.00');

  const handlePress = (key: string) => {
    if (key === '清除') {
      setAmount('');
    } else {
      setAmount(prev => prev === '0.00' ? key : prev + key);
    }
  };

  return (
    <Card bordered>
      <Space direction="vertical" size={24}>
        <div className="amount-display">
                <input 
                  type="text" 
                  value={amount ? `¥ ${amount}` : ''}
                  readOnly
                  aria-label="amount"
                  role="textbox"
                  className="t-input__inner"
                />
        </div>
        
        <Numpad onPress={handlePress} />

        <Space size={16}>
          <button className="t-button t-button--theme-primary">
            确认收款
          </button>
          <button className="t-button t-button--theme-primary">
            挂单
          </button>
        </Space>
      </Space>
    </Card>
  );
}