export const LEVEL_CONFIG = {
  1: {
    pairs: 6,
    gifts: ['🎁', '🎄', '⛄', '🦌', '🎅', '🔔'],
    timeLimit: 60,
    matchScore: 100,
    mismatchPenalty: 10
  },
  2: {
    pairs: 8,
    gifts: ['🎁', '🎄', '⛄', '🦌', '🎅', '🔔', '🍪', '🧦'],
    timeLimit: 90,
    matchScore: 150,
    mismatchPenalty: 15
  },
  3: {
    pairs: 12,
    gifts: ['🎁', '🎄', '⛄', '🦌', '🎅', '🔔', '🍪', '🧦', '🕯️', '🎯', '❄️', '🦃'],
    timeLimit: 120,
    matchScore: 200,
    mismatchPenalty: 20
  }
} as const;

export function shuffleCards(level: number) {
  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
  return config.gifts
    .flatMap(emoji => [emoji, emoji])
    .map((gift, index) => ({
      id: index,
      gift,
      isFlipped: false,
      isMatched: false
    }))
    .sort(() => Math.random() - 0.5);
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function getStoredScores(): ElfScore[] {
  const stored = localStorage.getItem('elfScores');
  return stored ? JSON.parse(stored) : [];
}

export function saveScore(score: ElfScore): void {
  const scores = getStoredScores();
  scores.push(score);
  localStorage.setItem('elfScores', JSON.stringify(scores));
}