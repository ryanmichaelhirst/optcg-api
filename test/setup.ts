// Test setup file
import { afterAll, beforeAll } from 'vitest'

// Set test environment
process.env.NODE_ENV = 'test'

beforeAll(() => {
  // Setup any test environment variables
  process.env.NODE_ENV = 'test'
})

afterAll(() => {
  // Cleanup after tests
}) 