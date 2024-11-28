import { X } from 'lucide-react';

interface HowToPlayProps {
  onClose: () => void;
}

const HowToPlay = ({ onClose }: HowToPlayProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-700 rounded-full"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">¿Cómo jugar?</h2>

        <div className="space-y-4">
          <p>
            Adivina la palabra oculta en 6 intentos.
          </p>

          <div className="space-y-2">
            <p>Después de cada intento, el color de las letras cambia:</p>
            
            <div className="flex gap-2 items-center">
              <div className="w-10 h-10 bg-green-600 flex items-center justify-center text-xl font-bold rounded">
                G
              </div>
              <span>Verde: la letra está en la posición correcta</span>
            </div>

            <div className="flex gap-2 items-center">
              <div className="w-10 h-10 bg-yellow-600 flex items-center justify-center text-xl font-bold rounded">
                A
              </div>
              <span>Amarillo: la letra está en la palabra pero en otra posición</span>
            </div>

            <div className="flex gap-2 items-center">
              <div className="w-10 h-10 bg-gray-600 flex items-center justify-center text-xl font-bold rounded">
                T
              </div>
              <span>Gris: la letra no está en la palabra</span>
            </div>
          </div>

          <div>
            <p className="mb-2">Reglas:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>Cada intento debe ser una palabra válida de 5 letras</li>
              <li>Los acentos no se tienen en cuenta</li>
              <li>Puede haber letras repetidas</li>
              <li>La palabra cambia cada día</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;