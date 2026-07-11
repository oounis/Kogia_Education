// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      // App entièrement en français : les apostrophes dans le JSX sont voulues.
      'react/no-unescaped-entities': 'off',
      // @core est un alias Metro (metro.config.js) qu'ESLint ne connaît pas.
      'import/no-unresolved': ['error', { ignore: ['^@core/'] }],
      // (Les règles React-Compiler ont été retirées : eslint-plugin-react-hooks
      // v5 — celui du SDK 54 — ne les connaît pas et ESLint plantait.)
      // Faux positif sur le patron d'icônes (import * as L + L[name]).
      'import/namespace': 'off',
    },
  },
])
