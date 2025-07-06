import { NextRequest, NextResponse } from 'next/server'

interface TestResult {
  parameter: string
  value: string
  unit: string
  reference: string
  status: 'normal' | 'high' | 'low' | 'critical'
}

interface TestReport {
  id: string
  name: string
  date: string
  type: string
  results: TestResult[]
  analysis: string
  recommendations: string[]
  severity: 'normal' | 'mild' | 'moderate' | 'severe'
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Simulate AI analysis - in a real implementation, this would use Ollama or another AI service
    const analysis = await simulateTestReportAnalysis(file)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error analyzing test report:', error)
    return NextResponse.json(
      { error: 'Failed to analyze test report' },
      { status: 500 }
    )
  }
}

async function simulateTestReportAnalysis(file: File): Promise<TestReport> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Generate mock analysis based on file type
  const fileName = file.name.toLowerCase()
  let testType = 'General Blood Test'
  let results: TestResult[] = []
  let analysis = ''
  let recommendations: string[] = []
  let severity: 'normal' | 'mild' | 'moderate' | 'severe' = 'normal'

  if (fileName.includes('cbc') || fileName.includes('blood')) {
    testType = 'Complete Blood Count (CBC)'
    results = [
      { parameter: 'Hemoglobin', value: '14.2', unit: 'g/dL', reference: '12.0-15.5', status: 'normal' },
      { parameter: 'White Blood Cells', value: '7.8', unit: 'K/μL', reference: '4.5-11.0', status: 'normal' },
      { parameter: 'Platelets', value: '250', unit: 'K/μL', reference: '150-450', status: 'normal' },
      { parameter: 'Red Blood Cells', value: '4.8', unit: 'M/μL', reference: '4.0-5.2', status: 'normal' },
      { parameter: 'Hematocrit', value: '42', unit: '%', reference: '36-46', status: 'normal' }
    ]
    analysis = 'Your Complete Blood Count results are within normal ranges. All parameters indicate healthy blood cell production and function. No abnormalities detected.'
    recommendations = [
      'Continue with regular health monitoring',
      'Maintain a balanced diet rich in iron and B vitamins',
      'Stay hydrated and exercise regularly',
      'Schedule follow-up in 6-12 months for routine check'
    ]
  } else if (fileName.includes('lipid') || fileName.includes('cholesterol')) {
    testType = 'Lipid Panel'
    results = [
      { parameter: 'Total Cholesterol', value: '180', unit: 'mg/dL', reference: '<200', status: 'normal' },
      { parameter: 'HDL Cholesterol', value: '55', unit: 'mg/dL', reference: '>40', status: 'normal' },
      { parameter: 'LDL Cholesterol', value: '110', unit: 'mg/dL', reference: '<100', status: 'high' },
      { parameter: 'Triglycerides', value: '150', unit: 'mg/dL', reference: '<150', status: 'normal' }
    ]
    analysis = 'Your lipid panel shows mostly normal values with slightly elevated LDL cholesterol. This may indicate a need for dietary adjustments to maintain optimal cardiovascular health.'
    recommendations = [
      'Reduce saturated fat intake',
      'Increase consumption of omega-3 fatty acids',
      'Consider Mediterranean diet approach',
      'Increase physical activity to 150 minutes/week',
      'Follow up with healthcare provider in 3 months'
    ]
    severity = 'mild'
  } else if (fileName.includes('thyroid') || fileName.includes('tsh')) {
    testType = 'Thyroid Function Test'
    results = [
      { parameter: 'TSH', value: '2.1', unit: 'μIU/mL', reference: '0.4-4.0', status: 'normal' },
      { parameter: 'Free T4', value: '1.2', unit: 'ng/dL', reference: '0.8-1.8', status: 'normal' },
      { parameter: 'Free T3', value: '3.1', unit: 'pg/mL', reference: '2.3-4.2', status: 'normal' }
    ]
    analysis = 'Your thyroid function tests are within normal ranges, indicating healthy thyroid hormone production and regulation.'
    recommendations = [
      'Continue current thyroid medication if prescribed',
      'Monitor for any changes in energy levels or weight',
      'Schedule annual thyroid function check',
      'Maintain iodine-rich diet'
    ]
  } else {
    // Generic test analysis
    results = [
      { parameter: 'Glucose', value: '95', unit: 'mg/dL', reference: '70-100', status: 'normal' },
      { parameter: 'Creatinine', value: '0.9', unit: 'mg/dL', reference: '0.6-1.2', status: 'normal' },
      { parameter: 'BUN', value: '15', unit: 'mg/dL', reference: '7-20', status: 'normal' }
    ]
    analysis = 'Your test results appear to be within normal ranges. The analysis indicates good overall health markers with no significant abnormalities detected.'
    recommendations = [
      'Continue with regular health monitoring',
      'Maintain healthy lifestyle habits',
      'Schedule annual physical examination',
      'Contact healthcare provider if experiencing unusual symptoms'
    ]
  }

  return {
    id: `test_${Date.now()}`,
    name: file.name.replace(/\.[^/.]+$/, ''),
    date: new Date().toISOString().split('T')[0],
    type: testType,
    results,
    analysis,
    recommendations,
    severity,
    confidence: Math.floor(Math.random() * 20) + 80 // 80-99% confidence
  }
} 