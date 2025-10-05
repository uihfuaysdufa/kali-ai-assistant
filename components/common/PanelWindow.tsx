import React, { useState, useEffect } from 'react';
import { CloseIcon, MaximizeIcon, MinimizeIcon, RestoreIcon } from '../../constants';
import { playSound } from '../../utils/audioUtils';

interface PanelWindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMaximizeChange: (isMaximized: boolean) => void;
}

const ControlButton: React.FC<{ onClick: () => void; ariaLabel: string; children: React.ReactNode; }> = ({ onClick, ariaLabel, children }) => (
  <button onClick={onClick} className="p-2 text-cyan-400 hover:bg-cyan-900/50 rounded-full transition-colors" aria-label={ariaLabel}>
    {children}
  </button>
);

const PanelWindow: React.FC<PanelWindowProps> = ({ title, children, onClose, onMaximizeChange }) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    onMaximizeChange(isMaximized);
  }, [isMaximized, onMaximizeChange]);

  const triggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); // Duration matches the fade-out animation
  };

  const handleMinimize = () => {
    playSound('toggleOff');
    triggerClose();
  };

  const handleToggleMaximize = () => {
    playSound('click');
    setIsMaximized(!isMaximized);
  };
  
  const handleClose = () => {
    playSound('toggleOff');
    triggerClose();
  };

  const containerClasses = isMaximized
    ? 'w-full h-full'
    : 'w-[90%] h-[90%] max-w-7xl rounded-lg shadow-2xl shadow-cyan-900/30';
  
  const animationClass = isClosing ? 'animate-fade-out' : 'animate-fade-in';

  return (
    <div className={`flex flex-col bg-black/70 backdrop-blur-md border border-cyan-800 transition-all duration-300 ease-in-out ${containerClasses} ${animationClass}`}>
      <header className="flex items-center justify-between h-10 px-4 bg-black/30 border-b border-cyan-800 flex-shrink-0">
        <h2 className="font-mono text-cyan-200">{title}</h2>
        <div className="flex items-center space-x-2">
          <ControlButton onClick={handleMinimize} ariaLabel="Minimize">
            <MinimizeIcon className="w-4 h-4" />
          </ControlButton>
          <ControlButton onClick={handleToggleMaximize} ariaLabel={isMaximized ? 'Restore Down' : 'Maximize'}>
            {isMaximized ? <RestoreIcon className="w-4 h-4" /> : <MaximizeIcon className="w-4 h-4" />}
          </ControlButton>
          <ControlButton onClick={handleClose} ariaLabel="Close">
            <CloseIcon className="w-4 h-4" />
          </ControlButton>
        </div>
      </header>
      <div className="flex-grow min-h-0">
        {children}
      </div>
    </div>
  );
};

export default PanelWindow;