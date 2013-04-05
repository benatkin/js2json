Converts JSON-structured JavaScript source to JSON. The JSON-structured
source is JavaScript source that contains some expressions that aren't
valid JSON but can easily be converted to it. For instance, a function
expression will be converted to JSON by taking its source, stripping its
indentation, and putting it into a JSON string. This is currently the
only JavaScript expression that is supported.

Goes with [json2js][json2js] to support modifying a CouchApp design
document in a single file.

Stay tuned for more tools to enable editing CouchApp design documents
in their original form.

# synopsis

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
  , json = js2json.convert(src)
  , obj = JSON.parse(json);
console.log(json);
console.log(obj.hello);
```

output:

```
{
  "hello": "function() {\n  /* a comment */\n  console.log('Hello, world.');\n}"
}

function() {
  /* a comment */
  console.log('Hello, world.');
}
```

# cli usage

Installing:

```
$ npm install -g js2json
```

Running:

```
$ js2json input.json
```

The json data will be printed to stdout.


# License (MIT)

Copyright (C) 2012 Ben Atkin

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[json2js]: https://npmjs.org/package/json2js
[esprima]: http://esprima.org/

