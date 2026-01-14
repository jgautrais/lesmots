import WordsPool from '#models/words_pool'
import WordsService from '#services/words_service'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { DateTime } from 'luxon'

export default class CreateWordsPool extends BaseCommand {
  static commandName = 'create:words-pool'
  static description = 'Create a words pool for a specific day'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string({ description: 'Day in YYYY-MM-DD format' })
  declare day: string

  async run() {
    const startTime = Date.now()

    let targetDay: DateTime
    if (this.day) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(this.day)) {
        this.logger.error("Day option must be in format 'YYYY-MM-DD'")
        return
      }
      const parsed = DateTime.fromISO(this.day)
      if (!parsed.isValid) {
        this.logger.error('Error parsing the date from format YYYY-MM-DD')
        return
      }
      targetDay = parsed
    } else {
      targetDay = DateTime.now().plus({ days: 2 })
    }

    const wordsService = new WordsService()
    await wordsService.initialize()
    wordsService.generateWords()

    const existingPool = await WordsPool.query()
      .whereRaw('day::text = ?', [targetDay.toISODate()!])
      .first()

    if (existingPool) {
      this.logger.error(`Words pool already exists for day ${targetDay.toISODate()}`)
      return
    }

    let existingWithSameWords = await WordsPool.query()
      .where('max_length_words', wordsService.getMatchingWordsOfMaxLengthString())
      .first()

    while (existingWithSameWords) {
      wordsService.generateWords()
      existingWithSameWords = await WordsPool.query()
        .where('max_length_words', wordsService.getMatchingWordsOfMaxLengthString())
        .first()
    }

    await WordsPool.create({
      letters: wordsService.getLettersPool(),
      pool: wordsService.getMatchingWords(),
      maxLengthWords: wordsService.getMatchingWordsOfMaxLengthString(),
      day: targetDay,
    })

    const duration = (Date.now() - startTime) / 1000
    this.logger.success(`Words pool generated in ${duration}s`)
  }
}
