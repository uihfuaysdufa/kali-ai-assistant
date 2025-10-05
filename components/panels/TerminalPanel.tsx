import React from 'react';
import ChatInterface from '../common/ChatInterface';
import PanelWindow from '../common/PanelWindow';

interface TerminalPanelProps {
  spokenText?: string;
  clearSpokenText?: () => void;
  speak?: (text: string, options?: { isFeedback?: boolean; onEnd?: () => void; }) => void;
  isSpeaking?: boolean;
  onClose: () => void;
  onMaximizeChange: (isMaximized: boolean) => void;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ onClose, onMaximizeChange, ...props }) => {
  const systemInstruction = "You are a code analysis and debugging assistant within the Kali AI. The user will provide code snippets or describe problems. Analyze the code, identify potential issues, suggest improvements, and explain concepts clearly. Format your responses using Markdown for code blocks, e.g., ```python\nprint('hello')\n```.";
  const welcomeMessage = "Terminal interface active. Provide me with code or a programming problem to analyze.";
  const placeholder = "Paste code or describe your problem here...";

  return (
    <PanelWindow title="Code Checker" onClose={onClose} onMaximizeChange={onMaximizeChange}>
      <ChatInterface
        panelId="terminal"
        systemInstruction={systemInstruction}
        welcomeMessage={welcomeMessage}
        placeholder={placeholder}
        uiVisible={true}
        {...props}
      />
    </PanelWindow>
  );
};

export default TerminalPanel;