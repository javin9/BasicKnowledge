/*
    表单效验类，具体见页脚部分注释
    使用方法： 
    var check = require("check");
    check.isID("身份证号码");
*/
var $ajax = tools.$ajax;
//去掉字符串头尾空格

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

var Check = {
    Wi: [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1], // 加权因子
    ValideCode: [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2], // 身份证验证位值.10代表X
    IdCardValidate: function (idCard) {
        idCard = idCard.trim(); //去掉字符串头尾空格
        if (idCard == "") {
            return "";
        } else if (idCard.length == 15) {
            return Check.IsValidityBrithBy15IdCard(idCard); //进行15位身份证的验证
        } else if (idCard.length == 18) {
            var a_idCard = idCard.split(""); // 得到身份证数组
            if (Check.IsValidityBrithBy18IdCard(idCard) && Check.IsTrueValidateCodeBy18IdCard(a_idCard)) { //进行18位身份证的基本验证和第18位的验证
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    /**
    * 判断身份证号码为18位时最后的验证位是否正确
    * @param a_idCard 身份证号码数组
    * @return
    */
    IsTrueValidateCodeBy18IdCard: function (a_idCard) {
        var sum = 0; // 声明加权求和变量
        if (a_idCard[17].toLowerCase() == 'x') {
            a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
        }
        for (var i = 0; i < 17; i++) {
            sum += Check.Wi[i] * a_idCard[i]; // 加权求和
        }
        var valCodePosition = sum % 11; // 得到验证码所位置
        if (a_idCard[17] == Check.ValideCode[valCodePosition]) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 通过身份证判断是男是女
     * @param idCard 15/18位身份证号码
     * @return 'female'-女、'male'-男
     */
    MaleOrFemalByIdCard: function (idCard) {
        idCard = trim(idCard.replace(/ /g, "")); // 对身份证号码做处理。包括字符间有空格。
        if (idCard.length == 15) {
            if (idCard.substring(14, 15) % 2 == 0) {
                return 'female';
            } else {
                return 'male';
            }
        } else if (idCard.length == 18) {
            if (idCard.substring(14, 17) % 2 == 0) {
                return 'female';
            } else {
                return 'male';
            }
        } else {
            return null;
        }
    },
    /**
     * 验证18位数身份证号码中的生日是否是有效生日
     * @param idCard 18位书身份证字符串
     * @return
     */
    IsValidityBrithBy18IdCard: function (idCard18) {
        var year = idCard18.substring(6, 10);
        var month = idCard18.substring(10, 12);
        var day = idCard18.substring(12, 14);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 这里用getFullYear()获取年份，避免千年虫问题
        if (temp_date.getFullYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 验证15位数身份证号码中的生日是否是有效生日
     * @param idCard15 15位书身份证字符串
     * @return
     */
    IsValidityBrithBy15IdCard: function (idCard15) {
        var year = idCard15.substring(6, 8);
        var month = idCard15.substring(8, 10);
        var day = idCard15.substring(10, 12);
        var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
        if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
            return false;
        } else {
            return true;
        }
    },
    /*
    *手机验证
    */
    IsPhoneNumber: function (number) {
        var phoneRexp = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);
        if (number == "") {
            return "";
        } else {
            return phoneRexp.test(number);
        }
    },
    /*
    *护照验证
    */
    IsPassport: function (number) {
        var passport = new RegExp(/^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/);
        if (number == "") {
            return "";
        } else {
            return passport.test(number);
        }
    },
    /*
    *姓名验证
    */
    IsName: function (number) {
        var nameRexp = new RegExp(/^[\u4e00-\u9fa5]{2,8}$/);//2-8位汉字
        if (number == "") {
            return "";
        } else {
            return nameRexp.test(number);
        }
    },
    /*
    *Email验证
    */
    IsEmail: function (number) {
        var retMail = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/;
        if (number == "") {
            return "";
        } else {
            return retMail.test(number);
        }
    },
    /*
    *车牌号验证
    */
    IsCarName: function (number) {
        var carNumberRexp = new RegExp(/^[\u4e00-\u9fa5]{1}[a-z_A-Z]{1}[0-9_a-z_A-Z]{5}$/);
        if (number == "") {
            return "";
        } else {
            return carNumberRexp.test(number);
        }
    },
    /*
    *座机号验证
    */
    IsLandline: function (number) {
        var landlineRexp = new RegExp(/^0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}$/);
        if (number == "") {
            return "";
        } else {
            return landlineRexp.test(number);
        }
    },
    /*
    *获取手机验证码 
    *@param     seconds 倒计时时间，单位秒
    *           tel_id  手机号input输入框ID 字符串
    *           gvc_id  验证码触发容器ID 字符串
    *           line    业务线
    */
    getCode: function (seconds, tel_id, gvc_id, line, global = true, oldcodelen = true,callback=function(res){}) {
        if (seconds <= 0) {
            alert(倒计时时间不能小于0);
            return false;
        };
        if ($("#" + gvc_id).hasClass("disable")) {
            return false;
        };

        var telNum = $("#" + tel_id).val().replace(/ /g, "");
        if (Check.IsPhoneNumber(telNum)) {
            var params = { mobile: telNum, line: line }
            var token = $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id')
            if (token) {
                params.__RequestVerificationToken = token
            }

            params.codelen = oldcodelen?6:4;
            //是否调用图片验证码
            // var type = $('input[name=type]').val();
            // if(type) {
            //     var captcha = $('input[name=captcha]').val();//图片验证码值
            //     params.type = type;
            //     params.captcha = captcha;
            // }
            //添加埋点
            try {
                 bc.evt.send('mobile', 'codeclk', params.mobile)
            }
            catch (err) {}

            $ajax({
                url: CODE_GETTING_URL,
                type: 'POST',
                data: params,
                success: callback
            });
            $("#" + gvc_id).addClass("disable").text(seconds + "秒后获取");
            if (global) {
                window.tmo = setInterval(function () {
                    if (--seconds == 0) {
                        clearInterval(tmo);
                        $("#" + gvc_id).removeClass("disable").text("获取验证码");
                        return;
                    }
                    $("#" + gvc_id).text(seconds + "秒后获取");
                }, 1000);
            } else {
                var tmp = setInterval(function () {
                    if (--seconds == 0) {
                        clearInterval(tmp);
                        $("#" + gvc_id).removeClass("disable").text("获取验证码");
                        return;
                    }
                    $("#" + gvc_id).text(seconds + "秒后获取");
                }, 1000);
            }
            return true;
        } else {
            return false;
        }
    },

    newGetCode: function(data, successFunc){
        let defaultData = {
            seconds: 60, 
            tel_id: 'mobile', 
            gvc_id: 'GetValidateCode',
            line: '550', 
            url: CODE_GETTING_URL,
            __RequestVerificationToken: '',
            global: true,
            type:'',
            captcha: '',
            codelen: 4,
        }

        let Tdata = $.extend(defaultData, data);

        if (Tdata.seconds <= 0) {
            alert(倒计时时间不能小于0);
            return false;
        };

        if ($("#" + Tdata.gvc_id).hasClass("disable")) {
            return false;
        };

        var telNum = ($("#" + Tdata.tel_id).val() || '').replace(/\s/g, '')

        if (Check.IsPhoneNumber(telNum)) {
            var params = { mobile: telNum, line: Tdata.line, codelen: Tdata.codelen };
            var token = Tdata.__RequestVerificationToken || $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id')
            
            if (token) {
                params.__RequestVerificationToken = token
            }

            //是否调用图片验证码
            var type = Tdata.type || $('input[name=type]').val();
            if(type) {
                params.type = type;
                params.captcha = Tdata.captcha;//图片验证码值
            }

            //添加埋点
            try {
                 bc.evt.send('mobile', 'codeclk', params.mobile)
            }
            catch (err) {}

            tools.$ajax({
                url: Tdata.url,
                data: params,
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    successFunc(res);
                }
            });
            $("#" + Tdata.gvc_id).addClass("disable").text(Tdata.seconds + "秒后获取");
        
            if (global) {
                window.tmo = setInterval(function () {
                    if (--Tdata.seconds == 0) {
                        clearInterval(tmo);
                        $("#" + Tdata.gvc_id).removeClass("disable").text("获取验证码");
                        return;
                    }
                    $("#" + Tdata.gvc_id).text(Tdata.seconds + "秒后获取");
                }, 1000);
            } else {
                var tmp = setInterval(function () {
                    if (--Tdata.seconds == 0) {
                        clearInterval(tmp);
                        $("#" + Tdata.gvc_id).removeClass("disable").text("获取验证码");
                        return;
                    }
                    $("#" + Tdata.gvc_id).text(Tdata.seconds + "秒后获取");
                }, 1000);
            }
        }else {
            return false;
        }
    },
    /**
     * 获取4位验证码
     * @description 为了向前兼容不得不另起一个方法
     */
    getAuthcode: function(seconds, tel_id, gvc_id, line, global = true){
        this.getCode(seconds, tel_id, gvc_id, line, global = true, 4)
    },
    /*
    *验证手机验证码 
    *@param     number      验证码
    *           tel_id      手机号input输入框ID 字符串 
    *           line        业务线
    *           successFunc 成功的回调函数      
    */
    checkCode: function (number, tel_id, line, successFunc) {
        if (number == "") {
            return ""
        }
        // if (Check.getCode()) {
        var flag = null;
        var params = { mobile: $("#" + tel_id).val().replace(/ /g, ""), validatecode: number, line: line }
        var token = $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id')
        if (token) {
            params.__RequestVerificationToken = token
        }
             //添加埋点
        try {
            bc.evt.send('mobile', 'chkcode', params.mobile)
        }
        catch (err) { }
        
        $ajax({
            url: CODE_VALIDATING_URL,
            type: 'POST',
            data: params,
            success: successFunc,
            error: function (req, status, text) {
                alert(status);//req.responseText;
            }
        });
        // };
    },
    /*
    *信用卡验证
    */
    IsCreditCard: function (number) {
        if (number == "") {
            return "";
        } else {
            // var re = {
            //     electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
            //     maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
            //     dankort: /^(5019)\d+$/,
            //     interpayment: /^(636)\d+$/,
            //     unionpay: /^(62|88)\d+$/,
            //     visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
            //     mastercard: /^5[1-5][0-9]{14}$/,
            //     amex: /^3[47][0-9]{13}$/,
            //     diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
            //     discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
            //     jcb: /^(?:2131|1800|35\d{3})\d{11}$/
            // };

            // for (var item in re) {
            //     if (re[item].test(number)) {
            //         return true;
            //     }
            // }

            // return false;

            if (number.length == 0 || number.length < 12 || number.length > 19) return false;
            var Exp = /[34569]/;
            var objExp = new RegExp(Exp);
            if (objExp.test(number.charAt(0) == false)) return false;
            var tempNumber = reverse(number); //反转 
            var tempS = 0; //保存基数之和
            var tempD = 0; //保存偶数位*2后之和
            for (var i = 0; i < tempNumber.length; i++) {
                if (i % 2 == 0) //说明是基数，因为从0位开始
                {
                    tempS = tempS + tempNumber.charAt(i) * 1;
                } else {
                    var temp = tempNumber.charAt(i) * 2;
                    if (temp > 9) {
                        tempD = tempD + (temp / 10 | 0) + temp % 10;
                    } else tempD = tempD + temp;
                }
            }
            var sum = tempS + tempD;
            if (sum % 10 == 0) return true;
            else return false;

            // @param {Object} source,被反转的字符串,返回反转后的字符串
            function reverse(source) {
                var s = source;
                var ss = "";
                for (i = s.length - 1; i >= 0; i--) {
                    ss = ss + s.charAt(i);
                }
                return ss;
            }

        }
    },
    /*
    *登录密码验证
    *正则表达式验证（数字+字母）或者（数字+特殊字符）或者（字母+特殊字符），不能是纯数字、纯字母、纯特殊字符，即只要符合这3个组合其中之一都为true
    */
    IsPassword: function (number) {
        var passwordRexp = new RegExp(/^((?=.*[a-zA-Z])(?=.*\d)|(?=[a-zA-Z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[a-zA-Z\d#@!~%^&*]{6,20}$/);
        if (number == "") {
            return "";
        } else {
            return passwordRexp.test(number);
        }
    },
    /*
    *图文验证码验证
    *正则表达式验证
    */
    // IsImagePassword: function(number){
    //     var passwordRexp = new RegExp(/^[0-9a-zA-Z]{4}$/);
    //     if(number == ""){
    //         return "";
    //     }else{
    //         return passwordRexp.test(number);
    //     }
    // }

    // 电话号通道
    TelChannel: function (id, telId, BusinessLine, data) {
        var self = this;
        let defaultData = {
            'CarId': '',
            'PackageId': '',
            'CarText': '',
            'CompanyId': '',
            'PackageText': '',
            'CityId': '',
            'CityText': '',
            'DeviceType': 1,//设备类型 1-pc  2-m  3-ios  4-android
            'PageType': 1,//入口页类型 1-首页 2-列表页结果区 3-列表页无结果 4-按预算列表无结果 5-列表页底部 6-详情页
            'statisticalMarker': '',//统计标记点
        },
            _data = $.extend(defaultData, data);
        // $('#maskLayer').after(``)
        var phoneHtml = '<div class="user-tel-box clrfix">' +
            '<div class="user-tel fl"><input id="' + telId + '" type="tel" maxlength="13" name="Phone" value="" placeholder="请输入手机号码"></div>' +
            '<div class="user-btn fr">为我推荐</div>' +
            '</div>' +
            '<div class="user-tips"><font>请输入正确手机号</font></div>';
        $('#' + id).html(phoneHtml);
        let addSpace = true;
        document.onkeydown = function (e) {
            e = e || window.event;
            addSpace = e.keyCode != 8 ? true : false;
        }
        $('#' + id).on('input propertychange', '#' + telId, function () {
            let telVal = $(this).val().replace(/\s*/g, ""),
                leg = $.trim(telVal).length;
            if (addSpace) {
                let result = [];
                for (let i = 0; i < telVal.length; i++) {
                    if (i == 3 || i == 7) {
                        result.push(" " + telVal.charAt(i));
                    } else {
                        result.push(telVal.charAt(i));
                    }
                }
                telVal = result.join("");
                $(this).val(telVal);
            }
        });

        $(document).on('click', '#' + id + ' .user-btn', function () {
            let tel = $.trim($('#' + id + ' #' + telId).val());
            if (tel.length > 0) {
                tel = tel.replace(/\s*/g, "");
            }
            $('#telPopUp #phone').val(tel);
            if (self.isPhoneNumber(tel)) {
                tools.$ajax({
                    url: ADVISERAPIURL + 'user/validatephone?Phone=' + tel,
                    type: 'GET',
                    dataType: 'jsonp',
                    success: function (res) {
                        $('#telPopUp .tel-code-tips font').hide();
                        if (res.Result) {
                            $('#telNum').text(tel.replace(/(\d{3})\d{4}(\d{4})/, '$1 **** $2'));
                            $('#telPopUp, #telPopUp .tel-code-box').show();
                            $('#maskLayer').show();
                            $('#' + id + ' .user-tips font').hide();
                            self.getCode(60, 'phone', 'GetValidateCode', BusinessLine, true, false);
                        } else {
                            $('#' + id + ' .user-tips font').text(res.Message).show();
                        }
                    }
                });
            } else {
                $('#' + id + ' .user-tips font').text('请输入正确手机号').show();
            }
            return false;
        });



        $('#GetValidateCode').click(function (e) {
            // e.stopPropagation();
            self.getCode(60, 'phone', 'GetValidateCode', BusinessLine, true, false);
        });

        $('#telPopUp .validateCode').bind({
            'blur': function () {
                let leg = $.trim($(this).val()).length;
                if (leg == 4) {
                    $('#telPopUp .tel-btn').removeClass('disabled');
                    $('#telPopUp .tel-code-tips font').hide();
                } else if (leg == 0) {
                    $('#telPopUp .tel-btn').addClass('disabled');
                    $('#telPopUp .tel-code-tips font').show().text('请输入验证码');
                } else {
                    $('#telPopUp .tel-code-tips font').show().text('请输入验证码');
                }
            },
            'focus': function () {
                let leg = $.trim($(this).val()).length;
                if ((leg != 0 && leg != 4) || $('#telPopUp .validateCode').hasClass('red')) {
                    $('#telPopUp .validateCode').val('').removeClass('red');
                    $('#telPopUp .tel-btn').addClass('disabled');
                    $('#telPopUp .tel-code-tips font').hide();
                }

                try {
                    _hmt.push(['_trackEvent', _data.statisticalMarker, 'click', '', '']);
                } catch (e) {

                }
            },
            'keyup': function () {
                let inputValLeg = $.trim($(this).val()).length;
                if (inputValLeg == 4) {
                    $('#telPopUp .tel-btn').removeClass('disabled');
                    $('#telPopUp .tel-code-tips font').hide();
                }
            }
        });

        $('#telPopUp .tel-btn').off("click").on('click', function (e) {
            // e.stopPropagation();
            let _code = $.trim($('#telPopUp .validateCode').val());
            if ($('#telPopUp .validateCode').val() == "") {
                $('#telPopUp .tel-code-tips font').show().text('请输入验证码');
            } else {
                tools.$ajax({
                    url: CODE_VALIDATING_URL,
                    type: 'POST',
                    data: { mobile: $("#phone").val(), validatecode: _code, line: BusinessLine },
                    success: function (res) {
                        if (!res.Result) {
                            $('#telPopUp .tel-code-tips font').show().text('验证码错误');
                            $('#telPopUp .validateCode').addClass('red');
                        } else {
                            $('#telPopUp .tel-code-tips font').hide();
                            // 提交申请
                            tools.$ajax({
                                url: ADVISERAPIURL + 'user/postuserphone?Phone=' + $('#phone').val() + '&DeviceType=' + _data.DeviceType + '&CityId=' + _data.CityId + '&CarId=' + _data.CarId + '&PackageId=' + _data.PackageId + '&PageType=' + _data.PageType + '&CarText=' + _data.CarText + '&CityText=' + _data.CityText + '&PackageText=' + _data.PackageText + '&CompanyId=' + _data.CompanyId,
                                type: 'GET',
                                dataType: 'jsonp',
                                success: function (res) {
                                    if (res.Result) {
                                        //成功
                                        $('#telPopUp .tel-success, #maskLayer').show();
                                        $('#telPopUp .tel-code-box').hide();
                                    } else {
                                        tools.showAlert(res.Message, 2000);
                                    }
                                }
                            })

                        }
                    },
                    error: function (req, status, text) {
                        alert(status);//req.responseText;
                    }
                });
            }
        });

        $('#telPopUp .close').click(function (e) {
            // e.stopPropagation();
            $('#' + id + ' #' + telId).val('');
            $('#telPopUp .validateCode').val('');
            $('#telPopUp .tel-btn').addClass('disabled');
            $('#' + id + ' .user-tips font').hide();
            $('#telPopUp').hide();
            $('#maskLayer').hide();
            $('#telPopUp .tel-success').hide();

            $('#GetValidateCode').removeClass("disable").text("获取验证码");
            clearInterval(window.tmo);
        });
    },

    // 三方验证码
    LoadTCapAuthcode: function(api=window.getSlideVerifyApi, businessid=window.businessid, cb){
        if(api){
            $('body').append('<div id="capFrame"></div>')
            $.post(api, {businessid}, res => {
                if(res.Result){
                    window.tencentCaptype = res.Data.captype
                    $.getScript(res.Data.url, () => {
                        if(typeof cb === 'function'){
                            Check.GetTCapAuthcode(cb)
                        }
                    })
                }else if(typeof cb === 'function' && res.Message){
                    tools.showAlert(res.Message)
                }
            }, 'json')
        }
    },

    // 展示三方验证码
    GetTCapAuthcode: function(cb, mobile=window.tempTcapMobile, api=window.CheckSign,  businessid=window.businessid){
        const $mask = $('#maskLayer')
        const hideMask = () => {
            if($mask.length && $mask.is(':visible')){
                $mask.hide()
            }
        }
        const showMask = () => {
            if($mask.length && $mask.is(':hidden')){
                $mask.show()
            }
        }
        const capOption = {
            type: 'popup',
            disturbLevel: 1,
            pos: 'fixed',
            themeColor: 'f1004d',
            showHeader: true,
            callback(res){
                if(res.ret === 0){
                    $.post(api, {captype: window.tencentCaptype, ticket: res.ticket, businessid: businessid, mobile: mobile}, res => {
                        hideMask()
                        if(typeof cb === 'function'){
                            cb(res)
                        }
                    }, 'json')
                }else{
                    hideMask()
                    cb(false)
                }
            }
        }
        if(window.capInit){
            window.tempTcapMobile = null
            showMask()
            window.capRefresh()
            window.capInit($('#capFrame'), capOption)
        }else{
            window.tempTcapMobile = mobile
            Check.LoadTCapAuthcode(window.getSlideVerifyApi, window.businessid, cb)
        }
    }
}

//手机号码
exports.isPhoneNumber = Check.IsPhoneNumber;
//身份证
exports.isID = Check.IdCardValidate;
//护照
exports.isPassport = Check.IsPassport;
//姓名
exports.isName = Check.IsName;
//Email
exports.isEmail = Check.IsEmail;
//车牌号
exports.isCarName = Check.IsCarName;
//座机号
exports.isLandline = Check.IsLandline;
//信用卡
exports.isCreditCard = Check.IsCreditCard;
//获取验证码
exports.getCode = Check.getCode;
//验证验证码
exports.checkCode = Check.checkCode;
//密码
exports.isPassword = Check.IsPassword;
//图文密码
// exports.isImagePassword = Check.IsImagePassword;
// 手机号通道
exports.telChannel = Check.TelChannel;
module.exports = {
    Check: Check,
    //手机号码
    isPhoneNumber: Check.IsPhoneNumber,
    //身份证
    isID: Check.IdCardValidate,
    //护照
    isPassport: Check.IsPassport,
    //姓名
    isName: Check.IsName,
    //Email
    isEmail: Check.IsEmail,
    //车牌号
    isCarName: Check.IsCarName,
    //座机号
    isLandline: Check.IsLandline,
    //信用卡
    isCreditCard: Check.IsCreditCard,
    //获取验证码
    getCode: Check.getCode,
    getAuthcode: Check.getAuthcode,
    //加安全校验的获取验证码
    newGetCode: Check.newGetCode,
    //验证验证码
    checkCode: Check.checkCode,
    //密码
    isPassword: Check.IsPassword,
    // 手机号通道
    telChannel: Check.TelChannel,
    // 加载三方验证码
    loadTCapAuthcode: Check.LoadTCapAuthcode,
    // 显示三方验证码
    getTCapAuthcode: Check.GetTCapAuthcode
}