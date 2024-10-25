

export function shuffleCards(gifts: { id: string, image: string }[]) {
  return gifts
    .sort(() => Math.random() - 0.5)
    .filter((_, index) => index < 8)
    .flatMap(gift => [gift, gift])
    .map((gift, index) => ({
      id: index,
      gift,
      isFlipped: false,
      isMatched: false
    }))
    .sort(() => Math.random() - 0.5)
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
