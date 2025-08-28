import React from 'react';
import { Button } from 'tdesign-react';

export const NumPad = () => {
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '清空'];
  
  return (
    <div className="grid grid-cols-3 gap-2 p-2">
      {keys.map(key => (
        <Button key={key} shape="square" block>
          {key}
        </Button>
      ))}
    </div>
  );
};