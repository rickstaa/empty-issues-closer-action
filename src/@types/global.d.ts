/**
 * Add global types.
 */

// Complete typescript error object.
declare interface Error {
  name: string
  message: string
  stack?: string
  code?: number | string
}
