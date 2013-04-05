module.exports = {
  "init": function() {
    this.read_file_sync = require('fs').readFileSync;
    var js2json = require('./');
    this.convert = js2json.convert.bind(js2json);
    this.write = process.stdout.write.bind(process.stdout);
    this.args = process.argv.slice(2);
  },
  "parse": function() {
    this.input_file = this.args[0];
    if (this.args.length == 1) {
      delete this['args'];
    } else if (this.args.length == 0) {
      this.error = 'No filename given.';
    } else {
      this.error = 'Too many arguments.';
    }
  },
  "run": function() {
    this.input_text = this.read_file_sync(this.input_file, 'utf8');
    this.output_text = this.convert(this.input_text);
    this.write(this.output_text);
  },
  "usage": function() {
    this.write('error: ' + this.error + "\n\n" + 'usage: js2json input-file' + "\n");
  },
  "exec": function() {
    this.init();
    this.parse();
    if (typeof this.error == 'undefined') {
      this.run();
    } else {
      this.usage();
    }
  }
}
