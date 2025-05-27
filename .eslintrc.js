module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'react-app',
    'react-app/jest'
  ],
  globals: {
    fbq: 'readonly'
  },
  rules: {
    'no-unused-vars': 'warn'
  }
}; 
