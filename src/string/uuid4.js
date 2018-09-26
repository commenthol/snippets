const crypto = require('crypto')

/**
 * Use crypto API to generate a UUID, compliant with RFC4122 version 4
 * @example
 * uuid4() //> be932f52-d4d7-4d04-a464-d055eca46f9b
 */
export const uuid4 = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ (crypto.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16)
  )
