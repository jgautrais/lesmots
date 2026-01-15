import type { GameData } from '../types/wordsPool'

const GAME_DATA_PREFIX = 'gameData_'

export function loadGameData(day: string, wordsPool: string[]): GameData {
  const stored = localStorage.getItem(`${GAME_DATA_PREFIX}${day}`)
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as GameData
      // Validate that stored foundWords are still valid
      const validFoundWords = parsed.foundWords.filter((word) => wordsPool.includes(word))
      return {
        foundWords: validFoundWords,
        wordsPool,
      }
    } catch {
      // Fall through to default
    }
  }
  return {
    foundWords: [],
    wordsPool,
  }
}

export function saveGameData(day: string, data: GameData): void {
  localStorage.setItem(`${GAME_DATA_PREFIX}${day}`, JSON.stringify(data))
}
