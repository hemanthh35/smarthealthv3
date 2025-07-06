"""
Comprehensive medical test reference database
Contains test names, normal ranges, units, and categories
"""

TEST_REFERENCE_DATA = {
    # Complete Blood Count (CBC)
    "hemoglobin": {
        "name": "Hemoglobin",
        "category": "CBC",
        "unit": "g/dL",
        "normal_range": "12.0-15.5",
        "gender_specific": {
            "male": "13.5-17.5",
            "female": "12.0-15.5"
        },
        "critical_low": "<7.0",
        "critical_high": ">20.0"
    },
    "hgb": {
        "name": "Hemoglobin",
        "category": "CBC",
        "unit": "g/dL",
        "normal_range": "12.0-15.5",
        "aliases": ["hemoglobin", "hgb"]
    },
    "wbc": {
        "name": "White Blood Cells",
        "category": "CBC",
        "unit": "K/μL",
        "normal_range": "4.5-11.0",
        "critical_low": "<2.0",
        "critical_high": ">30.0"
    },
    "white_blood_cells": {
        "name": "White Blood Cells",
        "category": "CBC",
        "unit": "K/μL",
        "normal_range": "4.5-11.0",
        "aliases": ["wbc", "leukocytes"]
    },
    "rbc": {
        "name": "Red Blood Cells",
        "category": "CBC",
        "unit": "M/μL",
        "normal_range": "4.0-5.2",
        "critical_low": "<2.5",
        "critical_high": ">6.5"
    },
    "red_blood_cells": {
        "name": "Red Blood Cells",
        "category": "CBC",
        "unit": "M/μL",
        "normal_range": "4.0-5.2",
        "aliases": ["rbc", "erythrocytes"]
    },
    "platelets": {
        "name": "Platelets",
        "category": "CBC",
        "unit": "K/μL",
        "normal_range": "150-450",
        "critical_low": "<50",
        "critical_high": ">1000"
    },
    "plt": {
        "name": "Platelets",
        "category": "CBC",
        "unit": "K/μL",
        "normal_range": "150-450",
        "aliases": ["platelets", "thrombocytes"]
    },
    "hematocrit": {
        "name": "Hematocrit",
        "category": "CBC",
        "unit": "%",
        "normal_range": "36-46",
        "gender_specific": {
            "male": "41-50",
            "female": "36-46"
        }
    },
    "hct": {
        "name": "Hematocrit",
        "category": "CBC",
        "unit": "%",
        "normal_range": "36-46",
        "aliases": ["hematocrit", "packed_cell_volume"]
    },

    # Lipid Panel
    "total_cholesterol": {
        "name": "Total Cholesterol",
        "category": "Lipid Panel",
        "unit": "mg/dL",
        "normal_range": "<200",
        "borderline": "200-239",
        "high": "≥240"
    },
    "hdl": {
        "name": "HDL Cholesterol",
        "category": "Lipid Panel",
        "unit": "mg/dL",
        "normal_range": ">40",
        "optimal": "≥60",
        "low": "<40"
    },
    "hdl_cholesterol": {
        "name": "HDL Cholesterol",
        "category": "Lipid Panel",
        "unit": "mg/dL",
        "normal_range": ">40",
        "aliases": ["hdl", "good_cholesterol"]
    },
    "ldl": {
        "name": "LDL Cholesterol",
        "category": "Lipid Panel",
        "unit": "mg/dL",
        "normal_range": "<100",
        "borderline": "130-159",
        "high": "160-189",
        "very_high": "≥190"
    },
    "ldl_cholesterol": {
        "name": "LDL Cholesterol",
        "category": "Lipid Panel",
        "unit": "mg/dL",
        "normal_range": "<100",
        "aliases": ["ldl", "bad_cholesterol"]
    },
    "triglycerides": {
        "name": "Triglycerides",
        "category": "Lipid Panel",
        "unit": "mg/dL",
        "normal_range": "<150",
        "borderline": "150-199",
        "high": "200-499",
        "very_high": "≥500"
    },

    # Thyroid Function Tests
    "tsh": {
        "name": "TSH",
        "category": "Thyroid",
        "unit": "μIU/mL",
        "normal_range": "0.4-4.0",
        "critical_low": "<0.1",
        "critical_high": ">10.0"
    },
    "thyroid_stimulating_hormone": {
        "name": "TSH",
        "category": "Thyroid",
        "unit": "μIU/mL",
        "normal_range": "0.4-4.0",
        "aliases": ["tsh", "thyrotropin"]
    },
    "free_t4": {
        "name": "Free T4",
        "category": "Thyroid",
        "unit": "ng/dL",
        "normal_range": "0.8-1.8",
        "critical_low": "<0.4",
        "critical_high": ">3.0"
    },
    "free_t3": {
        "name": "Free T3",
        "category": "Thyroid",
        "unit": "pg/mL",
        "normal_range": "2.3-4.2",
        "critical_low": "<1.5",
        "critical_high": ">6.0"
    },

    # Comprehensive Metabolic Panel (CMP)
    "glucose": {
        "name": "Glucose",
        "category": "CMP",
        "unit": "mg/dL",
        "normal_range": "70-100",
        "prediabetes": "100-125",
        "diabetes": "≥126",
        "critical_low": "<50",
        "critical_high": ">400"
    },
    "creatinine": {
        "name": "Creatinine",
        "category": "CMP",
        "unit": "mg/dL",
        "normal_range": "0.6-1.2",
        "gender_specific": {
            "male": "0.7-1.3",
            "female": "0.6-1.1"
        }
    },
    "bun": {
        "name": "BUN",
        "category": "CMP",
        "unit": "mg/dL",
        "normal_range": "7-20",
        "critical_low": "<5",
        "critical_high": ">50"
    },
    "blood_urea_nitrogen": {
        "name": "BUN",
        "category": "CMP",
        "unit": "mg/dL",
        "normal_range": "7-20",
        "aliases": ["bun", "urea"]
    },
    "sodium": {
        "name": "Sodium",
        "category": "CMP",
        "unit": "mEq/L",
        "normal_range": "135-145",
        "critical_low": "<120",
        "critical_high": ">160"
    },
    "na": {
        "name": "Sodium",
        "category": "CMP",
        "unit": "mEq/L",
        "normal_range": "135-145",
        "aliases": ["sodium", "na"]
    },
    "potassium": {
        "name": "Potassium",
        "category": "CMP",
        "unit": "mEq/L",
        "normal_range": "3.5-5.0",
        "critical_low": "<3.0",
        "critical_high": ">6.5"
    },
    "k": {
        "name": "Potassium",
        "category": "CMP",
        "unit": "mEq/L",
        "normal_range": "3.5-5.0",
        "aliases": ["potassium", "k"]
    },
    "chloride": {
        "name": "Chloride",
        "category": "CMP",
        "unit": "mEq/L",
        "normal_range": "96-106",
        "critical_low": "<80",
        "critical_high": ">120"
    },
    "cl": {
        "name": "Chloride",
        "category": "CMP",
        "unit": "mEq/L",
        "normal_range": "96-106",
        "aliases": ["chloride", "cl"]
    },
    "co2": {
        "name": "CO2",
        "category": "CMP",
        "unit": "mEq/L",
        "normal_range": "22-28",
        "critical_low": "<15",
        "critical_high": ">40"
    },
    "bicarbonate": {
        "name": "CO2",
        "category": "CMP",
        "unit": "mEq/L",
        "normal_range": "22-28",
        "aliases": ["co2", "bicarbonate", "hco3"]
    },
    "calcium": {
        "name": "Calcium",
        "category": "CMP",
        "unit": "mg/dL",
        "normal_range": "8.5-10.5",
        "critical_low": "<7.0",
        "critical_high": ">12.0"
    },
    "ca": {
        "name": "Calcium",
        "category": "CMP",
        "unit": "mg/dL",
        "normal_range": "8.5-10.5",
        "aliases": ["calcium", "ca"]
    },

    # Liver Function Tests
    "alt": {
        "name": "ALT",
        "category": "Liver",
        "unit": "U/L",
        "normal_range": "7-55",
        "gender_specific": {
            "male": "7-55",
            "female": "7-45"
        }
    },
    "alanine_aminotransferase": {
        "name": "ALT",
        "category": "Liver",
        "unit": "U/L",
        "normal_range": "7-55",
        "aliases": ["alt", "sgot"]
    },
    "ast": {
        "name": "AST",
        "category": "Liver",
        "unit": "U/L",
        "normal_range": "8-48",
        "gender_specific": {
            "male": "8-48",
            "female": "8-43"
        }
    },
    "aspartate_aminotransferase": {
        "name": "AST",
        "category": "Liver",
        "unit": "U/L",
        "normal_range": "8-48",
        "aliases": ["ast", "sgpt"]
    },
    "alkaline_phosphatase": {
        "name": "Alkaline Phosphatase",
        "category": "Liver",
        "unit": "U/L",
        "normal_range": "44-147",
        "gender_specific": {
            "male": "44-147",
            "female": "38-126"
        }
    },
    "alp": {
        "name": "Alkaline Phosphatase",
        "category": "Liver",
        "unit": "U/L",
        "normal_range": "44-147",
        "aliases": ["alkaline_phosphatase", "alp"]
    },
    "bilirubin_total": {
        "name": "Total Bilirubin",
        "category": "Liver",
        "unit": "mg/dL",
        "normal_range": "0.3-1.2",
        "critical_high": ">3.0"
    },
    "total_bilirubin": {
        "name": "Total Bilirubin",
        "category": "Liver",
        "unit": "mg/dL",
        "normal_range": "0.3-1.2",
        "aliases": ["bilirubin_total", "total_bilirubin"]
    },
    "albumin": {
        "name": "Albumin",
        "category": "Liver",
        "unit": "g/dL",
        "normal_range": "3.4-5.4",
        "critical_low": "<2.0",
        "critical_high": ">6.0"
    },

    # Kidney Function Tests
    "egfr": {
        "name": "eGFR",
        "category": "Kidney",
        "unit": "mL/min/1.73m²",
        "normal_range": "≥90",
        "stage_1": "90-120",
        "stage_2": "60-89",
        "stage_3a": "45-59",
        "stage_3b": "30-44",
        "stage_4": "15-29",
        "stage_5": "<15"
    },
    "estimated_glomerular_filtration_rate": {
        "name": "eGFR",
        "category": "Kidney",
        "unit": "mL/min/1.73m²",
        "normal_range": "≥90",
        "aliases": ["egfr", "gfr"]
    },

    # Inflammatory Markers
    "c_reactive_protein": {
        "name": "C-Reactive Protein",
        "category": "Inflammatory",
        "unit": "mg/L",
        "normal_range": "<3.0",
        "elevated": "3.0-10.0",
        "high": ">10.0"
    },
    "crp": {
        "name": "C-Reactive Protein",
        "category": "Inflammatory",
        "unit": "mg/L",
        "normal_range": "<3.0",
        "aliases": ["c_reactive_protein", "crp"]
    },
    "esr": {
        "name": "ESR",
        "category": "Inflammatory",
        "unit": "mm/hr",
        "normal_range": "0-20",
        "gender_specific": {
            "male": "0-15",
            "female": "0-20"
        }
    },
    "erythrocyte_sedimentation_rate": {
        "name": "ESR",
        "category": "Inflammatory",
        "unit": "mm/hr",
        "normal_range": "0-20",
        "aliases": ["esr", "sed_rate"]
    },

    # Cardiac Markers
    "troponin": {
        "name": "Troponin",
        "category": "Cardiac",
        "unit": "ng/mL",
        "normal_range": "<0.04",
        "elevated": "0.04-0.1",
        "high": ">0.1"
    },
    "troponin_i": {
        "name": "Troponin I",
        "category": "Cardiac",
        "unit": "ng/mL",
        "normal_range": "<0.04",
        "aliases": ["troponin", "troponin_i"]
    },
    "bnp": {
        "name": "BNP",
        "category": "Cardiac",
        "unit": "pg/mL",
        "normal_range": "<100",
        "elevated": "100-400",
        "high": ">400"
    },
    "brain_natriuretic_peptide": {
        "name": "BNP",
        "category": "Cardiac",
        "unit": "pg/mL",
        "normal_range": "<100",
        "aliases": ["bnp", "brain_natriuretic_peptide"]
    }
}

