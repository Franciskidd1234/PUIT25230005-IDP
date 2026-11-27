import os
import base64
import requests
from flask import Blueprint, render_template, request, jsonify, current_app
from werkzeug.utils import secure_filename

bp = Blueprint('main', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, webp'}), 400
    
    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        with open(filepath, 'rb') as img_file:
            img_data = base64.b64encode(img_file.read()).decode('utf-8')
        
        api_key = os.getenv('ULTRALYTICS_API_KEY')
        endpoint = os.getenv('ULTRALYTICS_ENDPOINT')
        
        if not api_key or not endpoint:
            return jsonify({'error': 'API configuration missing'}), 500
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'image': img_data,
            'confidence': 0.5
        }
        
        response = requests.post(endpoint, headers=headers, json=payload, timeout=30)
        
        os.remove(filepath)
        
        if response.status_code == 200:
            result = response.json()
            return jsonify({'success': True, 'result': result})
        else:
            return jsonify({'error': f'Model API error: {response.text}'}), 500
            
    except requests.Timeout:
        return jsonify({'error': 'Request timeout'}), 500
    except requests.RequestException as e:
        return jsonify({'error': f'Request failed: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500