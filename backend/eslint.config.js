// Minimal flat ESLint config for the TRYMINT backend.
// Keeps rules light so development is not blocked.

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      // Allow console logging for now (useful for a hackathon backend).
      'no-console': 'off',
      // So unused args like `_next` in middleware don't error hard.
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  }
];

