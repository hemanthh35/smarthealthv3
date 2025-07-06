'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { Heart, Eye, Activity, Shield, Zap, Users, ArrowRight, CheckCircle, Star, Sparkles, Brain, Camera, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Brain,
      title: 'AI Symptom Analysis',
      description: 'Advanced machine learning analyzes your symptoms with medical accuracy. Get instant health insights and personalized recommendations.',
      color: 'bg-primary-600',
      gradient: 'bg-primary-600'
    },
    {
      icon: Camera,
      title: 'Visual Health Analysis',
      description: 'Upload photos and let LLaVA AI analyze skin conditions, rashes, and health concerns with professional accuracy.',
      color: 'bg-green-500',
      gradient: 'bg-green-500'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your health data stays private. All processing happens locally with military-grade security and zero external storage.',
      color: 'bg-purple-500',
      gradient: 'bg-purple-500'
    }
  ]

  const stats = [
    { number: '99.9%', label: 'Privacy Secure', icon: Shield },
    { number: '24/7', label: 'Always Available', icon: Zap },
    { number: 'AI', label: 'Powered', icon: Brain },
    { number: '773', label: 'Diseases Trained', icon: TrendingUp }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-5xl mx-auto">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-yellow-500 mr-3" />
                <span className="text-yellow-600 font-semibold">AI-Powered Health Intelligence</span>
                <Sparkles className="w-8 h-8 text-yellow-500 ml-3" />
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Your Personal
                <span className="text-primary-600"> Health AI</span>
                <br />
                <span className="text-purple-600">Assistant</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Experience the future of healthcare with AI-powered symptom analysis and visual health recognition. 
                Get instant, accurate health insights powered by advanced machine learning.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Link href="/app" className="group bg-primary-600 text-white text-xl px-10 py-5 rounded-lg font-bold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg">
                  <Zap className="w-6 h-6" />
                  <span>Start Health Analysis</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Link>
                <button className="bg-white text-gray-700 text-xl px-10 py-5 rounded-lg font-bold border-2 border-gray-200 hover:bg-gray-50 transition-all duration-300">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className={`transition-all duration-1000 delay-${index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
                    <stat.icon className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Revolutionary AI Health Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Two cutting-edge AI systems working in harmony to provide comprehensive health insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group transition-all duration-1000 delay-${index * 200} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-all duration-500 transform hover:scale-105">
                  <div className={`w-20 h-20 ${feature.gradient} rounded-lg flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, powerful, and secure - your health insights in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Input Your Data', desc: 'Select symptoms or upload photos of health concerns' },
              { step: '02', title: 'AI Analysis', desc: 'Our advanced AI models analyze and provide insights' },
              { step: '03', title: 'Get Results', desc: 'Receive personalized recommendations and guidance' }
            ].map((item, index) => (
              <div key={index} className={`text-center transition-all duration-1000 delay-${index * 300} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold text-white shadow-lg">
                    {item.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-12 h-1 bg-primary-600 transform -translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of users who trust our AI-powered health assistant for accurate, 
              private, and instant health insights.
            </p>
            <Link href="/app" className="group bg-primary-600 text-white text-2xl px-12 py-6 rounded-lg font-bold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3 shadow-lg">
              <Sparkles className="w-6 h-6" />
              <span>Launch Health Assistant</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
      </main>
      <Footer />
    </div>
  )
} 