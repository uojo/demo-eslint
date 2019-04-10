module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
  },
  env: {},
  extends: [],
  plugins: [],
  // add your custom rules here
  rules: {
    'valid-jsdoc': 'error',
    'require-jsdoc': ["error", {
      "require": {
        "FunctionDeclaration": false,
        "MethodDefinition": false,
        "ClassDeclaration": false,
        "ArrowFunctionExpression": false,
        "FunctionExpression": false
      }
    }]
  },
  globals: {}
}