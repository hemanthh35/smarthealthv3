"""
FastAPI OCR Analyzer for Medical Test Reports
Complete OCR pipeline with test value extraction and analysis
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import uvicorn
from typing import Dict, Any
import sys
import os

# Add the lib directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lib'))

try:
    from ocr_processor import OCRProcessor
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback for development
    OCRProcessor = None

app = FastAPI(
    title="SmartHealth OCR Analyzer",
    description="OCR-powered medical test report analyzer",
    version="1.0.0"
)

# Initialize OCR processor
ocr_processor = OCRProcessor() if OCRProcessor else None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "SmartHealth OCR Analyzer",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/supported-tests")
async def get_supported_tests():
    """Get list of supported test types"""
    try:
        # Return basic test types since we removed the reference data import
        basic_tests = [
            "Hemoglobin", "Hematocrit", "White Blood Cells", "Red Blood Cells",
            "Platelets", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides",
            "Total Cholesterol", "Glucose", "Creatinine", "Sodium", "Potassium",
            "Chloride", "Calcium", "ALT", "AST", "Alkaline Phosphatase",
            "Total Bilirubin", "Albumin", "C-Reactive Protein", "ESR",
            "Troponin", "BNP"
        ]
        return {
            "supported_tests": basic_tests,
            "total_tests": len(basic_tests)
        }
    except Exception as e:
        return {
            "supported_tests": [],
            "total_tests": 0,
            "error": str(e)
        }

@app.post("/analyze-report")
async def analyze_medical_report(file: UploadFile = File(...)):
    """
    Analyze medical test report using OCR
    
    Upload a scanned PDF or image file containing medical test results.
    The system will:
    1. Extract text using OCR
    2. Identify test values and parameters
    3. Compare against normal ranges
    4. Generate analysis and recommendations
    """
    
    if not ocr_processor:
        raise HTTPException(
            status_code=500,
            detail="OCR processor not available. Please install required dependencies."
        )
    
    # Validate file type
    allowed_types = [
        "application/pdf",
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/tiff",
        "image/bmp"
    ]
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Supported types: {allowed_types}"
        )
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Determine file type
        file_type = "pdf" if file.content_type == "application/pdf" else "image"
        
        # Process document with OCR
        result = ocr_processor.process_document(file_content, file_type)
        
        if not result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to process document: {result.get('error', 'Unknown error')}"
            )
        
        # Prepare response
        response = {
            "success": True,
            "filename": file.filename,
            "file_type": file_type,
            "analysis": result.get("llava_analysis", {}),
            "extracted_text_preview": result.get("extracted_text", "")[:500] + "..." if len(result.get("extracted_text", "")) > 500 else result.get("extracted_text", "")
        }
        
        return JSONResponse(content=response)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/extract-text-only")
async def extract_text_only(file: UploadFile = File(...)):
    """
    Extract text from document without analysis
    Useful for debugging OCR results
    """
    
    if not ocr_processor:
        raise HTTPException(
            status_code=500,
            detail="OCR processor not available"
        )
    
    try:
        file_content = await file.read()
        file_type = "pdf" if file.content_type == "application/pdf" else "image"
        
        if file_type == "pdf":
            text = ocr_processor.process_pdf(file_content)
        else:
            text = ocr_processor.process_image(file_content)
        
        return {
            "success": True,
            "filename": file.filename,
            "extracted_text": text,
            "text_length": len(text)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract text: {str(e)}"
        )

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "ocr_available": ocr_processor is not None,
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "ocr_analyzer:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 