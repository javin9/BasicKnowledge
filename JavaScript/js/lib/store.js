var store = (function() {
	"use strict";
	// Store.js
	var store = {},
		win = (typeof window != 'undefined' ? window : global),
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage;
	/*
	 * loacalStorage是否可用;
	 */
	store.disabled = false;
	/*
	 * 版本号
	 */
	store.version = '1.0.0';
	/*
	 * 设置localStorage的值 设置成功返回设置的值 设置失败返回false
	 * @param key (string)
	 * @param value (string) 如果value没传入，相当于删除操作
	 * @param expireTimeInSecond 过期时间 单位秒  ,undefined、0、string字符串、NaN、-1,空字符串 都视为没有设置过期时间；
	 * @returns 真实给localStorage设置上的值
	 */
	store.set = function(key, value, expireTimeInSecond) {}
		/*
		 * 获取value值
		 * @param kye(string)
		 * @returns 返回值，如果获取不到或者失败，返回null
		 */
	store.get = function(key) {}
		/*
		 * 判断有没有key
		 * @param key(string)
		 * @returns true 或者 false；
		 */
	store.has = function(key) {
			var value = store.get(key);
			return value === undefined || value === null ? false : true;
		}
		/*
		 * 删除操作
		 * @param key(string)
		 */
	store.remove = function(key) {}
		/*
		 * 清空所有的存储
		 */
	store.clear = function() {}
	store.transact = function(key, defaultVal, transactionFn) {
		if(transactionFn == null) {
			transactionFn = defaultVal;
			defaultVal = null;
		}
		if(defaultVal == null) {
			defaultVal = {};
		}
		var val = store.get(key, defaultVal);
		var ret = transactionFn(val);
		store.set(key, ret === undefined ? val : ret);
	}
	store.getAll = function() {
		var ret = {};
		store.forEach(function(key, val) {
			ret[key] = val;
		})
		return ret;
	}
	store.forEach = function() {}
	store.serialize = function(value) {
		return JSON.stringify(value);
	}
	store.deserialize = function(value) {
		if(typeof value !== 'string') {
			return undefined;
		}
		try {
			return JSON.parse(value);
		} catch(e) {
			return value || undefined;
		}
	}

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try {
			return(localStorageName in win && win[localStorageName]);
		} catch(err) {
			return false;
		}
	}
	if(isLocalStorageNameSupported()) {
		storage = win[localStorageName];
		store.set = function(key, val, expireTimeInSecond) {
			var realValue = {};
			if(!key) {
				return false; //如果key未负值，则直接返回
			}
			//为空则删除
			if(val === undefined) {
				return store.remove(key);
			}
			realValue.value = val;
			//过期时间处理,如果没有输入，则默认是没设置；
			expireTimeInSecond = Number(expireTimeInSecond);
			if(!expireTimeInSecond) {
				expireTimeInSecond = -1; //没设置过期时间
			}
			realValue.expires = expireTimeInSecond === -1 ? -1 : Date.now() + expireTimeInSecond * 1000;
			//存储
			storage.setItem(key, store.serialize(realValue));
			return val;
		}
		store.get = function(key) {
			if(typeof key !== 'string') {
				return null;
			}

			var tempVal = null;

			try {
				tempVal = storage.getItem(key);
			} catch(e) {
				return null;
			}

			if(!tempVal) {
				return null;
			}
			var valueObj = store.deserialize(tempVal);
			if(!!valueObj) {
				var expires = valueObj.expires; //过期时间
				//没有设置过期时间
				if(expires === -1) {
					return valueObj.value;
				}
				//大于过期时间
				if(Date.now() > expires) {
					// 过期处理
					store.remove(key);
					return null;
				}

				return valueObj.value;
			} else {
				return null;
			}
		}
		store.remove = function(key) {
			if(typeof key !== 'string') {
				return;
			}
			try {
				storage.removeItem(key);
			} catch(e) {
				console.log(e);
			}
		}
		store.clear = function() {
			storage.clear();
		}
		store.forEach = function(callback) {
			for(var i = 0; i < storage.length; i++) {
				var key = storage.key(i);
				callback(key, store.get(key));
			}
		}
	} else if(doc && doc.documentElement.addBehavior) {
		console.log('ddd');
		var storageOwner,
			storageContainer;
		try {
			storageContainer = new ActiveXObject('htmlfile');
			storageContainer.open();
			storageContainer.write('<' + scriptTag + '>document.w=window</' + scriptTag + '><iframe src="/favicon.ico"></iframe>');
			storageContainer.close();
			storageOwner = storageContainer.w.frames[0].document;
			storage = storageOwner.createElement('div');
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div');
			storageOwner = doc.body;
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(storage);
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage);
				storage.addBehavior('#default#userData');
				storage.load(localStorageName);
				var result = storeFunction.apply(store, args);
				storageOwner.removeChild(storage);
				return result;
			}
		}

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
		var ieKeyFix = function(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___');
		}
		store.set = withIEStorage(function(storage, key, val) {
			var realValue = {};
			key = ieKeyFix(key);
			if(!key) {
				return false; //如果key未负值，则直接返回
			}
			if(val === undefined) {
				return store.remove(key);
			}

			realValue.value = val;

			//过期时间处理,如果没有输入，则默认是没设置；
			expireTimeInSecond = Number(expireTimeInSecond);
			if(!expireTimeInSecond) {
				expireTimeInSecond = -1; //没设置过期时间
			}
			realValue.expires = expireTimeInSecond === -1 ? -1 : Date.now() + expireTimeInSecond * 1000;

			storage.setAttribute(key, store.serialize(realValue));
			storage.save(localStorageName);
			return val;
		})
		store.get = withIEStorage(function(storage, key) {
			key = ieKeyFix(key);
			if(typeof key !== 'string') {
				return null;
			}
			var tempVal = null;
			try {
				tempVal = storage.getAttribute(key);
			} catch(e) {
				return null;
			}
			if(!tempVal) {
				return null;
			}
			var valueObj = store.deserialize(tempVal);
			if(!!valueObj) {
				var expires = valueObj.expires; //过期时间
				//没有设置过期时间
				if(expires === -1) {
					return valueObj.value;
				}
				//大于过期时间
				if(Date.now() > expires) {
					// 过期处理
					store.remove(key);
					return null;
				}

				return valueObj.value;
			} else {
				return null;
			}
		})
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key);
			storage.removeAttribute(key);
			storage.save(localStorageName);
		})
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes;
			storage.load(localStorageName);
			for(var i = attributes.length - 1; i >= 0; i--) {
				storage.removeAttribute(attributes[i].name);
			}
			storage.save(localStorageName);
		})
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes;
			for(var i = 0, attr; attr = attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)));
			}
		})
	}

	try {
		var testKey = '__storejs__'
		store.set(testKey, testKey)
		if(store.get(testKey) != testKey) {
			store.disabled = true
		}
		store.remove(testKey)
	} catch(e) {
		store.disabled = true
	}
	store.enabled = !store.disabled

	return store
}());