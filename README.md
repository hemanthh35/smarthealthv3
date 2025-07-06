# 🏥 Health AI - Smart Symptoms Checker & Medical Image Analyzer

A comprehensive health analysis web application powered by AI that analyzes symptoms, medical images, and helps users find nearby healthcare facilities. Built with Next.js, TypeScript, and Ollama LLaVA for advanced medical image analysis.

![Health AI Dashboard](https://img.shields.io/badge/Next.js-14.2.30-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Ollama](https://img.shields.io/badge/Ollama-LLaVA-FF6B6B?style=for-the-badge)

## 🚀 Live Demo

**Repository**: https://github.com/hemanthh35/smarthealthv3.git

## ✨ Features

### 🔍 **AI-Powered Symptom Analysis**
- **Advanced Language Model Integration**: Uses state-of-the-art AI models for symptom analysis
- **Personalized Health Recommendations**: Tailored advice based on symptom patterns
- **Confidence Scoring**: AI provides confidence levels for each analysis
- **Severity Assessment**: Automatic severity classification (mild/moderate/severe)
- **Actionable Insights**: Clear guidance on when to seek medical attention

### 🖼️ **Medical Image Analysis**
- **X-ray Analysis**: Bone structure, fractures, and skeletal abnormalities detection
- **Brain Tumor Detection**: Specialized analysis for brain scan abnormalities
- **Bone Fracture Detection**: Advanced fracture identification and classification
- **Powered by Ollama LLaVA**: High-accuracy medical image analysis
- **Real-time Processing**: Instant analysis with detailed results

### 🏥 **Healthcare Facility Finder**
- **Real-time Location Services**: Find nearby hospitals, clinics, and pharmacies
- **Interactive Maps**: Leaflet-powered maps with facility locations
- **Distance Calculations**: Accurate distance and travel time estimates
- **Contact Information**: Direct phone numbers and navigation links
- **Emergency Alerts**: Quick access to emergency services
- **Multiple Facility Types**: Hospitals, clinics, pharmacies, urgent care centers

### 📊 **Health Dashboard**
- **Personal Health Tracking**: Monitor symptoms and analysis history
- **Health Statistics**: Visual charts and progress tracking
- **Reminder System**: Medication and appointment reminders
- **Health Insights**: AI-generated health recommendations
- **Trend Analysis**: Long-term health pattern recognition

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **AI/ML**: Ollama LLaVA for image analysis
- **Maps**: Leaflet.js with OpenStreetMap
- **Data Management**: Local Storage with compression
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Ollama** installed and running locally
- **LLaVA model** installed in Ollama

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/hemanthh35/smarthealthv3.git
cd smarthealthv3
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Set Up Ollama
```bash
# Install Ollama (if not already installed)
# Visit: https://ollama.ai/download

# Pull the LLaVA model
ollama pull llava

# Start Ollama service
ollama serve
```

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🎯 Usage Guide

### Symptom Analysis
1. Navigate to the **Symptom Checker** tab
2. Enter your symptoms in natural language
3. Select symptom categories if prompted
4. Review AI-generated analysis and recommendations
5. Save results to your health dashboard

### Image Analysis
1. Go to the **Image Analysis** tab
2. Upload a medical image (X-ray, brain scan, etc.)
3. Select the analysis type (X-ray, Brain Tumor, Bone Fracture)
4. Wait for Ollama LLaVA to process the image
5. Review detailed analysis results and recommendations

### Healthcare Facility Finder
1. Visit the **Find Hospitals** page
2. Allow location access or enter your address
3. Select facility types (hospitals, clinics, pharmacies)
4. View facilities on the interactive map
5. Click on facilities for contact information and directions

### Health Dashboard
1. Access your **Dashboard** to view health statistics
2. Review recent analyses and insights
3. Set up health reminders
4. Track your health trends over time

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llava

# Application Settings
NEXT_PUBLIC_APP_NAME=Health AI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Ollama Configuration
Ensure Ollama is running with the LLaVA model:

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Test LLaVA model
ollama run llava "Hello, this is a test"
```

## 📁 Project Structure

```
smarthealthv3/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Health dashboard page
│   ├── hospitals/         # Facility finder page
│   ├── app/              # Main app with tabs
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/            # Reusable React components
│   ├── NavigationBar.tsx # Main navigation
│   ├── SymptomChecker.tsx
│   ├── ImageAnalyzer.tsx
│   └── HealthcareFinder.tsx
├── lib/                  # Utility libraries
│   ├── healthData.ts     # Health data management
│   └── types.ts          # TypeScript type definitions
├── pages/                # API routes (legacy)
└── public/              # Static assets
```

## 🧪 Testing

### Test Ollama Connection
```bash
# Test API endpoint
curl http://localhost:3000/api/test-ollama
```

### Run Development Tests
```bash
npm run dev
# Navigate to http://localhost:3000
# Test all features manually
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Local Production Build
```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

### Medical Disclaimer
This application is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

### Data Privacy
- All health data is stored locally in your browser
- No personal health information is transmitted to external servers
- Image analysis is processed locally via Ollama

### System Requirements
- Modern web browser with JavaScript enabled
- Stable internet connection for map services
- Sufficient RAM for Ollama LLaVA model (8GB+ recommended)

## 🆘 Troubleshooting

### Common Issues

**Ollama Connection Error**
```bash
# Ensure Ollama is running
ollama serve

# Check if LLaVA model is installed
ollama list

# Install LLaVA if missing
ollama pull llava
```

**Image Analysis Not Working**
- Verify Ollama is running on `http://localhost:11434`
- Check that LLaVA model is installed
- Ensure uploaded images are in supported formats (JPEG, PNG)

**Map Not Loading**
- Check internet connection
- Verify browser location permissions
- Clear browser cache if needed

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Ensure all prerequisites are met

## 🙏 Acknowledgments

- **Ollama Team** for the LLaVA model
- **Next.js Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **OpenStreetMap** for map data
- **Leaflet.js** for interactive maps

---

**Made with ❤️ for better healthcare accessibility**

*This project is part of a health technology initiative to make AI-powered medical analysis more accessible to everyone.* 
