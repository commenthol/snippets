/**
 * @credits https://stackoverflow.com/questions/38508420/how-to-know-if-a-function-is-async
 */

const AsyncFunction = (async () => {}).constructor
const GeneratorFunction = function * () {}.constructor

export const isAsyncFn = asyncFn =>
  asyncFn[Symbol.toStringTag] === 'AsyncFunction' ||
    // transpiled Babel/TypeScript
    (asyncFn instanceof AsyncFunction && AsyncFunction !== Function && AsyncFunction !== GeneratorFunction) === true
