import { Select } from 'tdesign-react';
import { useState, useEffect } from 'react';
import { getStores } from '../services/store';

export default function StoreSelect() {
  const [stores, setStores] = useState([]);
  const [currentStore, setCurrentStore] = useState('');

  useEffect(() => {
    getStores().then(data => {
      setStores(data);
      setCurrentStore(data[0]?.id || '');
    });
  }, []);

  return (
    <Select
      value={currentStore}
      onChange={(value) => {
        setCurrentStore(value);
        // 实际项目中这里会触发店铺切换逻辑
      }}
      options={stores.map(store => ({
        label: store.name,
        value: store.id
      }))}
    />
  );
}