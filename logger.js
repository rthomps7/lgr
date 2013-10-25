var winston = require('winston');

module.exports = exports = lgr;

function lgr(opts) {
  var self = {},
      opts = opts || {};
  opts.name = opts.anme || 'lgr_default';
  opts.winston = opts.winston || {
    console: { level: 'info', colorize: 'true', prettyPrint: true }
  };
  winston.loggers.add(opts.name, opts.winston);

  var callback = require('./lib/callback')(opts),
      note = require('./lib/note')(opts);
  Object.defineProperty(self, 'cb', callback);
  Object.defineProperty(self, 'callback', callback);
  Object.defineProperty(self, 'note', note);
  Object.defineProperty(self, 'n', note);

  return self;
}
