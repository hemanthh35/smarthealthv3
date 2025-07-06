export interface HealthAnalysis {
  id: string
  type: 'symptom' | 'image'
  date: string
  result: string
  confidence: number
  symptoms?: string[]
  imageUrl?: string
  description?: string
  recommendations?: string[]
  severity?: 'low' | 'medium' | 'high'
}

export interface HealthStats {
  totalAnalyses: number
  thisWeek: number
  thisMonth: number
  accuracy: number
  streak: number
  averageConfidence: number
}

export interface HealthInsight {
  id: string
  type: 'positive' | 'warning' | 'info' | 'alert'
  title: string
  description: string
  date: string
  actionable: boolean
  actionUrl?: string
}

export interface HealthReminder {
  id: string
  title: string
  date: string
  time: string
  type: 'appointment' | 'medication' | 'health-check' | 'follow-up'
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

export interface HealthTrend {
  date: string
  analyses: number
  accuracy: number
  confidence: number
}

export interface UserProfile {
  id: string
  name: string
  email: string
  age?: number
  gender?: string
  medicalHistory?: string[]
  allergies?: string[]
  medications?: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

export interface DashboardData {
  user: UserProfile
  stats: HealthStats
  recentAnalyses: HealthAnalysis[]
  insights: HealthInsight[]
  reminders: HealthReminder[]
  trends: HealthTrend[]
} 