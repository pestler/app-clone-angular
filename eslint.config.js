import js from '@eslint/js';
import angular from 'angular-eslint';
import prettierConfig from 'eslint-config-prettier';
import pluginPlaywright from 'eslint-plugin-playwright';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/', '.angular/', 'node_modules/', 'coverage/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ['**/*.ts'],
  })),
  ...tseslint.configs.stylistic.map((config) => ({
    ...config,
    files: ['**/*.ts'],
  })),

  ...angular.configs.tsRecommended.map((config) => ({
    ...config,
    files: ['**/*.ts'],
  })),

  {
    files: ['src/**/*.ts'], // Apply Angular-specific rules only to src files
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.jasmine,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },

  // Playwright specific configuration
  {
    files: ['e2e/**/*.ts'],
    plugins: {
      playwright: pluginPlaywright,
    },
    rules: {
      ...pluginPlaywright.configs.recommended.rules,
    },
  },

  ...angular.configs.templateRecommended.map((config) => ({
    ...config,
    files: ['**/*.html'],
  })),
  ...angular.configs.templateAccessibility.map((config) => ({
    ...config,
    files: ['**/*.html'],
  })),

  {
    files: ['**/*.html'],
    rules: {},
  },

  prettierConfig,
];
