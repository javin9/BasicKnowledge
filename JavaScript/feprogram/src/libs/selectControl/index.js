/*
DOM例子：
    响应点击位置需要增加 data-aslider-in="occupation|fade|bottom"
    如果需要二级选项除了增加data-aslider-in 还需要增加一个data-aslider-type="2"（没有多级的请勿增加这个属性）
    <li class="select-con" data-aslider-in="occupation|fade|bottom">请选择</li>

    弹层位置需要 data-aslider="occupation"
    <!-- 职业身份 -->
    <aside class="sel-control-box" data-aslider="occupation">
        <div class="asilder_wrapper">
            <div class="sel-ctrl-fun-btn">
                <div class="sel-ctrl-close font-nav">取消</div>
                <div class="sel-ctrl-title font-nav">职业身份</div>
                <div class="sel-ctrl-complete font-nav">确定</div>    
            </div>
            <div class="scroll-wrapper">
                <div class="scroll">
                    <ul class="slider">
                        <li data-id="40" class="cur" data-aslider-in="socialSecurity|fade|bottom"  data-aslider-type="2">公务员/事业单位</li>
                        <li data-id="41">上班族</li>
                        <li data-id="42">企业主</li>
                        <li data-id="44">个体户</li>
                        <li data-id="45">自由职业者</li>
                        <li data-id="45">其他</li>
                    </ul>
                </div>
            </div>
        </div>
    </aside>


用法：
    $(".select-con").selectControl({
        CallBacks:function(obj){
            console.log(obj)
        }
    });
*/
Array.prototype.find = function(item){
    for(var i=0; i<this.length; i++){
        if(this[i] === item){
            return this[i]
        }
    }
    return null
}
var uc = false;
if(window.navigator.userAgent.match(/(UCBrowser|UCWeb)/i))
    uc = true;
