import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Square, Key, Loader } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

// TypeScript declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceAssistant = () => {
  const { t, language } = useAppContext();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState("Tap the microphone and ask a question...");
  
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const isEnvKeyValid = envKey && envKey !== 'paste_your_google_gemini_api_key_here';
  
  const [apiKey, setApiKey] = useState(isEnvKeyValid ? envKey : (localStorage.getItem('gemini_api_key') || ''));
  const [showApiKeyInput, setShowApiKeyInput] = useState(!isEnvKeyValid && !localStorage.getItem('gemini_api_key'));
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      if (language === 'hi') recognitionRef.current.lang = 'hi-IN';
      else if (language === 'te') recognitionRef.current.lang = 'te-IN';
      else recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("Listening...");
      };

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleGeminiResponse(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setTranscript("Sorry, I couldn't hear that. Please try again.");
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      setTranscript("Your browser does not support voice recognition.");
    }

    synthRef.current = window.speechSynthesis;
    
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [language]);

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  const handleGeminiResponse = async (userText: string) => {
    setIsThinking(true);
    
    // Simulate AI delay
    setTimeout(() => {
      setIsThinking(false);
      const reply = "I am a local mock assistant. You said: " + userText;
      setTranscript(reply);
      speak(reply);
    }, 1500);
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else utterance.lang = 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const toggleListen = () => {
    if (showApiKeyInput) {
      setShowApiKeyInput(false); // Skip API key for mock
    }

    // Unlock audio engine on first user interaction
    if (synthRef.current) {
      synthRef.current.speak(new SpeechSynthesisUtterance(''));
    }
    
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      synthRef.current?.cancel();
      recognitionRef.current?.start();
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
      <h2>{t('nav_voice') || 'Voice Assistant'} (Gemini AI)</h2>
      <p className="text-muted" style={{ marginBottom: '3rem' }}>Ask anything about your medicines in your language.</p>
      
      {showApiKeyInput ? (
        <div className="glass animate-slide-up" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Key size={20} /> Enter Gemini API Key
          </h3>
          <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Since the Vercel environment variable isn't set, please paste your Gemini API Key here to test it. It will be saved securely in your browser.
          </p>
          <form onSubmit={saveApiKey} style={{ display: 'flex', gap: '1rem' }}>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..." 
              style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-text)' }}
              required
            />
            <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--color-primary)', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
              Save
            </button>
          </form>
        </div>
      ) : (
        <>
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
            onClick={toggleListen}
          >
            <Mic size={80} style={{ animation: isListening ? 'pulse 1.5s infinite' : 'none' }} />
          </div>

          <div className="glass animate-slide-up" style={{ marginTop: '4rem', padding: '2rem', borderRadius: 'var(--radius-lg)', minHeight: '150px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {isThinking ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                <Loader className="spin" size={24} />
                <span>Thinking...</span>
              </div>
            ) : (
              <h3 style={{ fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.5 }}>
                "{transcript}"
              </h3>
            )}
          </div>

          {isSpeaking && (
            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', color: 'var(--color-primary)' }}>
              <Volume2 size={24} style={{ animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontWeight: 600 }}>Speaking...</span>
              <button onClick={stopSpeaking} style={{ padding: '0.5rem', borderRadius: '50%', border: 'none', background: 'var(--color-danger)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Square size={16} />
              </button>
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default VoiceAssistant;
