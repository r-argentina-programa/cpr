module.exports = {
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['airbnb', 'prettier'],
  plugins: ['prettier', 'jest', 'plugin:cypress/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        singleQuote: true,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [0],
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 0,
  },
};
