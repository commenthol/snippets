import { Worker } from 'worker_threads'

/**
 * @param {string} filename with task for execution
 * @returns {(workerData: object) => Promise<any>}
 */
export const workerThread = (filename) => (workerData) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(filename, { workerData })

    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      }
    })
  })
}
