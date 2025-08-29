import { Store } from '../types/shop'

let currentStore: Store | null = null

export function switchStore(store: Store) {
  currentStore = store
}

export function getCurrentStore() {
  return currentStore
}
