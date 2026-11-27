# Image Detection Web App

A Flask web application for detecting if an uploaded image is "you" using a custom model deployed on Ultralytics.

## Features

- Upload images (drag & drop or click)
- Real-time detection using Ultralytics API
- Displays detection result with confidence score
- Responsive design
- Ready for Vercel deployment

## Setup

### Local Development

1. **Install Python 3.9+**

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**
   Copy `.env.example` to `.env` and add your credentials:
   ```env
   ULTRALYTICS_API_KEY=your_api_key_here
   ULTRALYTICS_ENDPOINT=https://api.ultralytics.com/v1/predict/your_model_id
   ```

5. **Run the application:**
   ```bash
   python main.py
   ```
   Open http://localhost:5000

### Getting Ultralytics Credentials

1. Go to [Ultralytics Hub](https://hub.ultralytics.com/)
2. Select your trained model
3. Copy the **API Key** and **Endpoint URL**
4. Add them to your `.env` file

## Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/image-detection.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add Environment Variables:
     - `ULTRALYTICS_API_KEY`
     - `ULTRALYTICS_ENDPOINT`
   - Deploy

## Project Structure

```
image-detection/
├── app/
│   ├── __init__.py
│   └── routes.py
├── templates/
│   └── index.html
├── static/
│   └── uploads/
├── main.py
├── requirements.txt
├── vercel.json
├── .env.example
├── .env
└── .gitignore
```

## API Response Format

The app expects the Ultralytics API to return JSON with:
```json
{
  "is_me": true,
  "class": "me",
  "confidence": 0.95
}
```

Or standard Ultralytics format:
```json
{
  "predictions": [
    {
      "class": "me",
      "confidence": 0.95
    }
  ]
}
```

## License

MIT