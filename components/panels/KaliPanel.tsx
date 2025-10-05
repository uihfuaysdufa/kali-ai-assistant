import React from 'react';
import ChatInterface from '../common/ChatInterface';
import PanelWindow from '../common/PanelWindow';

interface KaliPanelProps {
  spokenText?: string;
  clearSpokenText?: () => void;
  speak?: (text: string, options?: { isFeedback?: boolean; onEnd?: () => void; }) => void;
  isSpeaking?: boolean;
  onClose: () => void;
  onMaximizeChange: (isMaximized: boolean) => void;
}

const KaliPanel: React.FC<KaliPanelProps> = ({ onClose, onMaximizeChange, ...props }) => {
  const systemInstruction = "You are Kali, an expert AI assistant specializing in Kali Linux, ethical hacking, cybersecurity, and general programming. Provide clear, concise, and helpful information. Format code snippets and commands appropriately using Markdown, for example: ```bash\nls -la\n```.";
  const welcomeMessage = "Kali online. I am an expert in Kali Linux and cybersecurity. How may I assist you?";
  const placeholder = "Ask about a Kali tool, command, or concept...";

  return (
    <PanelWindow title="Kali Assistant" onClose={onClose} onMaximizeChange={onMaximizeChange}>
      <ChatInterface
        panelId="kali"
        systemInstruction={systemInstruction}
        welcomeMessage={welcomeMessage}
        placeholder={placeholder}
        uiVisible={true}
        {...props}
      />
    </PanelWindow>
  );
};

export default KaliPanel;