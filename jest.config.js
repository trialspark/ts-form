module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
      isolatedModules: true,
      diagnostics: false,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.ts'],
};
