export interface ElfScore {
  name: string;
  score: number;
  level: number;
  moves: number;
  timeLeft: number;
  timestamp: number;
}

export interface LeaderboardFilters {
  level: number | 'all';
  timeRange: 'all' | 'today' | 'week' | 'month';
}