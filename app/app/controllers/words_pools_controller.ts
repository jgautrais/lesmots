import WordsPool from '#models/words_pool'
import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'

export default class WordsPoolsController {
  private async getWordsPoolForToday() {
    const today = DateTime.now().toFormat('yyyy-MM-dd')

    const wordsPool = await WordsPool.query().whereRaw('day::text = ?', [today]).first()

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

  async history({ inertia }: HttpContext) {
    return inertia.render('history', {})
  }

  async game({ inertia, params }: HttpContext) {
    const { day } = params

    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return inertia.render('today', { wordsPool: null })
    }

    const wordsPool = await WordsPool.query().whereRaw('day::text = ?', [day]).first()

    if (!wordsPool) {
      return inertia.render('today', { wordsPool: null })
    }

    return inertia.render('today', {
      wordsPool: {
        day,
        letters: wordsPool.letters,
        wordsPool: wordsPool.pool,
        maxLengthWords: wordsPool.maxLengthWords.split(','),
      },
    })
  }

  async gameDetails({ inertia, params }: HttpContext) {
    const { day } = params

    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      return inertia.render('game-details', { wordsPool: null })
    }

    const wordsPool = await WordsPool.query().whereRaw('day::text = ?', [day]).first()

    if (!wordsPool) {
      return inertia.render('game-details', { wordsPool: null })
    }

    return inertia.render('game-details', {
      wordsPool: {
        day,
        letters: wordsPool.letters,
        wordsPool: wordsPool.pool,
        maxLengthWords: wordsPool.maxLengthWords.split(','),
      },
    })
  }
}
