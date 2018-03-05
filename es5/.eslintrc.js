
module.exports = {
  root: true,
  parserOptions: {
    // sourceType: 'module'
  },
  env: {
    browser: true,
    node:true,
    commonjs:true,
    qunit:true,
  },
  extends:[
    // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
    // extends: 'standard',
    "airbnb-base/legacy",
  ],
  plugins: [
    "html",
    // "vue"
  ],
  // add your custom rules here
  'rules': {
    "no-new":0,
    "no-unused-vars":0
  },
  globals:{
    "Vue":true,
    // "Vuex":false,
    // "VueRouter":true
  }

}
