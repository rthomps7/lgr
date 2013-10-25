var winston = require('winston'),
    util = require('util');

module.exports = exports = function(opts) {
  var utils = {},
      log = winston.loggers.get(opts.name);

  Object.defineProperty(utils, 'stack', {
    get: function () {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack){ return stack; };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }, enumerable: false
  });

  utils.arg_array = function(a, n) {
    var x = Array.prototype.slice.call(a, 0),
        n = n || 0;
    for (var i = 0; i < n; i++) x.shift();
    return x;
  }

  utils.error = utils.e = create_logger('error', process.stdout, console.log);
  utils.warn = utils.e = create_logger('warn', process.stdout, console.log);
  utils.info = utils.e = create_logger('info', process.stdout, console.log);

  return utils;

  function create_logger(lvl) {
    return function(type, msg) {
      var str = util.format('lgr[%s] - %s -', type, msg),
          args = utils.arg_array(arguments, 2);
      args.unshift(str);
      log[lvl].apply(log, args);
    }
  }
}
