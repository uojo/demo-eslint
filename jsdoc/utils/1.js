function foo() {
  // FunctionDeclaration
  return 10;
}

var foo = () => {
  // ArrowFunctionExpression
  return 10;
};

class Foo {
  // ClassDeclaration
  bar() {
    // MethodDefinition
      return 10;
  }
}

var foo = function() {
  // FunctionExpression
  return 10;
};

var foo = {
  // FunctionExpression
  bar: function() {
      return 10;
  },

  baz() {
      return 10;
  }
};