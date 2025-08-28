import { Store } from '../types/shop';

let currentStore: Store | null = null;

export const switchStore = (store: Store) => {
  currentStore = store;
};

export { currentStore };