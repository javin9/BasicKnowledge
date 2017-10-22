 /*
    工具类，具体见页脚部分注释
    使用方法： 
    var tools = require("tools");
    tools.GetCookie("key");

    =============================
    分页器使用方法：
          参数：    container ID容器名称（String类型）,
                    count 总页数,
                    pageindex 当前页数, 
                    callBacks 回调函数(返回当前页码数 pageindex)
    
    tools.listPagination(container, count, pageindex, callBacks);
    ————————————————————————————————————————————————————————————————————————————————————————
    分页器Dom实例：<div id="listPagination" class="list_pagination"></div>
           js部分: tools.listPagination("listPagination", 35, 5, callBacks);
                   function callBacks(pageindex){
                        alert(pageindex);
                   }
    ================================================================================================================

    下拉菜单使用方法：（具体可以参考新车列表页面）
    2016/2/24 按需求增加了事件类型参数为 eventType，鼠标滑过是hover默认是点击click
    $(".select").selectControl();
    注意：.select如果不是原生组件<select>则需要在.selectControl()中传入选项，
          第一个参数是回调函数，当需要选择完选项立即执行的时候，用回调函数，回调函数返回选项的ID TEXT和下拉菜单对象。
          第二个参数为eventType，鼠标滑过是hover默认是点击click
          第三个参数为渲染模式，默认是空,如果设置'notRender'则需要在DOM上写结构（此处结构并非select控件）
    $(".select").selectControl(callback,eventType,renderMode)
    列表页面选择车型下拉菜单比较特殊如下
    第一个选项上增加  data-default="不限" 表示默认下拉菜单中第一个选项显示文字为“不限”
    data-option="false" 表示不需要第一个默认选项出现在下拉菜单中。
    data-type="牧马人 2015款" 表示选中后需要增在文字前边增加的内容。
    data-disabled="disabled"  表示此项不能选择只供展示
    data-link="/beijing/quanxinaodia4l/m101727" 跳转链接

    增加下拉菜单$$分割左右部分
    ————————————————————————————————————————————————————————————————————————————————————————
    回调函数的参数：
    selDataId,selText,$(this),selCategory,{oldDataId,oldText}
    当前选择的选项ID,TEXT,选项本身的JQUERY对象，选项的分类（车款的年份），上次选项的ID和TEXT
    ————————————————————————————————————————————————————————————————————————————————————————
    <select class="select" style="display: none;">
        <option data-option="false">牧马人 2015款 2.8TD 自动 四门Sahara 柴油</option>
        <option data-disabled="disabled" value="0">2015</option>
        <option value="1" data-type="牧马人 2015款">2.8TD 自动 四门Sahara 柴油 42.99万</option>
        <option value="1" data-type="牧马人 2015款">3.0L 自动 四门Sahara 43.99万</option>
        <option value="1" data-type="牧马人 2015款">3.6L 自动 两门Rubicon 48.99万</option>
        <option value="1" data-type="牧马人 2015款">3.6L 自动 四门Rubicon 53.99万</option>
        <option data-disabled="disabled" value="0">2014</option>
        <option value="1" data-type="牧马人 2014款">2.8TD 自动 四门Sahara 柴油 42.99万</option>
        <option value="1" data-type="牧马人 2014款">3.0L 自动 四门Sahara 43.99万</option>
        <option value="1" data-type="牧马人 2014款">3.6L 龙腾典藏版 56.88万</option>
        <option data-disabled="disabled" value="0">2013</option>
        <option value="1" data-type="牧马人 2013款">3.6L 自动 两门Sahara 42.99万</option>
        <option value="1" data-type="牧马人 2013款">3.6L 自动 四门Sahara 46.99万</option>
        <option value="1" data-type="牧马人 2013款">3.6L 自动 两门Rubicon 48.99万</option>
        <option value="1" data-type="牧马人 2013款">3.6L 自动 四门Rubicon 53.99万</option>
        <option value="1" data-type="牧马人 2013款">3.6L 自动 两门Rubicon 十周年版 55.99万</option>
        <option value="1" data-type="牧马人 2013款">3.6L 自动 四门Rubicon 十周年版 59.99万</option>
    </select>

 */

var applyBln = true,
    applyTimer = null;

