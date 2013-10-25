var util = require('util');

module.exports = exports = function(opts) {
  var utils = require('./utils')(opts);
      def_property = {
        get: function() {
          var stack = utils.stack[1],
              line = stack.getLineNumber(),
              file = stack.getFileName();
          return create_note(file, line);
        }
      }

  return def_property;

  function create_note(file, line) {
    return function(msg) {
      log('info', file, line, msg);
    }
  }

  function log(lvl, file, line, msg) {
    var str = util.format('%s@%s', file, line);
    utils[lvl]('note', str, msg);
  }
}

