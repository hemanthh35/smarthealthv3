'use client'

import { useState } from 'react'
import { Search, AlertTriangle, CheckCircle, Clock, Activity, Brain } from 'lucide-react'
import SymptomInput from './SymptomInput'
import SymptomResults from './SymptomResults'
import { ConditionResult, symptomCategories } from '@/types/health'
import { healthDataManager } from '@/lib/healthData'

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [results, setResults] = useState<ConditionResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'input' | 'results'>('input')
  const [error, setError] = useState<string | null>(null)

  const handleSymptomSelection = (symptoms: string[]) => {
    setSelectedSymptoms(symptoms)
  }

  const analyzeSymptoms = async () => {
    if (selectedSymptoms.length === 0) return
    
    setIsAnalyzing(true)
    setError(null)
    
    try {
      // Get symptom names from IDs
      const symptomNames = selectedSymptoms.map(symptomId => {
        // Find the symptom name from the symptom categories
        const symptom = symptomCategories
          .flatMap(cat => cat.symptoms)
          .find(s => s.id === symptomId)
        return symptom ? symptom.name : symptomId
      })

      // Call the new LLaVA API
      const response = await fetch('/api/analyze-symptoms-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptomNames
        })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze symptoms')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      if (data.success && data.analysis) {
        // Convert the LLaVA response to ConditionResult format
        const conditionResult: ConditionResult = {
          condition: data.analysis.condition,
          probability: data.analysis.probability,
          severity: data.analysis.severity,
          description: data.analysis.description,
          symptoms: data.analysis.symptoms,
          recommendations: data.analysis.recommendations,
          whenToSeekCare: data.analysis.whenToSeekCare
        }

        setResults([conditionResult])
        setCurrentStep('results')
        
        // Save analysis to dashboard
        healthDataManager.addAnalysis({
          type: 'symptom',
          date: new Date().toISOString().split('T')[0],
          result: conditionResult.condition,
          confidence: conditionResult.probability,
          symptoms: symptomNames,
          description: conditionResult.description,
          recommendations: conditionResult.recommendations,
          severity: conditionResult.severity === 'mild' ? 'low' : conditionResult.severity === 'moderate' ? 'medium' : 'high'
        })
      } else {
        throw new Error('Invalid response from LLaVA analysis')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      setError(error instanceof Error ? error.message : 'Analysis failed')
      
      // Fallback to basic analysis if LLaVA fails
      const fallbackResult: ConditionResult = {
        condition: 'LLaVA Analysis Unavailable',
        probability: 50,
        severity: 'moderate',
        description: 'LLaVA analysis failed. This could be due to Ollama not running or LLaVA model not being available. Please ensure Ollama is running with the LLaVA model installed.',
        symptoms: selectedSymptoms,
        recommendations: [
          'Ensure Ollama is running: ollama serve',
          'Install LLaVA model: ollama pull llava',
          'Consult with a healthcare provider for proper diagnosis'
        ],
        whenToSeekCare: 'If symptoms worsen or persist, seek medical attention'
      }
      
      setResults([fallbackResult])
      setCurrentStep('results')
      
      // Save fallback analysis to dashboard
      healthDataManager.addAnalysis({
        type: 'symptom',
        date: new Date().toISOString().split('T')[0],
        result: fallbackResult.condition,
        confidence: fallbackResult.probability,
        symptoms: selectedSymptoms,
        description: fallbackResult.description,
        recommendations: fallbackResult.recommendations,
        severity: fallbackResult.severity === 'mild' ? 'low' : fallbackResult.severity === 'moderate' ? 'medium' : 'high'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetChecker = () => {
    setSelectedSymptoms([])
    setResults([])
    setError(null)
    setCurrentStep('input')
  }

  return (
    <div className="space-y-6">
      {currentStep === 'input' ? (
        <div className="card">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
              <Brain className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">SmartHealth Symptom Checker</h2>
            <p className="text-gray-600">Select your symptoms for AI-powered analysis using LLaVA</p>
          </div>
          
          <SymptomInput 
            selectedSymptoms={selectedSymptoms}
            onSymptomChange={handleSymptomSelection}
          />
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={analyzeSymptoms}
              disabled={selectedSymptoms.length === 0 || isAnalyzing}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>Analyzing with LLaVA...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Analyze with LLaVA</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Important Disclaimer</h4>
                <p className="text-blue-800 text-sm">
                  This AI analysis is for informational purposes only and should not replace professional medical advice. 
                  The LLaVA AI analysis provides insights but may not be 100% accurate. Always consult with a healthcare provider 
                  for proper diagnosis and treatment based on your symptoms.
                </p>
              </div>
            </div>
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