var Tools = {
    //写cookies
    SetCookie:function(name, value, exp,domain) {
        var Days = 1;
        var expstr = "";
        var _domain ="";
        if (exp == undefined || exp == "") {
            exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            exp = exp.toGMTString();
        }
        if(domain){
           _domain = ";domain=" + domain;
        }
        document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp + _domain;
    },
    //读取cookies 
    GetCookie:function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)){
            return unescape(arr[2]);
        }
        else{
            return null;
        }
    },
    //判断是不是IP
    IsIp:function(value){    
        var exp=/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        var reg = value.match(exp);
        if(reg==null)
        {
            return false;
        }else{
            return true;
        }
    },
    //泛域名处理
    WildcardUrl:function(){
        var url = "";
        var urlHostName = window.location.hostname;
        if(Tools.IsIp(urlHostName) || urlHostName =="localhost"){
            url = urlHostName
        }else{
            var urlArr = urlHostName.split(".");
            url = urlArr[urlArr.length-2] +"." +urlArr[urlArr.length-1];
        }
        return url;
    },
    /**
     *全局处理ajax
     *@param Object opt  传入ajax对象参数
    */
    ajaxUrl:{},
    $ajax: function(opt) {
        if (Tools.ajaxUrl[opt.url]) {
            return false;
        }
        Tools.ajaxUrl[opt.url] = true;
        opt.cache = true;
        opt.dataType = opt.dataType?opt.dataType:"json";
        opt.type = opt.type?opt.type:"POST";
        opt.error = function(XMLHttpRequest, textStatus) {
            var status = XMLHttpRequest.status;
            if (status == 0)
                return;
            else if (status == 500)
                alert("服务器错误");
            else if (status == 404)
                alert("请求没有找到");
        };
        opt.goSuccess = opt.success;
        opt.success = function(res) {
            if (opt.goSuccess)
                opt.goSuccess(res);
        }
        opt.complete = function() {
            delete Tools.ajaxUrl[opt.url];
        }
        $.ajax(opt);
    },
    //获取URL中的参数
    GetUrlParam: function (name){  
        // 转换为小写
        var lowerName = name.toLowerCase(),
            lowerSearch = window.location.search.substr(1).toLowerCase();
        //构造一个含有目标参数的正则表达式对象  
        var reg = new RegExp("(^|&)"+ lowerName +"=([^&]*)(&|$)");  
        //匹配目标参数  
        var r = lowerSearch.match(reg);  
        //返回参数值  
        if (r!=null) return unescape(r[2]);  
        return null;  
    },
    //修改URL参数
    SetUrlParam: function(name,value){ 
        var pattern = name+'=([^&]*)',
            replaceText = name + '=' + value,
            url = window.location.href; 
        if(url.match(pattern)){ 
            var tmp='/('+ name+'=)([^&]*)/gi'; 
            tmp=url.replace(eval(tmp),replaceText); 
            return tmp; 
        }else{ 
            if(url.match('[\?]')){ 
                return url+'&'+replaceText; 
            }else{ 
                return url+'?'+replaceText; 
            } 
        } 
        return url+'\n'+name+'\n'+ value; 
    },
    /*分页器    
    *       参数：    container ID容器,
    *                 count 总页数 ,
    *                 pageindex 当前页数, 
    *                 callBacks 回调函数
    */
    ListPagination:function (container, count, pageindex, callBacks){
        var container = container;
        var count = count;
        var pageindex = pageindex;

        var html = "";
        pageindex == 1?html += "<a href=\"javascript:void(0);\" class=\"prev unclick\">上一页</a>":html += "<a href=\"javascript:void(0);\" class=\"prev\">上一页</a>";

        // 总页数小于10
        if (count <= 10) {
            for(var i = 1; i <= count; ++i){
                setPagination();
            }
        }else {//总页数大于10页
            if (pageindex <= 4) {
                for (var i = 1; i <= 5; i++) {
                    setPagination();
                }
                html += "<a href=\"javascript:void(0);\">...</a><a href=\"javascript:void(0);\" class=\"num\">" + count + "</a>";
            } else if (pageindex >= count - 3) {
                html += "<a href=\"javascript:void(0);\" class=\"num\">1</a><a href=\"javascript:void(0);\">...</a>";
                for (var i = count - 4; i <= count; i++) {
                setPagination();
                }
            }
            else { //当前页在中间部分
                html += "<a href=\"javascript:void(0);\" class=\"num\">1</a> <a href=\"javascript:void(0);\" class=\"num\">...</a>";
                var j=0;
                for (var i = pageindex - 2; i <= pageindex + 2; i++) {
                    j++;
                    if(j<=5){
                         setPagination();
                    }
                }
                html += "<a href=\"javascript:void(0);\">...</a><a href=\"javascript:void(0);\" class=\"num\">" + count + "</a>";
            }
        }

        pageindex == count?html += "<a href=\"javascript:void(0);\" class=\"next unclick\">下一页</a>":html += "<a href=\"javascript:void(0);\" class=\"next\">下一页</a>";

        $("#"+container).html(html);

        function setPagination(){
            pageindex == i?html += "<a href=\"javascript:void(0);\" class=\"num active\">"+ i +"</a>":html += "<a href=\"javascript:void(0);\" class=\"num\">"+ i +"</a>";
        }

        // 点击上一页
        $("#"+container).find(".prev").on("click", function(e){
            e.stopPropagation();
            if (pageindex == 1) {
                callBacks(pageindex);
                return false;
            }
            --pageindex;
            Tools.ListPagination(container, count, pageindex, callBacks);
            callBacks(pageindex);
            return false;
        });
        // 点击页码
        $("#"+container).find(".num").on("click", function(e){
            e.stopPropagation();
            pageindex = parseInt($(this).text());
            Tools.ListPagination(container, count, pageindex, callBacks);
            callBacks(pageindex);
            return false;
        });

        // 点击下一页
        $("#"+container).find(".next").on("click", function(e){
            e.stopPropagation();
            if (pageindex == count) {
                callBacks(pageindex);
                return false;
            }
            ++pageindex;
            Tools.ListPagination(container, count, pageindex, callBacks);
            callBacks(pageindex);
            return false;
        });
    },
    /** 
     * 将数值四舍五入(保留2位小数)后格式化成金额形式
     *
     * @param num 数值(Number或者String)
     * @return 金额格式的字符串,如'1,234,567.45'
     * @type String
     */
    FormatCurrency: function (num) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = "0";
        var sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        var cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    },
    //获取网站域名及端口
    GetUrl: function () {
        var urlStr = window.location.href.split('//')[1];
        urlStr = urlStr.split('/');
        return urlStr.length > 0 ? "http://" + urlStr[0] : "";
    },
    //提示
    ShowAlert:function(txt, time, hideMask=true) {
        var showAlertBox,
            maskLayer = $("#maskLayer"),
            // bodyBox = $("body"),
            displayTime = 0,
            _txt = txt;
        if($("#showAlertBox").length>0){
            showAlertBox = $("showAlertBox");
        }else{
            showAlertBox = $('<div id="showAlertBox">');
            $("body").append(showAlertBox);
        }
        $("#showAlertBox").text(_txt).css({
                    'margin-left': '-' + ($("#showAlertBox").outerWidth() / 2) + 'px',
                    "margin-top": '-' + ($("#showAlertBox").outerHeight() / 2) + 'px'
                }).fadeIn();
        maskLayer.fadeIn();
        // bodyBox.css({"overflow":"hidden"});
        if (time == undefined) {
            displayTime = 2000;
        }else{
            displayTime = time;
        }
        setTimeout(function() {
            $("#showAlertBox").fadeOut(300);
            hideMask && maskLayer.fadeOut(300);
            // bodyBox.css({"overflow":"visible"});
        },displayTime);
    },
    //金额加逗号
    AddCmma:function(str){
        var _unit = String(str).substring(str.length,str.length-1),
            _str = String(Math.round(str));

        if(_unit == "元" ){
            _str = String(Math.round(str.substring(0,str.length-1)));
        }else if(_unit == "万"){
            _str = String(Math.round(Number(str.substring(0,str.length-1)) * 10000));
        }
        return _str.replace(/\B(?=(?:\d{3})+\b)/g, ',')
    },
    //提交触发规则
    IsApply:function(callBacks){       
        if(!applyTimer){
            callBacks(applyBln);
            applyBln = false;
            applyTimer = setTimeout(function(){
                applyBln = true; 
                clearTimeout(applyTimer);
                applyTimer = null;
            },1000);
        }else{
            callBacks(applyBln);
        }  
    },
    // 截断字符串
    SubstringClame: function($dom, num){
        let str = $dom.text(),
            strLeng = str.length;
        if(strLeng > num){
          str = str.substring(0, num) + '...';
          $dom.text(str);
        }
    },
    // ab测试
    Abtest(fn, limit){
        const REQ_INT = 1000
        const LIMIT_RETRY = limit || 10
        let retryCount = 0

        // 根据uuid的到ABTestKey
        const getKeyValue = (value) => {
            value = (value || '1') + ''
            return parseInt(value.substring(0,1), 16) % 2 ? 1 : 2
        }

        // 轮询uuid
        const getAbStatus = cb => {
            const uuid = this.getCookie('_utrace')
            const async = typeof cb === 'function'

            if(uuid || retryCount > LIMIT_RETRY || !async ){
                return async ? cb(getKeyValue(uuid)) : getKeyValue(uuid)
            }else{
                retryCount++
                setTimeout(getAbStatus.bind(this, cb), REQ_INT)
            }
        }

        return getAbStatus(fn)
    }
};


