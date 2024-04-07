export default {
  displayName: 'tech-trand-analyzer',
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['.module.ts', 'global.d.ts', 'main.ts', 'mock', 'index.ts'],
  coverageReporters: ['json-summary', 'lcov', 'text'],
};
