import { Button, Space } from 'tdesign-react';
import type { Props } from './types';

export default function Numpad({ onPress }: Props) {
  const keys = [
    '7', '8', '9',
    '4', '5', '6', 
    '1', '2', '3',
    '0', '.', '清除'
  ];

  return (
    <Space size={10} wrap>
      {keys.map(key => (
        <Button 
          key={key}
          theme="primary"
          shape="square"
          onClick={() => onPress(key)}
        >
          {key}
        </Button>
      ))}
    </Space>
  );
}