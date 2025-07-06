"""
Enhanced OCR Processor for Medical Test Reports
Extracts full text from scanned PDFs and images using Tesseract OCR
Then processes with LLaVA for text refinement and analysis
"""

import pytesseract
from PIL import Image
import io
import base64
from pdf2image import convert_from_bytes
import re
import json
import requests
from typing import Dict, Optional

# Configure Tesseract path for Windows
import os
tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
if os.path.exists(tesseract_path):
    pytesseract.pytesseract.tesseract_cmd = tesseract_path

class OCRProcessor:
    def __init__(self):
        self.tesseract_available = self._check_tesseract()
        self.ollama_url = "http://localhost:11434"
        
    def _check_tesseract(self) -> bool:
        """Check if Tesseract is available"""
        try:
            pytesseract.get_tesseract_version()
            return True
        except Exception:
            return False
    
    def clean_ocr_text(self, text: str) -> str:
        """Clean and refine OCR extracted text"""
        if not text:
            return ""
        
        # Remove excessive whitespace and normalize
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Fix common OCR errors
        text = re.sub(r'[|]', 'I', text)  # Fix vertical bars to I
        text = re.sub(r'[0]', 'O', text)  # Fix 0 to O in text contexts
        text = re.sub(r'[1]', 'l', text)  # Fix 1 to l in text contexts
        
        # Remove noise characters
        text = re.sub(r'[^\w\s\.\,\:\;\-\+\=\/\(\)\[\]\{\}\%\@\#\$\*\!\?\'\"]', '', text)
        
        # Fix spacing around punctuation
        text = re.sub(r'\s+([\.\,\:\;\-\+\=\/\(\)\[\]\{\}\%\@\#\$\*\!\?])\s*', r'\1', text)
        
        # Fix common medical abbreviations
        medical_fixes = {
            'Hgb': 'Hemoglobin',
            'Hct': 'Hematocrit',
            'WBC': 'White Blood Cells',
            'RBC': 'Red Blood Cells',
            'Plt': 'Platelets',
            'HDL': 'HDL Cholesterol',
            'LDL': 'LDL Cholesterol',
            'Trig': 'Triglycerides',
            'Chol': 'Total Cholesterol',
            'Glu': 'Glucose',
            'Creat': 'Creatinine',
            'Na': 'Sodium',
            'K': 'Potassium',
            'Cl': 'Chloride',
            'Ca': 'Calcium',
            'ALT': 'ALT',
            'AST': 'AST',
            'ALP': 'Alkaline Phosphatase',
            'Bil': 'Total Bilirubin',
            'Alb': 'Albumin',
            'CRP': 'C-Reactive Protein',
            'ESR': 'ESR',
            'Trop': 'Troponin',
            'BNP': 'BNP'
        }
        
        for abbr, full_name in medical_fixes.items():
            text = re.sub(rf'\b{abbr}\b', full_name, text, flags=re.IGNORECASE)
        
        return text.strip()
        
    def process_pdf(self, pdf_bytes: bytes) -> str:
        """Extract full text from PDF using OCR with enhanced processing"""
        if not self.tesseract_available:
            raise Exception("Tesseract OCR is not installed")
            
        try:
            images = convert_from_bytes(pdf_bytes)
            full_text = ""
            
            for i, img in enumerate(images):
                # Use enhanced OCR configuration for medical documents
                custom_config = '--oem 3 --psm 6'
                text = pytesseract.image_to_string(img, config=custom_config)
                full_text += text + "\n"
            
            # Clean and refine the extracted text
            cleaned_text = self.clean_ocr_text(full_text)
            return cleaned_text
            
        except Exception as e:
            raise Exception(f"PDF processing failed: {str(e)}")
    
    def process_image(self, image_bytes: bytes) -> str:
        """Extract full text from image using OCR with enhanced processing"""
        if not self.tesseract_available:
            raise Exception("Tesseract OCR is not installed")
            
        try:
            image = Image.open(io.BytesIO(image_bytes))
            
            # Use enhanced OCR configuration for medical documents
            custom_config = '--oem 3 --psm 6'
            text = pytesseract.image_to_string(image, config=custom_config)
            
            # Clean and refine the extracted text
            cleaned_text = self.clean_ocr_text(text)
            return cleaned_text
            
        except Exception as e:
            raise Exception(f"Image processing failed: {str(e)}")
    
    def process_with_llava(self, extracted_text: str) -> str:
        """Process extracted text with LLaVA for refinement and analysis, return only cleaned text"""
        try:
            # Check if Ollama is running
            try:
                test_response = requests.get(f"{self.ollama_url}/api/tags", timeout=5)
                if test_response.status_code != 200:
                    raise Exception("Ollama not responding")
            except Exception:
                # If Ollama is not available, return just OCR text
                return extracted_text
            
            # Prepare enhanced prompt for LLaVA
            prompt = f"""
You are a medical document analysis expert. Clean and correct the following OCR-extracted text from a medical test report. Fix OCR errors, improve readability, and output only the cleaned, corrected, and well-formatted text. Do not return any JSON or structured data, just the cleaned text.

Extracted OCR text:
{extracted_text}
"""
            
            # Call LLaVA via Ollama with increased timeout
            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": "llava",
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.1,
                        "top_p": 0.9,
                        "num_predict": 2048
                    }
                },
                timeout=180  # Increased timeout to 3 minutes
            )
            
            if response.status_code == 200:
                result = response.json()
                llava_response = result.get('response', '')
                # Return the response as plain text (strip markdown if present)
                cleaned = llava_response.strip()
                # Remove markdown code block if present
                if cleaned.startswith('```'):
                    cleaned = cleaned.strip('`').strip()
                return cleaned
            else:
                return extracted_text
        except Exception:
            return extracted_text

    def process_document(self, file_bytes: bytes, file_type: str) -> str:
        """Complete document processing pipeline: Enhanced OCR + LLaVA, returns only cleaned text"""
        try:
            # Check if Tesseract is available
            if not self.tesseract_available:
                return "Tesseract OCR is not installed."
            # Extract text using enhanced OCR
            if file_type.lower() == "pdf":
                extracted_text = self.process_pdf(file_bytes)
            else:
                extracted_text = self.process_image(file_bytes)
            # Process with enhanced LLaVA, return only cleaned text
            cleaned_text = self.process_with_llava(extracted_text)
            return cleaned_text
        except Exception as e:
            return f"Error: {str(e)}" 