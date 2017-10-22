//导入所需js
import aes from "libs/aes"; // 加密
var check = require("libs/check");
var _returnurl = returnurl ? decodeURIComponent(returnurl) : "";
var token = '';

check.loadTCapAuthcode()

function AddAntiForgeryToken(data) {
    data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
    return data;
};
var checkedNumDom = $('.checked-num');
var CheckFormPage = function() {
    this.isShowData = true;
    this.tmoLogin = ""; //异步验证定时器
    this.IE8sign = false;


    //接口
    this.loginUrl = '/Login/Login';
    this.bindAccountUrl = '/login/BindAccount';
    this.regUrl = '/Register/Register';

    //忘记密码
    this.setpTwoUrl = '/ForgetPwd/FindPasswordSetpOne';
    this.setpThreeUrl = '/ForgetPwd/FindPasswordSetpTwo';
    this.setpFourUrl = '/ForgetPwd/FindPasswordSetpThree';

    //注册获取验证码
    this.regcodeUrl = '/Register/CheckAccount';
}


CheckFormPage.prototype = {
        init: function() {
            this.domInit();
            this.checkForm();
        },
        checkNumber: function(val) {
            return val.replace(/\D/g, '');
        },
        domInit: function() {
            var self = this;

            $(".GetImgValidateCode").each(function() {
                $(this).find('img').attr('src', '/Login/GetImageValidateCode?t=' + (new Date().getTime()));
            });

            $('#GetImgValidateCode1').find('img').attr('src', '/Login/GetImageValidateCode?t=' + (new Date().getTime()));

            // 用户登录
            $("#user-btn1").click(function() {
                if (!self.isShowData) {
                    return tools.showAlert("大侠手太快啦，等下再试试！");
                }
                self.submitFunc("tab1", self.loginUrl, function(res) {
                    sendURL(_returnurl);
                });
            });

            $('.inputNumber').on("keyup", function(e) {
                    var _val = $(this).val();
                    $(this).val(self.checkNumber(_val));
                })
                //动态密码登录
            $("#user-btn2").click(function() {
                if (!self.isShowData) {
                    return tools.showAlert("大侠手太快啦，等下再试试！");
                }
                self.submitFunc("tab2", self.loginUrl, function(res) {
                    sendURL(_returnurl);
                });
            });

            //回车登录
            var formIdArr = ['tab1', 'tab2']
            for (var i = 0; i < formIdArr.length; ++i) {
                var fId = formIdArr[i];
                (function(fId) {
                    $("#" + fId + " input.AppCheck").keyup(function(event) {
                        if (event.keyCode == "13") {
                            //已经写好的点击按钮所执行的js方法
                            $(this).blur();
                            if ($(this).attr("id").indexOf("ImgValidateCode1") != -1) {
                                clearInterval(self.tmoLogin);
                                $(this).removeClass("async");
                                var $that = $(this);
                                self.tmoLogin = setInterval(function() {
                                    if ($that.hasClass("async")) {
                                        clearInterval(self.tmoLogin);
                                        self.submitFunc(fId, self.loginUrl, function(res) {
                                            sendURL(_returnurl);
                                        });
                                    }
                                }, 500)
                            } else {
                                setTimeout(function() {　　　　　　　　
                                    self.submitFunc(fId, self.loginUrl, function(res) {
                                        sendURL(_returnurl);
                                    });
                                }, 1);
                            }
                        }

                    });
                })(fId);
            }


            //用户注册
            $("#reg-btn").click(function() {
                self.submitFunc("regForm", self.regUrl, function(res) {
                    sendURL(_returnurl);
                });
            });

            function sendURL(url) {
                if (url == "") {
                    window.location.href = xinche;
                } else {
                    window.location.href = _returnurl;
                }
            }

            //忘记密码第一步
            $("#step-btn01").click(function() {
                var that = this;
                self.submitFunc("form01", self.setpTwoUrl, function(res) {
                    var tel = $("#form01 input[name='mobile']").val();
                    nextStep($(that).data("id"));
                    $("#form02 input[name='mobile']").val(tel);
                    $(".telEvent").text(tel.substring(0, 3) + "-" + tel.substring(3, 7) + "-" + tel.substring(tel.length - 4));
                });
            });

            //忘记密码第二步
            $("#step-btn02").click(function() {
                var that = this;
                self.submitFunc("form02", self.setpThreeUrl, function(res) {
                    token = res.Data;
                    nextStep($(that).data("id"));
                    $("#form03 input[name='mobile']").val($("#form01 input[name='mobile']").val());
                    $("#form03 input[name='mobileValidateCode']").val($("#form02 input[name='mobileValidateCode']").val());
                });
            });

            //忘记密码第二步返回
            $("#reback").click(function() {
                lastStep($(this).data("id"));
            });

            //忘记密码第三步
            $("#step-btn03").click(function() {
                var that = this;
                self.submitFunc("form03", self.setpFourUrl + '?token=' + token, function(res) {
                    nextStep($(that).data("id"))
                });
            });

            //忘记密码第三步返回
            $("#reback03").click(function() {
                lastStep($(this).data("id"));
            });

            //用户绑定手机号
            $("#set-btn").click(function() {
                self.submitFunc("bindForm", self.bindAccountUrl, function(res) {
                    var num = $("#mobile").val(),
                        reg = /^(\d{3})\d{4}(\d{4})$/;
                    num = num.replace(reg, "$1****$2")
                    $("#mask").removeClass("hide").find(".mask-tel span").text(num);
                });
            });

            //关闭遮罩层
            $("#mask .close").click(function() {
                $("#mask").addClass("hide");
                location.href = _returnurl;
            });

            function nextStep(id) {
                $("#form0" + id).addClass("hide");
                $("#form0" + (parseInt(id) + 1)).removeClass("hide");
                $("#nav .step-box").removeClass("step0" + id).addClass('step0' + (parseInt(id) + 1));
            }

            function lastStep(id) {
                $("#form0" + id).addClass("hide");
                $("#form0" + (parseInt(id) - 1)).removeClass("hide");
                $("#nav .step-box").removeClass("step0" + id).addClass('step0' + (parseInt(id) - 1));
            }
        },
        //ajax
        sendAjax: function(opt, callbacks, errorCallback) {
            var self = this;
            var setting = {
                url: '',
                timeout: 5000,
                type: 'POST',
                async: true,
                data: {}
            };
            setting = $.extend(setting, opt);
            tools.$ajax({
                url: setting.url,
                type: setting.type,
                async: setting.async,
                data: setting.data,
                beforeSend: function() {
                    // self.tmoSUb = setTimeout(function(){
                    if (loadsign == "reg") {
                        tools.showAlert("正在为您准备账号，请耐心等待...", 50000);
                    } else if (loadsign == "login") {
                        tools.showAlert("Loading...", 50000);
                    }
                    // }, 300);
                },
                success: function(res) {
                    callbacks(res);
                },
                complete: function(XMLHttpRequest, textStatus) {
                    if (status == 'timeout') { //超时,status还有success,error等值的情况
                        errorCallBack(textStatus);
                    }
                }
            })
        },
        checkImgPassword: function(number, successFunc) {
            tools.$ajax({
                data: { 'imageValidateCode': number },
                url: '/Login/IsLegalValidateCode',
                success: successFunc,
                error: function(req, status, text) {
                    clearInterval(self.tmoLogin);
                    alert(status); //req.responseText;
                }
            })
        },

        //校验
        checkForm: function() {
            var self = this;
            var IDStr = {
                mobile: '手机号',
                mobile1: '手机号',
                password: '密码',
                passwordplaceholderfriend: '密码',
                ImgValidateCode1: '图片验证码'
            }

            function isShowBtn($input) {
                let fId = $input.parents('blockquote').attr('id');
                if (fId === 'tab2' || fId === 'regForm') {
                    if ($('#ImgValidateCode2Box').hasClass('hide')) {
                        if ($('#' + fId + ' input.nocheck').length === 1 && $('#ImgValidateCode2').hasClass('nocheck')) {
                            let btnDom = fId === 'tab2' ? $('#user-btn2') : $('#reg-btn');
                            btnDom.removeClass('disable');
                        }
                    } else {
                        if ($('#' + fId + ' .nocheck').length === 0) {
                            let btnDom = fId === 'tab2' ? $('#user-btn2') : $('#reg-btn');
                            btnDom.removeClass('disable');
                        }
                    }
                } else if (fId === 'tab1') {
                    if ($('#tab1 input.nocheck').length === 0) {
                        $('#user-btn1').removeClass('disable');
                    }
                }
            }

            $("input").on('blur', function() {
                if (self.IE8sign) {
                    self.IE8sign = false;
                    return;
                }
                blurFunc($(this));
            }).on('input', function() {
                let fId = $(this).parents('blockquote').attr('id'),
                    inputId = $(this).attr('id'),
                    inputVal = $(this).val();
                if (fId == 'tab1' || fId == 'tab2' || fId == 'regForm') {
                    if (inputId == 'mobile1' || inputId == 'mobile') { //手机号验证
                        if (inputVal.length == 11 && check.isPhoneNumber($(this).val())) {
                            let checkcodeType = $("input[name='type']").val();

                            $(this).removeClass("unsubmit nocheck").parents("#form").find(".jyts").hide();

                            if (inputId == 'mobile' && $('#ImgValidateCode2Box').hasClass('hide')) {
                                if (checkcodeType == 'register') {
                                    self.codeDisable('GetRegValidateCode');
                                } else if (checkcodeType == 'login') {
                                    self.codeDisable('GetValidateCode');
                                }
                            }
                            checkedNumDom.show();
                            isShowBtn($(this));
                        }
                    } else if (inputId == 'ImgValidateCode1') {
                        if (inputVal.length == 4) {
                            $(this).removeClass("unsubmit nocheck").parents("#form").find(".jyts").hide();
                            isShowBtn($(this));
                            self.checkImgPassword($(this).val(), function(res) {
                                if ($("input[name='type']").val() == 'register') {
                                    self.codeDisable('GetRegValidateCode');
                                } else if ($("input[name='type']").val() == 'login') {
                                    self.codeDisable('GetValidateCode');
                                }
                                // }
                                checkedNumDom.show();
                                $(this).addClass('async');
                            })
                        }
                    } else if (inputId == 'ValidateCode' || inputId == 'RegValidateCode') {
                        $(".codebox").removeClass('red');
                        let codeRexp = new RegExp(/^[0-9]{4}$/);
                        if (codeRexp.test(inputVal)) {
                            $(this).removeClass("unsubmit nocheck").parents("#form").find(".jyts").hide();
                            checkedNumDom.show();
                            isShowBtn($(this));
                        }
                    } else if (inputId == 'password') {
                        if (inputVal.length >= 1) {
                            $("#password").removeClass("unsubmit nocheck").parents("#form").find(".jyts").hide();
                            // checkedNumDom.show();
                            $("#password").next("input").removeClass("unsubmit nocheck");
                            checkedNumDom.show();
                            isShowBtn($(this));
                        }
                    } else if (inputId == 'passwordplaceholderfriend') {
                        $(this).removeClass('unsubmit nocheck').parents('blockquote').find('.jyts').hide();
                        checkedNumDom.show();
                        isShowBtn($(this));
                    }
                }
            });

            function blurFunc($input) {
                var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
                var inputName = $input.attr("id"),
                    inputValue = $input.val();

                function isPlaceholer() {
                    var input = document.createElement('input');
                    return "placeholder" in input;
                }
                if (!isPlaceholer()) {
                    inputValue = reg.test(inputValue) ? "" : inputValue;
                };

                //验证图文验证码
                function checkImgFUnc(number, $input) {
                    $input.removeClass('async');
                    if ($.trim(number) === "") {
                        clearInterval(self.tmoLogin);
                        if ($input.hasClass("sideTip")) {
                            $input.addClass("unsubmit nocheck").parents(".input-item").next().next(".jyts").show().find("span").text("请输入图文验证码");
                        } else {
                            $input.addClass("unsubmit nocheck").parents("#form").find(".jyts").show().text("请输入图文验证码");
                        }
                        checkedNumDom.hide();
                        return false;
                    }
                    self.checkImgPassword(number, function(res) {
                        if (!res.Result) {
                            if ($input.hasClass("sideTip")) {
                                $input.addClass("unsubmit nocheck").parents(".input-item").next().next(".jyts").show().find("span").text("图文验证码有误");
                            } else {
                                $input.addClass("unsubmit nocheck").parents("#form").find(".jyts").show().text("请输入正确的图片验证码");
                            }
                            checkedNumDom.hide();
                            return false;
                        } else {
                            if ($input.hasClass("sideTip")) {
                                $input.removeClass("unsubmit nocheck").parents(".input-item").next().next(".jyts").hide();
                            } else {
                                $input.removeClass("unsubmit nocheck").parents("#form").find(".jyts").hide();
                            }
                            checkedNumDom.show();
                            $input.addClass('async');
                            return false;
                        }
                    });
                }

                function checkInput(checkFunction, $input, name) {
                    if (checkFunction === "") {
                        if ($input.hasClass("sideTip")) {
                            $input.addClass("unsubmit nocheck").parents(".input-item").next(".jyts").show().find("span").text("请输入您的" + IDStr[name]);
                        } else {
                            $input.addClass("unsubmit nocheck").parents("#form").find(".jyts").show().text("请输入您的" + IDStr[name]);
                        }
                        checkedNumDom.hide();
                        return false;
                    } else if (checkFunction === false) {
                        if ($input.hasClass("sideTip")) {
                            $input.addClass("unsubmit nocheck").parents(".input-item").next(".jyts").show().find("span").text("您输入的" + ($input.attr('data-special') == '密码格式' ? '密码格式' : IDStr[name]) + "有误");
                        } else {
                            $input.addClass("unsubmit nocheck").parents("#form").find(".jyts").show().text("请输入正确的" + IDStr[name]);
                        }
                        checkedNumDom.hide();
                        return false;
                    } else {
                        if ($input.hasClass("sideTip")) {
                            $input.removeClass("unsubmit nocheck").parents(".input-item").next(".jyts").hide();
                        } else {
                            $input.removeClass("unsubmit nocheck").parents("#form").find(".jyts").hide();
                        }
                        checkedNumDom.show();
                        $input.next().removeClass("unsubmit nocheck");
                        return true;
                    }
                }

                function checkCode($input) {
                    var codeRexp = new RegExp(/^[0-9]{4}$/),
                        code = $.trim($input.val());

                    if (code == "" || code.indexOf('密码') != -1 || code.indexOf('验证码') != -1) {
                        if ($input.hasClass("sideTip")) {
                            $input.addClass("unsubmit").parents(".input-item").next().next(".jyts").show().find("span").text('请输入手机验证码');
                        } else {
                            $input.addClass("unsubmit").parents("#form").find(".jyts").show().text('请输入您的手机验证码');
                        }
                        checkedNumDom.hide();
                        return false;
                    } else if (!codeRexp.test(code)) {
                        if ($input.hasClass("sideTip")) {
                            $input.addClass("unsubmit").parents(".input-item").next().next(".jyts").show().find("span").text("手机验证码有误");
                        } else {
                            $input.addClass("unsubmit").parents("#form").find(".jyts").show().text("请输入正确的验证码");
                        }
                        checkedNumDom.hide();
                        return false;
                    } else {
                        if ($input.hasClass("sideTip")) {
                            $input.removeClass("unsubmit").parents(".input-item").next().next(".jyts").hide();
                        } else {
                            $input.removeClass("unsubmit").parents("#form").find(".jyts").hide();
                        }
                        checkedNumDom.show();
                        return false;
                    }
                }

                //对比密码与确认密码
                function comparePwd($input, inputValue) {
                    var pwd = $("input[name='password']").val() || $("input[name='Password']").val();
                    if ($.trim(inputValue) == "" || inputValue.indexOf('密码') != -1) {
                        $input.addClass("unsubmit nocheck").parents(".input-item").next(".jyts").show().find("span").text("请输入确认密码");
                        checkedNumDom.hide();
                        return false;
                    } else if (inputValue != pwd) {
                        $input.addClass("unsubmit nocheck").parents(".input-item").next(".jyts").show().find("span").text("您两次输入的密码不一致");
                        checkedNumDom.hide();
                        return false;
                    } else {
                        $input.removeClass("unsubmit nocheck").parents(".input-item").next(".jyts").hide();
                        checkedNumDom.show();
                        $input.next().removeClass("unsubmit nocheck");
                    }
                }

                function checkRegCode($input) {
                    var regcodeRexp = new RegExp(/^[0-9]{4}$/),
                        regcode = $.trim($input.val());
                    if (regcode === "") {
                        $input.addClass("unsubmit").parents("#form").find(".jyts").show().text("请输入手机验证码");
                        checkedNumDom.hide();
                    } else if (!regcodeRexp.test(regcode)) {
                        $input.addClass("unsubmit").parents("#form").find(".jyts").show().text("手机验证码有误");
                        checkedNumDom.hide();
                    } else {
                        $input.removeClass("unsubmit").parents("#form").find(".jyts").hide();
                        checkedNumDom.show();
                    }
                }

                function newCheckInput(checkFunction, val, inputId) {
                    if (checkFunction === '') {
                        $('#' + inputId).removeClass('unsubmit').parents('blockquote').find('.jyts').hide();
                        checkedNumDom.show();
                        return false;
                    }
                    let $input = $("input[id='" + inputId + "']"),
                        checkcodeType = $("input[name='type']").val();

                    if (inputId == 'mobile' || inputId == 'mobile1') {
                        if (checkFunction) {
                            if (inputId == 'mobile' && $('#ImgValidateCode2Box').hasClass('hide')) {
                                if (checkcodeType == 'register') {
                                    self.codeDisable('GetRegValidateCode');
                                } else if (checkcodeType == 'login') {
                                    self.codeDisable('GetValidateCode');
                                }
                            }
                            $input.removeClass('unsubmit nocheck').parents('blockquote').find('.jyts').hide();
                            checkedNumDom.show();
                        } else {
                            if (checkcodeType == 'register') {
                                $("#GetRegValidateCode").addClass('disable');
                            } else if (checkcodeType == 'login') {
                                $("#GetValidateCode").addClass('disable');
                            }
                            $input.addClass('unsubmit nocheck').parents('blockquote').find('.jyts').show().text('请输入有效的手机号');
                            checkedNumDom.hide();
                        }
                    }
                }

                function newCheckImgFunc(number, $input) {
                    $input.removeClass('async');
                    if ($.trim(number) === "") {
                        $input.removeClass('unsubmit').parents('blockquote').find('.jyts').hide();
                        checkedNumDom.show();
                        clearInterval(self.tmoLogin);
                        return false;
                    }
                    self.checkImgPassword(number, function(res) {
                        if (!res.Result) {

                            $input.addClass("unsubmit nocheck").parents("#form").find(".jyts").show().text("请输入正确的图片验证码");
                            checkedNumDom.hide();
                            return false;
                        } else {
                            $input.removeClass("unsubmit nocheck").parents("#form").find(".jyts").hide();
                            // if(inputName == 'mobile' && !$('#ImgValidateCode2Box').hasClass('hide')){
                            let checkcodeType = $("input[name='type']").val();
                            if (checkcodeType == 'register') {
                                self.codeDisable('GetRegValidateCode');
                            } else if (checkcodeType == 'login') {
                                self.codeDisable('GetValidateCode');
                            }
                            // }
                            let fId = $input.parents('blockquote').attr('id');
                            if (fId === 'tab2') {
                                if ($('#tab2 .nocheck').length === 0) {
                                    $('#user-btn2').removeClass('disable');
                                }
                            } else if (fId === 'tab1') {
                                if ($('#tab1 input.nocheck').length === 0) {
                                    $('#user-btn1').removeClass('disable');
                                }
                            } else if (fId === 'regForm') {
                                if ($('#regForm input.nocheck').length === 0) {
                                    $('#reg-btn').removeClass('disable');
                                }
                            }

                            checkedNumDom.show();
                            $input.addClass('async');
                            return true;
                        }
                    });
                }

                function newCheckCode($input) {
                    var codeRexp = new RegExp(/^[0-9]{4}$/),
                        code = $.trim($input.val());

                    if (code == "" || code.indexOf('密码') != -1 || code.indexOf('验证码') != -1) {
                        // if($input.hasClass("sideTip")){
                        // 	$input.addClass("unsubmit").parents(".input-item").next().next(".jyts").show().find("span").text('请输入手机验证码');
                        // }else{
                        // 	$input.addClass("unsubmit").parents("#form").find(".jyts").show().text('请输入您的手机验证码');
                        // }
                        $input.removeClass('unsubmit').parents("#form").find(".jyts").hide();;
                        checkedNumDom.show();
                        return false;
                    } else if (!codeRexp.test(code)) {
                        $input.addClass("unsubmit nocheck").parents("#form").find(".jyts").show().text("请输入正确的短信验证码");
                        checkedNumDom.hide();
                        return false;
                    } else {
                        $input.removeClass("unsubmit nocheck").parents("#form").find(".jyts").hide();
                        checkedNumDom.show();
                        return false;
                    }
                }

                switch (inputName) {
                    case 'mobile':
                        newCheckInput(check.isPhoneNumber(inputValue), inputValue, inputName);
                        break;
                    case 'mobile1':
                        newCheckInput(check.isPhoneNumber(inputValue), inputValue, inputName);
                        break;
                    case 'password':
                        if (inputValue === '') {
                            $input.addClass("unsubmit nocheck").parents("#form").find(".jyts").show().text("请输入密码");
                        } else {
                            $("#password").removeClass("unsubmit nocheck").parents("#form").find(".jyts").hide();
                        }
                        checkedNumDom.show();
                        break;
                    case 'passwordplaceholderfriend':
                        newCheckInput(check.isPassword(inputValue), inputValue, inputName);
                        break;
                    case 'ImgValidateCode1':
                        newCheckImgFunc(inputValue, $input);
                        break;
                    case 'ImgValidateCode2':
                        newCheckImgFunc(inputValue, $input);
                        break;
                    case 'ValidateCode':
                        newCheckCode($input);
                        break;
                    case 'ValidateCode1':
                        newCheckCode($input);
                        break;
                    case 'checkPassword': //密码、确认密码
                        comparePwd($input, inputValue);
                        break;
                    case 'checkPasswordplaceholderfriend':
                        comparePwd($input, inputValue);
                        break;
                    case 'RegValidateCode':
                        newCheckCode($input);
                        break;

                }

                $("#GetValidateCode").click(function() {
                    if ($(this).hasClass("disable")) {
                        return false;
                    };

                    const $validateCode = $('#GetValidateCode')
                    let seconds = 60
                    let tmo

                    if(!checkInput(check.isPhoneNumber($("#mobile").val()), $("#mobile"), 'mobile')){
                        return false
                    }

                    check.getTCapAuthcode(res => {
                        if(res && res.Result){
                            $('#ValidateCode').focus()
                        }else{
                            res.Message && tools.showAlert(res.Message)
                            if(tmo){
                                clearInterval(tmo)
                            }
                            $validateCode.removeClass('disable').text('获取动态密码')
                        }
                    }, $("#mobile").val())

                    $validateCode.addClass('disable').text("60秒后获取");
                    tmo = setInterval(function() {
                        if (--seconds === 0) {
                            clearInterval(tmo)
                            $validateCode.removeClass('disable').text('获取动态密码')
                            return;
                        }
                        $validateCode.text(seconds + '秒后获取');
                    }, 1000)
                });
                //获取图文验证码 "Login/GetImageValidateCode"
                $(".GetImgValidateCode").click(function() {
                    $(this).find('img').attr('src', '/Login/GetImageValidateCode?t=' + (new Date().getTime()));
                });

                $('#GetImgValidateCode1').click(function() {
                    $(this).find('img').attr('src', '/Login/GetImageValidateCode?t=' + (new Date().getTime()));
                });

                $('#changeImgValidateCode1').click(function() {
                    $('#GetImgValidateCode1 img').attr('src', '/Login/GetImageValidateCode?t=' + (new Date().getTime()));
                });

                // 注册获取验证码
                $("#GetRegValidateCode").click(function() {
                    if ($(this).hasClass("disable")) {
                        return false;
                    }

                    const $validateCode = $('#GetRegValidateCode')
                    let seconds = 60
                    let tmo

                    if(!checkInput(check.isPhoneNumber($("#mobile").val()), $("#mobile"), 'mobile')){
                        return false
                    }

                    check.getTCapAuthcode(res => {
                        if(res && res.Result){
                            $('#RegValidateCode').focus()
                        }else{
                            res.Message && tools.showAlert(res.Message)
                            if(tmo){
                                clearInterval(tmo)
                            }
                            $validateCode.removeClass('disable').text('获取动态密码')
                        }
                    }, $("#mobile").val())

                    $validateCode.addClass('disable').text("60秒后获取");
                    tmo = setInterval(function() {
                        if (--seconds === 0) {
                            clearInterval(tmo)
                            $validateCode.removeClass('disable').text('获取动态密码')
                            return;
                        }
                        $validateCode.text(seconds + '秒后获取');
                    }, 1000)
                })
            }

        },
        codeDisable: function(idName) {
            if ($('#' + idName).text().indexOf('秒后获取') < 0) {
                $("#" + idName).removeClass('disable');
            } else {
                $("#" + idName).addClass('disable');
            }
        },
        submitFunc: function(formID, url, callback) {
            var self = this;
            self.isShowData = true;
            let sunmitSign = false,
                checkSign = false;

            function submitAjax() {

                if ($("#" + formID + " input.unsubmit").length === 0) {
                    var data = new Object();
                    $("#" + formID + " input.data").each(function() {
                        if ($(this).attr('type') == 'checkbox') {
                            if ($(this).attr('name') == 'rememberMe') {
                                data[$(this).attr('name')] = $(this).is(':checked') ? true : false;
                            }
                        } else {
                            if ($(this).attr('name') === 'mobile' || $(this).attr('name') === 'password') {
                                data[$(this).attr('name')] = aes.encrypt($.trim($(this).val())); // 加密
                            } else {
                                data[$(this).attr('name')] = $.trim($(this).val());
                            }
                        }
                    });
                    if (self.isShowData) {
                        self.isShowData = false;
                        self.sendAjax({
                            url: url,
                            data: data,
                        }, successOrder, sendAngin);
                    }
                }

            }


            function successOrder(res) {
                self.isShowData = true;
                if (res.Result) {
                    callback(res);
                } else {
                    if (formID == 'tab1') {
                        $("#" + formID + " #GetImgValidateCode1 img").attr('src', '/Login/GetImageValidateCode?t=' + (new Date().getTime()));
                        $("#" + formID + " #ImgValidateCode1").addClass("nocheck");
                    }
                    if (res.Message == "验证码错误") {
                        $("#" + formID + " .codebox").addClass('red');
                    }
                    tools.showAlert(res.Message);
                }
            }

            // 重新加载
            function sendAngin(info) {
                self.sendAjax({
                    url: url,
                    dataType: 'jsonp'
                }, showSerials, sendAgain);
            }

            if ($("#" + formID).hasClass("sideTip")) {
                $("#" + formID + " input").blur();
            } else {
                $("#" + formID + " .AppCheck").each(function() {
                    if ($(this).hasClass("unsubmit") && $(this).css('display') != 'none') {
                        $(this).blur();
                        return false;
                    }
                });
            }

            // 账号登录
            if ($('#tab1 #ImgValidateCode1').hasClass('nocheck')) {
                $('#tab1 #ImgValidateCode1').addClass('unsubmit');
                $("#tab1 .jyts").show().text("请输入正确的图片验证码");
            }

            if ($(".selCheck").text() == "请选择" && $('.AppCheck.unsubmit').length == 0) {
                $(".jyts").show().text("请选择城市");
                checkedNumDom.hide();
                return false;
            }

            if ($("#" + formID + " #rule").length != 0 && !$("#" + formID + " #rule").is(':checked')) {
                $(".jyts").show().text("您还未同意协议");
                checkedNumDom.hide();
                return false;
            }

            function checkCodeWithToken(number, tel_id, line, successFunc) {
                if (number == "") {
                    return ""
                }
                var flag = null;
                tools.$ajax({
                    url: CODE_VALIDATING_URL,
                    data: AddAntiForgeryToken({ mobile: $("#" + tel_id).val(), validatecode: number, line: line }),
                    success: successFunc,
                    error: function(req, status, text) {
                        alert(status); //req.responseText;
                    }
                });
            }

            if ((formID === 'tab2' || formID === 'regForm') && $('#ImgValidateCode2Box').hasClass('hide')) {
                checkSign = $("#" + formID + " input.nocheck").length === 1 && $('#ImgValidateCode2').hasClass('nocheck') ? true : false;
            } else {
                checkSign = $("#" + formID + " input.nocheck").length === 0 ? true : false;
            }
            if (checkSign) {
                if ($("#" + formID + " #ValidateCode").length > 0) {
                    checkCodeWithToken($("#ValidateCode").val(), "mobile", BusinessLine, function(res) {
                        if (!res.Result) {
                            if ($("#" + formID).hasClass("sideTip")) {
                                $("#ValidateCode").addClass("unsubmit nocheck").parents(".input-item").next().next(".jyts").show().find("span").text("手机验证码有误");
                                checkedNumDom.hide();
                            } else {
                                $("#ValidateCode").addClass("unsubmit nocheck").parents("#form").find(".jyts").text("请输入正确的短信验证码").show();
                                $("#" + formID + " .codebox").addClass('red');
                            }
                            checkedNumDom.hide();
                            return false;
                        } else {
                            submitAjax();
                        }

                    });
                } else {
                    submitAjax();
                }
            }
        }
    }
    ////////////////////页面初始化
