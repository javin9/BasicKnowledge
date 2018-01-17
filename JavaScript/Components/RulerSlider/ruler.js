	var Ruler = (function() {
	    var Ruler = function(options) {
	        /*默认参数*/
	        this.settings = {
	            data: undefined,
	            rulerid: null,
	            ratioText: null,
	            ratioindex: 0,
	            ontransitionend: null,
	            onafterinit: null,
	            titleFn: null,
	            onstart: null,
	            onmove: null,
	            onend: null
	        }
	        this.settings = extend(this.settings, options);
	    };
	    Ruler.prototype.init = function(options) {

	        if (!this.validator()) {
	            return false;
	        }

	        this.createRatio();
	        this.bindEvent();
	        this.initRatio();
	        this.afterinit();

	    };
	    Ruler.prototype.afterinit = function() {
	        typeof this.settings.onafterinit === "function" && this.settings.onafterinit.call(this, this.settings.data);
	    };
	    Ruler.prototype.initRatio = function() {
	        var settings = this.settings,
	            rationTextLen = settings.ratioText.length,
	            ratioindex = settings.ratioindex,
	            progressBar = settings.progressBar,
	            progressBtn = settings.progressBtn;

	        if (rationTextLen === 1 && ratioindex === 0) {
	            var percent = "50%";
	            window.setTimeout(function() {
	                var transition = "all 0.5s ease";
	                progressBar.style.webkitTransition = transition;
	                progressBar.style.width = percent;
	                addEnd(progressBar, end);

	                progressBtn.style.webkitTransition = transition;
	                progressBtn.style.left = percent;

	            }, 100);
	        }

	        if (ratioindex > 0) {
	            var percent = (ratioindex / (rationTextLen - 1)) * 100 + "%";
	            window.setTimeout(function() {
	                var transition = "all 0.5s ease";
	                progressBar.style.webkitTransition = transition;
	                progressBar.style.width = percent;
	                addEnd(progressBar, end);

	                progressBtn.style.webkitTransition = transition;
	                progressBtn.style.left = percent;

	            }, 100);

	        }

	        function end() {
	            progressBar.style.webkitTransition = '';
	            progressBtn.style.webkitTransition = ''
	            removeEnd(progressBar, end);
	            settings.ontransitionend && settings.ontransitionend.call(this, settings);
	        }

	        function addEnd(obj, fn) {
	            obj.addEventListener('WebkitTransitionEnd', fn, false);
	            obj.addEventListener('transitionend', fn, false);
	        }

	        function removeEnd(obj, fn) {
	            obj.removeEventListener('WebkitTransitionEnd', fn, false);
	            obj.removeEventListener('transitionend', fn, false);
	        }
	    };
	    /*设置位置*/
	    Ruler.prototype.setposition = function(index) {
	    	var currentIndex=this.settings.ratioindex;
	    	if (currentIndex===index) {
	    		return false;
	    	}
	        this.settings.ratioindex = index;
	        this.initRatio();
	    };
	    Ruler.prototype.validator = function() {
	        var settings = this.settings,
	            rulerid = settings.rulerid,
	            result = true;
	        if (!rulerid) {
	            new Error('settings.rulerid is null or undefined');
	            return false;
	        }

	        var ruler = document.getElementById(settings.rulerid);
	        if (!ruler) {
	            new Error('ruler is null or undefined');
	            return false;
	        }

	        var progressBtn = ruler.getElementsByClassName('progress-btn')[0];
	        if (!progressBtn) {
	            new Error('progressBtn is null or undefined');
	            return false;
	        }
	        this.settings["progressBtn"] = progressBtn;

	        var progressBar = ruler.getElementsByClassName('progress-bar-active')[0];
	        if (!progressBar) {
	            new Error('progressBar is null or undefined');
	            return false;
	        }
	        this.settings["progressBar"] = progressBar;

	        var progressBarBc = ruler.getElementsByClassName('progress-bar-bc')[0];
	        if (!progressBarBc) {
	            new Error('progressBarBc is null or undefined');
	            return false;
	        }
	        this.settings["progressBarBc"] = progressBarBc;

	        var ratioWrapper = ruler.getElementsByClassName('ratio')[0];
	        if (!ratioWrapper) {
	            new Error('ratioWrapper is null or undefined');
	            return false;
	        }
	        this.settings["ratioWrapper"] = ratioWrapper;
	        return true;
	    };
	    /*创建参数列表*/
	    Ruler.prototype.createRatio = function() {
	        var frag = document.createDocumentFragment();
	        var ratioWrapper = this.settings.ratioWrapper,
	            ratioText = this.settings.ratioText,
	            titleFn = this.settings.titleFn,
	            ratioPercent = [],
	            len = ratioText.length - 1;
	        if (len === 0) {
	            var li = document.createElement('li');
	            li.style.left = "50%";
	            li.innerText = typeof titleFn === "function" ? titleFn.call(this, ratioText[0]) : ratioText[0];
	            frag.appendChild(li);
	            ratioPercent.push({
	                position: 0.5,
	                mark: true,
	                index: 0
	            });
	        } else {
	            var base = 1 / len,
	                subbase = base / 2,
	                percent = 0;
	            for (var i = 0; i <= len; i++) {
	                var li = document.createElement('li');
	                if (i === 0) {
	                    li.style.left = "0";
	                    li.innerText = typeof titleFn === "function" ? titleFn.call(this, ratioText[0]) : ratioText[0];
	                    ratioPercent.push({
	                        position: 0,
	                        mark: true,
	                        index: 0
	                    });
	                    ratioPercent.push({
	                        position: subbase,
	                        mark: false,
	                        index: -1
	                    });
	                } else if (i === len) {
	                    li.style.left = "100%";
	                    li.innerText = typeof titleFn === "function" ? titleFn.call(this, ratioText[len]) : ratioText[len];
	                    ratioPercent.push({
	                        position: 1,
	                        mark: true,
	                        index: len
	                    });
	                } else {
	                    percent = i * base;
	                    li.style.left = percent * 100 + "%";
	                    li.innerText = typeof titleFn === "function" ? titleFn.call(this, ratioText[i]) : ratioText[i];

	                    ratioPercent.push({
	                        position: percent,
	                        mark: true,
	                        index: i
	                    });
	                    ratioPercent.push({
	                        position: percent + subbase,
	                        mark: false,
	                        index: -1
	                    })

	                }
	                frag.appendChild(li);
	            }


	        }
	        this.settings["ratioPercent"] = ratioPercent;
	        $(ratioWrapper).html(frag);
	    };
	    Ruler.prototype.bindEvent = function() {
	        var xDistance = 0,
	            that = this,
	            settings = that.settings,
	            ratioFlat = 0,
	            progressBtn = settings.progressBtn || null,
	            ratioLen = settings.ratioText.length;


	        progressBtn.addEventListener("touchstart", function(ev) {
	            ev.preventDefault();
	            settings.onstart && settings.onstart.call(that, settings);
	        });
	        progressBtn.addEventListener("touchmove", function(ev) {
	            ev.preventDefault();
	            var progressBar = settings.progressBar,
	                progressBarBc = settings.progressBarBc,
	                progressBarBcW = progressBarBc.getBoundingClientRect().width;

	            xDistance = ev.targetTouches[0].pageX - offset(progressBar).left;
	            if (xDistance < 0) {
	                xDistance = 0;
	            }

	            if (xDistance > progressBarBcW) {
	                xDistance = progressBarBcW;
	            }
	            ratioFlat = xDistance / progressBarBcW;
	            var ratioPosition = ratioFlat.toFixed(2) * 100 + "%";
	            this.style.left = ratioPosition;
	            progressBar.style.width = ratioPosition;
	            settings.onmove && settings.onmove. call(that, settings);
	        });
	        progressBtn.addEventListener("touchend", function() {
	            var ratioPercent = settings.ratioPercent;
	            var i = ratioPercent.length - 1,
	                thisPercent = ratioPercent[i],
	                position = 0;
	            if (i === 0) {
	                thisPercent = ratioPercent[0];
	            } else {
	                while (ratioFlat <ratioPercent[i].position) {
	                    i = i - 1;
	                }
	                thisPercent = ratioPercent[i];
	                if (!thisPercent.mark) {
	                    thisPercent = ratioPercent[i + 1];
	                }
	            }


	            position = thisPercent.position * 100 + "%";
	            this.style.left = position;
	            settings.ratioindex = thisPercent.index;
	            settings.progressBar.style.width = position;
	            settings.onend && settings.onend.call(that, settings);
	        });
	    };

	    function offset(ele) {
	        var t = ele.offsetTop;
	        var l = ele.offsetLeft;
	        var p = ele.offsetParent;
	        while (p && p.id !== "wrapper") {
	            if (window.navigator.userAgent.indexOf('MSIE 8') > -1) {
	                l += p.offsetLeft;
	                t += p.offsetTop;
	            } else {
	                l += p.offsetLeft + p.clientLeft;
	                t += p.offsetTop + p.clientTop;;
	            }
	            p = p.offsetParent;
	        }
	        return {
	            left: l,
	            top: t
	        };
	    };

	    function extend(destination, options) {
	        for (var item in options) {
	            destination[item] = options[item];
	        }
	        return destination;
	    };
	    return Ruler;
	})();