module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/javascript/$1',
  },
  testEnvironment: 'jsdom',
};