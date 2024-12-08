import { useEffect, useState } from 'react';
import { GameState } from './types/game';
import { getTodaysWord, isValidWord } from './utils/words';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { AlertTriangle, Info, Loader2, RefreshCw } from 'lucide-react';
import Stats from './components/Stats';
import HowToPlay from './components/HowToPlay';

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('gameState');
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('lastPlayedDate');

    // Reset game if it's a new day
    if (savedDate !== today) {
      localStorage.setItem('lastPlayedDate', today);
      return {
        guesses: [],
        currentGuess: '',
        gameStatus: 'playing',
        stats: {
          played: 0,
          won: 0,
          currentStreak: 0,
          maxStreak: 0,
          guessDistribution: [0, 0, 0, 0, 0, 0]
        }
      };
    }

    return saved ? JSON.parse(saved) : {
      guesses: [],
      currentGuess: '',
      gameStatus: 'playing',
      stats: {
        played: 0,
        won: 0,
        currentStreak: 0,
        maxStreak: 0,
        guessDistribution: [0, 0, 0, 0, 0, 0]
      }
    };
  });
  const [solution] = useState(() => getTodaysWord());
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    localStorage.setItem('gameState', JSON.stringify(gameState));
  }, [gameState]);

  // Show how to play on first visit
  useEffect(() => {
    const hasPlayed = localStorage.getItem('hasPlayed');
    if (!hasPlayed) {
      setShowHowToPlay(true);
      localStorage.setItem('hasPlayed', 'true');
    }
  }, []);

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (showStats || showHowToPlay) return;

      const key = event.key.toUpperCase();
      
      if (key === 'ENTER') {
        onEnter();
      } else if (key === 'BACKSPACE') {
        onDelete();
      } else if (/^[A-ZÑ]$/.test(key)) {
        onKey(key);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [gameState.currentGuess, gameState.gameStatus, showStats, showHowToPlay, isValidating]);

  const onKey = (key: string) => {
    if (gameState.gameStatus !== 'playing') return;
    if (gameState.currentGuess.length < 5) {
      setGameState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key
      }));
    }
  };

  const onEnter = async () => {
    if (gameState.gameStatus !== 'playing' || isValidating) return;
    if (gameState.currentGuess.length !== 5) {
      showErrorMessage('La palabra debe tener 5 letras');
      return;
    }

    setIsValidating(true);
    try {
      const isValid = await isValidWord(gameState.currentGuess);
      if (!isValid) {
        showErrorMessage('Palabra no válida');
        setIsValidating(false);
        return;
      }

      const newGuesses = [...gameState.guesses, gameState.currentGuess.toUpperCase()];
      const currentGuessUpper = gameState.currentGuess.toUpperCase();
      const won = currentGuessUpper === solution;
      const lost = newGuesses.length === 6 && !won;

      if (won || lost) {
        const newStats = {
          ...gameState.stats,
          played: gameState.stats.played + 1,
          won: won ? gameState.stats.won + 1 : gameState.stats.won,
          currentStreak: won ? gameState.stats.currentStreak + 1 : 0,
          maxStreak: won 
            ? Math.max(gameState.stats.currentStreak + 1, gameState.stats.maxStreak)
            : gameState.stats.maxStreak,
          guessDistribution: gameState.stats.guessDistribution.map((count, i) => 
            i === newGuesses.length - 1 && won ? count + 1 : count
          )
        };

        setGameState(prev => ({
          ...prev,
          guesses: newGuesses,
          currentGuess: '',
          gameStatus: won ? 'won' : 'lost',
          stats: newStats
        }));

        setTimeout(() => setShowStats(true), 1500);
      } else {
        setGameState(prev => ({
          ...prev,
          guesses: newGuesses,
          currentGuess: ''
        }));
      }
    } finally {
      setIsValidating(false);
    }
  };

  const onDelete = () => {
    if (gameState.gameStatus !== 'playing') return;
    setGameState(prev => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1)
    }));
  };

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 2000);
  };

  const resetGame = () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar el juego? Perderás tu progreso actual.')) {
      setGameState({
        guesses: [],
        currentGuess: '',
        gameStatus: 'playing',
        stats: gameState.stats // Mantener las estadísticas generales
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white">
      <header className="w-full border-b border-gray-700 p-4 mb-4">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Palabritas</h1>
          <div className="flex gap-2">
            <button
              onClick={resetGame}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              title="Reiniciar juego"
            >
              <RefreshCw size={24} />
            </button>
            <button
              onClick={() => setShowHowToPlay(true)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              title="Cómo jugar"
            >
              <Info size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center max-w-xl w-full px-4">
        {showError && (
          <div className="flex items-center gap-2 bg-red-900/50 text-red-200 px-4 py-2 rounded mb-4 animate-bounce">
            <AlertTriangle size={20} />
            <span>{errorMessage}</span>
          </div>
        )}

        {isValidating && (
          <div className="flex items-center gap-2 bg-blue-900/50 text-blue-200 px-4 py-2 rounded mb-4">
            <Loader2 size={20} className="animate-spin" />
            <span>Validando palabra...</span>
          </div>
        )}

        <Grid
          guesses={gameState.guesses}
          currentGuess={gameState.currentGuess.toUpperCase()}
          solution={solution}
          isRevealing={false}
        />

        <Keyboard
          onKey={onKey}
          onEnter={onEnter}
          onDelete={onDelete}
          guesses={gameState.guesses}
          solution={solution}
        />

        {showStats && (
          <Stats
            stats={gameState.stats}
            gameStatus={gameState.gameStatus}
            solution={solution}
            onClose={() => setShowStats(false)}
          />
        )}

        {showHowToPlay && (
          <HowToPlay onClose={() => setShowHowToPlay(false)} />
        )}
      </main>
    </div>
  );
}

export default App;