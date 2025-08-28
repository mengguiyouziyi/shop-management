import { describe, it, expect } from 'vitest'
import { switchStore, currentStore } from '../../services/store'

describe('店铺服务', () => {
  it('应正确切换店铺', () => {
    const testStore = { id: 'store_1', name: '测试店铺' }
    switchStore(testStore)
    expect(currentStore.value).toEqual(testStore)
  })
})