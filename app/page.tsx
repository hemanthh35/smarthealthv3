'use client'

import { useEffect, useState } from 'react'
import { Heart, ArrowRight, Sparkles, Brain, Camera, Stethoscope, FileText, MapPin, Activity, Shield, Zap, Users, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'

export default function RootPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 shadow-lg">
                <Heart className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
                <span className="text-yellow-600 font-semibold">AI-Powered Healthcare Revolution</span>
                <Sparkles className="w-6 h-6 text-yellow-500 ml-2" />
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome to
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> SmartHealth</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Your comprehensive AI-powered health assistant for symptoms analysis, medical image recognition, and healthcare facility discovery
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link 
                  href="/app" 
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl px-8 py-4 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <Zap className="w-6 h-6" />
                  <span>Start Health Analysis</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                
                <Link 
                  href="/test-reports" 
                  className="group bg-white text-gray-700 text-xl px-8 py-4 rounded-lg font-bold border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
                >
                  <FileText className="w-6 h-6" />
                  <span>Analyze Test Reports</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Comprehensive Health Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by advanced AI technology including Ollama LLaVA for accurate medical analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Symptom Analysis */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">AI Symptom Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Real-time symptom analysis using LLaVA AI. Get instant medical insights, condition detection, and personalized recommendations.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Real LLaVA-powered analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Condition detection & severity assessment
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Personalized treatment recommendations
                </li>
              </ul>
            </div>

            {/* Medical Image Analysis */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Medical Image Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Advanced image analysis for X-rays, brain scans, and bone fractures using LLaVA AI technology.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  X-ray & brain scan analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Bone fracture detection
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Detailed medical insights
                </li>
              </ul>
            </div>

            {/* Test Report Analysis */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Test Report Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Intelligent analysis of medical test reports with LLaVA AI. Fast and detailed analysis modes available.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Fast analysis (60s timeout)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Detailed analysis (120s timeout)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Simple text output format
                </li>
              </ul>
            </div>

            {/* Healthcare Facility Finder */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Healthcare Facility Finder</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Find nearby hospitals, clinics, and pharmacies with interactive maps and real-time location services.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Interactive maps with Leaflet.js
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Distance & travel time calculations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Contact information & directions
                </li>
              </ul>
            </div>

            {/* Health Dashboard */}
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Health Dashboard</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Personal health tracking with statistics, insights, and trend analysis for better health management.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Health statistics & progress tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Medication & appointment reminders
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  AI-generated health insights
                </li>
              </ul>
            </div>

            {/* Privacy & Security */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-xl border border-red-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Privacy & Security</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Your health data is processed locally with Ollama LLaVA. No personal information is transmitted to external servers.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Local AI processing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  No external data transmission
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Secure health data storage
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powered by Advanced Technology</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technologies for reliable and accurate health analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ollama LLaVA</h3>
              <p className="text-gray-600 text-sm">Advanced AI model for medical image and text analysis</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Next.js 14</h3>
              <p className="text-gray-600 text-sm">Modern React framework for fast, scalable web applications</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">TypeScript</h3>
              <p className="text-gray-600 text-sm">Type-safe development for reliable code and better user experience</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Real-time Processing</h3>
              <p className="text-gray-600 text-sm">Fast analysis with optimized timeouts and error handling</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Access</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with our health analysis tools in just a few clicks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Link href="/app" className="group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <Stethoscope className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-bold">Symptom Checker</h3>
                </div>
                <p className="text-blue-100 mb-4">Analyze your symptoms with AI-powered LLaVA analysis</p>
                <div className="flex items-center text-blue-100">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/app" className="group">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <Camera className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-bold">Image Analysis</h3>
                </div>
                <p className="text-purple-100 mb-4">Upload medical images for AI-powered analysis</p>
                <div className="flex items-center text-purple-100">
                  <span>Upload Image</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/test-reports" className="group">
              <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <FileText className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-bold">Test Reports</h3>
                </div>
                <p className="text-green-100 mb-4">Analyze medical test reports with LLaVA AI</p>
                <div className="flex items-center text-green-100">
                  <span>Upload Report</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/hospitals" className="group">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <MapPin className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-bold">Find Hospitals</h3>
                </div>
                <p className="text-orange-100 mb-4">Locate nearby healthcare facilities</p>
                <div className="flex items-center text-orange-100">
                  <span>Find Facilities</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/dashboard" className="group">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <Activity className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-bold">Health Dashboard</h3>
                </div>
                <p className="text-indigo-100 mb-4">Track your health statistics and insights</p>
                <div className="flex items-center text-indigo-100">
                  <span>View Dashboard</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/app" className="group">
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-8 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-bold">All Tools</h3>
                </div>
                <p className="text-gray-100 mb-4">Access all health analysis tools in one place</p>
                <div className="flex items-center text-gray-100">
                  <span>Launch App</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
} 