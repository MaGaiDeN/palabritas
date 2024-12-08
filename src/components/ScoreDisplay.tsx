import React from 'react';

interface ScoreDisplayProps {
  score: number;
  attempts: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, attempts }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold text-gray-800">Puntuación</h3>
      <div className="text-3xl font-bold text-green-600">{score}</div>
      <div className="text-sm text-gray-600">
        Resuelto en {attempts} {attempts === 1 ? 'intento' : 'intentos'}
      </div>
    </div>
  );
}; 