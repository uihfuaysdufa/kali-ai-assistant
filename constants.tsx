import React from 'react';

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

export const CodeCreatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
);

export const KaliIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.43,3.34C15.65,2.4,13.3,2.5,11.3,3.7c-2.3,1.4-3.4,4.2-2.4,6.7c0.9,2.2,3.1,3.5,5.4,3.1 c2.6-0.4,4.4-2.6,4.4-5.2c0-0.6-0.1-1.2-0.3-1.8C18.13,4.74,17.83,3.94,17.43,3.34z M4.03,8.94c0.4-2.7,2.6-4.8,5.2-5.2 c3.1-0.4,6,1.7,6.4,4.8c0.4,3.1-1.7,6-4.8,6.4c-3.1,0.4-6-1.7-6.4-4.8C4.33,10.04,4.13,9.44,4.03,8.94z M12.83,13.74 c-3.8,0.3-6.8,3.2-6.8,6.9c0,3.8,3.1,6.9,6.9,6.9c3.8,0,6.9-3.1,6.9-6.9C19.73,16.84,16.73,14.04,12.83,13.74z" />
  </svg>
);

export const TerminalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4C2.89 4 2 4.9 2 6v12c0 1.1.89 2 2 2h16c1.11 0 2-.9 2-2V6c0-1.1-.89-2-2-2M9.3 16.3l-4-4 4-4L10.7 9.7 8.4 12l2.3 2.3-1.4 1.4zm5.4 0l-1.4-1.4L15.6 12l-2.3-2.3L14.7 8.3l4 4-4 4z" />
  </svg>
);

export const MicrophoneIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z" />
    </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
);

export const MaximizeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 3h18v2H3V3zm0 16h18v2H3v-2z" transform="rotate(-45 12 12)" />
        <path d="M3 3h18v18H3z" fill="none"/>
    </svg>
);

export const MinimizeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13H5v-2h14v2z" />
    </svg>
);

export const RestoreIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 5H5v14h14V5zm-2 12H7V7h10v10z" />
    </svg>
);