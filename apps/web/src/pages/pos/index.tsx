import { useState } from 'react';
import { Numpad } from '../../components/POS/NumPad';
import { Button, Card, Space } from 'tdesign-react';
import './index.css';

export default function PosPage() {
  const [input, setInput] = useState('');

  const handleKeyPress = (key: string) => {
    if (key === '清除') {
      setInput('');
    } else {
      setInput(prev => prev + key);
    }
  };

  return (
    <div className="pos-page">
      <Card>
        <Space direction="vertical" size="large">
          <div className="amount-display">
            <h3>¥ {input || '0.00'}</h3>
          </div>
          
          <Numpad onPress={handleKeyPress} />
          
          <Space>
            <Button theme="primary">确认收款</Button>
            <Button>挂单</Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
}