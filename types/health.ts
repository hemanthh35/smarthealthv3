export interface SymptomData {
  id: string
  name: string
  category: string
  severity: 'mild' | 'moderate' | 'severe'
  description: string
}

export interface ConditionResult {
  condition: string
  probability: number
  severity: 'mild' | 'moderate' | 'severe'
  description: string
  symptoms: string[]
  recommendations: string[]
  whenToSeekCare: string
}

export interface SymptomCategory {
  name: string
  symptoms: SymptomData[]
}

export const symptomCategories: SymptomCategory[] = [
  {
    name: 'Respiratory',
    symptoms: [
      { id: 'cough', name: 'Cough', category: 'Respiratory', severity: 'mild', description: 'Dry or productive cough' },
      { id: 'runny-nose', name: 'Runny Nose', category: 'Respiratory', severity: 'mild', description: 'Nasal discharge' },
      { id: 'sore-throat', name: 'Sore Throat', category: 'Respiratory', severity: 'moderate', description: 'Pain or irritation in throat' },
      { id: 'shortness-breath', name: 'Shortness of Breath', category: 'Respiratory', severity: 'severe', description: 'Difficulty breathing' },
      { id: 'chest-pain', name: 'Chest Pain', category: 'Respiratory', severity: 'severe', description: 'Pain in chest area' }
    ]
  },
  {
    name: 'Digestive',
    symptoms: [
      { id: 'nausea', name: 'Nausea', category: 'Digestive', severity: 'moderate', description: 'Feeling sick to stomach' },
      { id: 'vomiting', name: 'Vomiting', category: 'Digestive', severity: 'moderate', description: 'Throwing up' },
      { id: 'diarrhea', name: 'Diarrhea', category: 'Digestive', severity: 'moderate', description: 'Loose, watery stools' },
      { id: 'abdominal-pain', name: 'Abdominal Pain', category: 'Digestive', severity: 'moderate', description: 'Pain in stomach area' },
      { id: 'loss-appetite', name: 'Loss of Appetite', category: 'Digestive', severity: 'mild', description: 'Reduced desire to eat' }
    ]
  },
  {
    name: 'Neurological',
    symptoms: [
      { id: 'headache', name: 'Headache', category: 'Neurological', severity: 'moderate', description: 'Pain in head' },
      { id: 'dizziness', name: 'Dizziness', category: 'Neurological', severity: 'moderate', description: 'Feeling lightheaded' },
      { id: 'fatigue', name: 'Fatigue', category: 'Neurological', severity: 'mild', description: 'Extreme tiredness' },
      { id: 'confusion', name: 'Confusion', category: 'Neurological', severity: 'severe', description: 'Mental disorientation' },
      { id: 'seizures', name: 'Seizures', category: 'Neurological', severity: 'severe', description: 'Uncontrolled movements' }
    ]
  },
  {
    name: 'Musculoskeletal',
    symptoms: [
      { id: 'joint-pain', name: 'Joint Pain', category: 'Musculoskeletal', severity: 'moderate', description: 'Pain in joints' },
      { id: 'muscle-aches', name: 'Muscle Aches', category: 'Musculoskeletal', severity: 'mild', description: 'General muscle pain' },
      { id: 'back-pain', name: 'Back Pain', category: 'Musculoskeletal', severity: 'moderate', description: 'Pain in back' },
      { id: 'swelling', name: 'Swelling', category: 'Musculoskeletal', severity: 'moderate', description: 'Inflammation of body parts' }
    ]
  },
  {
    name: 'General',
    symptoms: [
      { id: 'fever', name: 'Fever', category: 'General', severity: 'moderate', description: 'Elevated body temperature' },
      { id: 'chills', name: 'Chills', category: 'General', severity: 'mild', description: 'Feeling cold with shivering' },
      { id: 'sweating', name: 'Sweating', category: 'General', severity: 'mild', description: 'Excessive perspiration' },
      { id: 'weight-loss', name: 'Weight Loss', category: 'General', severity: 'moderate', description: 'Unintentional weight reduction' }
    ]
  }
] 