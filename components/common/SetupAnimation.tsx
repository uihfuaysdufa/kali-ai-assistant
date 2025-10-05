import React, { useState, useEffect } from 'react';
import { KaliIcon } from '../../constants';
import { playSound } from '../../utils/audioUtils';

interface SetupAnimationProps {
  onFinished: () => void;
  speak: (text: string, options?: { onEnd?: () => void; isFeedback?: boolean; }) => void;
}

const messages = [
  " Initializing Kali AI Core...",
  " Welcome to Kali."
];

const SetupAnimation: React.FC<SetupAnimationProps> = ({ onFinished, speak }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [typedMessage, setTypedMessage] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (currentMessageIndex < messages.length) {
      const message = messages[currentMessageIndex];
      let charIndex = 0;
      setTypedMessage('');
      setShowCursor(true);

      const typingInterval = setInterval(() => {
        if (charIndex < message.length) {
          setTypedMessage(prev => prev + message.charAt(charIndex));
          playSound('type');
          charIndex++;
        } else {
          clearInterval(typingInterval);
          
          const handleSpeechEnd = () => {
            if (currentMessageIndex === messages.length - 1) {
              playSound('boot');
            }
            setTimeout(() => {
              setCurrentMessageIndex(prev => prev + 1);
            }, 1000); // Pause before next message
          };

          speak(message, { onEnd: handleSpeechEnd });

        }
      }, 50); // Typing speed

      return () => clearInterval(typingInterval);
    } else {
      setShowCursor(false);
      setTimeout(onFinished, 1200); // Wait a bit before fading out
    }
  }, [currentMessageIndex, onFinished, speak]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center animate-fade-in-scale">
        <KaliIcon className="w-24 h-24 text-cyan-300 mb-8" />
        <div className="font-mono text-lg text-cyan-200 h-8">
          <span className={showCursor ? 'typewriter-text' : ''}>
            {typedMessage}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SetupAnimation;