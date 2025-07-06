"""
OCR Processor for Medical Test Reports
Extracts text from scanned PDFs and images using Tesseract OCR
"""

import pytesseract
from PIL import Image
import io
import base64
from pdf2image import convert_from_bytes
import re
from typing import List, Dict, Optional
from .test_reference_data import get_test_reference, analyze_test_value

# Configure Tesseract path for Windows (adjust as needed)
try:
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
except:
    pass  # Use system default

class OCRProcessor:
    def __init__(self):
        self.extracted_text = ""
        self.test_results = []
        
    def process_pdf(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF using OCR"""
        try:
            print("📄 Converting PDF pages to images...")
            images = convert_from_bytes(pdf_bytes)
            full_text = ""
            
            for i, img in enumerate(images):
                print(f"🔍 OCR on page {i + 1}...")
                text = pytesseract.image_to_string(img)
                full_text += text + "\n"
            
            self.extracted_text = full_text
            return full_text
            
        except Exception as e:
            print(f"❌ Error processing PDF: {e}")
            raise
    
    def process_image(self, image_bytes: bytes) -> str:
        """Extract text from image using OCR"""
        try:
            print("🔍 Processing image with OCR...")
            image = Image.open(io.BytesIO(image_bytes))
            text = pytesseract.image_to_string(image)
            
            self.extracted_text = text
            return text
            
        except Exception as e:
            print(f"❌ Error processing image: {e}")
            raise
    
    def extract_test_values(self, text: str = None) -> List[Dict]:
        """Extract test values from OCR text"""
        if text is None:
            text = self.extracted_text
            
        if not text:
            return []
        
        # Common patterns for test results
        patterns = [
            # Pattern: Test Name: Value Unit (Reference Range)
            r'([A-Za-z\s]+):\s*([\d\.]+)\s*([A-Za-z\/%]+)\s*\(([\d\.\-\<\>]+)\)',
            # Pattern: Test Name Value Unit Reference
            r'([A-Za-z\s]+)\s+([\d\.]+)\s+([A-Za-z\/%]+)\s+([\d\.\-\<\>]+)',
            # Pattern: Test Name = Value Unit
            r'([A-Za-z\s]+)\s*=\s*([\d\.]+)\s*([A-Za-z\/%]+)',
            # Pattern: Test Name Value Unit
            r'([A-Za-z\s]+)\s+([\d\.]+)\s+([A-Za-z\/%]+)',
        ]
        
        extracted_tests = []
        
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                test_name = match[0].strip()
                value_str = match[1].strip()
                unit = match[2].strip()
                reference = match[3].strip() if len(match) > 3 else ""
                
                # Clean up test name
                test_name = self.clean_test_name(test_name)
                
                # Try to parse value
                try:
                    value = float(value_str)
                except ValueError:
                    continue
                
                # Analyze the test value
                analysis = analyze_test_value(test_name, value, unit)
                if analysis:
                    extracted_tests.append({
                        "parameter": analysis["test_name"],
                        "value": str(value),
                        "unit": analysis["unit"],
                        "reference": reference or analysis["normal_range"],
                        "status": analysis["status"],
                        "category": analysis["category"]
                    })
        
        self.test_results = extracted_tests
        return extracted_tests
    
    def clean_test_name(self, name: str) -> str:
        """Clean and normalize test name"""
        # Remove common prefixes/suffixes
        name = re.sub(r'^(test|lab|result|value):?\s*', '', name, flags=re.IGNORECASE)
        name = re.sub(r'\s*[:=]\s*$', '', name)
        
        # Normalize common abbreviations
        name_mappings = {
            'hgb': 'hemoglobin',
            'hct': 'hematocrit',
            'wbc': 'white_blood_cells',
            'rbc': 'red_blood_cells',
            'plt': 'platelets',
            'hdl': 'hdl_cholesterol',
            'ldl': 'ldl_cholesterol',
            'trig': 'triglycerides',
            'chol': 'total_cholesterol',
            'glu': 'glucose',
            'creat': 'creatinine',
            'na': 'sodium',
            'k': 'potassium',
            'cl': 'chloride',
            'ca': 'calcium',
            'alt': 'alt',
            'ast': 'ast',
            'alp': 'alkaline_phosphatase',
            'bil': 'total_bilirubin',
            'alb': 'albumin',
            'crp': 'c_reactive_protein',
            'esr': 'esr',
            'trop': 'troponin',
            'bnp': 'bnp'
        }
        
        normalized = name.lower().replace(" ", "_").replace("-", "_")
        
        for abbr, full_name in name_mappings.items():
            if abbr in normalized:
                return full_name
        
        return normalized
    
    def generate_analysis_summary(self) -> Dict:
        """Generate analysis summary from extracted test results"""
        if not self.test_results:
            return {
                "analysis": "No test results were extracted from the document.",
                "recommendations": ["Please ensure the document is clearly scanned and contains readable test values."],
                "severity": "normal",
                "confidence": 0
            }
        
        # Count abnormal results
        abnormal_count = sum(1 for test in self.test_results if test["status"] != "normal")
        total_count = len(self.test_results)
        
        # Determine severity
        if abnormal_count == 0:
            severity = "normal"
            analysis = "All test results are within normal ranges. Your health markers appear to be in good condition."
        elif abnormal_count <= 2:
            severity = "mild"
            analysis = f"Most test results are normal with {abnormal_count} slightly elevated values. This may indicate minor health considerations."
        elif abnormal_count <= 4:
            severity = "moderate"
            analysis = f"Several test results ({abnormal_count} out of {total_count}) are outside normal ranges. This suggests the need for medical attention."
        else:
            severity = "severe"
            analysis = f"Multiple test results ({abnormal_count} out of {total_count}) are significantly abnormal. Immediate medical consultation is recommended."
        
        # Generate recommendations
        recommendations = self.generate_recommendations(severity, self.test_results)
        
        # Calculate confidence based on extraction quality
        confidence = min(95, max(60, 100 - (abnormal_count * 5)))
        
        return {
            "analysis": analysis,
            "recommendations": recommendations,
            "severity": severity,
            "confidence": confidence
        }
    
    def generate_recommendations(self, severity: str, test_results: List[Dict]) -> List[str]:
        """Generate health recommendations based on test results"""
        recommendations = []
        
        if severity == "normal":
            recommendations.extend([
                "Continue with regular health monitoring",
                "Maintain a balanced diet and exercise routine",
                "Schedule annual physical examination",
                "Keep up with preventive health measures"
            ])
        elif severity == "mild":
            recommendations.extend([
                "Monitor the elevated values over time",
                "Consider lifestyle modifications",
                "Schedule follow-up testing in 3-6 months",
                "Consult with healthcare provider for guidance"
            ])
        elif severity == "moderate":
            recommendations.extend([
                "Schedule appointment with healthcare provider",
                "Consider dietary and lifestyle changes",
                "Monitor symptoms and report any changes",
                "Follow up with recommended testing"
            ])
        else:  # severe
            recommendations.extend([
                "Seek immediate medical attention",
                "Contact healthcare provider urgently",
                "Follow all medical recommendations strictly",
                "Monitor for any worsening symptoms"
            ])
        
        # Add specific recommendations based on test categories
        categories = set(test["category"] for test in test_results)
        
        if "Lipid Panel" in categories:
            recommendations.append("Consider heart-healthy diet and exercise")
        if "Thyroid" in categories:
            recommendations.append("Monitor energy levels and weight changes")
        if "Liver" in categories:
            recommendations.append("Avoid alcohol and monitor liver function")
        if "Kidney" in categories:
            recommendations.append("Stay hydrated and monitor kidney function")
        
        return recommendations[:6]  # Limit to 6 recommendations
    
    def process_document(self, file_bytes: bytes, file_type: str) -> Dict:
        """Complete document processing pipeline"""
        try:
            # Extract text using OCR
            if file_type.lower() == "pdf":
                text = self.process_pdf(file_bytes)
            else:
                text = self.process_image(file_bytes)
            
            # Extract test values
            test_results = self.extract_test_values(text)
            
            # Generate analysis
            analysis_summary = self.generate_analysis_summary()
            
            return {
                "success": True,
                "extracted_text": text[:1000] + "..." if len(text) > 1000 else text,
                "test_results": test_results,
                "analysis": analysis_summary["analysis"],
                "recommendations": analysis_summary["recommendations"],
                "severity": analysis_summary["severity"],
                "confidence": analysis_summary["confidence"],
                "total_tests": len(test_results),
                "abnormal_tests": sum(1 for test in test_results if test["status"] != "normal")
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "extracted_text": "",
                "test_results": [],
                "analysis": "Failed to process document",
                "recommendations": ["Please ensure the document is clearly scanned and try again."],
                "severity": "normal",
                "confidence": 0
            } 