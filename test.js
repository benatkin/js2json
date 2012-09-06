module.exports = {
  "init": function() {
    this.assert = require('assert');
    this.js2json = require('./').init();
    this.values.example = this.values.example.join("\n");
    this.values.exampleFunction = this.values.exampleFunction.join("\n");
    this.values.arrayExample = this.values.arrayExample.join("\n");
  },
  "values": {
    "example": [
      "module.exports = {",
      "  \"hello\": function() {",
      "    /* a comment */",
      "    console.log('Hello, world.');",
      "  }",
      "}"
    ],
    "exampleFunction": [
      "function() {",
      "  /* a comment */",
      "  console.log('Hello, world.');",
      "}",
    ],
    "arrayExample": [
      "module.exports = [",
      "  function() {",
      "    console.log('Hello, world.');",
      "  }",
      "]"
    ]
  },
  "tests": {
    "convert": function() {
      var obj = JSON.parse(this.js2json.convert(this.values.example));
      this.assert.equal(Object.keys(obj).length, 1);
    },
    "unindent": function() {
      var obj = JSON.parse(this.js2json.convert(this.values.example));
      this.assert.equal(obj.hello, this.values.exampleFunction);
    },
    "function in array": function() {
      var obj = JSON.parse(this.js2json.convert(this.values.arrayExample));
      this.assert.ok(/^function/.test(obj[0]));
    }
  },
  "run": function() {
    this.init();
    var passed = true;
    for (var key in this.tests) {
      try {
        this.tests[key].call(this);
        console.log(JSON.stringify(key) + ' passed');
      } catch (err) {
        console.log(JSON.stringify(key) + ' failed');
        console.log(err.stack);
        passed = false;
      }
    }
    process.exit(passed ? 0 : -1);
  }
}
