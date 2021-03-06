module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  watchman: false,
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/$1',
    '^~~/(.*)$': '<rootDir>/$1'
  },
  testPathIgnorePatterns: ['acceptance.spec.js'],
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
  },
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
    '<rootDir>/layouts/*.vue',
    '<rootDir>/store/*.js',
    '<rootDir>/middleware/*.js',
    '<rootDir>/plugins/axiosTokenInjector.js'
  ],
  verbose: true
}
