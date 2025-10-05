import React from 'react';
import ChatInterface from '../common/ChatInterface';
import PanelWindow from '../common/PanelWindow';

interface CodeCreatorPanelProps {
  spokenText?: string;
  clearSpokenText?: () => void;
  speak?: (text: string, options?: { isFeedback?: boolean; onEnd?: () => void; }) => void;
  isSpeaking?: boolean;
  onClose: () => void;
  onMaximizeChange: (isMaximized: boolean) => void;
}

const CodeCreatorPanel: React.FC<CodeCreatorPanelProps> = ({ onClose, onMaximizeChange, ...props }) => {
  const systemInstruction = "You are a specialized AI code generator within the Kali assistant. Your purpose is to write scripts and code snippets for Kali Linux tools and tasks. The user will describe a goal, and you will provide the complete, ready-to-use code. Prioritize Python, Bash, and PowerShell, but use the best language for the job. Explain the code's function clearly. Format all code using Markdown code blocks.";
  const welcomeMessage = "Code Creator initialized. Describe the script or tool you need for Kali Linux, and I will generate the code.";
  const placeholder = "e.g., 'Create a python script to scan for open ports on a host'...";

  return (
    <PanelWindow title="Code Creator" onClose={onClose} onMaximizeChange={onMaximizeChange}>
      <ChatInterface
        panelId="code_creator"
        systemInstruction={systemInstruction}
        welcomeMessage={welcomeMessage}
        placeholder={placeholder}
        uiVisible={true}
        {...props}
      />
    </PanelWindow>
  );
};

export default CodeCreatorPanel;