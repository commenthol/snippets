import globals from 'globals'
import pluginPrettier from 'eslint-plugin-prettier/recommended'

const { node, mocha, browser } = globals

const config = [
  { languageOptions: { globals: { ...node, ...mocha, ...browser } } },
  pluginPrettier,
  {
    rules: {
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_$',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_err$',
        },
      ],
    },
  },
  {
    ignores: ['coverage/', 'docs/', 'dist', 'lib/', 'tmp/', 'package/'],
  },
]

export default config
