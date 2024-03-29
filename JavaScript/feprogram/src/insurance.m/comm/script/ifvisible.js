(function() {
  "use strict";
  var addEvent, customEvent, doc, fireEvent, hidden, idleStartedTime, idleTime, ie, ifvisible, init, initialized, status, trackIdleStatus, visibilityChange;
  ifvisible = {};

  doc = document;

  initialized = false;

  status = "active";

  idleTime = 60000;

  idleStartedTime = false;

  customEvent = (function() {
    var S4, addCustomEvent, cgid, fireCustomEvent, guid, listeners;

    S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    guid = function() {
      return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };
    listeners = {};
    cgid = '__ceGUID';
    addCustomEvent = function(obj, event, callback) {
      obj[cgid] = undefined;
      if (!obj[cgid]) {
        obj[cgid] = "ifvisible.object.event.identifier";
      }
      if (!listeners[obj[cgid]]) {
        listeners[obj[cgid]] = {};
      }
      if (!listeners[obj[cgid]][event]) {
        listeners[obj[cgid]][event] = [];
      }
      return listeners[obj[cgid]][event].push(callback);
    };
    fireCustomEvent = function(obj, event, memo) {
      var ev, _i, _len, _ref, _results;

      if (obj[cgid] && listeners[obj[cgid]] && listeners[obj[cgid]][event]) {
        _ref = listeners[obj[cgid]][event];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ev = _ref[_i];
          _results.push(ev(memo || {}));
        }
        return _results;
      }
    };
    return {
      add: addCustomEvent,
      fire: fireCustomEvent
    };
  })();

  addEvent = (function() {
    var setListener;

    setListener = false;
    return function(el, ev, fn) {
      if (!setListener) {
        if (el.addEventListener) {
          setListener = function(el, ev, fn) {
            return el.addEventListener(ev, fn, false);
          };
        } else if (el.attachEvent) {
          setListener = function(el, ev, fn) {
            return el.attachEvent(ev, fn, false);
          };
        } else {
          setListener = function(el, ev, fn) {
            return el['on' + ev] = fn;
          };
        }
      }
      return setListener(el, ev, fn);
    };
  })();

  fireEvent = function(element, event) {
    var evt;

    if (doc.createEventObject) {
      return element.fireEvent('on' + event, evt);
    } else {
      evt = doc.createEvent('HTMLEvents');
      evt.initEvent(event, true, true);
      return !element.dispatchEvent(evt);
    }
  };

  ie = (function() {
    var all, check, div, undef, v;

    undef = void 0;
    v = 3;
    div = doc.createElement("div");
    all = div.getElementsByTagName("i");
    check = function() {
      return (div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->", all[0]);
    };
    while (check()) {
      continue;
    }
    if (v > 4) {
      return v;
    } else {
      return undef;
    }
  })();

  hidden = false;

  visibilityChange = void 0;

  if (typeof doc.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof doc.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
  } else if (typeof doc.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof doc.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }

  trackIdleStatus = function() {
    var timer, wakeUp;

    timer = false;
    wakeUp = function() {
      clearTimeout(timer);
      if (status !== "active") {
        ifvisible.wakeup();
      }
      idleStartedTime = +(new Date());
      return timer = setTimeout(function() {
        if (status === "active") {
          return ifvisible.idle();
        }
      }, idleTime);
    };
    wakeUp();
    addEvent(doc, "mousemove", wakeUp);
    addEvent(doc, "keyup", wakeUp);
    addEvent(window, "scroll", wakeUp);
    return ifvisible.focus(wakeUp);
  };

  init = function() {
    var blur;

    if (initialized) {
      return true;
    }
    if (hidden === false) {
      blur = "blur";
      if (ie < 9) {
        blur = "focusout";
      }
      addEvent(window, blur, function() {
        return ifvisible.blur();
      });
      addEvent(window, "focus", function() {
        return ifvisible.focus();
      });
    } else {
      addEvent(doc, visibilityChange, function() {
        if (doc[hidden]) {
          return ifvisible.blur();
        } else {
          return ifvisible.focus();
        }
      }, false);
    }
    initialized = true;
    return trackIdleStatus();
  };

  ifvisible = {
    setIdleDuration: function(seconds) {
      return idleTime = seconds * 1000;
    },
    getIdleDuration: function() {
      return idleTime;
    },
    getIdleInfo: function() {
      var now, res;

      now = +(new Date());
      res = {};
      if (status === "idle") {
        res.isIdle = true;
        res.idleFor = now - idleStartedTime;
        res.timeLeft = 0;
        res.timeLeftPer = 100;
      } else {
        res.isIdle = false;
        res.idleFor = now - idleStartedTime;
        res.timeLeft = (idleStartedTime + idleTime) - now;
        res.timeLeftPer = (100 - (res.timeLeft * 100 / idleTime)).toFixed(2);
      }
      return res;
    },
    focus: function(callback) {
      if (typeof callback === "function") {
        return this.on("focus", callback);
      }
      status = "active";
      customEvent.fire(this, "focus");
      customEvent.fire(this, "wakeup");
      return customEvent.fire(this, "statusChanged", {
        status: status
      });
    },
    blur: function(callback) {
      if (typeof callback === "function") {
        return this.on("blur", callback);
      }
      status = "hidden";
      customEvent.fire(this, "blur");
      customEvent.fire(this, "idle");
      return customEvent.fire(this, "statusChanged", {
        status: status
      });
    },
    idle: function(callback) {
      if (typeof callback === "function") {
        return this.on("idle", callback);
      }
      status = "idle";
      customEvent.fire(this, "idle");
      return customEvent.fire(this, "statusChanged", {
        status: status
      });
    },
    wakeup: function(callback) {
      if (typeof callback === "function") {
        return this.on("wakeup", callback);
      }
      status = "active";
      customEvent.fire(this, "wakeup");
      return customEvent.fire(this, "statusChanged", {
        status: status
      });
    },
    on: function(name, callback) {
      init();
      return customEvent.add(this, name, callback);
    },
    onEvery: function(seconds, callback) {
      var t;

      init();
      t = setInterval(function() {
        if (status === "active") {
          return callback();
        }
      }, seconds * 1000);
      return {
        stop: function() {
          return clearInterval(t);
        },
        code: t,
        callback: callback
      };
    },
    now: function() {
      init();
      return status === "active";
    }
  };
  if (typeof define === "function" && define.amd) {
    define(function() {
      return ifvisible;
    });
  } else {
    window.ifvisible = ifvisible;
  }
  module.exports = {
    ifvisible:ifvisible
  }
}).call(this);
