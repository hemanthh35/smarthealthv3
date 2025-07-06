import sys
import json
import joblib
import numpy as np

def load_model_and_data():
    """Load the trained model and metadata"""
    try:
        # Load the trained model
        model = joblib.load('trained_model.pkl')
        
        # Load symptom names and mapping
        with open('symptom_names.json', 'r') as f:
            symptom_names = json.load(f)
        
        with open('symptom_mapping.json', 'r') as f:
            symptom_mapping = json.load(f)
        
        with open('diseases.json', 'r') as f:
            diseases = json.load(f)
        
        return model, symptom_names, symptom_mapping, diseases
    except FileNotFoundError as e:
        print(json.dumps({'error': f'Model files not found: {e}'}))
        sys.exit(1)

def predict_diseases(symptoms, model, symptom_names, symptom_mapping, diseases):
    """Make predictions based on selected symptoms"""
    try:
        # Create feature vector (all zeros initially)
        features = np.zeros(len(symptom_names))
        
        # Set selected symptoms to 1
        for symptom in symptoms:
            if symptom in symptom_mapping:
                features[symptom_mapping[symptom]] = 1
        
        # Make prediction
        prediction_proba = model.predict_proba([features])[0]
        
        # Get top 5 predictions with probabilities
        top_indices = np.argsort(prediction_proba)[::-1][:5]
        
        results = []
        for idx in top_indices:
            if prediction_proba[idx] > 0.01:  # Only include if probability > 1%
                results.append({
                    'condition': diseases[idx],
                    'probability': round(prediction_proba[idx] * 100, 1),
                    'severity': 'moderate',  # Default severity
                    'description': f'Possible {diseases[idx]} based on symptoms',
                    'symptoms': symptoms,
                    'recommendations': [
                        'Consult with a healthcare provider for proper diagnosis',
                        'Monitor symptoms for any changes',
                        'Keep track of symptom severity and duration'
                    ],
                    'whenToSeekCare': 'If symptoms persist or worsen, seek medical attention'
                })
        
        return results
    except Exception as e:
        print(json.dumps({'error': f'Prediction failed: {e}'}))
        sys.exit(1)

def main():
    """Main function to handle prediction requests"""
    try:
        # Load model and data
        model, symptom_names, symptom_mapping, diseases = load_model_and_data()
        
        # Read input from stdin
        input_data = sys.stdin.read()
        symptoms = json.loads(input_data)
        
        # Make predictions
        results = predict_diseases(symptoms, model, symptom_names, symptom_mapping, diseases)
        
        # Output results as JSON
        print(json.dumps(results))
        
    except json.JSONDecodeError:
        print(json.dumps({'error': 'Invalid JSON input'}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({'error': f'Unexpected error: {e}'}))
        sys.exit(1)

if __name__ == "__main__":
    main() 