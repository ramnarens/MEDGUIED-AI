import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Scanner = () => {
  const { setScannedImage } = useAppContext();
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSimulatedUpload = () => {
    setIsScanning(true);
    setTimeout(() => {
      navigate('/simplification');
    }, 2000);
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access denied or unavailable.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setScannedImage(dataUrl);
      }
    }
    stopCamera();
    handleSimulatedUpload();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setScannedImage(ev.target.result as string);
        }
        handleSimulatedUpload();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <h2>Scan Prescription</h2>
      <p className="text-muted" style={{ marginBottom: '2rem' }}>Upload or take a photo of the handwritten prescription.</p>
      
      <input 
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />

      {isCameraOpen ? (
        <div className="glass animate-fade-in" style={{ padding: '1rem', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
          <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#000', marginBottom: '1rem' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
            <button 
              onClick={stopCamera} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.5)', color: 'white', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
          <button onClick={takePhoto} style={{ padding: '1rem 2rem', background: 'var(--color-primary)', color: 'white', borderRadius: 'var(--radius-full)', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto', cursor: 'pointer' }}>
            <Camera size={20} /> Capture Photo
          </button>
        </div>
      ) : (
        <div 
          className="glass"
          style={{ 
            border: '2px dashed var(--color-border)', 
            padding: '4rem 2rem', 
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {isScanning ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '48px', height: '48px', border: '4px solid var(--color-primary-light)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <h3 style={{ marginTop: '1.5rem' }}>AI is reading your prescription...</h3>
              <p className="text-muted">Analyzing handwriting and extracting medicines</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div onClick={() => fileInputRef.current?.click()} style={{ cursor: 'pointer', marginBottom: '2rem' }}>
                <Upload size={48} style={{ color: 'var(--color-primary)', marginBottom: '1rem' }} />
                <h3>Drag & Drop</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>or click to browse from your device</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button onClick={(e) => { e.stopPropagation(); startCamera(); }} style={{ padding: '0.75rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--color-text)' }}>
                  <Camera size={20} /> Open Camera
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default Scanner;
