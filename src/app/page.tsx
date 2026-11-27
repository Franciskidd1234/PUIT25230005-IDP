"use client";

import { useState, useRef, ChangeEvent, DragEvent, FormEvent } from "react";

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    isMe: boolean;
    className: string;
    confidence: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSampleClick = async (src: string, name: string) => {
    const res = await fetch(src);
    const blob = await res.blob();
    const file = new File([blob], name, { type: blob.type });
    handleFileSelect(file);
  };
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 16 * 1024 * 1024) {
      setError("File size must be less than 16MB");
      return;
    }
    setSelectedFile(file);
    setError(null);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        const r = data.result;
        const det = r.images?.[0]?.results?.[0];
        const isMe = det?.name === "me" || det?.name === "you" || det?.class === 0;
        const confidence = det?.confidence || 0;
        const className = det?.name || "unknown";
        setResult({ isMe, className, confidence });
      } else {
        setError(data.error || "Detection failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔍 Image Detection</h1>
        <p style={styles.subtitle}>Upload an image to detect if it's you</p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
          {[1,2,3,4,5].map((n) => (
            <img
              key={n}
              src={`/samples/${n}.jpg`}
              alt={`Sample ${n}`}
              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, cursor: "pointer", border: "2px solid #667eea" }}
              onClick={() => handleSampleClick(`/samples/${n}.jpg`, `sample${n}.jpg`)}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              ...styles.uploadArea,
              borderColor: selectedFile ? "#28a745" : "#667eea",
              background: selectedFile ? "#f0fff4" : "#fafbff",
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              style={styles.fileInput}
            />
            <div style={styles.uploadIcon}>📷</div>
            <p style={styles.uploadText}>
              {selectedFile ? "Image selected ✓" : "Click or drag & drop an image"}
            </p>
            <p style={styles.uploadHint}>
              Supports: PNG, JPG, JPEG, GIF, WebP (Max 16MB)
            </p>
          </div>

          {preview && (
            <div style={styles.previewContainer}>
              <img src={preview} alt="Preview" style={styles.previewImage} />
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedFile || loading}
            style={{
              ...styles.btn,
              opacity: selectedFile && !loading ? 1 : 0.6,
              cursor: selectedFile && !loading ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Analyzing..." : "Detect"}
          </button>
        </form>

        {error && <div style={styles.error}>{error}</div>}

        {result && (
          <div
            style={{
              ...styles.result,
              background: result.isMe ? "#d4edda" : "#f8d7da",
              borderColor: result.isMe ? "#c3e6cb" : "#f5c6cb",
            }}
          >
            <div
              style={{
                ...styles.resultLabel,
                color: result.isMe ? "#155724" : "#721c24",
              }}
            >
              {result.isMe ? "✅ This is YOU!" : "❌ This is NOT you"}
            </div>
            <div
              style={{
                ...styles.resultDetails,
                color: result.isMe ? "#155724" : "#721c24",
              }}
            >
              <strong>Detected:</strong> {result.className}<br />
              <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
            </div>
            <div style={styles.confidenceBar}>
              <div
                style={{
                  ...styles.confidenceFill,
                  width: `${result.confidence * 100}%`,
                  background: result.isMe
                    ? "linear-gradient(90deg, #28a745, #20c997)"
                    : "linear-gradient(90deg, #dc3545, #fd7e14)",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "40px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "10px",
    fontSize: "28px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
    fontSize: "14px",
  },
  uploadArea: {
    border: "3px dashed #667eea",
    borderRadius: "15px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s",
    position: "relative",
  },
  fileInput: {
    position: "absolute",
    inset: 0,
    opacity: 0,
    cursor: "pointer",
  },
  uploadIcon: {
    fontSize: "48px",
    marginBottom: "15px",
  },
  uploadText: {
    color: "#667eea",
    fontWeight: 500,
  },
  uploadHint: {
    color: "#999",
    fontSize: "12px",
    marginTop: "8px",
  },
  previewContainer: {
    marginTop: "20px",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  btn: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    marginTop: "20px",
    transition: "all 0.3s",
  },
  error: {
    background: "#fff3cd",
    border: "1px solid #ffeaa7",
    color: "#856404",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "20px",
    textAlign: "center",
  },
  result: {
    marginTop: "25px",
    padding: "20px",
    borderRadius: "15px",
    borderWidth: "1px",
    borderStyle: "solid",
    animation: "slideIn 0.3s ease",
  },
  resultLabel: {
    fontSize: "18px",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "10px",
  },
  resultDetails: {
    textAlign: "center",
    fontSize: "14px",
    lineHeight: 1.6,
  },
  confidenceBar: {
    background: "#e9ecef",
    borderRadius: "10px",
    height: "8px",
    marginTop: "15px",
    overflow: "hidden",
  },
  confidenceFill: {
    height: "100%",
    borderRadius: "10px",
    transition: "width 0.5s ease",
  },
};