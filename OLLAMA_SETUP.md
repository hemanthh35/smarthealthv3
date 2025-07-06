# Ollama LLaVA Setup Guide

This guide will help you set up Ollama with the LLaVA model for image analysis in your health application.

## 🚀 Quick Setup

### 1. Install Ollama
Download and install Ollama from: https://ollama.ai/

### 2. Pull LLaVA Model
Open a terminal and run:
```bash
ollama pull llava
```

### 3. Start Ollama Service
```bash
ollama serve
```

### 4. Test the Model
```bash
ollama run llava "Describe this image" -i path/to/image.jpg
```

## 🔧 Configuration

### Default Settings
- **Model**: llava
- **API Endpoint**: http://localhost:11434
- **Image Format**: Base64 encoded
- **Max File Size**: 10MB

### Custom Configuration
You can modify the API endpoint in `pages/api/analyze-image.js`:

```javascript
const response = await fetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'llava', // Change model name here
    prompt: prompt,
    images: [base64Image],
    stream: false
  })
})
```

## 🏥 Health Analysis Prompts

The application uses specialized prompts for health image analysis:

### Skin Condition Analysis
```
Analyze this medical image and provide a health assessment. 
Please identify any visible conditions, symptoms, or health concerns. 
Focus on skin conditions, rashes, swelling, or other visible health indicators.
```

### General Health Analysis
```
Analyze this image for any visible health concerns, symptoms, or conditions.
Provide a detailed assessment focusing on:
- Visible symptoms or conditions
- Severity assessment
- Recommended actions
- When to seek medical care
```

## 🔍 Testing the Integration

### 1. Start Your Application
```bash
npm run dev
```

### 2. Test Image Upload
- Go to http://localhost:3000
- Click on "Image Analyzer" tab
- Upload a test image
- Check the analysis results

### 3. Monitor Ollama Logs
Watch the terminal where Ollama is running for API calls and responses.

## 🛠️ Troubleshooting

### Common Issues

#### 1. Ollama Not Running
**Error**: `Ollama API error: 500`
**Solution**: Start Ollama service
```bash
ollama serve
```

#### 2. Model Not Found
**Error**: `Model 'llava' not found`
**Solution**: Pull the model
```bash
ollama pull llava
```

#### 3. Image Format Issues
**Error**: `Invalid image format`
**Solution**: Ensure images are in supported formats (JPEG, PNG, etc.)

#### 4. Memory Issues
**Error**: `Out of memory`
**Solution**: 
- Close other applications
- Use a smaller model variant
- Increase system RAM

### Performance Optimization

#### 1. Model Selection
- **llava**: Best quality, slower
- **llava:7b**: Faster, good quality
- **llava:13b**: High quality, more memory

#### 2. Batch Processing
For multiple images, consider implementing batch processing to reduce API calls.

#### 3. Caching
Implement result caching for repeated analyses.

## 🔒 Security Considerations

### 1. Local Processing
- Images are processed locally on your machine
- No data is sent to external servers
- Maintains privacy and security

### 2. File Cleanup
- Uploaded files are automatically deleted after analysis
- Temporary files are cleaned up

### 3. Input Validation
- File size limits (10MB)
- Image format validation
- Malicious file protection

## 📊 Monitoring

### 1. API Response Times
Monitor response times in the browser console:
```javascript
console.time('analysis')
// ... analysis code
console.timeEnd('analysis')
```

### 2. Error Logging
Check browser console and server logs for errors:
```javascript
console.error('Analysis error:', error)
```

### 3. Model Performance
Monitor Ollama logs for model performance and memory usage.

## 🚀 Production Deployment

### 1. Environment Variables
Set up environment variables for production:
```bash
OLLAMA_API_URL=http://your-ollama-server:11434
OLLAMA_MODEL=llava
```

### 2. Load Balancing
For high traffic, consider:
- Multiple Ollama instances
- Load balancer configuration
- Caching layer

### 3. Monitoring
Implement:
- Response time monitoring
- Error rate tracking
- Usage analytics

## 📚 Additional Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [LLaVA Model Information](https://github.com/haotian-liu/LLaVA)
- [Health Image Analysis Guidelines](https://www.who.int/health-topics/digital-health)

## 🆘 Support

If you encounter issues:
1. Check Ollama logs
2. Verify model installation
3. Test with simple images first
4. Check network connectivity
5. Review error messages in browser console 