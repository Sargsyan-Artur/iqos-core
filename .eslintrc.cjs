module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:sonarjs/recommended',
      'airbnb',
      'airbnb-typescript'
    ],
    overrides: [
      {
        files: ['**/*.stories.tsx', '**/*.test.tsx'],
        rules: {
          'import/no-extraneous-dependencies': 0,
          'react/jsx-props-no-spreading': 0,
          'no-console': 0,
        }
      }
    ],
    ignorePatterns: [
      '*.cjs',
      '*.setup.js',
      'vite.config.ts',
      'dist',
      'storybook-static',
      'coverage'
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      project: './tsconfig.json',
      sourceType: 'module'
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      }
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    // if a rule has fixer put warn instead of error
    rules: {
      'import/prefer-default-export': 0,
      'implicit-arrow-linebreak': 0,
      'operator-linebreak': 0,
      'function-paren-newline': 0,
      'react/prop-types': 0,
      'react/react-in-jsx-scope': 0,
      'react/function-component-definition': 0,
      'react/require-default-props': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/comma-dangle': 0,
      '@typescript-eslint/indent': 0,
      "linebreak-style": 0,
      'max-depth': ['error', 4],
      'max-nested-callbacks': ['error', 3],
      'max-params': ['error', 3],
      curly: ['warn', 'all'],
      'prettier/prettier': [
        'warn',
        {
          parser: 'typescript'
        }
      ],
      'max-statements-per-line': [
        'warn',
        {
          max: 1
        }
      ],
      'func-style': [
        'warn',
        'declaration',
        {
          allowArrowFunctions: true
        }
      ],
      'object-curly-newline': [
        'warn',
        { ImportDeclaration: { minProperties: 5, multiline: true } }
      ],
      '@typescript-eslint/semi': ['warn', 'always'],
      'no-console': ['error']
    }
  };
