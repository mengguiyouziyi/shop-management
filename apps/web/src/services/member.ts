export interface Member {
  id: string
  level: number
  points: number
  balance: number
}

export function calculatePoints(member: Member, pointsToAdd: number) {
  const newPoints = member.points + pointsToAdd
  const newLevel = newPoints >= 200 ? 2 : member.level
  
  return {
    ...member,
    points: newPoints,
    level: newLevel
  }
}
