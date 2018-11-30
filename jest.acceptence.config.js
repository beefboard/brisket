module.exports = {
  moduleFileExtensions: ['js'],
  watchman: false,
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
    '^~~/(.*)$': '<rootDir>/$1'
  },
  testRegex: 'acceptence.spec.js?$',
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  }
}