//下拉菜单方法此方法不需要抛出只要加载当前JS就可使用
$.fn.selectControl = function(callback,eventType,renderMode){
    var selBox = $('<div class="select-ctrl">'),
        selStr ="",
        self = $(this),
        backStr ="",
        _eventType = eventType,//两种事件是click,hover默认是点击
        callback = callback;
    if(self.attr("class")){
        backStr += " class:" + self.attr("class");
    }else if(self.attr("id")){
        backStr += " id:" +self.attr("id");
    }
            
    if(self.is("select")){
        self.hide();

        var _defaultItem=self.find("option[selected='selected']"),
            _defaultId="",
            _defaultText="",
            _defaultCategory = self.find("option[data-disabled='disabled']:eq(0)").text();
        if($(this).attr("data-type")){
            _defaultText = $(this).attr("data-type");
        }
        if(_defaultItem.index() >= 0){
            _defaultId = _defaultItem.val();
            _defaultText += _defaultItem.text();
        }else{
            _defaultId = self.find("option").eq(0).val();
            _defaultText += self.find("option").eq(0).text().replace("$$","");
        }

        var dadaCategory="";
        self.find("option").each(function(index,item){
            var dataDis,
                dataType,
                liClass,
                dataLink,
                liTxt="";
           if($(this).attr("data-disabled")){
                dataDis=$(this).attr("data-disabled");
                dadaCategory = $(this).text();
                liClass = "disabled";
           }else{
             dataDis = "";
             liClass = "";
           }

           liTxt = $(this).text().split("$$")[0];
           if($(this).text().split("$$")[1]){
                liTxt += '<span>'+ $(this).text().split("$$")[1] +'</span>';
           }

           ($(this).attr("data-link"))?dataLink = $(this).attr("data-link"):dataLink = "";
           ($(this).attr("data-type"))?dataType=$(this).attr("data-type"):dataType = "";

            if(index == 0){
                selStr += '<div data-id="'+ _defaultId +'" data-link="'+ dataLink +'" data-disabled="'+ dataDis +'" data-category="'+ $(this).attr("data-year") +'" data-type="'+ dataType +'">'+ _defaultText +'</div>';
                selStr += '<ul class="drop-layer" style="display:none;"><li class="triangle-icon"></li>';
                if($(this).attr("data-option")!="false"){
                    var defaultTxt = "";
                    $(this).attr("data-default")?defaultTxt = $(this).attr("data-default"):defaultTxt = liTxt;
                    selStr += '<li data-id="'+ $(this).val() +'" data-link="'+ dataLink +'" data-disabled="'+ dataDis +'" data-type="'+ dataType +'" data-text="'+ $(this).text() +'">'+ defaultTxt +'</li>';
                }
            }else{
                selStr += '<li class="' + liClass + '" data-category="'+ dadaCategory +'" data-id="'+ $(this).val() +'" data-link="'+ dataLink +'" data-disabled="'+ dataDis +'" data-type="'+ dataType +'">'+ liTxt +'</li>';
            }
           
        })
        selStr += "</ul>";
        selBox.html(selStr);
        self.after(selBox);
    }else if(renderMode == "notRender"){
        selBox = $(this);
    }else{
        console.log(backStr + " 参数有误！");
    }
    if(selBox.find("li").length <=1){
        selBox.addClass('no-arrow');
    }
     var selBoxUl = selBox.find("ul"),
        oldDataId = selBox.find("div").attr("data-id"),
        oldText = selBox.find("div").text(),
        oldIndex = "",
        oldBln = false;

    //console.log(selBox);
    //隐藏其他菜单
    function showHideFun(){
        if(selBox.find("li").length >1){
            oldDataId = selBox.find("div").attr("data-id");

            $(".drop-layer:visible").stop().hide();
            $(".up-arrow").removeClass('up-arrow');
            $(".upArrow-icon").removeClass('upArrow-icon').addClass('downArrow-icon');

            selBox.find("li").each(function(index, el) {
                if(oldIndex != ""){
                   oldBln =  $(el).index() == oldIndex;
                }else{
                   oldBln = true;
                }
                if($(el).attr("data-id") == oldDataId && oldBln){
                    $(this).addClass("cur");
                }else{
                    $(this).removeClass("cur");
                }
            });
            selBox.addClass('up-arrow');
            selBoxUl.stop().fadeIn();
        }
        
    }
    
   
    //判断eventType参数
    if(_eventType=="hover"){
        selBox.hover(
          function () {
            showHideFun();
          },
          function () {
            selBox.removeClass('up-arrow');
            selBox.find("ul").stop().fadeOut();
          }
        );
    }

    //选择事件
    selBox.on("click","div,li",function(e){
        e.stopPropagation();
        var target = $(e.currentTarget);                
        if((target.is("div") || target.is(selBox)) && _eventType!="hover"){
            if(selBoxUl.is(":hidden")){
                showHideFun();
            }else{
                selBox.removeClass('up-arrow');
                selBoxUl.fadeOut();
            }              
        }else if(target.is("li") && !target.is("[data-disabled = 'disabled']")){
            var selDataId = target.attr("data-id"),
                selCategory = target.attr("data-category"),
                selText = "",
                defaultTxt = "",
                selLink="";
            oldIndex = target.index();
            target.attr("data-text")?defaultTxt = target.attr("data-text"):defaultTxt = target.text();
            target.attr("data-link")?selLink = target.attr("data-link"):selLink = "";
            if(target.attr("data-type")){
                selText = target.attr("data-type") + defaultTxt;
            }else{
                selText = defaultTxt;
            }
            selBox.removeClass('up-arrow');
            target.parent("ul").fadeOut().siblings("div").attr("data-id",selDataId).text(selText);
            if(callback){
                callback(selDataId,selText,selBox,selCategory,{"oldDataId":oldDataId,"oldText":oldText},selLink);
            }
            
            self.val(selDataId);
        }
    });
    //点击空白关闭
    $(document).on("click",function(e){
        var target = $(e.target),
            selBox = $(".select-ctrl");
            if (!target.is(selBox) && target.parents(".select-ctrl").length <= 0) {
                selBox.removeClass('up-arrow');
                selBox.find("ul").fadeOut();
            }
    })

    return this;        
}


