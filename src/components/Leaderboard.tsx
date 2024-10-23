import React, { useState } from 'react';
import { Trophy, Clock, Sparkles, Calendar } from 'lucide-react';
import { ElfScore, LeaderboardFilters } from '../types/game';
import { formatTime } from '../utils/gameUtils';

interface LeaderboardProps {
  scores: ElfScore[];
  onClose: () => void;
}

export function Leaderboard({ scores, onClose }: LeaderboardProps) {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    level: 'all',
    timeRange: 'all'
  });

  const filterScores = (scores: ElfScore[]) => {
    let filtered = [...scores];

    if (filters.level !== 'all') {
      filtered = filtered.filter(score => score.level === filters.level);
    }

    const now = Date.now();
    switch (filters.timeRange) {
      case 'today':
        filtered = filtered.filter(score => 
          now - score.timestamp < 24 * 60 * 60 * 1000
        );
        break;
      case 'week':
        filtered = filtered.filter(score => 
          now - score.timestamp < 7 * 24 * 60 * 60 * 1000
        );
        break;
      case 'month':
        filtered = filtered.filter(score => 
          now - score.timestamp < 30 * 24 * 60 * 60 * 1000
        );
        break;
    }

    return filtered.sort((a, b) => b.score - a.score).slice(0, 10);
  };

  const filteredScores = filterScores(scores);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-400" />
            Elf Leaderboard
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <select
            value={filters.level}
            onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value === 'all' ? 'all' : Number(e.target.value) }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Levels</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
          </select>

          <select
            value={filters.timeRange}
            onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value as LeaderboardFilters['timeRange'] }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Elf Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moves</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Left</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredScores.map((score, index) => (
                <tr key={index} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {score.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Level {score.level}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {score.score}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {score.moves}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatTime(score.timeLeft)}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredScores.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No scores found for the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}