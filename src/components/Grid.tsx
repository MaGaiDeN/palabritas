import React from 'react';
import { LetterState } from '../types/game';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  solution: string;
  isRevealing: boolean;
}

export const Grid: React.FC<GridProps> = ({
  guesses,
  currentGuess,
  solution,
  isRevealing,
}) => {
  const empties = Array(6 - (guesses.length + 1)).fill('');
  const currentGuessArray = currentGuess.split('').concat(Array(5 - currentGuess.length).fill(''));

  const getLetterState = (letter: string, index: number): LetterState => {
    if (!letter) return 'empty';
    if (letter === solution[index]) return 'correct';
    if (solution.includes(letter)) return 'present';
    return 'absent';
  };

  return (
    <div className="grid grid-rows-6 gap-1.5 px-2 mb-4">
      {guesses.map((guess, i) => (
        <div key={i} className="grid grid-cols-5 gap-1.5">
          {guess.split('').map((letter, j) => {
            const state = getLetterState(letter, j);
            return (
              <div
                key={j}
                className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold rounded
                  ${isRevealing ? 'animate-flip-in' : ''}
                  ${state === 'correct' ? 'bg-green-600 text-white border-green-600' :
                    state === 'present' ? 'bg-yellow-600 text-white border-yellow-600' :
                    state === 'absent' ? 'bg-gray-600 text-white border-gray-600' :
                    'border-gray-600'
                  }`}
                style={{
                  animationDelay: `${j * 100}ms`
                }}
              >
                {letter}
              </div>
            );
          })}
        </div>
      ))}
      
      {guesses.length < 6 && (
        <div className="grid grid-cols-5 gap-1.5">
          {currentGuessArray.map((letter, i) => (
            <div
              key={i}
              className={`w-14 h-14 border-2 border-gray-600 flex items-center justify-center text-2xl font-bold rounded
                ${letter ? 'animate-bounce-in' : ''}`}
            >
              {letter}
            </div>
          ))}
        </div>
      )}

      {empties.map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-1.5">
          {Array(5).fill('').map((_, j) => (
            <div
              key={j}
              className="w-14 h-14 border-2 border-gray-800 flex items-center justify-center text-2xl font-bold rounded"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;