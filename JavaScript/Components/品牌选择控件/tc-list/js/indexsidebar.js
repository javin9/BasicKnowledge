!(function (factory) {

    if (typeof module === 'object' && module.export) {
        module.export = factory()
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define([], factory)
    } else if (typeof window !== 'undefined') {
        window.IndexSidebar = factory()
    }

})(function () {

    var extend = function (destination, defaultOptions) {
        for (var k in defaultOptions) {
            if (defaultOptions.hasOwnProperty(k)) {
                destination[k] = destination[k] || defaultOptions[k]
            }
        }
        return destination;
    };

    var defaultOptions = {
        chars: '',
        isAdjust: true,
        offsetTop:110,
        offsetBottom:92,
        lineScale:1,
        charOffsetX: 80,
        charOffsetY: 0,
        containerClassName: 'index-sidebar-container',
        currentCharSelector: "",
        containerSelector: ''
    }

    function IndexSidebar(options) {
        options = options || {};
        this.options = extend(options, defaultOptions);
        this.el = null;
        this.elChar = null;
        this.chars = null;
        this._listeners = {};
        this.init();
    }

    IndexSidebar.prototype.init = function () {
        var that = this,
            options = that.options;
        var chars = options.chars
        var el = document.createElement('div');
        el.className = this.options.containerClassName;// 'index-sidebar-container'
        el.id = this.options.containerClassName;// 'index-sidebar-container'
        el.innerHTML = this.render(chars);
        if (!!this.options.containerSelector) {
            document.querySelector(this.options.containerSelector).appendChild(el);
        } else {
            document.body.appendChild(el);
        }

        that.el = el;
        that.elChar = !!options.currentCharSelector && document.querySelector(options.currentCharSelector);
        that.chars = chars;

        if (options.isAdjust) {
            this.adjust(options);
        }
        this.bindEvent(options);
    }

    IndexSidebar.prototype.render = function (chars) {
        return (
            '<ul>' + [].map.call(chars, function (ch) {
                return '<li>' + ch + '</li>'
            }).join('') +
            '</ul>'
        );
    }

    IndexSidebar.prototype.bindEvent = function (options) {
        var that = this;
        var el = that.el;
        var elChar = that.elChar;
        var chars = that.chars;

        var boxRect = el.getBoundingClientRect();
        var boxHeight = boxRect.height;
        var boxClientTop = boxRect.top;

        var charOffsetX = options.charOffsetX;
        var charOffsetY = options.charOffsetY;

        var touching = false;
        var lastChar;

        // touch events
        if ('ontouchstart' in document) {
            el.addEventListener('touchstart', function (e) {
                if (!touching) {
                    e.preventDefault();
                    var t = e.touches[0];
                    start(t.clientX, t.clientY);
                }
            }, false)
            document.addEventListener('touchmove', function handler(e) {
                if (touching) {
                    e.preventDefault();
                    var t = e.touches[0];
                    move(t.clientX, t.clientY);
                }
            }, false)
            document.addEventListener('touchend', function (e) {
                if (touching) {
                    e.preventDefault();
                    end();
                }
            }, false)
        }
            // mouse events
        else {
            el.addEventListener('mousedown', function (e) {
                if (!touching) {
                    e.preventDefault();
                    start(e.clientX, e.clientY);
                }
            })
            document.addEventListener('mousemove', function (e) {
                if (touching) {
                    e.preventDefault();
                    move(e.clientX, e.clientY);
                }
            })
            document.addEventListener('mouseup', function (e) {
                if (touching) {
                    e.preventDefault();
                    end();
                }
            })
        }

        function start(clientX, clientY) {
            touching = true;
            elChar.style.display = 'block';
            move(clientX, clientY);
        }
        function move(clientX, clientY) {
            var offset = calcRelativePosition(clientY);//y
            var percent = offset / boxHeight;//距离顶部的百分比
            var ch = getPositionChar(percent);//获取这个百分比出的字符

            updateChar(clientX, clientY, ch);
        }

        function end() {
            touching = false;
            elChar.style.display = 'none';
        }

        function updateChar(clientX, clientY, ch) {
            // var x = Math.max(clientX, charOffsetX);
            var yMin = boxClientTop;
            var yMax = window.innerHeight - charOffsetY;//window.innerHeight - charOffsetY;
            var y = Math.min(Math.max(clientY, yMin), yMax);

            elChar.textContent = ch;

            if (ch && lastChar !== ch) {
                lastChar = ch;
                that.trigger('charChange', ch);
            }
        }
        //计算位置
        function calcRelativePosition(clientY) {
            var y = clientY - boxClientTop;
            if (y < 0) {
                y = 0;
            } else if (y > boxHeight) {
                y = boxHeight;
            }
            return y;
        }

        //根据百分比获取字符
        function getPositionChar(yPercent) {
            var min = 1;
            var max = chars.length;
            var index = Math.ceil(yPercent * max);
            if (index < min) {
                index = min;
            } else if (index > max) {
                index = max;
            }
            return chars[index - 1];
        }
    }

    IndexSidebar.prototype.adjust = function (options) {
        var charCount = options.chars.length;

        var expectHeight = window.innerHeight - options.offsetTop;// - options.offsetBottom;
        var expectLineHeight = expectHeight / charCount;
        var expectFontSize = expectLineHeight * options.lineScale;

        var style = this.el.querySelector('ul').style;
        style.lineHeight = expectLineHeight + 'px';
        style.fontSize = expectFontSize + 'px';
    }

    /* 发布订阅接口 */
    IndexSidebar.prototype.trigger = function (event, data) {
        var listeners = this._listeners && this._listeners[event];
        if (listeners) {
            listeners.forEach(function (listener) {
                listener(data);
            })
        }
    }

    IndexSidebar.prototype.on = function (event, callback) {
        this._listeners = this._listeners || {}
        var listeners = this._listeners[event] || (this._listeners[event] = [])
        listeners.push(callback);
    }

    IndexSidebar.prototype.off = function (event, callback) {
        var listeners = this._listeners && this._listeners[event];
        if (listeners) {
            var i = listeners.indexOf(callback);
            if (i > -1) {
                listeners.splice(i, 1);
                if (listeners.length === 0) {
                    this._listeners[event] = null;
                }
            }
        }
    }

    return IndexSidebar

})