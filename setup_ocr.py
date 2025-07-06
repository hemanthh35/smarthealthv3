#!/usr/bin/env python3
"""
OCR Setup Script for Health AI
Installs and configures OCR dependencies for medical test report analysis
"""

import subprocess
import sys
import os
import platform

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def install_python_packages():
    """Install required Python packages"""
    packages = [
        "pytesseract==0.3.10",
        "Pillow==10.0.0", 
        "pdf2image==1.16.3",
        "rapidfuzz==3.4.0",
        "fastapi==0.104.1",
        "uvicorn==0.24.0",
        "python-multipart==0.0.6"
    ]
    
    for package in packages:
        if not run_command(f"pip install {package}", f"Installing {package}"):
            return False
    return True

def install_tesseract():
    """Install Tesseract OCR engine based on platform"""
    system = platform.system().lower()
    
    if system == "windows":
        print("🔄 Installing Tesseract for Windows...")
        print("📥 Please download Tesseract from: https://github.com/UB-Mannheim/tesseract/wiki")
        print("📁 Install to: C:\\Program Files\\Tesseract-OCR\\")
        print("🔧 Add to PATH: C:\\Program Files\\Tesseract-OCR\\")
        return True
        
    elif system == "linux":
        return run_command("sudo apt update && sudo apt install -y tesseract-ocr", "Installing Tesseract (Linux)")
        
    elif system == "darwin":  # macOS
        return run_command("brew install tesseract", "Installing Tesseract (macOS)")
        
    else:
        print(f"❌ Unsupported platform: {system}")
        return False

def install_pdf_tools():
    """Install PDF processing tools"""
    system = platform.system().lower()
    
    if system == "linux":
        return run_command("sudo apt install -y poppler-utils", "Installing PDF tools (Linux)")
    elif system == "darwin":  # macOS
        return run_command("brew install poppler", "Installing PDF tools (macOS)")
    elif system == "windows":
        print("📥 For Windows, PDF tools are included with pdf2image")
        return True
    else:
        print(f"❌ Unsupported platform: {system}")
        return False

def test_installation():
    """Test if OCR is working properly"""
    print("🧪 Testing OCR installation...")
    
    try:
        import pytesseract
        from PIL import Image
        import io
        
        # Create a simple test image with text
        from PIL import Image, ImageDraw, ImageFont
        
        # Create a test image
        img = Image.new('RGB', (300, 100), color='white')
        draw = ImageDraw.Draw(img)
        
        # Try to use a default font
        try:
            font = ImageFont.load_default()
        except:
            font = None
            
        draw.text((10, 10), "Test OCR Text", fill='black', font=font)
        
        # Test OCR
        text = pytesseract.image_to_string(img)
        
        if "Test" in text or "OCR" in text or "Text" in text:
            print("✅ OCR test successful!")
            return True
        else:
            print(f"⚠️ OCR test returned: '{text}'")
            return False
            
    except Exception as e:
        print(f"❌ OCR test failed: {e}")
        return False

def create_env_file():
    """Create .env file with OCR configuration"""
    env_content = """# OCR Configuration
USE_OCR=true
OCR_API_URL=http://localhost:8000

# Tesseract Configuration (Windows)
TESSERACT_PATH=C:\\Program Files\\Tesseract-OCR\\tesseract.exe

# FastAPI Configuration
FASTAPI_HOST=0.0.0.0
FASTAPI_PORT=8000
"""
    
    try:
        with open('.env.local', 'w') as f:
            f.write(env_content)
        print("✅ Created .env.local with OCR configuration")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env.local: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up OCR for Health AI...")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ required")
        return False
    
    print(f"✅ Python {sys.version} detected")
    
    # Install Python packages
    if not install_python_packages():
        print("❌ Failed to install Python packages")
        return False
    
    # Install Tesseract
    if not install_tesseract():
        print("❌ Failed to install Tesseract")
        return False
    
    # Install PDF tools
    if not install_pdf_tools():
        print("❌ Failed to install PDF tools")
        return False
    
    # Test installation
    if not test_installation():
        print("❌ OCR test failed")
        return False
    
    # Create environment file
    create_env_file()
    
    print("\n🎉 OCR setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the OCR API: python api/ocr_analyzer.py")
    print("2. Set USE_OCR=true in your environment")
    print("3. Upload scanned medical reports for analysis")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 