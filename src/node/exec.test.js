import assert from 'assert/strict'
import { fileURLToPath } from 'url'
import { exec } from './index.js'
import os from 'os'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

describe('node/exec', () => {
  if (['win32'].includes(os.platform())) {
    console.error(`${os.platform()} unsupported!`)
    return
  }

  it('should execute in shell', async () => {
    const result = await exec(`cat ${__dirname}/exec.js | wc -l`)
    assert.equal(result, '23')
  })

  it('should throw', async () => {
    try {
      await exec(`cat ${__dirname}/exec.js | foowc -l`)
      throw new Error('fail')
    } catch (/** @type {*} */ err) {
      assert.ok(/Command failed: cat/.test(err.message), err.message)
    }
  })
})
