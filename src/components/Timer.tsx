import { Clock } from 'lucide-react';
import { formatTime } from '../utils/gameUtils';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
  const percentage = (timeLeft / totalTime) * 100;

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-6 h-6 text-white" />
      <div className="w-32 h-4 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 rounded-full ${timeLeft < 10 ? 'bg-red-500' : timeLeft < 30 ? 'bg-yellow-400' : 'bg-green-400'
            }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-white font-mono">{formatTime(timeLeft)}</span>
    </div>
  );
}