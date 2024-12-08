interface WordFrequency {
  [key: string]: number;
}

// Frecuencias base (esto es un ejemplo, deberías usar datos reales)
const FREQUENCY_DATA: WordFrequency = {
  "casa": 0.95,
  "perro": 0.85,
  "gato": 0.82,
  // ... más palabras
};

const MAX_SCORE = 1000;
const MIN_SCORE = 100;

export class WordScoreService {
  private static instance: WordScoreService;
  private frequencies: WordFrequency;

  private constructor() {
    this.frequencies = FREQUENCY_DATA;
  }

  public static getInstance(): WordScoreService {
    if (!WordScoreService.instance) {
      WordScoreService.instance = new WordScoreService();
    }
    return WordScoreService.instance;
  }

  public calculateScore(word: string, attempts: number): number {
    const frequency = this.frequencies[word.toLowerCase()] || 0.5;
    const baseScore = Math.floor(frequency * MAX_SCORE);
    
    // Bonus por menos intentos (máximo 6 intentos)
    const attemptsMultiplier = Math.max(0, (7 - attempts) / 6);
    
    return Math.max(
      MIN_SCORE,
      Math.floor(baseScore * attemptsMultiplier)
    );
  }

  public async loadFrequencyData(): Promise<void> {
    try {
      // Aquí podríamos cargar datos de un API o archivo JSON
      const response = await fetch('/data/word-frequencies.json');
      this.frequencies = await response.json();
    } catch (error) {
      console.error('Error cargando frecuencias:', error);
    }
  }
} 