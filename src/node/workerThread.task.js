import { parentPort, workerData, isMainThread } from 'worker_threads'

function task() {
  if (isMainThread) return

  const { ms } = workerData
  const end = Date.now() + ms
  let count = 0
  while (Date.now() < end) {
    count++ // fully blocking...
  }

  parentPort?.postMessage({ done: true, count })
}

task()
