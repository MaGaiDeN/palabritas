interface DictionaryService {
  isValidWord: (word: string) => Promise<boolean>;
  getRandomWord: () => Promise<string>;
}

interface WordData {
  words: string[];
  frequencies: { [key: string]: number };
}

export class SpanishDictionary implements DictionaryService {
  private static instance: SpanishDictionary;
  private words: Set<string> = new Set();
  private validWords: string[] = [];
  private frequencies: { [key: string]: number } = {};

  private constructor() {}

  public static getInstance(): SpanishDictionary {
    if (!SpanishDictionary.instance) {
      SpanishDictionary.instance = new SpanishDictionary();
    }
    return SpanishDictionary.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const response = await fetch('https://raw.githubusercontent.com/sustained/castellano/master/dist/5.json');
      const data: WordData = await response.json();
      this.validWords = data.words;
      this.frequencies = data.frequencies;
      this.words = new Set(this.validWords);
    } catch (error) {
      console.error('Error cargando diccionario:', error);
      throw error;
    }
  }

  public async isValidWord(word: string): Promise<boolean> {
    return this.words.has(word.toLowerCase());
  }

  public async getRandomWord(): Promise<string> {
    // Seleccionar palabra basada en frecuencia
    const totalFreq = Object.values(this.frequencies).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalFreq;
    
    for (const word of this.validWords) {
      random -= this.frequencies[word] || 0;
      if (random <= 0) return word;
    }
    
    return this.validWords[0]; // fallback
  }

  public getWordFrequency(word: string): number {
    return this.frequencies[word.toLowerCase()] || 0;
  }
} 