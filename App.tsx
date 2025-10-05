// FIX: Add type declarations for SpeechRecognition API to fix TypeScript errors.
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResult[];
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition {
  continuous: boolean;
  lang: string;
  interimResults: boolean;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: { new(): SpeechRecognition };
    webkitSpeechRecognition: { new(): SpeechRecognition };
  }
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PanelType } from './types';
import Taskbar from './components/Taskbar';
import HomePanel from './components/panels/HomePanel';
import CodeCreatorPanel from './components/panels/WeatherPanel';
import KaliPanel from './components/panels/KaliPanel';
import TerminalPanel from './components/panels/TerminalPanel';
import SetupAnimation from './components/common/SetupAnimation';
import RecognitionFeedback from './components/common/RecognitionFeedback';
import { playSound } from './utils/audioUtils';

const App: React.FC = () => {
  const [activePanel, setActivePanel] = useState<PanelType>('HOME');
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [showSetup, setShowSetup] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionStatus, setRecognitionStatus] = useState('');
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const [isPanelMaximized, setIsPanelMaximized] = useState(false);
  
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const maleVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const showRecognitionFeedback = useCallback((message: string, duration: number = 5000) => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    setRecognitionStatus(message);
    if (duration !== Infinity) {
      feedbackTimerRef.current = window.setTimeout(() => {
        setRecognitionStatus('');
      }, duration);
    }
  }, []);

  const speak = useCallback((text: string, options: { isFeedback?: boolean, onEnd?: () => void } = {}) => {
    const { isFeedback = false, onEnd } = options;
    if (!text || typeof text !== 'string') {
        if (!isFeedback) setIsSpeaking(false);
        onEnd?.();
        return;
    }
    
    const cleanText = isFeedback ? text : text.replace(/```[\s\S]*?```/g, 'Code block displayed.');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (maleVoiceRef.current) {
      utterance.voice = maleVoiceRef.current;
    }
    
    const handleEnd = () => {
      if (!isFeedback) setIsSpeaking(false);
      onEnd?.();
    };

    if (!isFeedback) {
      utterance.onstart = () => setIsSpeaking(true);
    }
    utterance.onend = handleEnd;
    utterance.onerror = handleEnd;
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1][0];
      const transcript = lastResult.transcript.trim();
      const confidence = lastResult.confidence;
      const CONFIDENCE_THRESHOLD = 0.7;

      if (pendingCommand) {
        setPendingCommand(null);
        setRecognitionStatus(''); // Clear the sticky prompt

        if (transcript.toLowerCase() === 'yes') {
          setSpokenText(pendingCommand);
          showRecognitionFeedback("Command confirmed.", 2000);
        } else {
          // Assume it's a new command if confidence is high enough
          if (confidence >= CONFIDENCE_THRESHOLD) {
            setSpokenText(transcript);
            showRecognitionFeedback("Okay, new command received.", 2000);
          } else {
            showRecognitionFeedback("Confirmation cancelled. Please try your command again.", 3000);
          }
        }
        return;
      }

      if (confidence >= CONFIDENCE_THRESHOLD) {
        setSpokenText(transcript);
      } else {
        setPendingCommand(transcript);
        const feedbackMessage = `I'm not sure. Did you say: "${transcript}"? Click the mic and say 'yes' to confirm, or just state your new command.`;
        speak(feedbackMessage, { isFeedback: true });
        showRecognitionFeedback(feedbackMessage, Infinity);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
       if (pendingCommand) {
        setPendingCommand(null);
        setRecognitionStatus('');
      }
      let errorMessage = "Sorry, a recognition error occurred.";
      if (event.error === 'no-speech') {
        errorMessage = "I didn't hear anything. Please try again.";
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = "Microphone access is disabled. Please enable it in your browser settings.";
      }
      showRecognitionFeedback(errorMessage);
      setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    speechRecognitionRef.current = recognition;

    const setupVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        maleVoiceRef.current = voices.find(voice => 
          voice.lang.startsWith('en') && voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      }
    };
    
    // Voices may load asynchronously
    window.speechSynthesis.onvoiceschanged = setupVoice;
    setupVoice();

    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };

  }, [showRecognitionFeedback, speak, pendingCommand]);

  const toggleListening = useCallback(() => {
    const recognition = speechRecognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      // onend handler will set isListening to false
    } else {
      if (!pendingCommand) {
        // Only clear previous text if it's a brand new command, not a confirmation response.
        setSpokenText('');
      }
      recognition.start();
      setIsListening(true);
    }
  }, [isListening, pendingCommand]);
  

  const clearSpokenText = () => {
    setSpokenText('');
  };

  const handleClosePanel = () => {
    playSound('toggleOff');
    setActivePanel('HOME');
    setIsPanelMaximized(false);
  };

  const handleMaximizeChange = (isMaximized: boolean) => {
    setIsPanelMaximized(isMaximized);
  };

  const renderPanel = () => {
    const chatProps = { 
      spokenText, 
      clearSpokenText, 
      speak,
      isSpeaking,
    };
    switch (activePanel) {
      case 'HOME':
        return <HomePanel {...chatProps} />;
      case 'CODE_CREATOR':
        return <CodeCreatorPanel {...chatProps} onClose={handleClosePanel} onMaximizeChange={handleMaximizeChange} />;
      case 'KALI':
        return <KaliPanel {...chatProps} onClose={handleClosePanel} onMaximizeChange={handleMaximizeChange} />;
      case 'TERMINAL':
        return <TerminalPanel {...chatProps} onClose={handleClosePanel} onMaximizeChange={handleMaximizeChange} />;
      default:
        return <HomePanel {...chatProps} />;
    }
  };
  
  if (showSetup) {
    return <SetupAnimation onFinished={() => setShowSetup(false)} speak={speak} />;
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <main className="relative z-10 h-screen flex items-center justify-center">
        {renderPanel()}
      </main>
      <RecognitionFeedback message={recognitionStatus} />
      {!isPanelMaximized && (
        <Taskbar 
          activePanel={activePanel} 
          setActivePanel={setActivePanel} 
          isListening={isListening}
          toggleListening={toggleListening}
        />
      )}
    </div>
  );
};

export default App;
