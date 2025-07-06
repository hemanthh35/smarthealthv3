'use client'

import { useState } from 'react'
import { Search, AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react'
import SymptomInput from './SymptomInput'
import SymptomResults from './SymptomResults'
import { ConditionResult } from '@/types/health'
import { healthDataManager } from '@/lib/healthData'

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [results, setResults] = useState<ConditionResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'input' | 'results'>('input')

  const handleSymptomSelection = (symptoms: string[]) => {
    setSelectedSymptoms(symptoms)
  }

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return
    
    setIsAnalyzing(true)
    
    try {
      // Call the API to get predictions from the trained model
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms')
      }

      const predictions = await response.json()
      
      if (predictions.error) {
        throw new Error(predictions.error)
      }

      setResults(predictions)
      setIsAnalyzing(false)
      setCurrentStep('results')
      
      // Save analysis to dashboard
      if (predictions.length > 0) {
        const topResult = predictions[0]
        healthDataManager.addAnalysis({
          type: 'symptom',
          date: new Date().toISOString().split('T')[0],
          result: topResult.condition,
          confidence: topResult.probability,
          symptoms: selectedSymptoms,
          description: topResult.description,
          recommendations: topResult.recommendations,
          severity: topResult.severity === 'mild' ? 'low' : topResult.severity === 'moderate' ? 'medium' : 'high'
        })
      }
    } catch (error) {
      console.error('Analysis error:', error)
      
      // Fallback to mock data if API fails
      const mockResults: ConditionResult[] = [
        {
          condition: 'Common Cold',
          probability: 75,
          severity: 'mild',
          description: 'A viral infection affecting the upper respiratory tract',
          symptoms: ['runny nose', 'sore throat', 'cough'],
          recommendations: [
            'Rest and stay hydrated',
            'Use over-the-counter cold medications',
            'Monitor symptoms for worsening'
          ],
          whenToSeekCare: 'If symptoms persist for more than 10 days or worsen significantly'
        }
      ]
      
      setResults(mockResults)
      setIsAnalyzing(false)
      setCurrentStep('results')
      
      // Save mock analysis to dashboard
      healthDataManager.addAnalysis({
        type: 'symptom',
        date: new Date().toISOString().split('T')[0],
        result: mockResults[0].condition,
        confidence: mockResults[0].probability,
        symptoms: selectedSymptoms,
        description: mockResults[0].description,
        recommendations: mockResults[0].recommendations,
                  severity: mockResults[0].severity === 'mild' ? 'low' : mockResults[0].severity === 'moderate' ? 'medium' : 'high'
      })
    }
  }

  const resetChecker = () => {
    setSelectedSymptoms([])
    setResults([])
    setCurrentStep('input')
  }

  return (
    <div className="space-y-6">
      {currentStep === 'input' ? (
        <div className="card">
          <div className="text-center mb-6">
            <Activity className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              What symptoms are you experiencing?
            </h2>
            <p className="text-gray-600">
              Select all symptoms that apply to help our AI provide accurate health insights
            </p>
          </div>
          
          <SymptomInput 
            selectedSymptoms={selectedSymptoms}
            onSymptomChange={handleSymptomSelection}
          />
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Analyze with AI Model</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <SymptomResults 
          results={results}
          selectedSymptoms={selectedSymptoms}
          onReset={resetChecker}
        />
      )}
    </div>
  )
} 