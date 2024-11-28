interface KeyboardProps {
  onKey: (key: string) => void;
  onEnter: () => void;
  onDelete: () => void;
  guesses: string[];
  solution: string;
}

const Keyboard = ({ onKey, onEnter, onDelete, guesses, solution }: KeyboardProps) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '←']
  ];

  const getKeyState = (key: string) => {
    const flatGuesses = guesses.join('');
    if (guesses.some(guess => guess.split('').some((letter, i) => letter === key && solution[i] === key))) {
      return 'correct';
    }
    if (guesses.some(guess => guess.includes(key)) && solution.includes(key)) {
      return 'present';
    }
    if (flatGuesses.includes(key) && !solution.includes(key)) {
      return 'absent';
    }
    return 'unused';
  };

  return (
    <div className="w-full max-w-xl px-2">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1.5 my-1.5">
          {row.map((key) => {
            const state = key.length === 1 ? getKeyState(key) : 'unused';
            return (
              <button
                key={key}
                onClick={() => {
                  if (key === 'ENTER') onEnter();
                  else if (key === '←') onDelete();
                  else onKey(key);
                }}
                className={`${key.length > 1 ? 'w-16' : 'w-10'} h-14 rounded font-bold transition-all
                  active:scale-95 active:opacity-70
                  ${state === 'correct' ? 'bg-green-600 text-white' :
                    state === 'present' ? 'bg-yellow-600 text-white' :
                    state === 'absent' ? 'bg-gray-600 text-white' :
                    'bg-gray-400 text-gray-900'
                  } hover:opacity-90`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;