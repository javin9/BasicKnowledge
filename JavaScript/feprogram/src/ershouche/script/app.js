/**
 * 全局App，提供常用功能接口
 */

'use strict';
module.exports = {
    log:function(title,text){
        console.log(title,text);
    },
    //#region ajax
    /*
    ajax,example:
    ajax({
    action:'Json',
    controller:'Test',
    callback:function(d){ alert(d.Name); }
    })
    */
    ajax: function (params) {
        /*params：
        url:url
        loading:true 是否显示加载状态？
        data:JSON对象,传递给服务的参数{name:'test'}
        type:POST or GET,默认GET
        async:true or false ,默认 true
        dataType：数据类型 默认‘json’
        callback:回调成功
        completeCallback:结束回调函数
        */
        var _this = this;
        var tip = null;
        if (params.loading) {
            //("正在加载数据…");
        }

        //检测网络链接
        if (!navigator.onLine) {
            // this.emit('APP-MESSAGE-OPEN', {
            //     content: '网络链接失败，请重试！'
            // });
        }

        function completeCallback(result) {
            if (params.completeCallback) {
                params.completeCallback(result);
            }
        }

        function successCallback(result) {
            try {
                params.callback(result);
            } catch (error) {
                console.error(error);
            }
        }

        function errorCallback(xhr, textStatus, errorThrown) {
            if (params.errorCallback) {
                params.errorCallback(xhr, textStatus, errorThrown);
            }
        }
        var options = {};
        options.data =params.data;
        options.success = successCallback;
        options.error = errorCallback;
        options.complete = completeCallback;
        options.url =params.url;
        options.type = params.type || 'POST';
        options.async = params.async || true;
        options.dataType = params.dataType || 'json';
        //添加ajax options的contentType属性(默认使用表单提交的contentType)
        if (params.contentType) {
            options.contentType = params.contentType; // || 'application/json';
        }
            $.ajax(options);
    },
    //#endregion
    host: '',
    //价格四舍五入
        show_price_text:function (priceNum) {
            var newNum = '';
            priceNum=Number(priceNum)
            if (priceNum > 1) {
                return newNum = (priceNum).toFixed(2) + '万'
            } else {
                return newNum = (priceNum * 10000).toFixed(0) + '元'
            }

    }

};
//前置通知
Function.prototype.before = function (func) {
    var that = this;
    args = [].slice.call(arguments, 1);
    return function () {
        //debugger
        if (func.apply(this, args) === false) {
            return false;
        }
        return that.apply(this, arguments);
    }
};

//后置通知
Function.prototype.after = function (func) {
    var that = this;
    args = [].slice.call(arguments, 1);
    return function () {
        var ret = that.apply(this, arguments);
        if (ret === false) {
            return false;
        }
        func.apply(this, args);
        return ret;
    }
};







