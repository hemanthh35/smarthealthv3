import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json

def load_and_preprocess_data():
    """Load and preprocess the disease-symptoms dataset"""
    print("Loading dataset...")
    
    # Load the CSV file
    df = pd.read_csv('Disease and symptoms dataset.csv')
    
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {len(df.columns)}")
    
    # The first column is the disease name
    diseases = df.iloc[:, 0]
    symptoms = df.iloc[:, 1:]  # All other columns are symptoms
    
    print(f"Number of diseases: {len(diseases.unique())}")
    print(f"Number of symptoms: {len(symptoms.columns)}")
    
    # Convert symptoms to numeric (some might be strings)
    symptoms = symptoms.astype(int)
    
    return diseases, symptoms

def train_model(diseases, symptoms):
    """Train a Random Forest model on the disease-symptoms data"""
    print("Training model...")
    
    # Use regular train_test_split instead of stratified due to some classes having only 1 sample
    X_train, X_test, y_train, y_test = train_test_split(
        symptoms, diseases, test_size=0.2, random_state=42
    )
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Train Random Forest classifier
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model accuracy: {accuracy:.3f}")
    print("\nClassification Report (top 10 classes):")
    
    # Get unique classes in test set
    unique_classes = np.unique(y_test)
    if len(unique_classes) > 10:
        print(f"Showing report for top 10 classes (out of {len(unique_classes)} total classes)")
    
    print(classification_report(y_test, y_pred, target_names=unique_classes[:10]))
    
    return model, symptoms.columns.tolist()

def save_model_and_data(model, symptom_names, diseases):
    """Save the trained model and metadata"""
    print("Saving model and data...")
    
    # Save the model
    joblib.dump(model, 'trained_model.pkl')
    
    # Save symptom names
    with open('symptom_names.json', 'w') as f:
        json.dump(symptom_names, f)
    
    # Save unique diseases
    unique_diseases = diseases.unique().tolist()
    with open('diseases.json', 'w') as f:
        json.dump(unique_diseases, f)
    
    # Create a mapping of symptoms to their indices
    symptom_mapping = {name: i for i, name in enumerate(symptom_names)}
    with open('symptom_mapping.json', 'w') as f:
        json.dump(symptom_mapping, f)
    
    print("Files saved:")
    print("- trained_model.pkl (trained model)")
    print("- symptom_names.json (list of all symptoms)")
    print("- diseases.json (list of all diseases)")
    print("- symptom_mapping.json (symptom name to index mapping)")

def create_symptom_categories(symptom_names):
    """Create categorized symptoms for the frontend"""
    categories = {
        'Mental Health': [],
        'Respiratory': [],
        'Cardiovascular': [],
        'Digestive': [],
        'Neurological': [],
        'Musculoskeletal': [],
        'Skin': [],
        'Eyes': [],
        'Ears': [],
        'General': []
    }
    
    # Categorize symptoms based on keywords
    for symptom in symptom_names:
        symptom_lower = symptom.lower()
        
        if any(word in symptom_lower for word in ['anxiety', 'depression', 'panic', 'psychotic', 'mental', 'emotional']):
            categories['Mental Health'].append(symptom)
        elif any(word in symptom_lower for word in ['breath', 'cough', 'throat', 'nasal', 'lung', 'respiratory']):
            categories['Respiratory'].append(symptom)
        elif any(word in symptom_lower for word in ['heart', 'chest', 'palpitation', 'cardiac']):
            categories['Cardiovascular'].append(symptom)
        elif any(word in symptom_lower for word in ['stomach', 'abdominal', 'nausea', 'vomiting', 'diarrhea', 'digestive']):
            categories['Digestive'].append(symptom)
        elif any(word in symptom_lower for word in ['headache', 'dizziness', 'seizure', 'memory', 'brain']):
            categories['Neurological'].append(symptom)
        elif any(word in symptom_lower for word in ['pain', 'muscle', 'joint', 'back', 'arm', 'leg', 'shoulder']):
            categories['Musculoskeletal'].append(symptom)
        elif any(word in symptom_lower for word in ['skin', 'rash', 'acne', 'lesion', 'mole']):
            categories['Skin'].append(symptom)
        elif any(word in symptom_lower for word in ['eye', 'vision', 'blind']):
            categories['Eyes'].append(symptom)
        elif any(word in symptom_lower for word in ['ear', 'hearing']):
            categories['Ears'].append(symptom)
        else:
            categories['General'].append(symptom)
    
    # Save categorized symptoms
    with open('symptom_categories.json', 'w') as f:
        json.dump(categories, f)
    
    print("Symptom categories saved to symptom_categories.json")
    return categories

def main():
    """Main function to train the model"""
    print("=== Disease Symptoms Model Training ===")
    
    # Load and preprocess data
    diseases, symptoms = load_and_preprocess_data()
    
    # Train the model
    model, symptom_names = train_model(diseases, symptoms)
    
    # Save model and data
    save_model_and_data(model, symptom_names, diseases)
    
    # Create symptom categories
    categories = create_symptom_categories(symptom_names)
    
    print("\n=== Training Complete ===")
    print("Model is ready to be integrated into the symptoms checker!")
    
    # Print some statistics
    print(f"\nStatistics:")
    print(f"- Total diseases: {len(diseases.unique())}")
    print(f"- Total symptoms: {len(symptom_names)}")
    print(f"- Model accuracy: {accuracy_score(diseases, model.predict(symptoms)):.3f}")

if __name__ == "__main__":
    main() 