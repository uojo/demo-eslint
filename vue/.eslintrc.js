
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends:[
    "airbnb-base",
    "plugin:vue/recommended"

    // "plugin:vue/strongly-recommended"
  ],
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  // extends: 'standard',
  // required to lint *.vue files
  plugins: [
    // "html",
    // "vue"
  ],
  // add your custom rules here
  'rules': {
    /* "vue/max-attributes-per-line": [2, {
      "singleline": 1,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }], */
    'quote-props': ["error"],
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    //禁止直接使用 Object.prototypes 的内置属性
    "no-prototype-builtins":0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 强制使用有效的 JSDoc 注释
    "valid-jsdoc": 1,
    "space-before-function-paren": 0,
    "no-inner-declarations":0,
    "no-extend-native":0// 可以使用扩展方法
  }
}
