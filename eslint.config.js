import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginImport from 'eslint-plugin-import';
import parser from '@typescript-eslint/parser';
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default [
  {
    plugins: {
      react: eslintPluginReact,
      'jsx-a11y': eslintPluginJsxA11y,
      import: eslintPluginImport,
      '@typescript-eslint': import('@typescript-eslint/eslint-plugin'),
    },
    languageOptions: {
      parser, 
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname, 
        ecmaVersion: 2020,
        sourceType: 'module', 
        ecmaFeatures: {
          jsx: true, 
        },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/no-redundant-roles': 'warn',
      'jsx-a11y/alt-text': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['eslint.config.js', 'vite.config.ts'],
  },
];
