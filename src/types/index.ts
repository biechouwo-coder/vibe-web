export interface TaskWithMeta {
  id: string
  date: Date
  title: string
  description: string | null
  completed: boolean
  completedAt: Date | null
  sortOrder: number
}

export interface DailyContentWithMeta {
  id: string
  date: Date
  type: string // 'conversation' | 'vocabulary' | 'passage'
  title: string
  content: string
  source: string | null
  tags: string | null
  pushed: boolean
}

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActive: Date | null
}

export interface NotionSettings {
  token: string
  dbEnglish: string
  dbPlans: string
  enabled: boolean
}

export interface DailyStats {
  totalTasks: number
  completedTasks: number
  completionRate: number
  streak: StreakData
}
