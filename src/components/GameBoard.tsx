import { useMutation, useQuery } from '@tanstack/react-query';
import { Sparkles, Trophy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getElfs, updateElfScore } from '../sanity';
import { shuffleCards } from '../utils/gameUtils';
import { Card } from './Card';
import { Leaderboard } from './Leaderboard';
import { Timer } from './Timer';

type GameBoardProps = {
  toys: {
    id: string;
    image: string;
  }[]
  elfs: {
    id: string;
    name: string;
    role: string;
    score: number;
  }[]
}

const config = {
  pairs: 8,
  gifts: ['🎁', '🎄', '⛄', '🦌', '🎅', '🔔', '🍪', '🧦'],
  timeLimit: 90,
  matchScore: 100,
  mismatchPenalty: 10
}

export function GameBoard(props: GameBoardProps) {
  const [cards, setCards] = useState(shuffleCards(props.toys));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [selectedElf, setSelectedElf] = useState<string>();

  const { refetch, data: elfs } = useQuery({
    queryKey: ['elfs'],
    queryFn: async () => {
      return await getElfs();
    },
    initialData: props.elfs
  })

  const changeElfScore = useMutation({
    mutationFn: async ({ _id, score }: { _id: string, score: number }) => {
      const result = await updateElfScore(_id, score);
      console.log(result);
      return result;
    }
  })

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

  const resetGame = useCallback(() => {
    setCards(shuffleCards(props.toys));
    setFlippedIndices([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setTimeLeft(config.timeLimit);
    setIsGameOver(false);
    setGameStarted(false);
  }, []);

  const handleScoreSave = async () => {

    if (selectedElf === undefined) return;

    await changeElfScore.mutateAsync({ _id: selectedElf, score });

    await refetch();
  };

  const isVictory = matchedPairs === config.pairs;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-green-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
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

          <div className="grid grid-cols-4 gap-8 place-items-center">
            {cards.map((card, index) => (
              <Card
                key={card.id}
                id={card.id}
                isFlipped={card.isFlipped}
                isMatched={card.isMatched}
                onClick={() => handleCardClick(index)}
                gift={card.gift}
              />
            ))}
          </div>
        </div>

        {showLeaderboard && (
          <Leaderboard
            scores={elfs}
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
                    You completed in {moves} moves<br />
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
                <select
                  value={selectedElf}
                  onChange={(e) => setSelectedElf(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-full max-w-xs"
                >
                  {elfs.map(elf => (
                    <option key={elf.id} value={elf.id}>{elf.name} ({elf.role})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleScoreSave}
                  // disabled={!elfName.trim()}
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}