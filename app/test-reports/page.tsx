'use client'

import TestReportAnalyzer from '@/components/TestReportAnalyzer'
import Navigation from '@/components/Navigation'

export default function TestReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto py-8">
        <TestReportAnalyzer />
      </div>
    </div>
  )
} 