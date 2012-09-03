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

## License (MIT)

Copyright (C) 2012 Ben Atkin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[esprima]: http://esprima.org/
