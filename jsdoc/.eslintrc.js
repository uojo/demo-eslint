module.exports = {
  root: true,
  parserOptions: {},
  env: {},
  extends: [],
  plugins: [],
  // add your custom rules here
  rules: {
    'valid-jsdoc': 'error',
    'require-jsdoc': ["error", {
      "require": {
        "FunctionDeclaration": true,
        "MethodDefinition": false,
        "ClassDeclaration": false,
        "ArrowFunctionExpression": false,
        "FunctionExpression": false
      }
    }]
  },
  globals: {}
}