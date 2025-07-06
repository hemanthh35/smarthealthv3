'use client'

import { useEffect } from 'react'
import TestReportAnalyzer from '@/components/TestReportAnalyzer'
import Navigation from '@/components/Navigation'

export default function TestReportsPage() {
  useEffect(() => {
    console.log('Test Reports page loaded successfully')
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto py-8">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Test Reports Page</h1>
          <p className="text-gray-600">Page is working correctly</p>
        </div>
        <TestReportAnalyzer />
      </div>
    </div>
  )
} 