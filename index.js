// TODO:
//
//  -- Logging handler
//  -- Better Callback usage
//  -- Something like describe('test this' that logs stuff
//  -- Note: Objects cna have a getter, so they can be variable
//

function logger() {
  var e = {};

  Object.defineProperty(e, 'cb', {
    get: function() {
      var line = e.__stack[1].getLineNumber();
      return create_callback(line);;
    }
  });

  function create_callback(line) {
    return function(fn) {
      return function(m) {
        var m = m || {},
            eline = e.__stack[1].getLineNumber(),
            lmsg = 'on line ' + eline + ' called from line ' + line;
        if (m.error) return e.log.e(lmsg, m.error);
        else if (m.warn) e.log.w(lmsg, m.warn);
        else if (m.info) e.log(lmsg, m.info);
        else if (m) e.log(m);
        fn.apply(this, arguments);
      }
    }
  }

  e.log = function(a, b) {
    var b = arguments.length == 2 ? b : a,
        a = arguments.length == 2 ? a : '';
    if (a && a.length) a = ' ' + a + ' ';
    process.stderr.write('[INFO]: ');
    console.log.call(console, b);
  }

  e.log.error = e.log.e = function(a, b) {
    var b = arguments.length == 2 ? b : a,
        a = arguments.length == 2 ? a : '';
    if (a && a.length) a = ' ' + a;
    process.stderr.write("[ERROR]: ");
    console.error.call(console, b);
  }

  e.log.warn = e.log.w = function(a, b) {
    var b = arguments.length == 2 ? b : a,
        a = arguments.length == 2 ? a : '';
    if (a && a.length) a = ' ' + a + ' ';
    process.stderr.write('[WARNING' + a + ']: ');
    console.warn.call(console, b);
  }
/*
  e.callback = e.cb = function(fn) {
    var callee = arguments.callee.caller;
  }  */

  e.error = e.e = function(x) {
    return { error: x };
  }

  e.warn = e.w = function(x) {
    return { warn: x };
  }
  e.info = e.i = function(x) {
    return { info: x };
  }

  Object.defineProperty(e, '__stack', {
    get: function() {
      var orig = Error.prepareStackTrace;
      Error.prepareStackTrace = function(_, stack){ return stack; };
      var err = new Error;
      Error.captureStackTrace(err, arguments.callee);
      var stack = err.stack;
      Error.prepareStackTrace = orig;
      return stack;
    },
    enumerable: false
  });

  return e;
}

// 


var l = logger();

// Can have different handlers. e.y continues, e.n stops, e.d needs datum, etc
doSomething(5, l.cb(function(d) {
  console.log('datum', d);
}))


function doSomething(x, cb) {
  cb(l.w('Not the right thing'), 1000);
}


