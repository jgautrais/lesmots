import WordsPool from '#models/words_pool'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class WordsPoolsController {
  private async getWordsPoolForDay(day: string) {
    const wordsPool = await WordsPool.query().whereRaw('day::text = ?', [day]).first()

    if (!wordsPool) {
      return null
    }

    return {
      day,
      letters: wordsPool.letters,
      wordsPool: wordsPool.pool,
      maxLengthWords: wordsPool.maxLengthWords.split(','),
    }
  }

  private isFutureDate(day: string): boolean {
    const requestedDate = DateTime.fromISO(day, { zone: 'utc' }).startOf('day')
    // Allow up to end of current UTC day + 14 hours buffer for UTC+14 timezone
    const maxAllowedDate = DateTime.now().toUTC().startOf('day').plus({ hours: 38 })
    return requestedDate > maxAllowedDate
  }

  async today({ inertia }: HttpContext) {
    // Fallback: use server time if accessed directly without client date
    const today = DateTime.now().toFormat('yyyy-MM-dd')
    const wordsPool = await this.getWordsPoolForDay(today)
    return inertia.render('today', { wordsPool })
  }

  async stats({ inertia, request }: HttpContext) {
    const day = request.input('day') || DateTime.now().toFormat('yyyy-MM-dd')
    const wordsPool = await this.getWordsPoolForDay(day)
    return inertia.render('stats', { wordsPool })
  }

  async history({ inertia }: HttpContext) {
    return inertia.render('history', {})
  }

  async game({ inertia, params }: HttpContext) {
    const { day } = params

    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return inertia.render('today', { wordsPool: null })
    }

    // Prevent access to future word pools
    if (this.isFutureDate(day)) {
      return inertia.render('today', { wordsPool: null })
    }

    const wordsPool = await this.getWordsPoolForDay(day)
    return inertia.render('today', { wordsPool })
  }

  async gameDetails({ inertia, params }: HttpContext) {
    const { day } = params

    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return inertia.render('game-details', { wordsPool: null })
    }

    // Prevent access to future word pools
    if (this.isFutureDate(day)) {
      return inertia.render('game-details', { wordsPool: null })
    }

    const wordsPool = await this.getWordsPoolForDay(day)
    return inertia.render('game-details', { wordsPool })
  }
}
