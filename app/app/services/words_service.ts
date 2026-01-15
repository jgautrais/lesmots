import app from '@adonisjs/core/services/app'
import { readFile } from 'node:fs/promises'

export default class WordsService {
  private static readonly WORDS_JSON_PATH = 'resources/data/gutenberg.json'
  private static readonly WORDS_MAX_LENGTH = 9
  private static readonly WORDS_MIN_LENGTH = 4

  private words: string[] = []
  private wordsOfMaxLength: string[] = []
  private lettersPool: string[] = []
  private matchingWords: string[] = []
  private matchingWordsOfMaxLength: string[] = []

  async initialize(): Promise<void> {
    this.words = await this.loadWordsPool()
    this.wordsOfMaxLength = this.getWordsPoolOfMaxLength()
  }

  generateWords(): void {
    this.setMatchingWords()
    this.filterMatchingWordsForLettersCount()

    this.matchingWordsOfMaxLength = this.matchingWords.filter(
      (word) => word.length === WordsService.WORDS_MAX_LENGTH
    )
  }

  private setMatchingWords(): void {
    this.matchingWords = []
    this.matchingWordsOfMaxLength = []

    const randomIndex = Math.floor(Math.random() * this.wordsOfMaxLength.length)
    const randomMaxLengthWord = this.wordsOfMaxLength[randomIndex]
    this.lettersPool = [...randomMaxLengthWord]

    for (const word of this.words) {
      if (this.isValid(word) && !this.matchingWords.includes(word)) {
        this.matchingWords.push(word)
      }
    }
  }

  private async loadWordsPool(): Promise<string[]> {
    const filePath = app.makePath(WordsService.WORDS_JSON_PATH)
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content) as string[]
  }

  private getWordsPoolOfMaxLength(): string[] {
    return this.words.filter((word) => word.length === WordsService.WORDS_MAX_LENGTH)
  }

  private isValid(word: string): boolean {
    if (word.length < WordsService.WORDS_MIN_LENGTH) {
      return false
    }
    return [...word].every((letter) => this.lettersPool.includes(letter))
  }

  private filterMatchingWordsForLettersCount(): void {
    const lettersNumber: Record<string, number> = {}
    for (const letter of this.lettersPool) {
      lettersNumber[letter] = (lettersNumber[letter] || 0) + 1
    }

    this.matchingWords = this.matchingWords.filter((word) => {
      const testNbLetters: Record<string, number> = {}
      for (const char of word) {
        testNbLetters[char] = (testNbLetters[char] || 0) + 1
      }

      return Object.entries(testNbLetters).every(
        ([char, count]) => count <= (lettersNumber[char] || 0)
      )
    })
  }

  getLettersPool(): string[] {
    return this.lettersPool
  }

  getMatchingWords(): string[] {
    return this.matchingWords
  }

  getMatchingWordsOfMaxLengthString(): string {
    return [...this.matchingWordsOfMaxLength].sort().join(',')
  }
}
