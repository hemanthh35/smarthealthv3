'use client'

import { useEffect, useState } from 'react'
import { Heart, ArrowRight, Sparkles, Brain, Camera } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function RootPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center w-24 h-24 bg-primary-600 rounded-full mx-auto mb-6 shadow-lg">
                <Heart className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="text-yellow-600 font-semibold">Welcome to the Future of Healthcare</span>
                <Sparkles className="w-6 h-6 text-yellow-500 ml-2" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to
                <span className="text-primary-600"> HealthAI</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Your AI-powered health assistant for symptoms analysis and visual health recognition
              </p>
            </div>
            
            <div className="space-y-6 mb-16">
              <Link 
                href="/home" 
                className="group bg-primary-600 text-white text-xl px-10 py-5 rounded-lg font-bold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 mx-auto w-fit shadow-lg"
              >
                <Sparkles className="w-6 h-6" />
                <span>Explore Home Page</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link 
                href="/app" 
                className="group bg-white text-gray-700 text-xl px-10 py-5 rounded-lg font-bold border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 mx-auto w-fit"
              >
                <Brain className="w-6 h-6" />
                <span>Launch Health Tools</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <div className="flex items-center justify-center space-x-4 mt-8">
                <Link 
                  href="/login" 
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <span className="text-gray-400">|</span>
                <Link 
                  href="/register" 
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Create Account
                </Link>
                <span className="text-gray-400">|</span>
                <Link 
                  href="/dashboard" 
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-gray-400">|</span>
                <Link 
                  href="/hospitals" 
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Hospitals
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 rounded-lg bg-primary-50 border border-primary-200">
                  <Brain className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Home Page</h4>
                  <p className="text-gray-600 text-sm">Learn about our features and capabilities</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                  <Camera className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Health Tools</h4>
                  <p className="text-gray-600 text-sm">Start using AI-powered health analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 