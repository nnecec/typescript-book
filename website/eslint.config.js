import nnecec from '@nnecec/eslint-config'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...nnecec({
    tailwindcss: true,
    typescript: true,
  }),
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
