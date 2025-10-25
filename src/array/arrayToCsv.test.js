import assert from 'node:assert'
import { arrayToCsv, csvToArray } from './arrayToCsv.js'

describe('array/arrayToCsv', function () {
  // from https://plants.usda.gov/home/noxiousInvasiveSearch
  const header = ['Symbol', 'Scientific Name', 'Common Name']
  const array = [
    ['AGAD2', 'Ageratina, adenophora(Spreng.)', 'crofton "weed"'],
    [
      'DIAB',
      'Digitaria abyssinica (Hochst. ex A. Rich.) Stapf',
      'African couchgrass',
    ],
    ['PEPO14', 'Pennisetum polystachion (L.) Schult.', 'missiongrass'],
  ]
  const csv = [
    '"Symbol","Scientific Name","Common Name"',
    '"AGAD2","Ageratina, adenophora(Spreng.)","crofton \\"weed\\""',
    '"DIAB","Digitaria abyssinica (Hochst. ex A. Rich.) Stapf","African couchgrass"',
    '"PEPO14","Pennisetum polystachion (L.) Schult.","missiongrass"',
  ].join('\n')

  it('shall convert 2dim array to csv', function () {
    const res = arrayToCsv(array, { header })
    assert.strictEqual(res, csv)
  })

  it('shall convert quoted csv to 2dim array', function () {
    const res = csvToArray(csv + '\n   \n')
    assert.deepStrictEqual(res, [header, ...array])
  })

  it('shall convert unquoted csv to 2dim array', function () {
    const csv = [
      'Symbol,Scientific Name,Common Name',
      'AGAD2,Ageratina adenophora(Spreng.),crofton weed',
      'DIAB,Digitaria abyssinica (Hochst. ex A. Rich.) Stapf,African couchgrass',
      'PEPO14,Pennisetum polystachion (L.) Schult.,missiongrass',
    ].join('\n')
    const res = csvToArray(csv + '\n   \n')
    assert.deepStrictEqual(res, [
      ['Symbol', 'Scientific Name', 'Common Name'],
      ['AGAD2', 'Ageratina adenophora(Spreng.)', 'crofton weed'],
      [
        'DIAB',
        'Digitaria abyssinica (Hochst. ex A. Rich.) Stapf',
        'African couchgrass',
      ],
      ['PEPO14', 'Pennisetum polystachion (L.) Schult.', 'missiongrass'],
    ])
  })
})
