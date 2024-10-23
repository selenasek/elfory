import React, { useState, useEffect, useCallback } from 'react';
import { Card } from './Card';
import { LevelSelector } from './LevelSelector';
import { Timer } from './Timer';
import { Sparkles, Trophy } from 'lucide-react';
import { LEVEL_CONFIG, shuffleCards, getStoredScores, saveScore } from '../utils/gameUtils';
import { Leaderboard } from './Leaderboard';
import { ElfScore } from '../types/game';

export function GameBoard() {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState(shuffleCards(level));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(LEVEL_CONFIG[level].timeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [elfName, setElfName] = useState('');
  const [scores, setScores] = useState<ElfScore[]>(getStoredScores());

  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];

  const handleCardClick = (index: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    if (
      cards[index].isMatched ||
      cards[index].isFlipped ||
      flippedIndices.length === 2 ||
      isGameOver
    ) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    setFlippedIndices([...flippedIndices, index]);
  };

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setMoves(moves + 1);
      
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].gift === cards[secondIndex].gift) {
        setMatchedPairs(matchedPairs + 1);
        setScore(score + config.matchScore);
        
        const newCards = [...cards];
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setTimeout(() => setCards(newCards), 500);
      } else {
        setScore(Math.max(0, score - config.mismatchPenalty));
        setTimeout(() => {
          const newCards = [...cards];
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
        }, 1000);
      }
      
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  }, [flippedIndices]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !isGameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, isGameOver]);

  const resetGame = useCallback((newLevel?: number) => {
    const levelToUse = newLevel || level;
    setCards(shuffleCards(levelToUse));
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setTimeLeft(LEVEL_CONFIG[levelToUse].timeLimit);
    setIsGameOver(false);
    setGameStarted(false);
  }, [level]);

  const handleLevelSelect = (newLevel: number) => {
    setLevel(newLevel);
    resetGame(newLevel);
  };

  const handleScoreSave = () => {
    if (elfName.trim()) {
      const newScore: ElfScore = {
        name: elfName,
        score,
        level,
        moves,
        timeLeft,
        timestamp: Date.now()
      };
      saveScore(newScore);
      setScores(getStoredScores());
      setElfName('');
    }
  };

  const isVictory = matchedPairs === config.pairs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <LevelSelector currentLevel={level} onLevelSelect={handleLevelSelect} />
          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg flex items-center gap-2 hover:bg-yellow-500 transition-colors"
          >
            <Trophy className="w-5 h-5" />
            Leaderboard
          </button>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8 text-yellow-300" />
              <div className="text-white">
                <div className="text-sm opacity-80">Score</div>
                <div className="text-2xl font-bold">{score}</div>
              </div>
            </div>
            
            <Timer timeLeft={timeLeft} totalTime={config.timeLimit} />
            
            <div className="flex items-center gap-4">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <div className="text-white">
                <div className="text-sm opacity-80">Moves</div>
                <div className="text-2xl font-bold">{moves}</div>
              </div>
            </div>
          </div>

          <div className={`grid gap-4 md:gap-6 ${
            level === 3 ? 'grid-cols-6' : 'grid-cols-4'
          }`}>
            {cards.map((card, index) => (
              <Card
                key={card.id}
                id={card.id}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => handleCardClick(index)}
                giftEmoji={card.gift}
              />
            ))}
          </div>
        </div>

        {showLeaderboard && (
          <Leaderboard
            scores={scores}
            onClose={() => setShowLeaderboard(false)}
          />
        )}

        {(isVictory || isGameOver) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">
                {isVictory ? '🎉 Congratulations! 🎉' : '⏰ Time\'s Up!'}
              </h2>
              <p className="text-gray-600 mb-6">
                {isVictory ? (
                  <>
                    You completed level {level} in {moves} moves<br />
                    Time remaining: {timeLeft} seconds<br />
                    Final Score: {score}
                  </>
                ) : (
                  <>
                    You matched {matchedPairs} pairs<br />
                    Final Score: {score}
                  </>
                )}
              </p>
              <div className="mb-6">
                <input
                  type="text"
                  value={elfName}
                  onChange={(e) => setElfName(e.target.value)}
                  placeholder="Enter your elf name"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-xs"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleScoreSave}
                  disabled={!elfName.trim()}
                  className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Score
                </button>
                <button
                  onClick={() => resetGame()}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
                {isVictory && level < 3 && (
                  <button
                    onClick={() => handleLevelSelect(level + 1)}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Next Level
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}