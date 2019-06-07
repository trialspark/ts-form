module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'airbnb',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:jest/recommended',
  ],
  globals: {},
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['test/**', '**/*.spec.{ts,tsx,js,jsx}', 'example/**'] },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/prop-types': 'off',
  },
  overrides: [
    {
      files: ['*.spec.ts'],
      env: {
        'jest/globals': true,
      },
      rules: {},
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
    },
  },
};
