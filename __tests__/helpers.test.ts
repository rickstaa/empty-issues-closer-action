/**
 * @file Helper functions test file.
 *
 * @remark This file does not test functions that wrap external calls to the GitHub client.
 */
import {str2bool} from '../src/helpers'

// == Tests ==
describe('str2bool', () => {
  it("should return true for 'TRUE'", () => {
    expect(str2bool('TRUE')).toBe(true)
  })

  it("should return true for 'True'", () => {
    expect(str2bool('True')).toBe(true)
  })

  it("should return true for 'true'", () => {
    expect(str2bool('true')).toBe(true)
  })

  it("should return false for 'FALSE'", () => {
    expect(str2bool('FALSE')).toBe(false)
  })

  it("should return false for 'False'", () => {
    expect(str2bool('False')).toBe(false)
  })

  it("should return false for 'false'", () => {
    expect(str2bool('false')).toBe(false)
  })

  it("should return false for 'other'", () => {
    expect(str2bool('other')).toBe(false)
  })
})
