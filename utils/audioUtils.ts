// Sound effect utility using Web Audio API
let audioContext: AudioContext;
const getAudioContext = () => {
  if (!audioContext && (window.AudioContext || (window as any).webkitAudioContext)) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playSound = (type: 'click' | 'toggleOn' | 'toggleOff' | 'type' | 'boot') => {
  const context = getAudioContext();
  if (!context) return;

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  switch (type) {
    case 'click':
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.01);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, context.currentTime); // A4
      oscillator.start(context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.1);
      oscillator.stop(context.currentTime + 0.1);
      break;
    case 'toggleOn':
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.01);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(623.25, context.currentTime); // D#5
      oscillator.start(context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.1);
      oscillator.stop(context.currentTime + 0.1);
      break;
    case 'toggleOff':
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.01);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(349.23, context.currentTime); // F4
      oscillator.start(context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.1);
      oscillator.stop(context.currentTime + 0.1);
      break;
    case 'type':
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.01);
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1200, context.currentTime);
      oscillator.start(context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.05);
      oscillator.stop(context.currentTime + 0.05);
      break;
    case 'boot':
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.01);
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(800, context.currentTime + 0.3);
      oscillator.start(context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.4);
      oscillator.stop(context.currentTime + 0.4);
      break;
  }
};