$(function() {
    var checkFormPage = new CheckFormPage();
    // checkFormPage.init();
    /*IE8 placeholder支持文本、密码*/
    (function($) {
        var placeholderfriend = {
            focus: function(s) {
                checkFormPage.IE8sign = true;

                s = $(s).hide().prev().show().focus();
                var idValue = s.attr("id");
                if (idValue) {
                    s.attr("id", idValue.replace("placeholderfriend", ""));
                }
                var clsValue = s.attr("class");
                if (clsValue) {
                    s.attr("class", clsValue.replace("placeholderfriend", ""));
                }
            }
        }

        //判断是否支持placeholder
        function isPlaceholer() {
            var input = document.createElement('input');
            return "placeholder" in input;
        }
        //不支持的代码
        if (!isPlaceholer()) {
            $(function() {

                var form = $(this);
                var elements = form.find("input[type='text'][placeholder]");
                elements.each(function() {
                    var s = $(this);
                    var pValue = s.attr("placeholder");
                    var sValue = s.val();
                    if (pValue) {
                        if (sValue == '') {
                            s.val(pValue);
                        }
                    }
                });

                elements.focus(function() {
                    var s = $(this);
                    var pValue = s.attr("placeholder");
                    var sValue = s.val();
                    if (sValue && pValue) {
                        if (sValue == pValue) {
                            s.val('');
                        }
                    }
                });

                elements.blur(function() {
                    var s = $(this);
                    var pValue = s.attr("placeholder");
                    var sValue = s.val();
                    if (!sValue) {
                        s.val(pValue);
                    }
                });

                var elementsPass = form.find("input[type='password'][placeholder]");
                elementsPass.each(function(i) {
                    var s = $(this);
                    var pValue = s.attr("placeholder");
                    var sValue = s.val();
                    if (pValue) {
                        if (sValue == '') {
                            var html = this.outerHTML || "";
                            html = html.replace(/\s*type=(['"])?password\1/gi, " type=text placeholderfriend").replace(/\s*(?:value|on[a-z]+|name|id)(=(['"])?\S*\1)?/gi, " ").replace(/\s*placeholderfriend/, " placeholderfriend value='" + pValue + "' " + "onfocus='placeholderfriendfocus(this);' ").replace('data', '');
                            var idValue = s.attr("id");
                            if (idValue && idValue.indexOf("placeholderfriend") == -1) {
                                s.attr("id", idValue + "placeholderfriend");
                            }
                            var clsValue = s.attr("class");
                            if (clsValue && idValue.indexOf("placeholderfriend") == -1) {
                                s.attr("class", clsValue + " placeholderfriend");
                            }
                            s.hide();
                            s.after(html);
                        }
                    }
                });

                elementsPass.blur(function() {
                    var s = $(this);
                    var sValue = s.val();
                    if (sValue == '') {
                        var idValue = s.attr("id");
                        if (idValue && idValue.indexOf("placeholderfriend") == -1) {
                            s.attr("id", idValue + "placeholderfriend");
                        }
                        var clsValue = s.attr("class");
                        if (clsValue && idValue.indexOf("placeholderfriend") == -1) {
                            s.attr("class", clsValue + " placeholderfriend");
                        }
                        s.hide().next().show();
                    }
                    s.next().removeClass('AppCheck nocheck');
                });

            });
        }
        window.placeholderfriendfocus = placeholderfriend.focus;
        setTimeout(function() { checkFormPage.init(); }, 500);
    })(jQuery);
});