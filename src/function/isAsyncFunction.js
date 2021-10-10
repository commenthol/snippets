/**
 * For node use util.types.isAsyncFunction
 * @credits https://stackoverflow.com/questions/38508420/how-to-know-if-a-function-is-async
 * @see https://nodejs.org/dist/latest/docs/api/util.html#util_util_types_isasyncfunction_value
 */

const AsyncFunction = (async () => {}).constructor
const GeneratorFunction = function * () {}.constructor

export const isAsyncFunction = asyncFn =>
  asyncFn[Symbol.toStringTag] === 'AsyncFunction' ||
    // transpiled Babel/TypeScript
    (asyncFn instanceof AsyncFunction && AsyncFunction !== Function && AsyncFunction !== GeneratorFunction) === true
