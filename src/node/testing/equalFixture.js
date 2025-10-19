/* eslint no-console: "off" */
import { equal, deepEqual } from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'

/**
 * @module node/testing
 */

const doWrite = process.env.WRITE_FIXTURES === 'true'

/**
 * compare string or object with fixtures file
 *
 * if env-var `WRITE_FIXTURES=true` is set then fixtures file is written before
 * comparison
 *
 * @param {any} actual
 * @param {string|URL} filename
 * @param {{
 *  write?: boolean
 *  parser?: (str: string) => object
 *  serializer?: (obj: object) => string
 * }} [opts]
 * @returns {Promise<void>}
 */
export async function equalFixture(
  actual,
  filename,
  {
    write = false,
    parser = JSON.parse,
    serializer = (any) => JSON.stringify(any, null, 2),
  } = {}
) {
  const isObject = typeof actual === 'object'
  if (doWrite || write) {
    const serialized = isObject ? serializer(actual) : String(actual)
    await writeFile(filename, serialized, 'utf-8')
  }
  const expected = await readFile(filename, 'utf-8')
  if (isObject) {
    deepEqual(parser(serializer(actual)), parser(expected))
  } else {
    equal(String(actual), expected)
  }
}

/**
 * force writing fixtures file (for dev)
 */
equalFixture.write = (actual, filename, opts) => {
  console.warn('WARN: equalFixture.write is set')
  return equalFixture(actual, filename, { ...opts, write: true })
}
