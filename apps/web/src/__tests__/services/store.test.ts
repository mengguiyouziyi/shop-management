import { describe, it, expect, beforeEach } from 'vitest'
import { switchStore, getCurrentStore } from '../../services/store'
import type { Store } from '../../types/shop'

describe('商店服务', () => {
  const testStore: Store = {
    id: 's001',
    name: '测试商店',
    address: '测试地址'
  }

  beforeEach(() => {
    // Reset current store
    switchStore(null as any)
  })

  it('应正确切换商店', () => {
    switchStore(testStore)
    const current = getCurrentStore()
    expect(current).toEqual(testStore)
  })

  it('应正确处理空商店', () => {
    const current = getCurrentStore()
    expect(current).toBeNull()
  })

  it('应正确更新当前商店', () => {
    // First switch to a store
    switchStore(testStore)
    let current = getCurrentStore()
    expect(current).toEqual(testStore)
    
    // Switch to another store
    const newStore: Store = {
      id: 's002',
      name: '新商店',
      address: '新地址'
    }
    
    switchStore(newStore)
    current = getCurrentStore()
    expect(current).toEqual(newStore)
    expect(current?.id).toBe('s002')
  })
})