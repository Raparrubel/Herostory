import React from 'react';
import { StoryBeat } from '../types';
import { SpeechBubble } from './SpeechBubble';

interface PanelProps {
  beat: StoryBeat;
  isLatest: boolean;
}

export const Panel: React.FC<PanelProps> = ({ beat, isLatest }) => {
  return (
    <div className={`relative w-full aspect-[4/3] border-8 border-black bg-white overflow-hidden ${isLatest ? 'shadow-comic' : ''}`}>
      {/* Image Layer */}
      {beat.imageUrl ? (
        <img 
          src={beat.imageUrl} 
          alt={beat.scene} 
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 p-8 text-center">
          <p className="font-mono text-gray-500">{beat.scene}</p>
        </div>
      )}

      {/* Halftone Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply" style={{
        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
        backgroundSize: '4px 4px'
      }}></div>

      {/* Text Layers */}
      <SpeechBubble type="caption" text={beat.caption} position="top-left" />
      <SpeechBubble type="dialogue" text={beat.dialogue} position="bottom-right" />
    </div>
  );
};
