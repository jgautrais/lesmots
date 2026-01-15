export interface WordsPool {
  letters: string[]
  wordsPool: string[]
  maxLengthWords: string[]
}

export interface WordsPoolWithDay extends WordsPool {
  day: string
}

export interface GameData {
  foundWords: string[]
  wordsPool: string[]
}

export type SortedWordsPool = Record<string, string[]>
