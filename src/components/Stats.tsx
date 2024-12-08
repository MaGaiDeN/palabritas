interface StatsProps {
  stats: {
    played: number;
    won: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: number[];
  };
  gameStatus: 'playing' | 'won' | 'lost';
  solution: string;
  onClose: () => void;
  onPlayAgain: () => void;
}

export const Stats: React.FC<StatsProps> = ({
  stats,
  gameStatus,
  solution,
  onClose,
  onPlayAgain
}) => {
  const winPercentage = stats.played > 0 
    ? Math.round((stats.won / stats.played) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">
          {gameStatus === 'won' ? '¡Felicidades!' : 'Juego terminado'}
        </h2>
        
        {gameStatus !== 'playing' && (
          <p className="mb-4">
            La palabra era: <strong>{solution}</strong>
          </p>
        )}

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

        <div className="flex gap-2 mt-4">
          <button
            onClick={onPlayAgain}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
          >
            Jugar de nuevo
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Stats;