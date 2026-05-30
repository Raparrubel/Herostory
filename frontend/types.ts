export interface StorySetup {
  premise: string;
  heroDesc: string;
  friendDesc: string;
  villainDesc: string;
  recommendedGenre: string;
}

export interface Character {
  id: 'hero' | 'friend' | 'villain';
  role: string;
  description: string;
  imageUrl: string | null;
}

export interface StoryConfig {
  setup: StorySetup;
  characters: Record<string, Character>;
  language: string;
  tone: string;
}

export interface StoryBeat {
  id: string;
  caption: string;
  dialogue: string;
  scene: string;
  focus_char: string;
  choices: string[];
  imageUrl?: string;
}

export type ViewState = 'setup' | 'reader';
