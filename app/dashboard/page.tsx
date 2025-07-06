'use client'

import { useState, useEffect } from 'react'
import { 
  Heart, 
  TrendingUp, 
  Calendar, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Bell,
  Settings,
  Plus,
  ArrowRight,
  Eye,
  Brain,
  Camera,
  Shield,
  Zap,
  Star,
  Sparkles,
  Trash2,
  Edit,
  X,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { healthDataManager } from '@/lib/healthData'
import { DashboardData, HealthReminder } from '@/lib/types'

export default function DashboardPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedTimeframe, setSelectedTimeframe] = useState('week')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [showAddReminder, setShowAddReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: '',
    time: '',
    type: 'appointment' as const,
    description: '',
    priority: 'medium' as const
  })

  useEffect(() => {
    setIsVisible(true)
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    const data = healthDataManager.getDashboardData()
    setDashboardData(data)
  }

  const handleAddReminder = () => {
    if (newReminder.title && newReminder.date && newReminder.time) {
      healthDataManager.addReminder({
        ...newReminder,
        completed: false
      })
      setNewReminder({
        title: '',
        date: '',
        time: '',
        type: 'appointment',
        description: '',
        priority: 'medium'
      })
      setShowAddReminder(false)
      loadDashboardData()
    }
  }

  const handleCompleteReminder = (id: string) => {
    healthDataManager.updateReminder(id, { completed: true })
    loadDashboardData()
  }

  const handleDeleteReminder = (id: string) => {
    healthDataManager.deleteReminder(id)
    loadDashboardData()
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health data...</p>
        </div>
      </div>
    )
  }

  const { user, stats, recentAnalyses, insights, reminders, trends } = dashboardData

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                  <p className="text-gray-600">Here's your health overview for today</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select 
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value)}
                    className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.totalAnalyses}</h3>
                  <p className="text-gray-600 text-sm">Total Analyses</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.accuracy}%</h3>
                  <p className="text-gray-600 text-sm">Accuracy Rate</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.streak}</h3>
                  <p className="text-gray-600 text-sm">Day Streak</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <Sparkles className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.thisWeek}</h3>
                  <p className="text-gray-600 text-sm">This Week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-8">
            {['overview', 'history', 'insights', 'reminders'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Analyses */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Recent Analyses</h3>
                      <button 
                        onClick={() => setActiveTab('history')}
                        className="text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentAnalyses.map((analysis) => (
                        <div key={analysis.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 ${
                                analysis.type === 'symptom' ? 'bg-primary-600' : 'bg-green-500'
                              } rounded-lg flex items-center justify-center`}>
                                {analysis.type === 'symptom' ? (
                                  <Brain className="w-5 h-5 text-white" />
                                ) : (
                                  <Camera className="w-5 h-5 text-white" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">{analysis.type === 'symptom' ? 'Symptom Analysis' : 'Image Analysis'}</h4>
                                <p className="text-gray-600 text-sm">{analysis.result}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-900 font-semibold">{analysis.confidence}%</p>
                              <p className="text-gray-500 text-sm">{analysis.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Health Trends Chart */}
                <div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Weekly Trends</h3>
                    <div className="space-y-4">
                      {trends.map((day, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="w-4 h-4 text-primary-600" />
                              <span className="text-gray-900 text-sm">{day.analyses}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-gray-900 text-sm">{day.accuracy}%</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Health History</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  {recentAnalyses.map((analysis) => (
                    <div key={analysis.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 ${
                            analysis.type === 'symptom' ? 'bg-primary-600' : 'bg-green-500'
                          } rounded-lg flex items-center justify-center`}>
                            {analysis.type === 'symptom' ? (
                              <Brain className="w-6 h-6 text-white" />
                            ) : (
                              <Camera className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{analysis.type === 'symptom' ? 'Symptom Analysis' : 'Image Analysis'}</h4>
                            <p className="text-gray-600">{analysis.result}</p>
                            <p className="text-gray-500 text-sm">{analysis.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary-600 rounded-full"
                                style={{ width: `${analysis.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-gray-900 font-semibold">{analysis.confidence}%</span>
                          </div>
                          <button className="text-primary-600 hover:text-primary-700 transition-colors text-sm">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Health Insights</h3>
                  <div className="space-y-4">
                    {insights.map((insight, index) => (
                      <div key={index} className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                            <p className="text-gray-600 text-sm">{insight.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recommendations</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Great Progress!</h4>
                          <p className="text-gray-600 text-sm">You've maintained a consistent health monitoring routine.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Consider a Check-up</h4>
                          <p className="text-gray-600 text-sm">It's been a while since your last comprehensive health analysis.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reminders' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Upcoming Reminders</h3>
                    <button 
                      onClick={() => setShowAddReminder(true)}
                      className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 transition-all duration-300"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {reminders.filter(r => !r.completed).map((reminder) => (
                      <div key={reminder.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{reminder.title}</h4>
                            <p className="text-gray-600 text-sm">{reminder.date} at {reminder.time}</p>
                            {reminder.description && (
                              <p className="text-gray-500 text-sm mt-1">{reminder.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              reminder.type === 'appointment' ? 'bg-primary-100 text-primary-700' :
                              reminder.type === 'medication' ? 'bg-yellow-100 text-yellow-700' :
                              reminder.type === 'health-check' ? 'bg-green-100 text-green-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {reminder.type}
                            </span>
                            <button 
                              onClick={() => handleCompleteReminder(reminder.id)}
                              className="p-1 text-green-500 hover:text-green-600 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteReminder(reminder.id)}
                              className="p-1 text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    <Link href="/app?tab=symptoms" className="block bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Brain className="w-6 h-6" />
                          <span className="font-semibold">New Symptom Analysis</span>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Link>
                    
                    <Link href="/app?tab=image" className="block bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Camera className="w-6 h-6" />
                          <span className="font-semibold">Image Analysis</span>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Link>
                    
                    <Link href="/hospitals" className="block bg-red-500 text-white p-4 rounded-lg hover:bg-red-600 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-6 h-6" />
                          <span className="font-semibold">Find Hospitals</span>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </Link>
                    
                    <button 
                      onClick={() => setShowAddReminder(true)}
                      className="w-full bg-gray-100 text-gray-700 p-4 rounded-lg hover:bg-gray-200 transition-all duration-300 border border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-6 h-6" />
                          <span className="font-semibold">Schedule Reminder</span>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Reminder</h3>
              <button 
                onClick={() => setShowAddReminder(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Reminder title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({...newReminder, type: e.target.value as any})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="appointment">Appointment</option>
                  <option value="medication">Medication</option>
                  <option value="health-check">Health Check</option>
                  <option value="follow-up">Follow-up</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Additional details..."
                  rows={3}
                />
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddReminder(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddReminder}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-300"
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
} 