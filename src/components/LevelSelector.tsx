import React from 'react';
import { Star } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: number;
  onLevelSelect: (level: number) => void;
}

export function LevelSelector({ currentLevel, onLevelSelect }: LevelSelectorProps) {
  const levels = [
    { id: 1, name: 'Easy', pairs: 6 },
    { id: 2, name: 'Medium', pairs: 8 },
    { id: 3, name: 'Hard', pairs: 12 },
  ];

  return (
    <div className="flex gap-4 justify-center mb-8">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onLevelSelect(level.id)}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            currentLevel === level.id
              ? 'bg-yellow-400 text-gray-900'
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          <Star className={`w-4 h-4 ${currentLevel === level.id ? 'fill-gray-900' : ''}`} />
          {level.name}
        </button>
      ))}
    </div>
  );
}