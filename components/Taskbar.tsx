import React, { useState, useEffect } from 'react';
import type { PanelType } from '../types';
import { CodeCreatorIcon, KaliIcon, TerminalIcon, MicrophoneIcon } from '../constants';
import { playSound } from '../utils/audioUtils';

interface TaskbarProps {
  activePanel: PanelType;
  setActivePanel: (panel: PanelType) => void;
  isListening: boolean;
  toggleListening: () => void;
}

const NavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <div className="relative group flex flex-col items-center z-10">
    <button
      onClick={() => {
        playSound('click');
        onClick();
      }}
      className={`p-3 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out group-hover:bg-cyan-900/50 ${
        isActive ? 'bg-cyan-800/60 text-cyan-200' : 'text-cyan-400'
      }`}
      aria-label={label}
    >
      {icon}
    </button>
    <div className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-gray-900 text-cyan-200 text-xs rounded-md border border-cyan-800 shadow-lg whitespace-nowrap">
      {label}
    </div>
  </div>
);

const panelButtons: { id: PanelType; icon: React.ReactNode; label: string }[] = [
  { id: 'CODE_CREATOR', icon: <CodeCreatorIcon className="w-6 h-6" />, label: 'Code Creator' },
  { id: 'KALI', icon: <KaliIcon className="w-6 h-6" />, label: 'Kali Assistant' },
  { id: 'TERMINAL', icon: <TerminalIcon className="w-6 h-6" />, label: 'Code Checker' },
];

const Taskbar: React.FC<TaskbarProps> = ({ activePanel, setActivePanel, isListening, toggleListening }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleToggleListening = () => {
    playSound(isListening ? 'toggleOff' : 'toggleOn');
    toggleListening();
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-in-up opacity-0">
        <div className="flex items-center justify-center gap-4 h-16 bg-black/80 backdrop-blur-md border border-cyan-800 rounded-full px-4 shadow-lg shadow-cyan-900/50">
            
            <button onClick={() => { playSound('click'); setActivePanel('HOME'); }} className="p-2 rounded-full group" aria-label="Home">
                <KaliIcon className="w-8 h-8 text-cyan-300 group-hover:scale-105 transition-transform animate-pulse-logo" />
            </button>
            
            <div className="relative flex items-center p-1 bg-black/20 rounded-full">
              {panelButtons.map(button => (
                <NavButton
                  key={button.id}
                  icon={button.icon}
                  label={button.label}
                  isActive={activePanel === button.id}
                  onClick={() => setActivePanel(button.id)}
                />
              ))}
            </div>

            <div className="relative group">
                <button
                onClick={handleToggleListening}
                className={`p-3 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${isListening ? 'bg-red-500 text-white animate-pulse-mic' : 'text-cyan-400 hover:bg-cyan-900/50'}`}
                aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                <MicrophoneIcon className="w-6 h-6" />
                </button>
                <div className="absolute bottom-full mb-2 hidden group-hover:block px-2 py-1 bg-gray-900 text-cyan-200 text-xs rounded-md border border-cyan-800 shadow-lg whitespace-nowrap">
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                </div>
            </div>
            
            <div className="text-cyan-300 text-sm font-mono tabular-nums">
                {formatTime(time)}
            </div>
        </div>
    </div>
  );
};

export default Taskbar;