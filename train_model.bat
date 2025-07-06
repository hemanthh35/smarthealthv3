@echo off
echo Training AI Model for Symptoms Checker...
echo.

python train_model.py

echo.
echo Training complete! Check the generated files:
echo - trained_model.pkl
echo - symptom_names.json
echo - diseases.json
echo - symptom_mapping.json
echo - symptom_categories.json
echo.
pause 