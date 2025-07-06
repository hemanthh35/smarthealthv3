'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Search, AlertTriangle } from 'lucide-react'
import { symptomCategories, SymptomData } from '@/types/health'

interface SymptomInputProps {
  selectedSymptoms: string[]
  onSymptomChange: (symptoms: string[]) => void
}

export default function SymptomInput({ selectedSymptoms, onSymptomChange }: SymptomInputProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Respiratory'])
  const [searchTerm, setSearchTerm] = useState('')

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    )
  }

  const handleSymptomToggle = (symptomId: string) => {
    const newSelected = selectedSymptoms.includes(symptomId)
      ? selectedSymptoms.filter(id => id !== symptomId)
      : [...selectedSymptoms, symptomId]
    onSymptomChange(newSelected)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'severe': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredCategories = symptomCategories.map(category => ({
    ...category,
    symptoms: category.symptoms.filter(symptom =>
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptom.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.symptoms.length > 0)

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search symptoms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Selected Symptoms Summary */}
      {selectedSymptoms.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Selected Symptoms ({selectedSymptoms.length})</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(symptomId => {
              const symptom = symptomCategories
                .flatMap(cat => cat.symptoms)
                .find(s => s.id === symptomId)
              return symptom ? (
                <span
                  key={symptomId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {symptom.name}
                  <button
                    onClick={() => handleSymptomToggle(symptomId)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      {/* Symptom Categories */}
      <div className="space-y-4">
        {filteredCategories.map(category => (
          <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleCategory(category.name)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left font-medium text-gray-900 transition-colors"
            >
              <span>{category.name}</span>
              {expandedCategories.includes(category.name) ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            
            {expandedCategories.includes(category.name) && (
              <div className="p-4 space-y-2">
                {category.symptoms.map(symptom => (
                  <div
                    key={symptom.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={symptom.id}
                          checked={selectedSymptoms.includes(symptom.id)}
                          onChange={() => handleSymptomToggle(symptom.id)}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label htmlFor={symptom.id} className="font-medium text-gray-900 cursor-pointer">
                          {symptom.name}
                        </label>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(symptom.severity)}`}>
                          {symptom.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-7">{symptom.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Warning */}
      {selectedSymptoms.some(id => {
        const symptom = symptomCategories.flatMap(cat => cat.symptoms).find(s => s.id === id)
        return symptom?.severity === 'severe'
      }) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">Emergency Warning</span>
          </div>
          <p className="text-red-700 mt-2 text-sm">
            You have selected severe symptoms. Please seek immediate medical attention if these symptoms are concerning.
          </p>
        </div>
      )}
    </div>
  )
} 