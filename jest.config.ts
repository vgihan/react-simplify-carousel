import { type Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+[.tsx|.ts|.jsx|.js]$': '<rootDir>/test/transformers/main.js',
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^.+\\.css?$': '<rootDir>/test/mocks/css.js',
  },
  extensionsToTreatAsEsm: ['.tsx', '.ts', '.jsx'],
  cache: false,
};

export default config;
