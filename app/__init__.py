from flask import Flask
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    app.config['UPLOAD_FOLDER'] = 'static/uploads'
    
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    from app.routes import bp
    app.register_blueprint(bp)
    
    return app