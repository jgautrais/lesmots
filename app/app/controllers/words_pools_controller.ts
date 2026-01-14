import type { HttpContext } from '@adonisjs/core/http'
import WordsPool from '#models/words_pool'
import { DateTime } from 'luxon'

export default class WordsPoolsController {
  private async getWordsPoolForToday() {
    const today = DateTime.now().toFormat('yyyy-MM-dd')

    const wordsPool = await WordsPool.query()
      .whereRaw("day::text = ?", [today])
      .first()

    if (!wordsPool) {
      return null
    }

    return {
      day: today,
      letters: wordsPool.letters,
      wordsPool: wordsPool.pool,
      maxLengthWords: wordsPool.maxLengthWords.split(','),
    }
  }

  async today({ inertia }: HttpContext) {
    const wordsPool = await this.getWordsPoolForToday()
    return inertia.render('today', { wordsPool })
  }

  async stats({ inertia }: HttpContext) {
    const wordsPool = await this.getWordsPoolForToday()
    return inertia.render('stats', { wordsPool })
  }
}
