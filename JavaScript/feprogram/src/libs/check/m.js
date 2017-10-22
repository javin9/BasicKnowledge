var Check = {
    Wi: [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1], // 加权因子
    ValideCode: [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2], // 身份证验证位值.10代表X
    IdCardValidate: function(idCard) {
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
    IsTrueValidateCodeBy18IdCard: function(a_idCard) {
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
    MaleOrFemalByIdCard: function(idCard) {
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
    IsValidityBrithBy18IdCard: function(idCard18) {
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
    IsValidityBrithBy15IdCard: function(idCard15) {
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
    IsPhoneNumber: function(number) {
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
    IsPassport: function(number) {
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
    IsName: function(number) {
        var nameRexp = new RegExp(/^[\u4e00-\u9fa5]{2,8}$/); //2-8位汉字
        if (number == "") {
            return "";
        } else {
            return nameRexp.test(number);
        }
    },
    /*
     *Email验证
     */
    IsEmail: function(number) {
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
    IsCarName: function(number) {
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
    IsLandline: function(number) {
        //var landlineRexp = new RegExp(/^0\d{2,3}-\d{5,9}|0\d{2,3}-\d{5,9}$/);
        var landlineRexp = new RegExp(/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/);
        if (number == "") {
            return "";
        } else {
            return landlineRexp.test(number);
        }
    },
    //返回验证码类型
    getTencentCaptype() {
        return this.TencentCaptype
    },
    getTencentImageCode(url, bID, tip) {
        const _this = this
            //获取验证资源
        if (dev) {
            const Mock = { "Result": true, "Message": "", "Data": { "url": "https://captcha.guard.qcloud.com/template/TCapIframeApi.js?appid=1251107216\u0026clientype=2\u0026lang=2052\u0026asig=rAHrCYbX5d7oXOUvXhFZcfpDZvnPpU55xe1pNe8dgCOV3JhwGkjDlPQeEHCQqu20VNRVdMUdmlXqugBtNMd6W9DkRgQEBfN8", "captype": "2" }, "RowCount": 0 }
            let dc = document.createElement("script");
            dc.type = "text/javascript";
            dc.async = true;
            dc.src = Mock.Data.url;
            let s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(dc, s)
            _this.TencentCaptype = Mock.Data.captype; //这个用于验证的时候
            return;
        }
        $.ajax({
            url: url,
            type: 'post',
            data: {
                businessid: bID
            },
            success: (res) => {
                if (res.Result) {
                    let dc = document.createElement("script");
                    dc.type = "text/javascript";
                    dc.async = true;
                    dc.src = res.Data.url;
                    let s = document.getElementsByTagName("script")[0];
                    s.parentNode.insertBefore(dc, s)
                    _this.TencentCaptype = res.Data.captype; //这个用于验证的时候
                } else {
                    if (tip) {
                        tools.showAlert(res.Message)
                    }
                }
            }
        })
    },
    checkTencentImageCode(callback) {
        $('#maskLayer').css({ display: 'block' })
        const res = {
            Result: true,
            Ticket: '',
            Message: ''
        }
        const capOption = {
            type: "popup",
            disturbLevel: 1,
            businessId: 0,
            pos: 'fixed',
            themeColor: "f1004d",
            showHeader: true,
            callback: (retJson) => {
                if (retJson.ret == 0) {
                    $('#maskLayer').css({ display: 'none' })
                        // 用户验证成功
                    res.Ticket = retJson.ticket;
                    callback(res)
                } else {
                    $('#maskLayer').css({ display: 'none' })
                        //用户关闭验证码页面，去掉遮罩
                    stopCountDown(_validateCode)
                    res.Result = false
                    res.Message = retJson.Message
                    callback(res)
                }
            }
        };
        if (typeof(capInit) != "undefined") {
            capRefresh();
            capInit(document.getElementById("capFrame"), capOption);
        } else {
            this.getTencentImageCode(getSlideVerifyApi, businessid, true)
        }

    },
    /*
     *获取手机验证码 
     *@param     seconds     倒计时时间，单位秒
     *           tel_id      手机号input输入框ID 字符串
     *           gvc_id      验证码触发容器ID 字符串
     *           line        业务线
     *           url         接口路径 
     *           successFunc 成功的回调函数 
     */
    getCode: function(data, successFunc) {
        var defaultData = {
            seconds: 60,
            tel_id: 'mobile',
            gvc_id: 'GetValidateCode',
            line: '550',
            url: CODE_GETTING_URL,
            __RequestVerificationToken: '',
            codelen: 6
        }

        // 此处为了兼容淘车对该函数的修改
        // 淘车用的length参数控制
        var Tdata = $.extend(defaultData, data, { codelen: data.codelen || data.length || defaultData.codelen });

        if (Tdata.seconds <= 0) {
            alert(倒计时时间不能小于0);
            return false;
        };

        if ($("#" + Tdata.gvc_id).hasClass("disable")) {
            return false;
        };

        var telNum = ($("#" + Tdata.tel_id).val() || '').replace(/\s/g, '')
        var params = { mobile: telNum, line: Tdata.line, codelen: Tdata.codelen };
        var token = Tdata.__RequestVerificationToken || $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id')
        if (token) {
            params.__RequestVerificationToken = token
        }
        if (Check.IsPhoneNumber(telNum)) {
            //添加埋点
            try {
                bc.evt.send('mobile', 'codeclk', params.mobile)
            } catch (err) {}
            tools.$ajax({
                url: Tdata.url,
                data: params,
                type: 'POST',
                dataType: 'json',
                success: function(res) {
                    successFunc(res);
                }
            });
            $("#" + Tdata.gvc_id).addClass("disable").text(Tdata.seconds + "秒后获取");
            window.tmo = setInterval(function() {
                if (--Tdata.seconds == 0) {
                    clearInterval(tmo);
                    $("#" + Tdata.gvc_id).removeClass("disable").text("获取验证码");
                    return;
                }
                $("#" + Tdata.gvc_id).text(Tdata.seconds + "秒后获取");
            }, 1000);
            return true;
        } else {
            return false;
        }
    },
    /*
     *验证手机验证码 
     *@param     number      验证码
     *           tel_id      手机号input输入框ID 字符串 
     *           line        业务线
     *           url         接口路径 
     *           successFunc 成功的回调函数      
     */
    checkCode: function(data, successFunc) {
        var defaultData = {
            number: '',
            tel_id: 'mobile',
            gvc_id: 'GetValidateCode',
            line: '550',
            url: CODE_VALIDATING_URL
        }
        var Tdata = $.extend(defaultData, data);

        if (Tdata.number == "") {
            return ""
        }
        // if (Check.getCode()) {
        var params = { mobile: ($("#" + Tdata.tel_id).val() || '').replace(/\s/g, ''), validatecode: Tdata.number, line: Tdata.line }
        var token = Tdata.__RequestVerificationToken || $('input[name=__RequestVerificationToken]').val() || $('input[name=__RequestVerificationToken]').data('id')
        if (token) {
            params.__RequestVerificationToken = token
        }
        var flag = null;
        //添加埋点
        try {
            bc.evt.send('mobile', 'chkcode', params.mobile)
        } catch (err) {}
        tools.$ajax({
            url: Tdata.url,
            type: 'POST',
            data: params,
            success: successFunc,
            error: function(req, status, text) {
                alert(status); //req.responseText;
            }
        });
        // };
    },
    /*
     *信用卡验证
     */
    IsCreditCard: function(number) {
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
    IsPassword: function(number) {
        var passwordRexp = new RegExp(/^((?=.*[a-zA-Z])(?=.*\d)|(?=[a-zA-Z])(?=.*[#@!~%^&*])|(?=.*\d)(?=.*[#@!~%^&*]))[a-zA-Z\d#@!~%^&*]{6,20}$/);
        if (number == "") {
            return "";
        } else {
            return passwordRexp.test(number);
        }
    },
    /*
     *校验手机验证码
     */
    IsValidateCode: function(num) {
        var codeRexp = new RegExp(/^[0-9]{6}$/);
        if (num === "") {
            return "";
        } else {
            return codeRexp.test(num);
        }
    },
    IsAuthcode: function(num) {
        var codeRexp = new RegExp(/^[0-9]{4}$/);
        if (num === "") {
            return "";
        } else {
            return codeRexp.test(num);
        }
    },
    /*
     *校验年龄22-65
     */
    IsAge: function(num) {
        var codeRexp = new RegExp(/^[2][2-9]|[3-5]\d|[6][0-5]$/);
        if (num === "") {
            return "";
        } else {
            return codeRexp.test(num);
        }
    },
    /*
     *校验公里数
     */
    IsKilometres: function(num) {
        var codeRexp = new RegExp(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/);
        if (num === "") {
            return "";
        } else {
            return codeRexp.test(num);
        }
    },
    /*
     *图文验证码验证
     *正则表达式验证
     */
    IsImagePassword: function(number) {
        var passwordRexp = new RegExp(/^[0-9a-zA-Z]{4}$/);
        if (number == "") {
            return "";
        } else {
            return passwordRexp.test(number);
        }
    }

}
module.exports = {
    //手机号
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
    //腾讯验证码
    getTencentCaptype: Check.getTencentCaptype,
    getTencentImageCode: Check.getTencentImageCode,
    checkTencentImageCode: Check.checkTencentImageCode,
    //获取验证码
    getCode: Check.getCode,
    //验证验证码
    checkCode: Check.checkCode,
    //密码
    isPassword: Check.IsPassword,
    //校验验证码6位
    isValidateCode: Check.IsValidateCode,
    //校验验证码4位
    isAuthcode: Check.IsAuthcode,
    //校验年龄
    isAge: Check.IsAge,
    //校验公里数
    isKilometres: Check.IsKilometres,
    // 图片验证码
    isImagePassword: Check.IsImagePassword
}