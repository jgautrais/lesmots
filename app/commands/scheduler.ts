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

    // Schedule create:words-pool daily at 01:00 (temporarily every hour for debugging)
    new Cron('0 * * * *', async () => {
      this.logger.info('Running scheduled task: create:words-pool')
      try {
        const { default: ace } = await import('@adonisjs/core/services/ace')
        await ace.exec('create:words-pool', [])
        this.logger.success('Scheduled task create:words-pool completed')
      } catch (error) {
        this.logger.error(`Scheduled task create:words-pool failed: ${error}`)
      }
    })

    this.logger.success('Scheduler started. Press Ctrl+C to stop.')
  }
}
