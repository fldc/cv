import js from '@eslint/js';
import markdown from '@eslint/markdown';
import html from 'eslint-plugin-html';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';

export default [
  {
    ignores: ['build/', '.svelte-kit/', 'node_modules/'],
  },
  js.configs.recommended,
  ...markdown.configs.recommended,
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
    files: ['src/**/*.js'],
  },
  {
    files: ['src/**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        extraFileExtensions: ['.svelte'],
      },
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
