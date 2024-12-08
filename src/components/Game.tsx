import { useEffect, useState } from 'react';
import { SpanishDictionary } from '../services/dictionary';
import { WordScoreService } from '../services/wordScore';
import { ScoreDisplay } from './ScoreDisplay';

export const Game = () => {
  const [dictionary, setDictionary] = useState<SpanishDictionary | null>(null);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const wordScoreService = WordScoreService.getInstance();
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<number>(0);

  useEffect(() => {
    const initDictionary = async () => {
      try {
        const dict = SpanishDictionary.getInstance();
        await dict.initialize();
        setDictionary(dict);
        const word = await dict.getRandomWord();
        setCurrentWord(word);
        setIsLoading(false);
      } catch (err) {
        setError('Error cargando el diccionario');
        setIsLoading(false);
      }
    };

    initDictionary();
  }, []);

  const validateGuess = async (guess: string) => {
    if (!dictionary) return false;
    
    const isValid = await dictionary.isValidWord(guess);
    if (!isValid) {
      // Mostrar mensaje de error
      return false;
    }
    // Continuar con la lógica del juego
    return true;
  };

  const handleGameWin = () => {
    const gameScore = wordScoreService.calculateScore(currentWord, attempts);
    setScore(gameScore);
    // ... resto de tu lógica existente
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await validateGuess(guess)) {
      setAttempts(attempts + 1);
      if (guess.toLowerCase() === currentWord.toLowerCase()) {
        handleGameWin();
      }
      setGuess('');
    }
  };

  if (isLoading) {
    return <div className="text-center">Cargando diccionario...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mt-4">
      <ScoreDisplay score={score} attempts={attempts} />
      <form onSubmit={handleSubmit}>
        <input 
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          maxLength={5}
        />
      </form>
    </div>
  );
}; 