/*
*选项卡tab切换插件，用法： 
* new Tabs({
*   tabsId:"modular_2_tabs",//tabs  ID
*   consId:"modular_2_sins" //cons  ID
* });
*/        
; (function (window, $, undefined) {
    var defaults = {
        tabsId: "tabs",//tab容器ID
        consId: "cons"//内容ID
    }
    var Tabs = function (jsonData) {
        var _this = this;

        this.data = $.extend(defaults, jsonData);
        this.scroll = null;

        if (this.data.tabsId)
            this.tabsId = this.data.tabsId;
        else
            return console.log("请填写选项tab ID");
        if (this.data.consId)
            this.consId = this.data.consId;
        else
            return console.log("请填写内容con ID");

        this.domInit();
        this.eventInit();
    }
    Tabs.prototype = {
        domInit: function () {
            $("#" + this.tabsId + ">div:eq(" + 0 + ")").addClass("stab active").siblings().addClass("stab");
            $("#" + this.consId + ">div:eq(" + 0 + ")").addClass("scon active").siblings().addClass("scon");
        },
        eventInit: function () {
            var _this = this;
            $("body").on("mouseover", "#" + _this.tabsId + ">div", function () {
                var $con = $("#" + _this.consId);
                var i = $(this).index();
                $(this).addClass("active").siblings().removeClass("active");
                $con.children("div:eq(" + i + ")").addClass("active").siblings().removeClass("active");
            });
        }
    }
    window.Tabs = Tabs;
})(window, $);


module.exports = {
    //读取URL参数内容
   getUrlParam: Tools.GetUrlParam,
    //修改URL参数内容
   setUrlParam: Tools.SetUrlParam,
    //写cookie
   setCookie: Tools.SetCookie,
    //读取cookies       
   getCookie: Tools.GetCookie,
    //ajax
   $ajax: Tools.$ajax,
    // 分页器
   listPagination: Tools.ListPagination,
    //提示层
   showAlert: Tools.ShowAlert,
    //将数值四舍五入(保留2位小数)后格式化成金额形式
   formatCurrency: Tools.FormatCurrency,
    //获取网站域名及端口
   getUrl: Tools.GetUrl,
    //获取泛域名
   wildcardUrl: Tools.WildcardUrl,
    //获取IP
   isIP: Tools.IsIP,
    //金额加逗号
   addCmma: Tools.AddCmma,
    //申请按钮
   isApply: Tools.IsApply,
   //截断字符串
   substringClame: Tools.SubstringClame,
   // AB测试
   abtest: Tools.Abtest
}
    
    
