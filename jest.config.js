/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['/modules', '/_modules'],
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  maxConcurrency: 1,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  coveragePathIgnorePatterns: [],
}
