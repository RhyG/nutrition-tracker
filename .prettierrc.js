module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'all',
  importOrder: ['<THIRD_PARTY_MODULES>', '^@features/(.*)$', '^@app/(.*)$', '^@components/(.*)$', '^@hooks/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  printWidth: 160,
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
