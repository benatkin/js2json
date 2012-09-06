module.exports = {
  "init": function() {
    this._ready = true;
    this.falafel = require('falafel');
    return this;
  },
  "convert": function(moduleSource) {
    if (! this._ready) {
      this.init();
    }
    var exportsRemoved = false;
    var that = this;
    var replaced = this.falafel(moduleSource, function(node) {
      if (!exportsRemoved && node.type == 'AssignmentExpression') {
        that.removeExports(node);
        exportsRemoved = true;
      } else if (node.type == 'FunctionExpression') {
        that.replaceFunction.call(that, node);
      }
    }).toString();
    return replaced;
  },
  "removeExports": function(node) {
    var msg = 'assignment must be to module.exports';
    if (node.type == 'AssignmentExpression'
        && node.left.object.type == 'Identifier'
        && node.left.object.name == 'module'
        && node.left.property.type == 'Identifier'
        && node.left.property.name == 'exports') {
      node.update(node.right.source());
    }
  },
  "replaceFunction": function(node) {
    node.update(JSON.stringify(this.prepareFunction(node.source())));
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
