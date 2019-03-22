const { typePrettier } = require('./config/typeConfig');

module.exports = typePrettier({
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
});
