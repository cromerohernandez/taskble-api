import { expect } from 'chai'
import { dateToDays } from '../../helpers/dates.helper'

describe('dateToDays - basic functionality', () => {
  it('return NaN when passed an empty date', () => {
    const expected = NaN
    const actual = dateToDays()
    expect(actual).to.deep.equal(expected)
  })

  it('return NaN when passed a string', () => {
    const expected = NaN
    const actual = dateToDays('date')
    expect(actual).to.deep.equal(expected)
  })

  it("return the correct date rounded in days when passed today's date in milliseconds", () => {
    const expected = Math.floor(Date.now() / (24 * 60 * 60 * 1000))
    const actual = dateToDays(Date.now())
    expect(actual).to.equal(expected)
  })
})