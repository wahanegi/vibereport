module.exports = {
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'svg'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    "^.+\\.svg$": "<rootDir>/svgTransform.js"
  },
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/javascript/$1',
    "^ramda$": "ramda/src/index.js",
    "^ramda/es/(.*)$": "ramda/src/$1"
  },
  testEnvironment: 'jsdom',
};