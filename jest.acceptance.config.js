module.exports = {
  moduleFileExtensions: ['js', 'json'],
  watchman: false,
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
    '^~~/(.*)$': '<rootDir>/$1'
  },
  testRegex: 'acceptance.spec.js?$'
}