var SelectControl = function(ele,options) {
    this.element = ele;
    this.defaults = {
        //回调函数
        CallBacks: new Function,
    }

    this.opts = $.extend(this.defaults,options);
    this.itemHeight = 0;
    this.visibleStack = [];
    this.bindArray = [];
    this.lastY = 0;
    this.y = 0;
    this.curY = 0;
    this.defaultIndex = 0;
    this.curIndex = 0;
    this.item;
    this.callBackObjArr = [];
    this.bind();
}
SelectControl.prototype ={
    _findEntry: function(item){
        for(var i=0; i<this.bindArray.length; i++){
            if(this.bindArray[i].initialator === item && $(this.bindArray[i].slider).length > 0){
                return true
            }
        }
        return false
    },
    bind: function(){
        var self = this;
        // console.log(self.element.attr('data-aslider-in'));
        // var asliderEntries = self.element.find('[data-aslider-in]');
        var historyList = [];
        $(self.element).each(function(idx,el) {
            if(self._findEntry($(el).data("aslider-in"))){
                return
            } 
            var array = String($(this).data("aslider-in")).split("|");
            var targetSlider = array[0];
            var targetSlider2 = $(this).data("aslider-type");
            self.bindArray.push({
                initialator: this,
                slider: '[data-aslider="' + targetSlider + '"]',
                sliderType:targetSlider2,
                options:{
                    isFade: (function(){
                        var isFade = false;
                        array.forEach(function(value,idx){
                            if(value == "fade"){
                                isFade = true;
                                return false;
                            }
                        });
                        return isFade;
                    })(),
                    direction: (function(){
                        var direction = 'right';
                        array.forEach(function(value,idx){
                            if(value == "right" || value == "left" || value == "top" || value == "bottom"){
                                direction = value;
                                return false;
                            }
                        });
                        return direction;
                    })(),
                    size:(function(){
                        var size = "100%";
                        var direction = 'right';
                        array.forEach(function(value,idx){
                            if(value == "right" || value == "left" || value == "top" || value == "bottom"){
                                direction = value;
                                return false;
                            }
                        });
                    })()
                }
            });
            for(var i in historyList){
              if (historyList[i].entry == $(el).data("aslider-in")){
                return;
              }
            }
            historyList.push(
                {
                    'entry':$(el).data("aslider-in"),
                    'slider': '[data-aslider="' + targetSlider + '"]',
                }
            );
            var $bg = $("<div class='bg sel-ctrl-close'></div>");
            $(self.bindArray[self.bindArray.length-1].slider).prepend($bg);
        });
        //sliders to be inited
        var sliders = historyList.map(function(item){
            return item.slider
        }).join(',');

        this.init($(sliders))
    },
    onTransitionEnd: function (e) {
        var self = this;
        var $el = $(e.currentTarget),
            _yScroll = "0px";
        self.itemHeight= $el.find(".slider li").height();
        self.y = 0;
        self.lastY = 0;
        self.defaultIndex = self.curIndex= Math.max($el.find("li.cur").index(),0)
        if(!self.defaultIndex){
            $el.find("li").eq(0).addClass('cur')
        }
        // $el.find("li.cur").next("li").addClass('next-li');
        if(self.defaultIndex !== null && self.defaultIndex > 0){
            _yScroll = - self.defaultIndex * self.itemHeight +"px";
        }
        // console.log(_yScroll)
        $el.find(".slider").css({
            "-moz-transform":"translate(0,"+ _yScroll +")",
            "-ms-transform":"translate(0,"+ _yScroll +")",
            "transform":"translate(0,"+ _yScroll +")",
            "-webkit-transform":"translate(0,"+ _yScroll +")",
        });
        if($el.find(".slide_out")[0])
            $el.css("display","none");
    },
    /**
     * 侦听侧边栏的关闭点击事件，调用滑出侧边栏方法
     * @param  {event}
     * @return {null}
     */
    onClose: function(e){
        var self = this;
        e.preventDefault();
        e.stopPropagation();
        // console.log(this.curIndex);
        if ($(e.currentTarget).hasClass('sel-ctrl-close')) {
            var $el = this._findAslider(e.currentTarget);

            $el.find("li").eq(self.defaultIndex).addClass('cur').siblings('li').removeClass('cur');
            //清空回调对象
            self.callBackObjArr =[];
            this.asideSlideOut($el);
        }else if($(e.currentTarget).hasClass('sel-ctrl-complete')){//确定按钮
            var $el = this._findAslider(e.currentTarget);
            var dataAslier = $el.data("aslider");
            var _obj  = {
                txt: $el.find('li.cur').text(),
                id: $el.find('li.cur').data("id"),
                item: this.item
            }
            self.callBackObjArr.push(_obj);
            var secondNameStr = '[data-aslider="' + String($el.find('li.cur').data("aslider-in")).split("|")[0] +'"]';
            //判断是否有多级菜单
            if($el.find('li.cur').data('aslider-in')){
                this.asideSlideOut($el);
                self.asideSlideIn($(secondNameStr));
            }else{           
                if(self.callBackObjArr.length>1){
                    this.opts.CallBacks(self.callBackObjArr);
                }else{
                    this.opts.CallBacks(_obj);
                }
                
                this.asideSlideOut($el);
                //清空回调对象
                self.callBackObjArr =[];
            }
           
        }
    },
    init: function () {
        var self = this;
        var asliders = $('[data-aslider]');
        var y = this.y;
        var lastY = this.lastY;
        $(asliders).bind("webkitTransitionEnd",$.proxy(this.onTransitionEnd,this));
        $(asliders).bind("transitionEnd",$.proxy(this.onTransitionEnd,this));

        $(asliders).off("click").on("click",".sel-ctrl-close,.sel-ctrl-complete",function(e){
            self.onClose(e);
        });
        $(document).off("click").on("click",'[data-aslider="'+$(asliders).data("aslider")+'"]',$.proxy(this.onClose,this));
        /**
         * 侦听触摸事件的div
         */
        $(asliders).each(function(idx, aslider) {
            if(uc)
                $(aslider).find(".asilder_wrapper").addClass("for_uc");
            var lastScrollTop = 0;
            //找不到slider，就创建slider
            var children = $(aslider).find(".asilder_wrapper").children();
            if($(aslider).find(".slider").length==0){
                var $slider = $("<div class='slider'></div>");
                $slider.append(children);
                $(aslider).find(".asilder_wrapper").append($slider);
            }else
                var $slider = $(aslider).find(".slider");
            if($(aslider).find(".scroll").length==0){
                var $scroll = $("<div class='scroll'></div>");
                //创建scroll
                $slider.before($scroll);
                //将slider添加到scroll
                $scroll.append($slider);
            }
            /**
             * 每次点击开始时，先重置lastY
             */
            $slider.on('touchstart', function(e) {
                lastY = e.touches[0].pageY;
                if($(this).data('y')){
                    y = $(this).data('y')
                }else{
                    y = 0
                }
            });
            /**
             * 触摸移动事件
             * 通过当前的触摸Y值 - 上一次事件的y值
             * 得到两次触摸事件的差
             * y = y +deltaY使div移动
             * 如果y > 0，则div的顶部低于窗口了，所以y>0时，y=0
             * 同理y < limit是为了防止div的底部高于窗口
             * 最后让当前的触摸y值 = lastY,即对下一次触摸来说，这次的y就是lastY
             */
            $slider.on('touchmove', function(e) {
                self.curY = e.touches[0].pageY;
                var deltaY = self.curY - lastY;
                var height = $(this)[0].scrollHeight;
                var limit =  $(this).height()-$(this).find("li").height();
                y = y + deltaY;
                if(y<limit*-1) y = limit*-1;
                if(y>0) y = 0;

                var translate = "translate3d(0,"+y+"px,0)";
                $(this).css({
                    "-moz-transform": translate,
                    "-ms-transform": translate,
                    "transform": translate,
                    "-webkit-transform": translate,
                }).data('y', y);
                lastY = self.curY;
            });
            $slider.on('touchend', function(e) {
                y = Math.round(y/self.itemHeight) * self.itemHeight;

                self.curIndex = Math.round(y/self.itemHeight) < 0? -Math.round(y/self.itemHeight): Math.round(y/self.itemHeight);

                $(this).find("li").eq(self.curIndex ).addClass('cur').siblings('li').removeClass('cur');

                var translate = "translate3d(0,"+y+"px,0)";
                $(this).css({
                    "-moz-transform": translate,
                    "-ms-transform": translate,
                    "transform": translate,
                    "-webkit-transform": translate,
                });
                lastY = self.curY
            });
        });

        this.bindArray.forEach(function(item) {
            if(item.sliderType){
                self._bindAsideSlider($(item.initialator), $(item.slider),false);
            }else{
                 self._bindAsideSlider($(item.initialator), $(item.slider),true);
            }
            
            if(item.options.isFade)
                $(item.slider).data("aslider-fade", item.options.isFade);
            else
                $(item.slider).find('.bg').css("opacity","0");


            $(item.slider).data("aslider-direction", item.options.direction);
            $(item.slider).find(".asilder_wrapper").addClass(item.options.direction)
        });
    },
    /**
     * @private
     * 绑定页面的侧边栏和侧边栏滑出的发起者的click事件，当点击发起者时，滑出侧边栏
     * @param  {zepto object} $initialator 发起者
     * @param  {zepto object} $slider      侧边栏
     * @return {null}
     */
    _bindAsideSlider: function($initialator, $slider,bln) {
        if (typeof($initialator) == "undefined") return;
        if(bln){
            $initialator.click($.proxy(function(e) {
                this.item = e.currentTarget;
                this.asideSlideIn($slider);
            },this));
        }
        
    },
    /**
     * @private
     * 给定一个侧边栏的子节点，找到这个侧边栏
     * @param {Type} 一个html dom node
     */
    _findAslider: function(el) {
        var theSlider;
        $("[data-aslider]").each(function(idx, aslider) {
          if(aslider == el){
            theSlider = aslider;
            return false;
          }
          $(aslider).find(".sel-ctrl-close").each(function(idx,_el){
            if(el==_el){
                theSlider = aslider;
                return false;
            } else {
                return true;
            }
          });
        $(aslider).find(".sel-ctrl-complete").each(function(idx,_el){
            if(el==_el){
                theSlider = aslider;
                return false;
            } else {
                return true;
            }
          });

        });
        return $(theSlider);
    },
    /**
     * @public
     * 遍历所有侧边栏，滑出隐藏当前显示的那个
     * @return {null}
     */
    asideSlideOut: function($el){
        $el = typeof $el === 'string' ? $($el) : $el;
        if ($el.css("display")!="none") {
            var isFade = $el.data("aslider-fade");
            if (isFade === "" || isFade || $el.isFade) {
                $el.find(".bg").removeClass("fade_in");
                $el.find(".bg").addClass("fade_out");
            }
            $el.find(".asilder_wrapper").removeClass("slide_in");
            $el.find(".asilder_wrapper").addClass("slide_out");
        }
        this.visibleStack.pop();
        if(this.visibleStack.length === 0)
            $('body').unbind('touchmove');
    },
    /**
     * @public
     * 滑入显示一个侧边栏
     * @param  {zepto object} $el 侧边栏dom对象
     * @return {null}
     */
    asideSlideIn: function($el){
        $el = typeof $el === 'string' ? $($el) : $el
        $el.show();
        var isFade = $el.data("aslider-fade");
        if (isFade === "" || isFade || $el.isFade) {
            $el.find(".bg").removeClass("fade_out");
            $el.find(".bg").addClass("fade_in");
        }
        $el.find(".asilder_wrapper").removeClass("slide_out");
        $el.find(".asilder_wrapper").addClass("slide_in");
        this.visibleStack.push($el);

        $('body').bind('touchmove',function(e){
            e.preventDefault();
        });
    }
}

/*扩展方法*/
$.fn.selectControl = function(options){
    var selectControl = new SelectControl(this,options); 
    return this;
};