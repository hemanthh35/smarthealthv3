'use client'

import { CheckCircle, AlertTriangle, Info, ArrowLeft, TrendingUp, Clock, Shield } from 'lucide-react'
import { ConditionResult, symptomCategories } from '@/types/health'

interface SymptomResultsProps {
  results: ConditionResult[]
  selectedSymptoms: string[]
  onReset: () => void
}

export default function SymptomResults({ results, selectedSymptoms, onReset }: SymptomResultsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-green-600 bg-green-100'
      case 'moderate': return 'text-yellow-600 bg-yellow-100'
      case 'severe': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600'
    if (probability >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
              <p className="text-gray-600">Based on your symptoms, here are the possible conditions:</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Start Over</span>
          </button>
        </div>

        {/* Selected Symptoms Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Your Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptomId) => {
              const symptom = symptomCategories
                .flatMap(cat => cat.symptoms)
                .find(s => s.id === symptomId)
              return symptom ? (
                <span
                  key={symptomId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {symptom.name}
                </span>
              ) : (
                <span
                  key={symptomId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {symptomId}
                </span>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{result.condition}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.severity)}`}>
                    {result.severity}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{result.description}</p>
                
                {/* Probability Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Probability</span>
                    <span className={`text-sm font-bold ${getProbabilityColor(result.probability)}`}>
                      {result.probability}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        result.probability >= 80 ? 'bg-green-500' :
                        result.probability >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.probability}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Common Symptoms */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Common Symptoms
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.symptoms.map((symptom, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((recommendation, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* When to Seek Care */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">When to Seek Medical Care</h4>
                  <p className="text-yellow-700 text-sm">{result.whenToSeekCare}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-2">Important Disclaimer</h4>
            <p className="text-blue-800 text-sm mb-3">
              This analysis is for informational purposes only and should not replace professional medical advice. 
              The results are based on common symptom patterns and may not accurately reflect your specific condition.
            </p>
            <div className="flex items-center space-x-2 text-blue-700 text-sm">
              <Shield className="w-4 h-4" />
              <span>Always consult with a healthcare provider for proper diagnosis and treatment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="card bg-red-50 border-red-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-2">Emergency Notice</h4>
            <p className="text-red-800 text-sm">
              If you are experiencing severe symptoms, chest pain, difficulty breathing, or any other concerning symptoms, 
              please seek immediate medical attention or call emergency services.
            </p>
            <div className="mt-2">
              <span className="text-red-900 font-semibold">Emergency: 911</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 