def get_test_reference(test_name: str):
    """Get test reference data by name with fuzzy matching"""
    from rapidfuzz import process
    
    # Normalize test name for matching
    normalized_name = test_name.lower().replace(" ", "_").replace("-", "_")
    
    # Get all test names
    test_names = list(TEST_REFERENCE_DATA.keys())
    
    # Find best match
    match, score, _ = process.extractOne(normalized_name, test_names)
    
    if score >= 80:  # 80% similarity threshold
        return TEST_REFERENCE_DATA[match]
    
    return None

def get_all_test_names():
    """Get all available test names"""
    return list(TEST_REFERENCE_DATA.keys())

def get_tests_by_category(category: str):
    """Get all tests in a specific category"""
    return {name: data for name, data in TEST_REFERENCE_DATA.items() 
            if data.get("category", "").lower() == category.lower()}

def analyze_test_value(test_name: str, value: float, unit: str = None):
    """Analyze a test value against reference ranges"""
    reference = get_test_reference(test_name)
    if not reference:
        return None
    
    # Normalize units
    if unit and unit != reference["unit"]:
        # Add unit conversion logic here if needed
        pass
    
    normal_range = reference["normal_range"]
    
    # Parse range and determine status
    if "<" in normal_range:
        threshold = float(normal_range.replace("<", ""))
        status = "normal" if value < threshold else "high"
    elif ">" in normal_range:
        threshold = float(normal_range.replace(">", ""))
        status = "normal" if value > threshold else "low"
    elif "-" in normal_range:
        low, high = map(float, normal_range.split("-"))
        if value < low:
            status = "low"
        elif value > high:
            status = "high"
        else:
            status = "normal"
    else:
        status = "normal"  # Default
    
    return {
        "test_name": reference["name"],
        "value": value,
        "unit": reference["unit"],
        "normal_range": normal_range,
        "status": status,
        "category": reference["category"]
    } 