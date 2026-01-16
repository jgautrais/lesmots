import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { Cron } from 'croner'
import { spawn } from 'node:child_process'

export default class Scheduler extends BaseCommand {
  static commandName = 'scheduler:run'
  static description = 'Start the task scheduler'

  static options: CommandOptions = {
    startApp: false,
    staysAlive: true,
  }

  private runCommand(command: string, args: string[] = []): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('node', ['ace.js', command, ...args], {
        cwd: process.cwd(),
        stdio: 'inherit',
      })

      child.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Command exited with code ${code}`))
        }
      })

      child.on('error', reject)
    })
  }

  async run() {
    this.logger.info('Starting scheduler...')

    // Schedule create:words-pool daily at 01:00 (temporarily every hour for debugging)
    new Cron('0 * * * *', async () => {
      this.logger.info('Running scheduled task: create:words-pool')
      try {
        await this.runCommand('create:words-pool')
        this.logger.success('Scheduled task create:words-pool completed')
      } catch (error) {
        this.logger.error(`Scheduled task create:words-pool failed: ${error}`)
      }
    })

    this.logger.success('Scheduler started. Press Ctrl+C to stop.')
  }
}
