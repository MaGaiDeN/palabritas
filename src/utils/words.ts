import { DAILY_WORDS } from './wordList';

const removeAccents = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export const getTodaysWord = () => {
  const today = new Date();
  const index = (today.getFullYear() * 365 + today.getMonth() * 31 + today.getDate()) % DAILY_WORDS.length;
  return DAILY_WORDS[index];
};

// We'll cache valid words to avoid unnecessary API calls
const validWordsCache = new Set<string>();

export const isValidWord = async (word: string): Promise<boolean> => {
  // Convert to uppercase and remove accents
  const normalizedWord = removeAccents(word.toUpperCase());
  
  // Check if it's exactly 5 letters
  if (normalizedWord.length !== 5) {
    return false;
  }

  // Check if it's in our daily words list (these are always valid)
  if (DAILY_WORDS.includes(normalizedWord)) {
    return true;
  }

  // Check cache first
  if (validWordsCache.has(normalizedWord)) {
    return true;
  }

  try {
    // Query Datamuse API for 5-letter Spanish words
    const response = await fetch(`https://api.datamuse.com/words?sp=${normalizedWord.toLowerCase()}&v=es`);
    
    if (!response.ok) {
      throw new Error('API request failed');
    }

    const words = await response.json();
    const isValid = words.length > 0;

    // If valid, add to cache
    if (isValid) {
      validWordsCache.add(normalizedWord);
    }

    return isValid;
  } catch (error) {
    console.error('Error validating word:', error);
    // If API fails, we'll be more permissive and allow the word
    return true;
  }
};