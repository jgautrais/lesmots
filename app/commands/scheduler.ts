import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { Cron } from 'croner'

export default class Scheduler extends BaseCommand {
  static commandName = 'scheduler:run'
  static description = 'Start the task scheduler'

  static options: CommandOptions = {
    startApp: true,
    staysAlive: true,
  }

  async run() {
    this.logger.info('Starting scheduler...')

    // Schedule create:words-pool daily at 01:00
    new Cron('0 1 * * *', async () => {
      this.logger.info('Running scheduled task: create:words-pool')
      const { default: ace } = await import('@adonisjs/core/services/ace')
      await ace.exec('create:words-pool', [])
    })

    this.logger.success('Scheduler started. Press Ctrl+C to stop.')
  }
}
