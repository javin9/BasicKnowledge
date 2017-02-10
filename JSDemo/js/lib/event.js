/*
 * 发布--订阅插件
 * 
 * @method create 创建命名空间方法
 ****************@param namespace(string) 命名空间
 * 
 * @method trigger 发布订阅事件
 ****************@param key(string) 订阅的名称
 ****************@param 参数 后面叠加
 * 
 * @method listen 订阅事件方法
 ****************@param key(string) 订阅的名称
 ****************@param fn(function) 订阅的回调函数
 ****************@param last 忽略此参数
 * 
 *@method one 订阅事件方法，指订阅一次，重复订阅最后一次为准
 ****************@param key(string) 订阅的名称
 ****************@param fn(function) 订阅的回调函数
 ****************@param last 忽略此参数
 * 
 *@method remove 移除订阅事件
 ****************@param key(string) 订阅的名称
 ****************@param fn(function) 订阅的回调函数
 */

/*
 * 先订阅后发布
 * Event.trigger('hello', 1, 2);
 * 
 * Event.listen('hello', function(a, b) {
 *        console.log(a);
 *        console.log(b);
 * });
 * 
 */

/*
 * 先订阅在发布
 * Event.create('taoche').listen('word', function(a) {
 *   console.log(a);
 * });
 * 
 * Event.create('taoche').trigger('word', "wordddddd");
 *       console.log(Event);
 *  });
 */


var Event = (function() {
	var global = this,
		Event,
		_default = 'default';

	Event = function() {
		var _listen,
			_trigger,
			_remove,
			_slice = Array.prototype.slice,
			_shift = Array.prototype.shift,
			_unshift = Array.prototype.unshift,
			namespaceCache = [],
			_create,
			find,
			each = function(ary, fn) {
				var ret;
				for(var i = 0, len = ary.length; i < len; i++) {
					var n = ary[i];
					ret = fn.call(n, i, n);
				}
				return ret;
			};

		//注册事件
		_listen = function(key, fn, cache) {
			if(!cache[key]) {
				cache[key] = [];
			}
			cache[key].push(fn);
		};
		//移除
		_remove = function(key, cache, fn) {
			if(!!cache[key]) {
				if(!!fn) {
					for(var i = cache[key].length; i >= 0; i--) {
						if(cache[key][i] === fn) {
							cache[key].splice(i, 1); //删除
						}
					}
				} else {
					cache[key] = [];
				}
			}
		};
		_trigger = function() {
			var cache = _shift.call(arguments),
				key = _shift.call(arguments),
				args = arguments,
				_self = this,
				stack = cache[key];
			if(!stack || !stack.length) {
				return;
			}

			return each(stack, function() {
				return this.apply(_self, args);
			});
		};
		_create = function(namespace) {
			var namespace = namespace || _default;
			var cache = {},
				offlineStack = [], //离线事件
				ret = {
					listen: function(key, fn, last) {
						_listen(key, fn, cache);
						if(offlineStack === null) {
							return;
						}
						if(last === 'last') {
							offlineStack.length && offlineStack.pop()();
						} else {
							each(offlineStack, function() {
								this();
							});
						}
						offlineStack = null;
					},
					one: function(key, fn, last) {
						_remove(key, cache);
						this.listene(key, fn, last);
					},
					remove: function(key, fn) {
						_remove(key, cache, fn);
					},
					trigger: function() {
						var fn,
							args,
							_self = this;
						_unshift.call(arguments, cache);
						args = arguments;
						fn = function() {
							return _trigger.apply(_self, args);
						};

						if(offlineStack) {
							return offlineStack.push(fn);
						}
						return fn();
					}
				};

			return namespace ? (
					namespaceCache[namespace] ? namespaceCache[namespace] :
					namespaceCache[namespace] = ret) :
				ret;
		};

		return {
			create: _create,
			one: function(key, fn, last) {
				var event = this.create();
				event.one(key, fn, last);
			},
			remove: function(key, fn) {
				var event = this.create();
				event.remove(key, fn);
			},
			listen: function(key, fn, last) {
				var event = this.create();
				event.listen(key, fn, last);
			},
			trigger: function() {
				var event = this.create();
				event.trigger.apply(this, arguments);
			}
		};

	}();
	return Event;
})();