# SmartHealth Troubleshooting Guide

## Current Issues and Solutions

### 1. PowerShell Command Syntax
**Issue**: `&&` operator doesn't work in PowerShell
**Solution**: Use separate commands or PowerShell syntax
```powershell
# Instead of: cd /c/Users/naduk/OneDrive/Desktop/tejasexpo/you && npm run dev
# Use:
cd C:\Users\naduk\OneDrive\Desktop\tejasexpo\you
npm run dev
```

### 2. Ollama Connection Issues
**Issue**: LLaVA requests timing out
**Solutions**:

#### Check if Ollama is running:
```powershell
ollama list
```

#### Restart Ollama:
```powershell
# Stop any running Ollama processes
taskkill /f /im ollama.exe

# Start Ollama
ollama serve
```

#### Test LLaVA model:
```powershell
ollama run llava "Hello, this is a test"
```

### 3. API Timeout Issues
**Issue**: Analysis taking 5+ minutes and timing out
**Solutions**:

#### Optimized API Configuration:
- Regular analysis: 120 seconds timeout
- Fast analysis: 60 seconds timeout
- Reduced response length for faster processing

#### Test the APIs:
```powershell
# Test Ollama connection
curl http://localhost:3001/api/test-ollama

# Test with a simple image
# Upload a test image to the web interface
```

### 4. Development Server Issues
**Issue**: Server not starting or port conflicts
**Solutions**:

#### Check if server is running:
```powershell
netstat -an | findstr :3001
```

#### Restart development server:
```powershell
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### 5. File Upload Issues
**Issue**: PDF or image files not processing
**Solutions**:

#### Supported file types:
- Images: JPEG, PNG, JPG
- Documents: PDF

#### File size limits:
- Keep files under 10MB for faster processing
- Use clear, high-quality images for better analysis

### 6. LLaVA Model Issues
**Issue**: Model not responding or slow
**Solutions**:

#### Reinstall LLaVA:
```powershell
ollama pull llava
```

#### Check model status:
```powershell
ollama list
```

#### Test model directly:
```powershell
ollama run llava "Analyze this text: Hello world"
```

## Quick Fix Steps

1. **Restart Everything**:
   ```powershell
   # Stop all processes
   taskkill /f /im node.exe
   taskkill /f /im ollama.exe
   
   # Start Ollama
   ollama serve
   
   # Start development server
   cd C:\Users\naduk\OneDrive\Desktop\tejasexpo\you
   npm run dev
   ```

2. **Test Connection**:
   - Open browser to http://localhost:3001
   - Go to Test Report Analysis page
   - Upload a simple test image
   - Try both Fast and Detailed analysis modes

3. **Check Logs**:
   - Monitor terminal output for errors
   - Check browser console for JavaScript errors
   - Look for timeout or connection errors

## Expected Behavior

### Working System:
- Ollama responds within 30-60 seconds for fast analysis
- Ollama responds within 60-120 seconds for detailed analysis
- Simple text output without JSON formatting
- Purple-themed UI with clear error messages

### Error Indicators:
- "LLaVA processing error" - Ollama not running
- "Analysis timed out" - Model taking too long
- "Failed to analyze test report" - API connection issues

## Contact Support

If issues persist:
1. Check all prerequisites are installed
2. Ensure sufficient RAM (8GB+ recommended)
3. Try with a simple test image first
4. Monitor system resources during analysis

## System Requirements

- **RAM**: 8GB+ (16GB recommended for LLaVA)
- **Storage**: 5GB+ free space for models
- **Network**: Stable internet for initial model download
- **OS**: Windows 10/11 with PowerShell 