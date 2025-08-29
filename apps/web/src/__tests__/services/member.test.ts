import { describe, it, expect } from 'vitest'
import { calculatePoints } from '../../services/member'
import type { Member } from '../../services/member'

describe('会员服务', () => {
  const testMember: Member = {
    id: 'm001',
    level: 1,
    points: 100,
    balance: 0
  }

  it('应正确计算积分', () => {
    const result = calculatePoints(testMember, 50)
    expect(result.points).toBe(150)
    expect(result.level).toBe(1) // 仍低于升级阈值(200)
  })

  it('应正确升级会员等级', () => {
    const result = calculatePoints(testMember, 150)
    expect(result.points).toBe(250)
    expect(result.level).toBe(2) // 达到升级阈值(200)
  })

  it('应保持现有等级当积分不足时', () => {
    const lowPointsMember: Member = {
      id: 'm002',
      level: 1,
      points: 10,
      balance: 0
    }
    
    const result = calculatePoints(lowPointsMember, 50)
    expect(result.points).toBe(60)
    expect(result.level).toBe(1) // 仍低于升级阈值(200)
  })

  it('应正确处理高级会员', () => {
    const highLevelMember: Member = {
      id: 'm003',
      level: 2, // 白银会员
      points: 500,
      balance: 0
    }
    
    const result = calculatePoints(highLevelMember, 100)
    expect(result.points).toBe(600)
    expect(result.level).toBe(2) // 保持白银会员等级
  })
})