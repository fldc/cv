import js from '@eslint/js';
import markdown from '@eslint/markdown';
import html from 'eslint-plugin-html';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import svelte from 'eslint-plugin-svelte';

export default [
  {
    ignores: ['build/', '.svelte-kit/', 'node_modules/'],
  },
  js.configs.recommended,
  ...markdown.configs.recommended,
  ...[...svelte.configs.recommended, ...svelte.configs.prettier].map(
    (config) => ({ ...config, files: config.files ?? ['**/*.svelte'] })
  ),
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.md'],
    rules: {
      'markdown/heading-increment': 'off',
      'no-irregular-whitespace': 'off',
    },
  },
  {
    files: ['**/*.html'],
    plugins: { html },
  },
];
