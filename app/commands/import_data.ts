import WordsPool from '#models/words_pool'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { DateTime } from 'luxon'
import { readFile } from 'node:fs/promises'

interface MySQLWordPool {
  id: number
  letters: string[]
  pool: string[]
  maxLengthWords: string
  day: string
  created_at: string
  updated_at: string
}

export default class ImportData extends BaseCommand {
  static commandName = 'import:data'
  static description = 'Import data from MySQL export JSON file'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string({ description: 'Path to the JSON export file' })
  declare file: string

  async run() {
    if (!this.file) {
      this.logger.error('Please provide a path to the JSON file with --file flag')
      return
    }

    this.logger.info(`Importing data from ${this.file}...`)

    try {
      const content = await readFile(this.file, 'utf-8')
      const data = JSON.parse(content) as MySQLWordPool[]

      this.logger.info(`Found ${data.length} records to import`)

      let imported = 0
      let skipped = 0

      for (const record of data) {
        // Check if already exists
        const existing = await WordsPool.query().whereRaw('day::text = ?', [record.day]).first()

        if (existing) {
          skipped++
          continue
        }

        await WordsPool.create({
          letters: record.letters,
          pool: record.pool,
          maxLengthWords: record.maxLengthWords,
          day: DateTime.fromISO(record.day),
        })

        imported++
      }

      this.logger.success(`Import completed: ${imported} imported, ${skipped} skipped`)
    } catch (error) {
      this.logger.error(`Failed to import data: ${error}`)
    }
  }
}
