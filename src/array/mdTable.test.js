import assert from 'node:assert'
import { mdTable } from './mdTable.js'

/**
 * data-set is from https://catalog.data.gov/dataset/fdic-failed-bank-list
 */
const failedBanks = [
  [
    'Bank Name',
    'City',
    'State',
    'Cert',
    'Acquiring Institution',
    'Closing Date',
    'Fund',
  ],
  [':--', ':--:', ':--:', '--', '--', ':--:', '--:'],
  [
    'Signature Bank',
    'New York',
    'NY',
    '57053',
    'Flagstar Bank',
    '12-Mar-23',
    '10540',
  ],
  [
    'Silicon Valley Bank',
    'Santa Clara',
    'CA',
    '24735',
    'First Citizens Bank & Trust Company',
    '10-Mar-23',
    '10539',
  ],
  [
    'Almena State Bank',
    'Almena',
    'KS',
    '15426',
    'Equity Bank',
    '23-Oct-20',
    '10538',
  ],
  [
    'First City Bank of Florida',
    'Fort Walton Beach',
    'FL',
    '16748',
    'United Fidelity Bank',
    '16-Oct-20',
    '10537',
  ],
  [
    'The First State Bank',
    'Barboursville',
    'WV',
    '14361',
    'MVB Bank Inc.',
    '3-Apr-20',
    '10536',
  ],
  [
    'Ericson State Bank',
    'Ericson',
    'NE',
    '18265',
    'Farmers and Merchants Bank',
    '14-Feb-20',
    '10535',
  ],
  [
    'City National Bank of New Jersey',
    'Newark',
    'NJ',
    '21111',
    'Industrial Bank',
    '1-Nov-19',
    '010534',
  ],
  [
    'Resolute Bank',
    'Maumee',
    'OH',
    '58317',
    'Buckeye State Bank',
    '25-Oct-19',
    '10533',
  ],
  [
    'Louisa Community Bank',
    'Louisa',
    'KY',
    '58112',
    'Kentucky Farmers Bank Corporation',
    '25-Oct-19',
    '10532',
  ],
  [
    'The Enloe State Bank',
    'Cooper',
    'TX',
    '10716',
    'Legend Bank',
    '31-May-19',
    '10531',
  ],
  [
    'Washington Federal Bank for Savings',
    'Chicago',
    'IL',
    '30570',
    'Royal Savings Bank',
    '15-Dec-17',
    '10530',
  ],
]

const expFailedBanks = `| Bank Name                           |       City        | State | Cert  | Acquiring Institution               | Closing Date |   Fund |
| :---------------------------------- | :---------------: | :---: | ----- | ----------------------------------- | :----------: | -----: |
| Signature Bank                      |     New York      |  NY   | 57053 | Flagstar Bank                       |  12-Mar-23   |  10540 |
| Silicon Valley Bank                 |    Santa Clara    |  CA   | 24735 | First Citizens Bank & Trust Company |  10-Mar-23   |  10539 |
| Almena State Bank                   |      Almena       |  KS   | 15426 | Equity Bank                         |  23-Oct-20   |  10538 |
| First City Bank of Florida          | Fort Walton Beach |  FL   | 16748 | United Fidelity Bank                |  16-Oct-20   |  10537 |
| The First State Bank                |   Barboursville   |  WV   | 14361 | MVB Bank Inc.                       |   3-Apr-20   |  10536 |
| Ericson State Bank                  |      Ericson      |  NE   | 18265 | Farmers and Merchants Bank          |  14-Feb-20   |  10535 |
| City National Bank of New Jersey    |      Newark       |  NJ   | 21111 | Industrial Bank                     |   1-Nov-19   | 010534 |
| Resolute Bank                       |      Maumee       |  OH   | 58317 | Buckeye State Bank                  |  25-Oct-19   |  10533 |
| Louisa Community Bank               |      Louisa       |  KY   | 58112 | Kentucky Farmers Bank Corporation   |  25-Oct-19   |  10532 |
| The Enloe State Bank                |      Cooper       |  TX   | 10716 | Legend Bank                         |  31-May-19   |  10531 |
| Washington Federal Bank for Savings |      Chicago      |  IL   | 30570 | Royal Savings Bank                  |  15-Dec-17   |  10530 |
`

const cityState = [
  ['City', 'State'],
  ['New York', 'NY'],
  ['Santa Clara', 'CA'],
  ['Almena', 'KS'],
  ['Fort Walton Beach', 'FL'],
  ['Barboursville', 'WV'],
  ['Ericson', 'NE'],
  ['Newark', 'NJ'],
  ['Maumee', 'OH'],
  ['Louisa', 'KY'],
  ['Cooper', 'TX'],
  ['Chicago', 'IL'],
]

const expCityState = `| City              | State |
| ----------------- | ----- |
| New York          | NY    |
| Santa Clara       | CA    |
| Almena            | KS    |
| Fort Walton Beach | FL    |
| Barboursville     | WV    |
| Ericson           | NE    |
| Newark            | NJ    |
| Maumee            | OH    |
| Louisa            | KY    |
| Cooper            | TX    |
| Chicago           | IL    |
`

describe('array/mdTable', () => {
  it('should create a markdown table', () => {
    const table = mdTable(failedBanks)
    assert.equal(table, expFailedBanks)
  })

  it('should left align', () => {
    const table = mdTable(cityState)
    assert.equal(table, expCityState)
  })
})
