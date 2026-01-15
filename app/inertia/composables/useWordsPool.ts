import type { GameData } from '../types/wordsPool'

const GAME_DATA_PREFIX = 'gameData_'

export interface GameHistoryItem {
  day: string
  foundWords: string[]
  wordsPool: string[]
  completionPercentage: number
  nineLetterWords: string[]
}

export function getAllGameHistory(): GameHistoryItem[] {
  if (typeof window === 'undefined') return []

  const history: GameHistoryItem[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(GAME_DATA_PREFIX)) {
      const day = key.replace(GAME_DATA_PREFIX, '')
      const stored = localStorage.getItem(key)

      if (stored) {
        try {
          const parsed = JSON.parse(stored) as GameData
          const completionPercentage =
            parsed.wordsPool.length > 0
              ? Math.round((parsed.foundWords.length / parsed.wordsPool.length) * 100)
              : 0

          const nineLetterWords = parsed.foundWords.filter((word) => word.length === 9)

          history.push({
            day,
            foundWords: parsed.foundWords,
            wordsPool: parsed.wordsPool,
            completionPercentage,
            nineLetterWords,
          })
        } catch {
          // Skip invalid entries
        }
      }
    }
  }

  return history.sort((a, b) => b.day.localeCompare(a.day))
}

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
