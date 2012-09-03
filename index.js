module.exports = {
  "init": function() {
    this._ready = true;
    this.assert = require('assert');
    this.esprima = require('esprima');
    return this;
  },
  "convert": function(moduleSource) {
    if (! this._ready) {
      this.init();
    }
    var parsedModule = this.parseModule(moduleSource);
    var ranges = this.findRanges(parsedModule);
    var replaced = this.replaceRanges(moduleSource, ranges);
    return this.parseJson(replaced);
  },
  "parseModule": function(expression) {
    return this.esprima.parse(expression, { range: true });
  },
  "findRanges": function(parsedModule) {
    var ranges = [];
    var ok = this.assert.ok;
    ok(parsedModule.body,'parsed result should have a program body');
    ok(parsedModule.body.length == 1, 'parsed result should have one statement');
    ok(parsedModule.body[0].type == 'ExpressionStatement', 'root statement should be an expression');
    var assignment = parsedModule.body[0].expression;
    ok(assignment.type == 'AssignmentExpression', 'root statement should be an assignment expression');
    ok(assignment.left.object.type == 'Identifier', 'root statement should be a module.exports assignment');
    ok(assignment.left.object.name == 'module', 'root statement should be a module.exports assignment');
    ok(assignment.left.property.type == 'Identifier', 'root statement should be a module.exports assignment');
    ok(assignment.left.property.name == 'exports', 'root statement should be a module.exports assignment');
    ranges.push({type: 'exports', start: assignment.left.range[0], end: assignment.right.range[0] - 1});
    this.findRangesInExpression(assignment.right, ranges);
    return ranges;
  },
  "findRangesInExpression": function(expression, ranges) {
    var values = [], value;

    if (expression.type == 'ObjectExpression') {
      for (var i=0; i < expression.properties.length; i++) {
        values.push(expression.properties[i].value);
      }
    } else if (expression.type == 'ArrayExpression') {
      // TODO: put array values in values variable
    } else if (expression.type == 'FunctionExpression') {
      // in case the source has the form: module.exports = function() { /*src* }
      ranges.push({type: 'function', start: expression.range[0], end: expression.range[1]});
    }

    for (var i=0; i < values.length; i++) {
      value = values[i];
      if (value.type == 'FunctionExpression') {
        ranges.push({type: 'function', start: value.range[0], end: value.range[1]})
      } else if (value.type == 'ObjectExpression' || value.type == 'ArrayExpression') {
        this.findRangesInExpression(value, ranges);
      }
    }
  },
  "replaceRanges": function(expression, ranges) {
    var result = expression, token;
    for (var i = ranges.length - 1; i >= 0; i--) {
      if (ranges[i].type == 'function') {
        token = JSON.stringify(this.prepareFunction(result.substring(ranges[i].start, ranges[i].end + 1)));
      } else {
        token = '';
      }
      var parts = [result.substring(0, ranges[i].start), token, result.substring(ranges[i].end + 1)];
      result = parts.join('');
    }
    return result;
  },
  "prepareFunction": function(functionSource) {
    var lines = functionSource.split("\n"), i, match, indent, indentString;
    if (lines.length >= 3) {
      match = /^\s+/.exec(lines[lines.length - 1]);
      if (match) {
        indentString = match[0].toString();
        indent = indentString.length;
        for (var i=1; i < lines.length; i++) {
          if (lines[i].substr(0, indent) === indentString) {
            lines[i] = lines[i].substr(indent);
          } else {
            return functionSource;
          }
        }
        return lines.join("\n");
      } else {
        return functionSource;
      }
    } else {
      return functionSource;
    }
  },
  "parseJson": function(expression) {
    return JSON.parse(expression);
  }
}
