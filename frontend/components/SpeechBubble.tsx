import React from 'react';

interface SpeechBubbleProps {
  type: 'dialogue' | 'caption';
  text: string;
  position?: 'top-left' | 'bottom-right' | 'top-right' | 'bottom-left';
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ type, text, position = 'top-left' }) => {
  if (!text) return null;

  if (type === 'caption') {
    return (
      <div className={`absolute z-10 bg-comic-yellow border-4 border-black p-3 shadow-comic-sm max-w-[80%] transform -skew-x-2
        ${position.includes('top') ? 'top-4' : 'bottom-4'}
        ${position.includes('left') ? 'left-4' : 'right-4'}
      `}>
        <p className="font-mono font-bold text-sm leading-tight uppercase">{text}</p>
      </div>
    );
  }

  // Dialogue bubble
  return (
    <div className={`absolute z-10 bg-white border-4 border-black p-4 rounded-3xl shadow-comic-sm max-w-[70%]
      ${position.includes('top') ? 'top-8' : 'bottom-8'}
      ${position.includes('left') ? 'left-8' : 'right-8'}
    `}>
      <p className="font-sans font-bold text-lg leading-snug">{text}</p>
      {/* Tail */}
      <div className={`absolute w-6 h-6 bg-white border-r-4 border-b-4 border-black transform rotate-45
        ${position.includes('top') ? '-bottom-3' : '-top-3'}
        ${position.includes('left') ? 'left-8' : 'right-8'}
      `}></div>
    </div>
  );
};
