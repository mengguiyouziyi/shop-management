import { describe, it, expect, beforeEach } from 'vitest'
import { StoreService } from '../../services/store'
import type { Store } from '../../types/shop'

describe('商店服务', () => {
  const testStore: Store = {
    id: 's001',
    name: '测试商店',
    address: '测试地址'
  }

  beforeEach(() => {
    // Reset current store
    const storeService = StoreService.getInstance();
    storeService.setCurrentStore(null as any)
  })

  it('应正确切换商店', () => {
    const storeService = StoreService.getInstance();
    storeService.setCurrentStore(testStore)
    const current = storeService.getCurrentStore()
    expect(current).toEqual(testStore)
  })

  it('应正确处理空商店', () => {
    const storeService = StoreService.getInstance();
    const current = storeService.getCurrentStore()
    expect(current).toBeNull()
  })

  it('应正确更新当前商店', () => {
    const storeService = StoreService.getInstance();
    // First switch to a store
    storeService.setCurrentStore(testStore)
    let current = storeService.getCurrentStore()
    expect(current).toEqual(testStore)
    
    // Switch to another store
    const newStore: Store = {
      id: 's002',
      name: '新商店',
      address: '新地址'
    }
    
    storeService.setCurrentStore(newStore)
    current = storeService.getCurrentStore()
    expect(current).toEqual(newStore)
    expect(current?.id).toBe('s002')
  })
})