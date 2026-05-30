import React, { useState } from 'react';
import { StoryConfig, StorySetup, Character } from '../types';
import { GENRES, LANGUAGES, TONES } from '../constants';
import { brainstormStory } from '../services/geminiService';
import { CharacterCard } from './CharacterCard';
import { LoadingFX } from './LoadingFX';
import { Zap, BookOpen } from 'lucide-react';

interface SetupProps {
  onStart: (config: StoryConfig) => void;
}

const initialSetup: StorySetup = {
  premise: '',
  heroDesc: '',
  friendDesc: '',
  villainDesc: '',
  recommendedGenre: GENRES[0]
};

export const Setup: React.FC<SetupProps> = ({ onStart }) => {
  const [brainstormInput, setBrainstormInput] = useState('');
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  
  const [setup, setSetup] = useState<StorySetup>(initialSetup);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [tone, setTone] = useState(TONES[0]);
  
  const [characters, setCharacters] = useState<Record<string, Character>>({
    hero: { id: 'hero', role: 'Hero', description: '', imageUrl: null },
    friend: { id: 'friend', role: 'Co-Star', description: '', imageUrl: null },
    villain: { id: 'villain', role: 'Villain', description: '', imageUrl: null }
  });

  const handleBrainstorm = async () => {
    if (!brainstormInput.trim()) return;
    setIsBrainstorming(true);
    try {
      const result = await brainstormStory(brainstormInput);
      setSetup(result);
      setCharacters({
        hero: { ...characters.hero, description: result.heroDesc },
        friend: { ...characters.friend, description: result.friendDesc },
        villain: { ...characters.villain, description: result.villainDesc }
      });
    } catch (error) {
      console.error("Brainstorm failed", error);
      alert("Brainstorming failed. Please try again.");
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleStart = () => {
    if (!setup.premise) {
      alert("Please enter a premise or use the brainstormer!");
      return;
    }
    onStart({ setup, characters, language, tone });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {isBrainstorming && <LoadingFX message="BRAINSTORMING MULTIVERSE..." />}
      
      <header className="mb-8 text-center">
        <h1 className="text-5xl md:text-7xl font-black text-white text-shadow-comic uppercase tracking-tighter transform -skew-x-6 inline-block">
          <span className="text-comic-red">Infinite</span> <span className="text-comic-yellow">Heroes</span>
        </h1>
        <p className="font-mono font-bold mt-2 bg-black text-white inline-block px-4 py-1 transform skew-x-6">
          ISSUE #1: ORIGIN STORY CREATOR
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Brainstorm & Config */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-comic-yellow border-4 border-black p-6 shadow-comic transform -skew-y-1">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <Zap className="fill-black" /> FAST BRAINSTORMER
            </h2>
            <textarea
              value={brainstormInput}
              onChange={(e) => setBrainstormInput(e.target.value)}
              placeholder="e.g., A chef gains laser fingers and fights a sentient pizza..."
              className="w-full border-4 border-black p-3 font-mono text-sm h-24 resize-none mb-4 focus:outline-none focus:ring-4 focus:ring-comic-red/50"
            />
            <button
              onClick={handleBrainstorm}
              disabled={isBrainstorming || !brainstormInput.trim()}
              className="w-full bg-comic-red text-white font-black text-xl py-3 border-4 border-black shadow-comic-sm hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50"
            >
              GENERATE IDEAS!
            </button>
          </div>

          <div className="bg-white border-4 border-black p-6 shadow-comic">
            <h2 className="text-xl font-black mb-4 uppercase">Book Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-sm mb-1">Genre</label>
                <select 
                  value={setup.recommendedGenre}
                  onChange={(e) => setSetup({...setup, recommendedGenre: e.target.value})}
                  className="w-full border-2 border-black p-2 font-mono"
                >
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border-2 border-black p-2 font-mono"
                >
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">Tone</label>
                <select 
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full border-2 border-black p-2 font-mono"
                >
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Characters & Premise */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-4 border-black p-6 shadow-comic">
            <h2 className="text-xl font-black mb-2 uppercase">The Premise</h2>
            <textarea
              value={setup.premise}
              onChange={(e) => setSetup({...setup, premise: e.target.value})}
              className="w-full border-2 border-black p-3 font-mono text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-comic-yellow"
              placeholder="The core story setup..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CharacterCard 
              character={characters.hero} 
              onChange={(c) => setCharacters({...characters, hero: c})} 
            />
            <CharacterCard 
              character={characters.villain} 
              onChange={(c) => setCharacters({...characters, villain: c})} 
            />
            <div className="md:col-span-2">
              <CharacterCard 
                character={characters.friend} 
                onChange={(c) => setCharacters({...characters, friend: c})} 
              />
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-black text-white font-black text-3xl py-6 border-4 border-black shadow-comic hover:bg-gray-900 hover:translate-y-1 hover:shadow-comic-sm transition-all flex items-center justify-center gap-4"
          >
            <BookOpen size={32} />
            START DRAWING ISSUE #1
          </button>
        </div>
      </div>
    </div>
  );
};
