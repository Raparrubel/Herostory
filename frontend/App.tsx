import React, { useState } from 'react';
import { Setup } from './components/Setup';
import { Book } from './components/Book';
import { StoryConfig, ViewState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('setup');
  const [config, setConfig] = useState<StoryConfig | null>(null);

  const handleStartStory = (newConfig: StoryConfig) => {
    setConfig(newConfig);
    setView('reader');
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to abandon this issue and start over?")) {
      setConfig(null);
      setView('setup');
    }
  };

  return (
    <div className="font-sans text-black selection:bg-comic-yellow selection:text-black">
      {view === 'setup' && <Setup onStart={handleStartStory} />}
      {view === 'reader' && config && <Book config={config} onReset={handleReset} />}
    </div>
  );
};

export default App;
