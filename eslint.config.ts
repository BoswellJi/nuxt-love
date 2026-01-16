import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  files: [],
  ignores: ['node_modules/**', '.nuxt/**', 'dist/**', 'logs'],
  languageOptions: {
    parserOptions: {
      parser: '@typescript-eslint/parser',
    },
  },
  rules: {
    'vue/html-self-closing': 'off',
    'vue/no-multiple-template-root': 'off',
  },
});
