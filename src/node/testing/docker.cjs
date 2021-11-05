/**
 * script to start neo4j database docker container for automated testing
 */

const { spawn } = require('child_process')

const log = ['debug', 'info', 'warn', 'error']
  .reduce((o, level) => ({
    ...o,
    [level]: (arg, ...args) => {
      if (typeof arg === 'string') {
        arg = `${level.toUpperCase()}: ${arg}`
      }
      console[level](arg, ...args)
    }
  }), {})

const MAX_STARTUP_DELAY = 20000
const POST_STARTUP_DELAY = 1000

// ---- utils ----

async function subProc (cmd, cmdArgs, { maxStartupDelay, match } = {}) {
  return new Promise((resolve, reject) => {
    let killed = false
    let data = ''
    let timerId

    if (maxStartupDelay) {
      timerId = setTimeout(() => {
        killed = true
        subProcess.kill('SIGHUP')
        reject(new Error('max timeout reached'))
      }, maxStartupDelay)
    }

    const subProcess = spawn(cmd, cmdArgs, {})

    subProcess.stdout.on('data', chunk => {
      log.info('%s', chunk)
      data += chunk

      if (match && match.test(String(chunk))) {
        clearTimeout(timerId)
        killed = true
        subProcess.kill('SIGHUP')
        resolve(0)
      }
    })
    subProcess.stderr.on('data', (chunk) => {
      log.error('%s', chunk)
    })
    subProcess.on('error', (err) => reject(err))
    subProcess.on('exit', code => {
      if (killed) return
      if (code === 0) {
        resolve({ code, data })
      } else {
        reject(new Error(`exitcode ${code}`))
      }
    })
  })
}

async function dockerPs ({
  containerName
}) {
  return subProc('docker', ['ps', '-q', '-f', `name=${containerName}`])
}

async function dockerLogs ({
  containerName,
  maxStartupDelay = MAX_STARTUP_DELAY,
  match
}) {
  return subProc('docker',
    ['logs', '-f', containerName],
    { maxStartupDelay, match }
  )
}

async function dockerRun ({
  containerName,
  image,
  args = []
}) {
  return subProc('docker',
    [
      'run',
      '-d',
      '--rm',
      '--name', containerName,
      ...args,
      image
    ]
  )
}

async function dockerStop ({
  containerName,
  doStop = false,
  doRemove = false
}) {
  await subProc('docker', [(doStop ? 'stop' : 'kill'), containerName])
  if (doRemove) await subProc('docker', ['stop', containerName])
}

async function sleep (delay) {
  return new Promise(resolve => setTimeout(() => resolve(), delay))
}

// ---- exports ----

async function start ({
  image, // image with tag
  containerName, // containerName to start image
  args = [], // docker run arguments
  match, // matched regex to signal successful container startup
  maxStartupDelay = MAX_STARTUP_DELAY, // max startup delay
  postStartupDelay = POST_STARTUP_DELAY // deplay after container was started
} = {}) {
  const ps = await dockerPs({ containerName })
  if (!ps.data) {
    await dockerRun({ containerName, image, args })
    await dockerLogs({ containerName, match, maxStartupDelay })
    await sleep(postStartupDelay)
  }
  return { stop: () => stop({ containerName }) }
}

async function stop ({
  containerName
} = {}) {
  return dockerStop({ containerName })
}

module.exports = {
  start,
  stop,
  dockerPs,
  dockerLogs,
  dockerRun,
  dockerStop
}

if (require.main === module) {
  // --- config
  const image = 'nginx:alpine'
  const containerName = 'nginx_test'
  const match = /ready for start up/
  const args = ['-p', '8080:80']

  if (process.argv.includes('--stop')) {
    stop({ containerName })
      .then(() => {
        log.info('stopped')
      })
      .catch(log.error)
  } else {
    start({
      image,
      containerName,
      args,
      match
    })
      .then(() => {
        log.info('started')
      })
      .catch(log.error)
  }
}
