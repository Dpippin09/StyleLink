'use client'

import { useState, useEffect } from 'react'

interface ImportStats {
  totalSearched: number
  totalImported: number
  totalUpdated: number
  totalSkipped: number
  errors: string[]
  duration: number
}

interface SchedulerJob {
  index: number
  running: boolean
  nextRun: string | null
}

export default function AdminImportPage() {
  const [importing, setImporting] = useState(false)
  const [stats, setStats] = useState<ImportStats | null>(null)
  const [error, setError] = useState('')
  const [schedulerStatus, setSchedulerStatus] = useState<SchedulerJob[]>([])
  const [schedulerLoading, setSchedulerLoading] = useState(false)

  const [config, setConfig] = useState({
    categories: ['dress', 'shoes', 'shirt', 'pants'],
    productsPerCategory: 3,
    platforms: ['walmart', 'amazon', 'etsy'],
    updateExisting: false
  })

  const startImport = async () => {
    setImporting(true)
    setError('')
    setStats(null)

    try {
      const response = await fetch('/api/admin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      })

      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
      } else {
        setError(data.error || 'Import failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  const getImportStats = async () => {
    try {
      const response = await fetch('/api/admin/import')
      const data = await response.json()

      if (data.success) {
        console.log('Current database stats:', data.stats)
      }
    } catch (err) {
      console.error('Failed to get stats:', err)
    }
  }

  const getSchedulerStatus = async () => {
    setSchedulerLoading(true)
    try {
      const response = await fetch('/api/admin/scheduler')
      const data = await response.json()
      
      if (data.success) {
        setSchedulerStatus(data.jobs)
      }
    } catch (err) {
      console.error('Failed to get scheduler status:', err)
    } finally {
      setSchedulerLoading(false)
    }
  }

  const controlScheduler = async (action: 'start' | 'stop') => {
    setSchedulerLoading(true)
    try {
      const response = await fetch('/api/admin/scheduler', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })

      const data = await response.json()
      
      if (data.success) {
        await getSchedulerStatus()
      } else {
        setError(data.error || 'Scheduler action failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scheduler action failed')
    } finally {
      setSchedulerLoading(false)
    }
  }

  useEffect(() => {
    getSchedulerStatus()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Product Import Administration
        </h1>

        {/* Import Configuration */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Import Configuration</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories (comma-separated)
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={config.categories.join(', ')}
                onChange={(e) => setConfig({
                  ...config,
                  categories: e.target.value.split(',').map(c => c.trim())
                })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products per Category
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={config.productsPerCategory}
                onChange={(e) => setConfig({
                  ...config,
                  productsPerCategory: parseInt(e.target.value) || 3
                })}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platforms
            </label>
            {['walmart', 'amazon', 'etsy', 'ebay'].map(platform => (
              <label key={platform} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={config.platforms.includes(platform)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setConfig({
                        ...config,
                        platforms: [...config.platforms, platform]
                      })
                    } else {
                      setConfig({
                        ...config,
                        platforms: config.platforms.filter(p => p !== platform)
                      })
                    }
                  }}
                />
                <span className="ml-2 capitalize">{platform}</span>
              </label>
            ))}
          </div>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                checked={config.updateExisting}
                onChange={(e) => setConfig({
                  ...config,
                  updateExisting: e.target.checked
                })}
              />
              <span className="ml-2">Update existing products</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startImport}
              disabled={importing || config.platforms.length === 0}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {importing ? 'Importing...' : 'Start Import'}
            </button>

            <button
              onClick={getImportStats}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              Get Database Stats
            </button>
          </div>
        </div>

        {/* Scheduled Import Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Scheduled Import Jobs</h2>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => controlScheduler('start')}
              disabled={schedulerLoading}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {schedulerLoading ? 'Loading...' : 'Start Scheduler'}
            </button>

            <button
              onClick={() => controlScheduler('stop')}
              disabled={schedulerLoading}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {schedulerLoading ? 'Loading...' : 'Stop Scheduler'}
            </button>

            <button
              onClick={getSchedulerStatus}
              disabled={schedulerLoading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Refresh Status
            </button>
          </div>

          {/* Scheduler Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Job Status</h3>
            {schedulerStatus.length > 0 ? (
              <div className="space-y-2">
                {schedulerStatus.map((job, index) => (
                  <div key={index} className="flex justify-between items-center bg-white p-3 rounded">
                    <div>
                      <span className="font-medium">
                        Job #{job.index} {index === 0 ? '(Daily)' : '(Weekly)'}
                      </span>
                      <div className="text-sm text-gray-600">
                        Status: {job.running ? '🟢 Running' : '🔴 Stopped'}
                      </div>
                    </div>
                    {job.nextRun && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Next run:</div>
                        <div className="text-sm font-mono">
                          {new Date(job.nextRun).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No scheduled jobs active</p>
            )}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Daily Job:</strong> Runs at 3:00 AM daily, imports 10 products per category from Walmart, Amazon, and Etsy</p>
            <p><strong>Weekly Job:</strong> Runs at 2:00 AM on Sundays, deep import of 20 products per category across more categories</p>
          </div>
        </div>

        {/* Import Progress */}
        {importing && (
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-800">
                Importing products from {config.platforms.join(', ')}...
              </span>
            </div>
          </div>
        )}

        {/* Import Results */}
        {stats && (
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-4">
              Import Completed Successfully! 
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.totalImported}
                </div>
                <div className="text-sm text-green-800">Imported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalUpdated}
                </div>
                <div className="text-sm text-blue-800">Updated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.totalSkipped}
                </div>
                <div className="text-sm text-yellow-800">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {(stats.duration / 1000).toFixed(1)}s
                </div>
                <div className="text-sm text-gray-800">Duration</div>
              </div>
            </div>

            <div className="text-sm text-green-700">
              Searched {stats.totalSearched} products across {config.platforms.length} platforms
            </div>

            {stats.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {stats.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Import Failed
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            📋 Setup Instructions
          </h3>
          <ol className="text-yellow-700 space-y-2 text-sm">
            <li><strong>1.</strong> First, update your database schema by running: <code className="bg-yellow-100 px-2 py-1 rounded">npx prisma db push</code></li>
            <li><strong>2.</strong> Then regenerate the Prisma client: <code className="bg-yellow-100 px-2 py-1 rounded">npx prisma generate</code></li>
            <li><strong>3.</strong> Once that's done, the import process will work with the new external product tracking fields.</li>
            <li><strong>4.</strong> You can then set up automated imports using cron jobs or scheduled tasks.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
