import React, { useState, useRef } from 'react';
import { Character } from '../types';
import { Upload, Wand2, Image as ImageIcon } from 'lucide-react';
import { generateImage } from '../services/geminiService';

interface CharacterCardProps {
  character: Character;
  onChange: (char: Character) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateImage = async () => {
    if (!character.description) return;
    setIsGenerating(true);
    try {
      const prompt = `Character portrait of a ${character.role}. ${character.description}`;
      const imageUrl = await generateImage(prompt);
      onChange({ ...character, imageUrl });
    } catch (error) {
      console.error("Failed to generate character image", error);
      alert("Failed to generate image. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange({ ...character, imageUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border-4 border-black p-4 shadow-comic flex flex-col gap-3 relative">
      <div className="absolute -top-3 -right-3 bg-comic-yellow border-2 border-black px-2 py-1 font-black uppercase text-sm transform rotate-3">
        {character.role}
      </div>
      
      <div className="flex gap-4">
        {/* Image Area */}
        <div className="w-32 h-32 border-4 border-black bg-comic-zinc flex-shrink-0 relative overflow-hidden group">
          {character.imageUrl ? (
            <img src={character.imageUrl} alt={character.role} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon size={32} />
            </div>
          )}
          
          {/* Overlay actions */}
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleGenerateImage}
              disabled={isGenerating || !character.description}
              className="bg-comic-red text-white p-1 border-2 border-black hover:scale-110 disabled:opacity-50"
              title="Generate with AI"
            >
              <Wand2 size={16} />
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-comic-yellow text-black p-1 border-2 border-black hover:scale-110"
              title="Upload Image"
            >
              <Upload size={16} />
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileUpload}
          />
        </div>

        {/* Text Area */}
        <div className="flex-grow flex flex-col">
          <label className="font-bold text-sm mb-1 uppercase">Description</label>
          <textarea
            value={character.description}
            onChange={(e) => onChange({ ...character, description: e.target.value })}
            className="w-full flex-grow border-2 border-black p-2 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-comic-red"
            placeholder={`Describe the ${character.role}...`}
          />
        </div>
      </div>
      
      {isGenerating && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center font-black text-comic-red animate-pulse">
          DRAWING...
        </div>
      )}
    </div>
  );
};
