# Image Detection Web App

A Next.js web application for detecting if an uploaded image is "you" using a custom model deployed on Ultralytics.

## Features

- Upload images (drag & drop or click)
- Real-time detection using Ultralytics API
- Displays detection result with confidence score
- Responsive design
- Ready for Vercel deployment

## Setup

### Local Development

1. **Install Node.js 18+**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env.local` and add your credentials:
   ```env
   ULTRALYTICS_API_KEY=your_api_key_here
   ULTRALYTICS_ENDPOINT=https://api.ultralytics.com/v1/predict/your_model_id
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

### Getting Ultralytics Credentials

1. Go to [Ultralytics Hub](https://hub.ultralytics.com/)
2. Select your trained model
3. Copy the **API Key** and **Endpoint URL**
4. Add them to your `.env.local` file

## Deployment to Vercel

1. **Push to GitHub** (already done)

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
├── src/
│   ├── app/
│   │   ├── api/detect/route.ts    # API endpoint
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Main page
│   │   └── globals.css            # Global styles
│   └── components/                # React components
├── public/                        # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
├── .env.example
├── .env.local
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