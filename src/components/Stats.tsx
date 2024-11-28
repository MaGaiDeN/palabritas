import { X } from 'lucide-react';
import { GameState } from '../types/game';

interface StatsProps {
  stats: GameState['stats'];
  gameStatus: GameState['gameStatus'];
  solution: string;
  onClose: () => void;
}

const Stats = ({ stats, gameStatus, solution, onClose }: StatsProps) => {
  const winPercentage = stats.played > 0 
    ? Math.round((stats.won / stats.played) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-700 rounded-full"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Estadísticas</h2>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.played}</div>
            <div className="text-xs text-gray-400">Jugadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{winPercentage}</div>
            <div className="text-xs text-gray-400">% Victorias</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <div className="text-xs text-gray-400">Racha actual</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.maxStreak}</div>
            <div className="text-xs text-gray-400">Mejor racha</div>
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3">Distribución de intentos</h3>
        <div className="space-y-2">
          {stats.guessDistribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4">{i + 1}</div>
              <div className="flex-1 bg-gray-700 rounded-sm h-5">
                <div
                  className="h-full bg-green-600 rounded-sm transition-all"
                  style={{
                    width: `${count > 0 ? Math.max((count / Math.max(...stats.guessDistribution)) * 100, 8) : 0}%`
                  }}
                >
                  <span className="px-2 text-sm">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gameStatus !== 'playing' && (
          <div className="mt-6 text-center">
            <p className="text-lg mb-2">
              {gameStatus === 'won' ? '¡Felicitaciones!' : `La palabra era: ${solution}`}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              Jugar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;