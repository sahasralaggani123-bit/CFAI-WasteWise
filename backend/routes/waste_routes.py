from flask import Blueprint, jsonify, request
from models.waste_classifier import WasteClassifier
waste_bp=Blueprint('waste',__name__)
@waste_bp.post('/classify')
def classify():
    file = next(iter(request.files.values()), None)
    return jsonify(success=True,prediction=WasteClassifier().predict(file.filename if file else 'demo-plastic.jpg'))
