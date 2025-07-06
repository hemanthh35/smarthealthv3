import fs from 'fs'
import path from 'path'

export interface DiseaseSymptomData {
  disease: string
  symptoms: string[]
  symptomMap: { [symptom: string]: boolean }
}

export interface ProcessedDataset {
  diseases: DiseaseSymptomData[]
  allSymptoms: string[]
  diseaseCount: number
}

export function processDataset(): ProcessedDataset {
  try {
    const csvPath = path.join(process.cwd(), 'Disease and symptoms dataset.csv')
    const csvContent = fs.readFileSync(csvPath, 'utf-8')
    
    const lines = csvContent.split('\n').filter(line => line.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    
    // Extract symptoms (all columns except the first one)
    const symptoms = headers.slice(1)
    
    const diseases: DiseaseSymptomData[] = []
    
    // Process each disease row
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const diseaseName = values[0]
      
      if (!diseaseName) continue
      
      const symptomMap: { [symptom: string]: boolean } = {}
      const diseaseSymptoms: string[] = []
      
      // Process symptoms for this disease
      for (let j = 1; j < values.length && j < symptoms.length; j++) {
        const hasSymptom = values[j] === '1'
        const symptomName = symptoms[j - 1]
        
        symptomMap[symptomName] = hasSymptom
        if (hasSymptom) {
          diseaseSymptoms.push(symptomName)
        }
      }
      
      diseases.push({
        disease: diseaseName,
        symptoms: diseaseSymptoms,
        symptomMap
      })
    }
    
    return {
      diseases,
      allSymptoms: symptoms,
      diseaseCount: diseases.length
    }
  } catch (error) {
    console.error('Error processing dataset:', error)
    return {
      diseases: [],
      allSymptoms: [],
      diseaseCount: 0
    }
  }
}

export function findMatchingDiseases(selectedSymptoms: string[]): DiseaseSymptomData[] {
  const dataset = processDataset()
  
  if (selectedSymptoms.length === 0) return []
  
  // Calculate match scores for each disease
  const diseaseScores = dataset.diseases.map(disease => {
    let matchCount = 0
    let totalSymptoms = selectedSymptoms.length
    
    selectedSymptoms.forEach(symptom => {
      if (disease.symptomMap[symptom]) {
        matchCount++
      }
    })
    
    const matchPercentage = (matchCount / totalSymptoms) * 100
    
    return {
      ...disease,
      matchScore: matchPercentage,
      matchedSymptoms: selectedSymptoms.filter(s => disease.symptomMap[s])
    }
  })
  
  // Filter diseases with at least one matching symptom and sort by match score
  return diseaseScores
    .filter(disease => disease.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5) // Return top 5 matches
}

export function getSymptomCategories(): { name: string; symptoms: string[] }[] {
  const dataset = processDataset()
  
  // Group symptoms by categories based on keywords
  const categories = {
    'Mental Health': ['anxiety', 'depression', 'panic', 'psychotic', 'delusions', 'hallucinations', 'obsession', 'compulsion'],
    'Respiratory': ['breath', 'cough', 'wheezing', 'sputum', 'chest', 'lung', 'throat', 'nasal'],
    'Cardiovascular': ['heart', 'palpitation', 'chest pain', 'blood pressure', 'circulation'],
    'Digestive': ['stomach', 'abdominal', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'bloating'],
    'Neurological': ['headache', 'dizziness', 'seizure', 'memory', 'speech', 'vision', 'hearing'],
    'Musculoskeletal': ['pain', 'joint', 'muscle', 'back', 'neck', 'shoulder', 'arm', 'leg', 'knee'],
    'Skin': ['skin', 'rash', 'itching', 'swelling', 'lesion', 'acne'],
    'General': ['fever', 'fatigue', 'weight', 'appetite', 'sleep', 'sweating']
  }
  
  const categorizedSymptoms: { name: string; symptoms: string[] }[] = []
  
  Object.entries(categories).forEach(([categoryName, keywords]) => {
    const categorySymptoms = dataset.allSymptoms.filter(symptom => 
      keywords.some(keyword => symptom.toLowerCase().includes(keyword.toLowerCase()))
    )
    
    if (categorySymptoms.length > 0) {
      categorizedSymptoms.push({
        name: categoryName,
        symptoms: categorySymptoms
      })
    }
  })
  
  return categorizedSymptoms
} 