import { productImportService } from './product-import'
import { CronJob } from 'cron'

export class ScheduledImportService {
  private jobs: CronJob[] = []

  // Daily import at 3 AM
  startDailyImport() {
    const dailyJob = new CronJob(
      '0 3 * * *', // 3:00 AM every day
      async () => {
        console.log('🕒 Running scheduled daily product import...')
        
        const config = {
          categories: ['dress', 'shoes', 'shirt', 'pants', 'accessories', 'jacket'],
          productsPerCategory: 10,
          platforms: ['walmart', 'amazon', 'etsy'], // Exclude eBay due to rate limits
          updateExisting: true
        }

        try {
          const stats = await productImportService.importProducts(config)
          console.log('✅ Daily import completed:', stats)
          
          // Cleanup old products (older than 30 days)
          await productImportService.cleanupOldProducts(30)
          
        } catch (error) {
          console.error('❌ Daily import failed:', error)
        }
      },
      null,
      true,
      'America/New_York'
    )

    this.jobs.push(dailyJob)
    console.log('📅 Daily import scheduled for 3:00 AM')
  }

  // Weekly deep import at Sunday 2 AM
  startWeeklyImport() {
    const weeklyJob = new CronJob(
      '0 2 * * 0', // 2:00 AM every Sunday
      async () => {
        console.log('🕒 Running scheduled weekly deep import...')
        
        const config = {
          categories: [
            'dress', 'shoes', 'shirt', 'pants', 'accessories', 'jacket',
            'tops', 'skirts', 'shorts', 'swimwear', 'activewear', 'lingerie',
            'bags', 'jewelry', 'watches', 'sunglasses'
          ],
          productsPerCategory: 20,
          platforms: ['walmart', 'amazon', 'etsy'],
          updateExisting: true
        }

        try {
          const stats = await productImportService.importProducts(config)
          console.log('✅ Weekly import completed:', stats)
          
        } catch (error) {
          console.error('❌ Weekly import failed:', error)
        }
      },
      null,
      true,
      'America/New_York'
    )

    this.jobs.push(weeklyJob)
    console.log('📅 Weekly import scheduled for Sunday 2:00 AM')
  }

  // Start all scheduled jobs
  startAll() {
    this.startDailyImport()
    this.startWeeklyImport()
    console.log(`🚀 Started ${this.jobs.length} scheduled import jobs`)
  }

  // Stop all scheduled jobs
  stopAll() {
    this.jobs.forEach(job => job.stop())
    this.jobs = []
    console.log('⏹️ All scheduled imports stopped')
  }

  // Get status of all jobs
  getStatus() {
    return this.jobs.map((job, index) => ({
      index,
      running: job.running,
      nextRun: job.nextDate()?.toDate()
    }))
  }
}

export const scheduledImportService = new ScheduledImportService()

// Auto-start in production
if (process.env.NODE_ENV === 'production' && process.env.AUTO_START_IMPORTS === 'true') {
  scheduledImportService.startAll()
}
