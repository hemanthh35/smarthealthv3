'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import SymptomChecker from '@/components/SymptomChecker'
import ImageAnalyzer from '@/components/ImageAnalyzer'
import Footer from '@/components/Footer'
import { Activity, Eye, Home } from 'lucide-react'
import Link from 'next/link'

export default function AppPage() {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'image'>('symptoms')
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams) return
    const tab = searchParams.get('tab')
    if (tab === 'image') {
      setActiveTab('image')
    } else if (tab === 'symptoms') {
      setActiveTab('symptoms')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Smart Health AI Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant health insights using AI-powered symptom analysis and image recognition. 
              Our advanced tools help you understand your health concerns and when to seek medical attention.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <div className="flex space-x-1">
                <button
                  onClick={() => setActiveTab('symptoms')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'symptoms'
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span>Symptoms Checker</span>
                </button>
                <button
                  onClick={() => setActiveTab('image')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                    activeTab === 'image'
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="w-5 h-5" />
                  <span>Image Analyzer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="flex justify-center mb-6">
            <Link 
              href="/home" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {activeTab === 'symptoms' ? (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    AI-Powered Symptoms Analysis
                  </h2>
                  <p className="text-gray-600">
                    Select your symptoms and get instant health insights using our trained medical AI model.
                  </p>
                </div>
                <SymptomChecker />
              </div>
            ) : (
              <div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    AI-Powered Image Analysis
                  </h2>
                  <p className="text-gray-600">
                    Upload photos of skin conditions, rashes, or other health concerns for AI analysis.
                  </p>
                </div>
                <ImageAnalyzer />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 