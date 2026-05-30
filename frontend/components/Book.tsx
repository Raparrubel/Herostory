import React, { useState, useEffect, useRef } from 'react';
import { StoryConfig, StoryBeat } from '../types';
import { generateBeat, generateImage } from '../services/geminiService';
import { Panel } from './Panel';
import { LoadingFX } from './LoadingFX';
import { RotateCcw, Printer } from 'lucide-react';

interface BookProps {
  config: StoryConfig;
  onReset: () => void;
}

export const Book: React.FC<BookProps> = ({ config, onReset }) => {
  const [history, setHistory] = useState<StoryBeat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("INITIALIZING MULTIVERSE...");
  const endOfBookRef = useRef<HTMLDivElement>(null);

  const processNextBeat = async (choice?: string) => {
    setIsLoading(true);
    try {
      setLoadingMsg("WRITING SCRIPT...");
      const newBeat = await generateBeat(config, history, choice);
      
      setLoadingMsg("DRAWING PANEL...");
      // Construct a prompt that includes character visual context if they are the focus
      let imagePrompt = newBeat.scene;
      if (newBeat.focus_char && config.characters[newBeat.focus_char]) {
         imagePrompt += ` Featuring: ${config.characters[newBeat.focus_char].description}`;
      }
      
      const imageUrl = await generateImage(imagePrompt);
      newBeat.imageUrl = imageUrl;

      setHistory(prev => [...prev, newBeat]);
    } catch (error) {
      console.error("Failed to process beat", error);
      alert("An error occurred while generating the next panel.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (history.length === 0) {
      processNextBeat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when new panel is added
  useEffect(() => {
    if (!isLoading) {
      endOfBookRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isLoading]);

  const handlePrint = () => {
    window.print();
  };

  const latestBeat = history[history.length - 1];

  return (
    <div className="min-h-screen bg-comic-zinc pb-24">
      {isLoading && <LoadingFX message={loadingMsg} />}

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-black text-white p-4 flex justify-between items-center shadow-md print:hidden">
        <h1 className="text-2xl font-black uppercase tracking-widest text-comic-yellow">
          {config.setup.recommendedGenre} Issue #1
        </h1>
        <div className="flex gap-4">
          <button onClick={handlePrint} className="flex items-center gap-2 hover:text-comic-red transition-colors font-bold">
            <Printer size={20} /> PRINT
          </button>
          <button onClick={onReset} className="flex items-center gap-2 hover:text-comic-red transition-colors font-bold">
            <RotateCcw size={20} /> RESTART
          </button>
        </div>
      </div>

      {/* Comic Pages Container */}
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 print:p-0 print:space-y-4">
        
        {/* Render History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block">
          {history.map((beat, index) => (
            <div key={beat.id} className={`print:mb-8 print:break-inside-avoid ${index % 3 === 0 ? 'md:col-span-2' : ''}`}>
              <Panel beat={beat} isLatest={index === history.length - 1} />
            </div>
          ))}
        </div>

        {/* Choices Section (Only show if not loading and we have a latest beat) */}
        {!isLoading && latestBeat && (
          <div className="bg-white border-8 border-black p-6 shadow-comic mt-12 print:hidden transform rotate-1">
            <h3 className="text-2xl font-black mb-6 text-center uppercase bg-comic-red text-white inline-block px-4 py-2 transform -rotate-2">
              WHAT HAPPENS NEXT?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {latestBeat.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => processNextBeat(choice)}
                  className="bg-comic-yellow border-4 border-black p-4 font-bold text-lg hover:bg-comic-red hover:text-white hover:-translate-y-1 transition-all shadow-comic-sm text-left"
                >
                  <span className="block text-sm font-mono mb-2 opacity-70">OPTION {idx + 1}</span>
                  {choice}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={endOfBookRef} />
      </div>
    </div>
  );
};
