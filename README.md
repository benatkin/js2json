Converts JSON-structured JavaScript source to JSON. The JSON-structured
source is JavaScript source that contains some expressions that aren't
valid JSON but can easily be converted to it. For instance, a function
expression will be converted to JSON by taking its source, stripping its
indentation, and putting it into a JSON string. This is currently the
only JavaScript expression that is supported.

This is designed to provide a way to edit CouchApps in a single file by
cloning them directly from CouchDB! Stay tuned for more tools and
documentation to support this workflow.

[Esprima][esprima] is used to find the function definitions. `js2json`
replaces the functions with plain-JSON strings containing the source, 
and removes the required `module.exports = ` fragment and runs the
result through `JSON.parse`.

## synopsis

example.js:

``` javascript
module.exports = {
  "hello": function() {
    /* a comment */
    console.log('Hello, world.');
  }
}
```

run-example.js:

``` javascript
var js2json = require('js2json')
  , fs = require('fs')
  , src = fs.readFileSync('./example.js', 'utf8')
  , obj = js2json.convert(src);
console.log(JSON.stringify(obj, null, 2));
```

output:

```
{
  "hello": "function() {\n  /* a comment */\n  console.log('Hello, world.');\n}"
}
```

[esprima]: http://esprima.org/
