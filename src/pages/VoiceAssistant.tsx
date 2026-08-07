import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Square, Loader } from 'lucide-react';
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
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Map our simple language codes to BCP-47 tags for Speech API
  const languageMap: Record<string, string> = {
    en: 'en-US', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', mr: 'mr-IN',
    bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN',
    or: 'or-IN', ur: 'ur-IN', as: 'as-IN', sa: 'sa-IN', ks: 'ks-IN',
    ne: 'ne-NP', sd: 'sd-IN', kok: 'kok-IN', mni: 'mni-IN', mai: 'mai-IN',
    doi: 'doi-IN', brx: 'brx-IN', sat: 'sat-IN'
  };

  // Provide mock responses in various languages to simulate translation
  const mockResponses: Record<string, string> = {
    en: "I am a local mock assistant. You said: ",
    hi: "मैं एक स्थानीय सहायक हूँ। आपने कहा: ",
    te: "నేను స్థానిక సహాయకుడిని. మీరు అన్నారు: ",
    ta: "நான் ஒரு உள்ளூர் உதவியாளர். நீங்கள் கூறினீர்கள்: ",
    mr: "मी एक स्थानिक सहाय्यक आहे. आपण म्हणालात: ",
    bn: "আমি একটি স্থানীয় সহকারী। আপনি বলেছেন: ",
    gu: "હું એક સ્થાનિક સહાયક છું. તમે કહ્યું: ",
    kn: "ನಾನು ಸ್ಥಳೀಯ ಸಹಾಯಕ. ನೀವು ಹೇಳಿದ್ದೀರಿ: ",
    ml: "ഞാൻ ഒരു പ്രാദേശിക സഹായിയാണ്. നിങ്ങൾ പറഞ്ഞു: ",
    ur: "میں ایک مقامی معاون ہوں۔ آپ نے کہا: "
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Use the mapped locale or default to en-US
      recognitionRef.current.lang = languageMap[language] || 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setTranscript("Listening...");
      };

      recognitionRef.current.onresult = (event: any) => {
        let text = "";
        try {
          text = event.results[0][0].transcript;
        } catch (err) {
          console.error("Could not parse transcript", err);
        }
        
        if (!text || text.trim() === "") {
          text = "(No speech detected)";
        }
        
        setTranscript(text);
        handleGeminiResponse(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          setTranscript("No speech was detected. Please try again.");
        } else {
          setTranscript("Microphone error: " + event.error);
        }
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

  const handleGeminiResponse = async (userText: string) => {
    setIsThinking(true);
    
    // Simulate AI delay
    setTimeout(() => {
      setIsThinking(false);
      // Select the mock response prefix based on the current language, default to English
      const prefix = mockResponses[language] || mockResponses['en'];
      const reply = prefix + userText;
      setTranscript(reply);
      speak(reply);
    }, 1500);
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Use the mapped locale or default to en-US
    utterance.lang = languageMap[language] || 'en-US';

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const toggleListen = () => {
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
