import React from 'react';
import { Gift } from 'lucide-react';

interface CardProps {
  id: number;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  giftEmoji: string;
}

export function Card({ isFlipped, isMatched, onClick, giftEmoji }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative w-24 h-32 cursor-pointer transition-transform duration-500 transform-gpu ${
        isFlipped ? 'rotate-y-180' : ''
      }`}
    >
      <div className={`absolute w-full h-full transition-opacity duration-300 ${
        isMatched ? 'opacity-60' : ''
      }`}>
        <div className={`relative w-full h-full preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}>
          {/* Front of card */}
          <div className={`absolute w-full h-full backface-hidden ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}>
            <div className="w-full h-full bg-red-600 rounded-lg shadow-lg border-4 border-white flex items-center justify-center">
              <Gift className="w-12 h-12 text-white" />
            </div>
          </div>
          
          {/* Back of card */}
          <div className={`absolute w-full h-full backface-hidden rotate-y-180 ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-full h-full bg-green-500 rounded-lg shadow-lg border-4 border-white flex items-center justify-center">
              <span className="text-4xl">{giftEmoji}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}