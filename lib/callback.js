var util = require('util');

module.exports = exports = function(opts) {
  var utils = require('./utils')(opts);
      def_property = {
        get: function() {
          var stack = utils.stack[1],
              line = stack.getLineNumber(),
              file = stack.getFileName();
          return create_callback(file, line);
        }
      }

  return def_property;

  function create_callback(file, line) {
    return function(fn) {
      return function(m) {
        var m = m || {},
            stack = utils.stack[1],
            eline = stack.getLineNumber(),
            efile = stack.getFileName(),
            arr = [file, line, efile, eline, m.error]
        if (m.error) return log('error', file, line, efile, eline, m.error);
        else if (m.warn) log('warn', file, line, efile, eline, m.warn);
        else if (m.info) log('info', file, line, efile, eline, m.info);
        else if (m) return log('info', file, line, efile, eline, m);
        fn.apply(this, arguments);
      }
    }
  }

  function log(lvl, def_file, def_n, call_file, call_n, data) {
    var str = util.format('defined at %s@%d | called at %s@%d',
                          def_file, def_n, call_file, call_n);
    utils[lvl]('callback', str, data);
  }
}
