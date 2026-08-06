import React, { useState } from 'react';
import { Mic, Play, Pause, RotateCcw } from 'lucide-react';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("Tap the microphone and ask a question...");
  
  const handleListen = () => {
    setIsListening(true);
    setTranscript("Listening...");
    setTimeout(() => {
      setIsListening(false);
      setTranscript("When should I take Metformin?");
      setTimeout(() => {
        setTranscript("You should take one tablet of Metformin after breakfast, and one after dinner.");
      }, 1500);
    }, 2000);
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
      <h2>Voice Assistant</h2>
      <p className="text-muted" style={{ marginBottom: '3rem' }}>Ask anything about your medicines in your language.</p>
      
      <div 
        className="glass" 
        style={{ 
          width: '200px', 
          height: '200px', 
          margin: '0 auto', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: isListening ? 'var(--color-primary)' : 'var(--color-surface)',
          color: isListening ? 'white' : 'var(--color-primary)',
          cursor: 'pointer',
          boxShadow: isListening ? '0 0 40px var(--color-primary-light)' : 'var(--shadow-glass)',
          transition: 'all 0.3s ease'
        }}
        onClick={handleListen}
      >
        <Mic size={80} />
      </div>

      <div className="glass animate-slide-up" style={{ marginTop: '4rem', padding: '2rem', borderRadius: 'var(--radius-lg)', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.5 }}>
          "{transcript}"
        </h3>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <button style={{ padding: '1rem', borderRadius: '50%', border: 'none', background: 'var(--color-surface)', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}><Play size={24} /></button>
        <button style={{ padding: '1rem', borderRadius: '50%', border: 'none', background: 'var(--color-surface)', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}><Pause size={24} /></button>
        <button style={{ padding: '1rem', borderRadius: '50%', border: 'none', background: 'var(--color-surface)', cursor: 'pointer', boxShadow: 'var(--shadow-md)' }}><RotateCcw size={24} /></button>
      </div>
    </div>
  );
};
export default VoiceAssistant;
