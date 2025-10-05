import React from 'react';

interface RecognitionFeedbackProps {
  message: string;
}

const RecognitionFeedback: React.FC<RecognitionFeedbackProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-gray-900/90 text-cyan-200 text-sm rounded-md border border-cyan-700 shadow-lg animate-fade-in-out"
    >
      {message}
    </div>
  );
};

export default RecognitionFeedback;
