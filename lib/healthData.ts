import { 
  HealthAnalysis, 
  HealthStats, 
  HealthInsight, 
  HealthReminder, 
  HealthTrend, 
  UserProfile,
  DashboardData 
} from './types'

// Local storage keys
export const STORAGE_KEYS = {
  ANALYSES: 'smarthealth_analyses',
  REMINDERS: 'smarthealth_reminders',
  USER_PROFILE: 'smarthealth_user_profile',
  INSIGHTS: 'smarthealth_insights'
}

// Initialize default user profile
const defaultUserProfile: UserProfile = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  age: 28,
  gender: 'female',
  medicalHistory: ['Seasonal allergies', 'Mild asthma'],
  allergies: ['Pollen', 'Dust'],
  medications: ['Albuterol inhaler'],
  emergencyContact: {
    name: 'Dr. Michael Chen',
    phone: '+1-555-0123',
    relationship: 'Primary Care Physician'
  }
}

// Health data management class
export class HealthDataManager {
  private static instance: HealthDataManager

  private constructor() {
    this.initializeData()
  }

  static getInstance(): HealthDataManager {
    if (!HealthDataManager.instance) {
      HealthDataManager.instance = new HealthDataManager()
    }
    return HealthDataManager.instance
  }

  private initializeData() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return
    }

    // Initialize user profile if not exists
    if (!this.getUserProfile()) {
      this.saveUserProfile(defaultUserProfile)
    }

    // Initialize sample data if no analyses exist
    if (!this.getAnalyses().length) {
      this.initializeSampleData()
    }
  }

  private initializeSampleData() {
    const sampleAnalyses: HealthAnalysis[] = [
      {
        id: '1',
        type: 'symptom',
        date: '2024-01-15',
        result: 'Common Cold',
        confidence: 89,
        symptoms: ['Runny nose', 'Sore throat', 'Cough'],
        description: 'Mild upper respiratory infection',
        recommendations: ['Rest well', 'Stay hydrated', 'Take over-the-counter cold medicine'],
        severity: 'low'
      },
      {
        id: '2',
        type: 'image',
        date: '2024-01-14',
        result: 'Eczema',
        confidence: 92,
        imageUrl: '/sample-skin.jpg',
        description: 'Mild eczema on forearm',
        recommendations: ['Use moisturizer', 'Avoid harsh soaps', 'Consider prescription cream'],
        severity: 'medium'
      },
      {
        id: '3',
        type: 'symptom',
        date: '2024-01-12',
        result: 'Seasonal Allergies',
        confidence: 87,
        symptoms: ['Sneezing', 'Itchy eyes', 'Nasal congestion'],
        description: 'Pollen allergy symptoms',
        recommendations: ['Take antihistamines', 'Use air purifier', 'Avoid outdoor activities during high pollen'],
        severity: 'low'
      },
      {
        id: '4',
        type: 'image',
        date: '2024-01-10',
        result: 'Normal Skin',
        confidence: 95,
        imageUrl: '/sample-skin-normal.jpg',
        description: 'Healthy skin appearance',
        recommendations: ['Continue current skincare routine', 'Use sunscreen daily'],
        severity: 'low'
      }
    ]

    const sampleReminders: HealthReminder[] = [
      {
        id: '1',
        title: 'Annual Checkup',
        date: '2024-02-15',
        time: '10:00 AM',
        type: 'appointment',
        description: 'Routine physical examination',
        completed: false,
        priority: 'high'
      },
      {
        id: '2',
        title: 'Albuterol Refill',
        date: '2024-01-20',
        time: '9:00 AM',
        type: 'medication',
        description: 'Inhaler prescription renewal',
        completed: false,
        priority: 'medium'
      },
      {
        id: '3',
        title: 'Blood Pressure Check',
        date: '2024-01-18',
        time: '2:00 PM',
        type: 'health-check',
        description: 'Monthly blood pressure monitoring',
        completed: false,
        priority: 'medium'
      }
    ]

    const sampleInsights: HealthInsight[] = [
      {
        id: '1',
        type: 'positive',
        title: 'Health Streak',
        description: 'You\'ve been consistent with health monitoring for 12 days!',
        date: '2024-01-15',
        actionable: false
      },
      {
        id: '2',
        type: 'info',
        title: 'Seasonal Pattern',
        description: 'Your allergy symptoms typically peak in spring months.',
        date: '2024-01-14',
        actionable: true,
        actionUrl: '/app'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Sleep Quality',
        description: 'Consider improving sleep hygiene for better health outcomes.',
        date: '2024-01-13',
        actionable: true,
        actionUrl: '/dashboard?tab=insights'
      }
    ]

    this.saveAnalyses(sampleAnalyses)
    this.saveReminders(sampleReminders)
    this.saveInsights(sampleInsights)
  }

  // Analysis methods
  getAnalyses(): HealthAnalysis[] {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(STORAGE_KEYS.ANALYSES)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  saveAnalyses(analyses: HealthAnalysis[]) {
    if (typeof window !== 'undefined') {
      try {
        // Limit to last 50 analyses to prevent quota issues
        const limitedAnalyses = analyses.slice(0, 50)
        
        // Remove large image data to save space
        const compressedAnalyses = limitedAnalyses.map(analysis => ({
          ...analysis,
          imageUrl: undefined, // Remove image URLs to save space
          description: analysis.description?.substring(0, 500) // Limit description length
        }))
        
        localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(compressedAnalyses))
      } catch (error) {
        console.error('Failed to save analyses:', error)
        // If still fails, try with even fewer items
        try {
          const minimalAnalyses = analyses.slice(0, 10).map(analysis => ({
            id: analysis.id,
            type: analysis.type,
            date: analysis.date,
            result: analysis.result,
            confidence: analysis.confidence,
            severity: analysis.severity
          }))
          localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(minimalAnalyses))
        } catch (secondError) {
          console.error('Failed to save even minimal analyses:', secondError)
        }
      }
    }
  }

  addAnalysis(analysis: Omit<HealthAnalysis, 'id'>): HealthAnalysis {
    try {
      const analyses = this.getAnalyses()
      const newAnalysis: HealthAnalysis = {
        ...analysis,
        id: Date.now().toString()
      }
      
      // Remove imageUrl to save space
      const compressedAnalysis = {
        ...newAnalysis,
        imageUrl: undefined
      }
      
      analyses.unshift(compressedAnalysis)
      this.saveAnalyses(analyses)
      return newAnalysis
    } catch (error) {
      console.error('Failed to add analysis:', error)
      // Return the analysis even if storage fails
      return {
        ...analysis,
        id: Date.now().toString()
      }
    }
  }

  getAnalysisById(id: string): HealthAnalysis | null {
    const analyses = this.getAnalyses()
    return analyses.find(a => a.id === id) || null
  }

  // Reminder methods
  getReminders(): HealthReminder[] {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  saveReminders(reminders: HealthReminder[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders))
    }
  }

  addReminder(reminder: Omit<HealthReminder, 'id'>): HealthReminder {
    const reminders = this.getReminders()
    const newReminder: HealthReminder = {
      ...reminder,
      id: Date.now().toString()
    }
    reminders.push(newReminder)
    this.saveReminders(reminders)
    return newReminder
  }

  updateReminder(id: string, updates: Partial<HealthReminder>): HealthReminder | null {
    const reminders = this.getReminders()
    const index = reminders.findIndex(r => r.id === id)
    if (index === -1) return null

    reminders[index] = { ...reminders[index], ...updates }
    this.saveReminders(reminders)
    return reminders[index]
  }

  deleteReminder(id: string): boolean {
    const reminders = this.getReminders()
    const filtered = reminders.filter(r => r.id !== id)
    this.saveReminders(filtered)
    return filtered.length !== reminders.length
  }

  // User profile methods
  getUserProfile(): UserProfile | null {
    try {
      if (typeof window === 'undefined') return null
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE)
      return data ? JSON.parse(data) : null
    } catch {
      return null
    }
  }

  saveUserProfile(profile: UserProfile) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile))
    }
  }

  updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
    const profile = this.getUserProfile()
    if (!profile) return null

    const updatedProfile = { ...profile, ...updates }
    this.saveUserProfile(updatedProfile)
    return updatedProfile
  }

  // Insight methods
  getInsights(): HealthInsight[] {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(STORAGE_KEYS.INSIGHTS)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  saveInsights(insights: HealthInsight[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(insights))
    }
  }

  addInsight(insight: Omit<HealthInsight, 'id'>): HealthInsight {
    const insights = this.getInsights()
    const newInsight: HealthInsight = {
      ...insight,
      id: Date.now().toString()
    }
    insights.unshift(newInsight)
    this.saveInsights(insights)
    return newInsight
  }

  // Stats calculation
  calculateStats(): HealthStats {
    const analyses = this.getAnalyses()
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const thisWeek = analyses.filter(a => new Date(a.date) >= weekAgo).length
    const thisMonth = analyses.filter(a => new Date(a.date) >= monthAgo).length
    const totalAnalyses = analyses.length

    const accuracy = totalAnalyses > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / totalAnalyses)
      : 0

    const averageConfidence = totalAnalyses > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / totalAnalyses)
      : 0

    // Calculate streak (consecutive days with analyses)
    let streak = 0
    const sortedAnalyses = analyses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    if (sortedAnalyses.length > 0) {
      let currentDate = new Date(sortedAnalyses[0].date)
      const today = new Date()
      
      while (currentDate <= today) {
        const hasAnalysis = sortedAnalyses.some(a => 
          new Date(a.date).toDateString() === currentDate.toDateString()
        )
        if (hasAnalysis) {
          streak++
          currentDate.setDate(currentDate.getDate() + 1)
        } else {
          break
        }
      }
    }

    return {
      totalAnalyses,
      thisWeek,
      thisMonth,
      accuracy,
      streak,
      averageConfidence
    }
  }

  // Trends calculation
  calculateTrends(days: number = 7): HealthTrend[] {
    const analyses = this.getAnalyses()
    const trends: HealthTrend[] = []
    const now = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayAnalyses = analyses.filter(a => a.date === dateStr)
      const analysesCount = dayAnalyses.length
      const accuracy = dayAnalyses.length > 0 
        ? Math.round(dayAnalyses.reduce((sum, a) => sum + a.confidence, 0) / dayAnalyses.length)
        : 0
      const confidence = dayAnalyses.length > 0 
        ? Math.round(dayAnalyses.reduce((sum, a) => sum + a.confidence, 0) / dayAnalyses.length)
        : 0

      trends.push({
        date: dateStr,
        analyses: analysesCount,
        accuracy,
        confidence
      })
    }

    return trends
  }

  // Get complete dashboard data
  getDashboardData(): DashboardData {
    const user = this.getUserProfile() || defaultUserProfile
    const stats = this.calculateStats()
    const recentAnalyses = this.getAnalyses().slice(0, 10)
    const insights = this.getInsights()
    const reminders = this.getReminders()
    const trends = this.calculateTrends(7)

    return {
      user,
      stats,
      recentAnalyses,
      insights,
      reminders,
      trends
    }
  }
}

// Export singleton instance
export const healthDataManager = HealthDataManager.getInstance() 