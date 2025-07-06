# Health AI - Smart Symptoms Checker

A comprehensive health analysis web application that uses AI to analyze symptoms and medical images, find nearby healthcare facilities, and provide personalized health insights.

## 🚀 Features

### 🔍 **Symptom Analysis**
- AI-powered symptom checker using advanced language models
- Personalized health recommendations based on symptoms
- Confidence scoring and severity assessment
- Detailed analysis with actionable insights

### 🖼️ **Image Analysis**
- **X-ray Analysis**: Bone structure, fractures, and skeletal abnormalities
- **Brain Tumor Detection**: Brain scan analysis for masses and abnormalities
- **Bone Fracture Detection**: Specialized fracture analysis
- Powered by Ollama LLaVA model for accurate medical image analysis

### 🏥 **Healthcare Facility Finder**
- Real-time location-based facility search
- Interactive map with OpenStreetMap integration
- Multiple facility types: Hospitals, Clinics, Pharmacies, Dental, Optical, Laboratories
- Distance calculation and emergency service filtering
- Navigation and contact information

### 📊 **Health Dashboard**
- Comprehensive health overview and statistics
- Recent analysis history
- Health trends and insights
- Reminder system for appointments and medications
- Progress tracking and streak monitoring

### 🎨 **Modern UI/UX**
- Responsive design with blue and white theme
- Smooth animations and transitions
- Mobile-friendly interface
- Intuitive navigation and user experience

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **AI Models**: Ollama LLaVA for image analysis
- **Maps**: Leaflet with OpenStreetMap
- **Icons**: Lucide React
- **Data Storage**: LocalStorage with compression

## 📋 Prerequisites

### Ollama Setup
This application requires Ollama with the LLaVA model for image analysis.

1. **Install Ollama**: [https://ollama.ai/](https://ollama.ai/)
2. **Install LLaVA Model**:
   ```bash
   ollama pull llava
   ```
3. **Start Ollama Service**:
   ```bash
   ollama serve
   ```

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd health-ai-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Health dashboard
│   ├── hospitals/         # Facility finder
│   └── globals.css       # Global styles
├── components/            # Reusable components
├── lib/                   # Utilities and data management
├── pages/                 # Legacy API routes
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for any environment-specific configurations:

```env
# Add any environment variables here
NEXT_PUBLIC_APP_NAME=Health AI
```

### Ollama Configuration
Ensure Ollama is running on the default port (11434) or update the API endpoints in:
- `pages/api/analyze-image.js`
- `app/api/test-ollama/route.ts`

## 🎯 Usage

### Symptom Analysis
1. Navigate to the app
2. Select "Symptom Checker" tab
3. Enter your symptoms
4. Receive AI-powered analysis and recommendations

### Image Analysis
1. Select "Image Analysis" tab
2. Choose analysis type (X-ray, Brain Tumor, Bone Fracture)
3. Upload medical image
4. Get detailed AI analysis with confidence scores

### Healthcare Facility Finder
1. Navigate to "Find Hospitals"
2. Allow location access or enter coordinates
3. Select facility type and radius
4. View interactive map and facility list
5. Get directions and contact information

### Dashboard
1. View comprehensive health overview
2. Track analysis history and trends
3. Manage health reminders
4. Monitor progress and insights

## 🔒 Privacy & Security

- All data is stored locally in the browser
- No personal health data is transmitted to external servers
- Image analysis is performed locally via Ollama
- Facility search uses public OpenStreetMap data

## 🐛 Troubleshooting

### Ollama Issues
- **Model not found**: Run `ollama pull llava`
- **Connection refused**: Ensure Ollama is running with `ollama serve`
- **Slow responses**: LLaVA model requires significant computational resources

### Build Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Performance Issues
- Image analysis is computationally intensive
- Large images may take 30-60 seconds to process
- Consider image compression for faster analysis

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This application is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Ensure Ollama is properly configured
3. Review the console for error messages
4. Create an issue with detailed information

---

**Built with ❤️ for better health insights** 