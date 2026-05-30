import React, { useState, useEffect } from 'react';
import { LOADING_PHRASES, ACTION_WORDS } from '../constants';

interface LoadingFXProps {
  message?: string;
}

export const LoadingFX: React.FC<LoadingFXProps> = ({ message }) => {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [actionWord, setActionWord] = useState(ACTION_WORDS[0]);
  const [actionPos, setActionPos] = useState({ top: '50%', left: '50%', rotate: '0deg' });

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 98) return 98;
        return p + Math.random() * 15;
      });
    }, 500);

    const phraseInterval = setInterval(() => {
      setPhraseIndex(i => (i + 1) % LOADING_PHRASES.length);
    }, 2000);

    const actionInterval = setInterval(() => {
      setActionWord(ACTION_WORDS[Math.floor(Math.random() * ACTION_WORDS.length)]);
      setActionPos({
        top: `${20 + Math.random() * 60}%`,
        left: `${20 + Math.random() * 60}%`,
        rotate: `${(Math.random() - 0.5) * 40}deg`
      });
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phraseInterval);
      clearInterval(actionInterval);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-comic-zinc/80 backdrop-blur-sm overflow-hidden">
      {/* Chaotic Action Word */}
      <div 
        className="absolute font-black text-6xl text-comic-yellow text-shadow-comic transition-all duration-200 pointer-events-none"
        style={{
          top: actionPos.top,
          left: actionPos.left,
          transform: `translate(-50%, -50%) rotate(${actionPos.rotate}) scale(${1 + Math.random() * 0.5})`,
          WebkitTextStroke: '3px black'
        }}
      >
        {actionWord}
      </div>

      {/* Status Box */}
      <div className="relative bg-comic-cream border-4 border-black p-6 shadow-comic transform -skew-x-2 max-w-md w-full mx-4">
        <div className="absolute -top-4 -left-4 bg-comic-red text-white font-bold px-3 py-1 border-2 border-black transform -rotate-6">
          SYSTEM STATUS
        </div>
        
        <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter mt-2">
          {message || "Processing..."}
        </h2>
        
        <div className="font-mono text-sm font-bold mb-2 h-6 text-comic-red">
          > {LOADING_PHRASES[phraseIndex]}
        </div>

        <div className="h-8 border-4 border-black bg-white relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-comic-yellow transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Striped pattern */}
            <div className="w-full h-full opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)'
            }}></div>
          </div>
        </div>
        <div className="text-right font-mono font-bold mt-1 text-sm">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
};
