import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Square, Key, Loader } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { GoogleGenerativeAI } from '@google/generative-ai';

// TypeScript declaration for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const languageNames: Record<string, string> = {
  en: 'English', hi: 'Hindi', te: 'Telugu', ta: 'Tamil', mr: 'Marathi',
  bn: 'Bengali', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi',
  or: 'Odia', ur: 'Urdu', as: 'Assamese', sa: 'Sanskrit', ks: 'Kashmiri',
  ne: 'Nepali', sd: 'Sindhi', kok: 'Konkani', mni: 'Manipuri', mai: 'Maithili',
  doi: 'Dogri', brx: 'Bodo', sat: 'Santali'
};

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

  // Map our simple language codes to BCP-47 tags for Speech API
  const languageMap: Record<string, string> = {
    en: 'en-US', hi: 'hi-IN', te: 'te-IN', ta: 'ta-IN', mr: 'mr-IN',
    bn: 'bn-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN',
    or: 'or-IN', ur: 'ur-IN', as: 'as-IN', sa: 'sa-IN', ks: 'ks-IN',
    ne: 'ne-NP', sd: 'sd-IN', kok: 'kok-IN', mni: 'mni-IN', mai: 'mai-IN',
    doi: 'doi-IN', brx: 'brx-IN', sat: 'sat-IN'
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
          setTranscript("(No speech detected)");
          setIsListening(false);
          return;
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

  const saveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  const handleGeminiResponse = async (userText: string) => {
    if (!apiKey) {
      setTranscript("API Key is missing. Please enter your Gemini API Key.");
      setShowApiKeyInput(true);
      return;
    }

    setIsThinking(true);
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      const systemInstruction = `
You are MedGuide AI, a friendly, multilingual healthcare voice assistant that helps users understand medicines, diseases, prescriptions, and healthy lifestyle habits.

Core Behavior
- Always listen carefully to the user's voice input.
- Understand the user's intent.
- Reply naturally like a caring healthcare assistant.
- Keep responses short, conversational, and easy to understand.
- Speak the response aloud using Text-to-Speech.
- Never sound robotic.

Language Rules (Very Important)
The application has a Language Setting. The currently selected language is: ${languageNames[language] || 'English'}.
- Always use the language selected in Settings (${languageNames[language] || 'English'}) for both Understanding the user's speech AND Speaking the response.
- Never switch languages unless instructed.
- If the user mixes languages, answer primarily in ${languageNames[language] || 'English'} while keeping the conversation natural.

Voice Personality
- Speak like a friendly doctor or pharmacist.
- Be: Warm, Polite, Calm, Helpful, Encouraging.
- Avoid technical medical jargon unless requested.

Response Style
For every medical question:
1. Answer the user's question.
2. Explain it in simple words.
3. Give useful tips if applicable.
4. Warn the user only when necessary.
5. Recommend consulting a doctor for emergencies or severe symptoms.
Keep responses between 2-6 sentences.

Medicine Questions
When asked about a medicine, explain: What it is used for, How to take it, Common side effects, Food precautions, Storage instructions (if relevant).

Disease Questions
Explain: What it is, Common symptoms, Possible causes, Foods to eat, Foods to avoid, Basic precautions. Do not diagnose diseases.

Prescription Questions
Explain each medicine in simple language. Mention dosage only if clearly written. Explain when to take it. Never guess unclear text.

Healthy Lifestyle Questions
Answer questions about Diet, Exercise, Water intake, Sleep, Nutrition, Diabetes diet, Blood pressure diet, Weight management. Always encourage healthy habits.

Safety Rules
- Never claim to be a real doctor.
- Never provide dangerous or unsafe medical advice.
- If symptoms sound severe, politely advise the user to seek immediate medical care or contact emergency services.
- If you are unsure about something, say so honestly instead of guessing.

Goal
Your mission is to make users feel like they are talking to a caring healthcare assistant who listens carefully, responds naturally, and always speaks in ${languageNames[language] || 'English'}.`;

      let result;
      let lastError: any = null;
      
      const modelsToTry = [
        { name: 'gemini-1.5-flash', useSystemPrompt: true },
        { name: 'gemini-1.5-flash-latest', useSystemPrompt: true },
        { name: 'gemini-1.5-pro', useSystemPrompt: true },
        { name: 'gemini-1.0-pro', useSystemPrompt: false },
        { name: 'gemini-pro', useSystemPrompt: false }
      ];

      for (const modelConfig of modelsToTry) {
        try {
          const modelParams: any = { model: modelConfig.name };
          if (modelConfig.useSystemPrompt) {
            modelParams.systemInstruction = systemInstruction;
          }
          
          const model = genAI.getGenerativeModel(modelParams);
          
          if (modelConfig.useSystemPrompt) {
            result = await model.generateContent(userText);
          } else {
            const combinedPrompt = `System Instructions:\n${systemInstruction}\n\nUser Input:\n${userText}`;
            result = await model.generateContent(combinedPrompt);
          }
          
          // If we succeed, clear error and break
          lastError = null;
          break;
        } catch (err: any) {
          console.warn(`Model ${modelConfig.name} failed:`, err.message);
          lastError = err;
          // Continue to next model in the array
        }
      }

      if (lastError) {
        throw lastError;
      }

      const response = await result.response;
      const text = response.text();
      
      setTranscript(text);
      speak(text);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const errorMsg = error.message || "Unknown error";
      
      // If the error mentions API key, reset it so they can try again
      if (errorMsg.toLowerCase().includes('api key') || errorMsg.includes('403') || errorMsg.includes('400')) {
        setTranscript(`API Error: ${errorMsg}. Please check your key and try again.`);
        setTimeout(() => setShowApiKeyInput(true), 3000);
      } else {
        setTranscript(`Error: ${errorMsg}`);
      }
    } finally {
      setIsThinking(false);
    }
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
    if (showApiKeyInput) return; // Don't listen if API key needs to be input

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
            To power the MedGuide AI persona, please paste your Gemini API Key here. It will be saved securely in your browser's local storage.
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.5 }}>
                {transcript}
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
