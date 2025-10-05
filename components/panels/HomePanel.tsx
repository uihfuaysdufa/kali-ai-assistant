import React from 'react';
import ChatInterface from '../common/ChatInterface';
import { HomeIcon } from '../../constants';

interface HomePanelProps {
  spokenText?: string;
  clearSpokenText?: () => void;
  speak?: (text: string, options?: { isFeedback?: boolean; onEnd?: () => void; }) => void;
  isSpeaking?: boolean;
}

const HomePanel: React.FC<HomePanelProps> = (props) => {
  const systemInstruction = "You are Kali, a helpful and versatile AI assistant inspired by Jarvis. Be friendly, slightly witty, and highly capable. Your goal is to assist the user with a wide range of tasks, from general knowledge questions to creative ideas.";
  const welcomeMessage = "Greetings. I am Kali, your personal AI assistant. How can I be of service today?";
  const placeholder = "Ask me anything...";

  return (
    <div className="h-full flex items-center justify-center">
        <HomeIcon className="w-48 h-48 text-cyan-200/10" />
        <ChatInterface
            panelId="home"
            systemInstruction={systemInstruction}
            welcomeMessage={welcomeMessage}
            placeholder={placeholder}
            {...props}
        />
    </div>
  );
};

export default HomePanel;