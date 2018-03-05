
module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
  },
  extends:[
    "airbnb-base",
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  // "standard",
  ],
  plugins: [
    "html",
  ],
  // add your custom rules here
  'rules': {
    
  },
  globals:{
    'Vue'
  }
}
