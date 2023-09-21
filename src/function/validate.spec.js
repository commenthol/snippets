import assert, { equal, deepEqual } from 'assert/strict'
import {
  booleanT,
  numberT,
  integerT,
  stringT,
  enumT,
  arrayT,
  objectT,
  REQUIRED,
  validateUrl,
  validateDate,
  validateUuid,
  oneOf,
  anyOf
} from './validate.js'

describe('function/validate', function () {
  describe('REQUIRED', function () {
    it('shall not not extensible', function () {
      assert.throws(() => {
        REQUIRED.test = 1
      }, /object is not extensible/)
    })
  })

  describe('booleanT', function () {
    it('boolean validations', function () {
      const e = {}
      equal(booleanT(REQUIRED)(undefined, e), false)
      equal(e.message, 'not a boolean')
      equal(booleanT()(), true)
      equal(booleanT(REQUIRED)(true), true)
      equal(booleanT(REQUIRED)(false), true)
    })
  })

  describe('numberT', function () {
    it('number validations', function () {
      let e = {}
      equal(numberT(REQUIRED)(undefined, e), false)
      equal(e.message, 'not a number')
      equal(numberT()(), true)

      equal(numberT()(1), true)
      equal(numberT()(1.23), true)
      equal(numberT()(-1), true)

      e = {}
      equal(numberT({ min: 0 })(1, e), true)
      equal(numberT({ min: 0 })(-1, e), false)
      equal(e.message, 'number less than min=0')

      e = {}
      equal(numberT({ max: 0 })(-1, e), true)
      equal(numberT({ max: 0 })(1, e), false)
      equal(e.message, 'number greater equal than max=0')

      e = {}
      equal(numberT()(true, e), false)
      equal(e.message, 'not a number')
      equal(numberT()('1.23'), false)
      equal(numberT()(null), false)
    })
  })

  describe('integerT', function () {
    it('integer validations', function () {
      let e = {}
      equal(integerT(REQUIRED)(undefined, e), false)
      equal(e.message, 'not a number')
      equal(integerT()(), true)

      e = {}
      equal(integerT()(1, e), true)
      equal(integerT()(1.23, e), false)
      equal(e.message, 'not an integer')
      equal(integerT()(-1), true)

      equal(integerT({ min: 0 })(1), true)
      equal(integerT({ min: 0 })(-1), false)

      equal(integerT({ max: 0 })(-1), true)
      equal(integerT({ max: 0 })(1), false)

      equal(integerT()(true), false)
      equal(integerT()('1.23'), false)
      equal(integerT()(null), false)
    })
  })

  describe('stringT', function () {
    it('string validation', function () {
      equal(stringT(REQUIRED)(), false)
      equal(stringT(REQUIRED)(''), true)
      equal(stringT({ ...REQUIRED, min: 1 })(''), false)
      equal(stringT()(''), true)
      equal(stringT()(), true)
      equal(stringT({ min: 5 })(''), true)

      equal(stringT()('a'), true)
      equal(stringT()('1.23'), true)

      equal(stringT({ min: 2 })('aaa'), true)
      equal(stringT({ min: 2 })('aa'), true)
      equal(stringT({ min: 2 })('a'), false)

      equal(stringT({ max: 2 })('a'), true)
      equal(stringT({ max: 2 })('aa'), true)
      equal(stringT({ max: 2 })('aaaa'), false)

      equal(stringT({ pattern: /ab/ })('aaba'), true)
      const e = {}
      equal(stringT({ pattern: /ab/ })('aaaa', e), false)
      equal(e.message, 'string does not match pattern=ab')

      equal(stringT()(true), false)
      equal(stringT()(1.23), false)
      equal(stringT()(null), false)
    })

    it('url validation', function () {
      equal(
        stringT({ validate: validateUrl })('https://foo.bar/path?a=1?b=2'),
        true
      )
      const e = {}
      equal(stringT({ validate: validateUrl })('/foo.bar/path', e), false)
      deepEqual(e, { message: 'string is not an url' })
    })

    it('date validation', function () {
      equal(stringT({ validate: validateDate })('2020-12-01'), true)
      const e = {}
      equal(stringT({ validate: validateDate })('/foo.bar/path', e), false)
      deepEqual(e, { message: 'string is not a date' })
    })

    it('uuid validation', function () {
      equal(
        stringT({ validate: validateUuid })(
          '641663d3-4689-4ab0-842d-11fe8bfcfb17'
        ),
        true
      )
      const e = {}
      equal(
        stringT({ validate: validateUuid })(
          '641663d3-4689-4ab0-842x-11fe8bfcfb17',
          e
        ),
        false
      )
      deepEqual(e, { message: 'string is not an uuid' })
    })
  })

  describe('enumT', function () {
    it('enum validation', function () {
      equal(enumT([1], REQUIRED)(), false)
      equal(enumT([1])(), true)

      equal(enumT([1])(1), true)
      const e = {}
      equal(enumT([1])(2, e), false)
      equal(e.message, 'not an enum value')

      equal(enumT([1])(true), false)
      equal(enumT([1])(1.23), false)
      equal(enumT([1])(null), false)
    })
  })

  describe('arrayT', function () {
    it('array validations', function () {
      equal(arrayT(numberT(), REQUIRED)(), false)
      equal(arrayT(numberT(), REQUIRED)([]), true)
      equal(arrayT(numberT())(), true)
      equal(arrayT(numberT())([]), true)

      equal(arrayT(integerT())([1, 2, 3]), true)
      let e = {}
      equal(arrayT(integerT())([1, 2.1, 3], e), false)
      deepEqual(e, { message: 'not an integer', path: [1] })

      e = {}
      equal(arrayT(integerT({ min: 2 }))([1, 2, 3], e), false)
      deepEqual(e, { message: 'number less than min=2', path: [0] })

      equal(arrayT(integerT({ max: 2 }))([1, 2, 3]), false)
      equal(arrayT(integerT({ max: 2 }))([0, 1]), true)

      e = {}
      equal(arrayT(integerT(), { max: 2 })([1, 2, 3], e), false)
      deepEqual(e, { message: 'array too long max=2' })

      e = {}
      equal(arrayT(integerT(), { min: 2 })([1], e), false)
      deepEqual(e, { message: 'array too short min=2' })
    })
  })

  describe('objectT', function () {
    const schema = {
      bool: booleanT(),
      num: numberT(),
      int: integerT(),
      str: stringT(REQUIRED),
      arr: arrayT(numberT()),
      obj: objectT({
        nested: integerT()
      })
    }

    it('valid', function () {
      const v = {
        bool: true,
        num: 3.14,
        int: 1,
        str: 'string',
        arr: [1, 2.3],
        obj: {
          nested: 7
        }
      }
      equal(objectT(schema)(v), true)
    })

    it('invalid bool', function () {
      const v = {
        bool: 1,
        num: 3.14,
        int: 1,
        str: 'string',
        arr: [1, 2.3],
        obj: {
          nested: 7
        }
      }
      const e = {}
      equal(objectT(schema)(v, e), false)
      deepEqual(e, {
        message: 'not a boolean',
        path: ['bool']
      })
    })

    it('invalid array', function () {
      const v = {
        bool: false,
        num: 3.14,
        int: 1,
        str: 'string',
        arr: [1, '2.3'],
        obj: {
          nested: 7
        }
      }
      const e = {}
      equal(objectT(schema)(v, e), false)
      deepEqual(e, {
        message: 'not a number',
        path: ['arr', 1]
      })
    })

    it('invalid nested obj', function () {
      const v = {
        bool: false,
        num: 3.14,
        int: 1,
        str: 'string',
        arr: [1, 2.3],
        obj: {
          nested: '7'
        }
      }
      const e = {}
      equal(objectT(schema)(v, e), false)
      deepEqual(e, {
        message: 'not a number',
        path: ['obj', 'nested']
      })
    })

    it('missing prop', function () {
      const v = {
        bool: false,
        num: 3.14,
        int: 1,
        arr: [1, 2.3],
        obj: {
          nested: 7
        }
      }
      const e = {}
      equal(objectT(schema)(v, e), false)
      deepEqual(e, {
        message: 'object has missing key=str'
      })
    })

    it('missing optional prop', function () {
      const v = {
        bool: false,
        num: 3.14,
        int: 1,
        arr: [1, 2.3],
        obj: {
          nested: 7
        }
      }
      const e = {}
      const _schema = { ...schema, str: stringT({ required: false }) }
      equal(objectT(_schema)(v, e), true)
      equal(e.message, undefined)
    })

    it('invalid additional props', function () {
      const v = {
        bool: false,
        num: 3.14,
        int: 1,
        str: 'works',
        other: 'xx',
        arr: [1, 2.3],
        obj: {
          nested: 7
        }
      }
      const e = {}
      equal(objectT(schema)(v, e), false)
      equal(e.message, 'object has additional key=other')
    })

    it('additional props allowed', function () {
      const v = {
        bool: false,
        num: 3.14,
        int: 1,
        str: 'works',
        other: 'xx',
        arr: [1, 2.3],
        obj: {
          nested: 7
        }
      }
      const e = {}
      equal(objectT(schema, { additionalProperties: true })(v, e), true)
      equal(e.message, undefined)
    })

    it('validate fn', function () {
      // if `flag` === true then `test` must be 1
      const schema = objectT(
        {
          flag: booleanT(REQUIRED),
          test: numberT()
        },
        {
          validate: (v) =>
            v.test === undefined || (v.flag === true && v.test === 1)
        }
      )
      equal(schema({ flag: false }), true)
      const e = {}
      equal(schema({ flag: false, test: 1 }, e), false)
      equal(e.message, 'object validate failed')
      equal(schema({ flag: true, test: 1 }), true)
    })
  })

  describe('oneOf', function () {
    it('string or number', function () {
      const schema = oneOf([numberT(), stringT()])

      equal(schema(1), true)
      equal(schema('1'), true)
      const e = {}
      equal(schema(true, e), false)
      deepEqual(e, { message: 'oneOf failed, matched=0' })
    })

    it('objects', function () {
      const schema = oneOf([
        // if flag === false then msg must be empty string
        objectT({
          flag: booleanT({ required: true, validate: (v) => !v }),
          msg: stringT({ required: true, min: 0, max: 0 })
        }),
        // otherwise msg must be at least 2 chars long
        objectT({
          flag: booleanT({ required: true, validate: (v) => v }),
          msg: stringT({ required: true, min: 2 })
        })
      ])

      equal(schema({ flag: false, msg: '' }), true)
      equal(schema({ flag: true, msg: 'hi' }), true)
      const e = {}
      equal(schema({ flag: true, msg: '' }, e), false)
      deepEqual(e, { message: 'oneOf failed, matched=0' })
    })
  })

  describe('anyOf', function () {
    it('string or number', function () {
      const schema = anyOf([numberT(), stringT()])

      equal(schema(1), true)
      equal(schema('1'), true)
      const e = {}
      equal(schema(true, e), false)
      deepEqual(e, { message: 'anyOf failed' })
    })
  })
})
