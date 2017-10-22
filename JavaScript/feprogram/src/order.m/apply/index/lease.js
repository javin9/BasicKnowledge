/*requirejs(['zepto', 'tools', 'check'], function ($, tools, check) {*/
import './lease.scss'
import check from 'libs/check/m'
import 'zepto/src/touch'

var Confirm = {
    elem: null,
    confirmFunc: function () { },
    closeFunc: function () { },
    init: function (options) {
        if (!options.selector) {
            return false;
        }
        var self = this;
        this.elem = $(options.selector);
        this.elem.find('.next-btn').bind('tap', function () {
            self.confirmFunc();
            self.hide();
        });
        this.elem.find('.cancel-btn').bind('tap', function () {
            self.closeFunc();
            self.hide();
        });
        this.elem.find('.cover').bind('tap', function () {
            self.closeFunc();
            self.hide();
        });
        if (options.onReady) {
            options.onReady();
        }
    },
    show: function (callback, callbackClose) {
        this.confirmFunc = callback || function () { };
        this.closeFunc = callbackClose || function () { };
        this.elem.fadeIn(250);
    },
    hide: function () {
        this.elem.fadeOut(250);
    }
};

window.onpageshow = function (event) {
    $('#personForm1 .submit-btn').removeClass('clicked').text('下一步');
    //$('#personForm2 .submit-btn').removeClass('clicked').text('提交订单');
};


var UserId = 0;
// Check
check.IsCompanyName = function (number) {
    var companynameRexp = new RegExp(/^[\u4e00-\u9fa5|a-z|A-Z|\.|\&|\s|0-9]{2,40}$/);//2-40位
    if (number == "") {
        return "";
    } else {
        return companynameRexp.test(number);
    }
};

// todo delete 去掉了切换
function initTab() {
    var tabs = $('.tabbtn a');
    var tabcons = $('.tabcons .tabcon');
    /* alert('test')*/
    tabs.bind('click', function () {
        var index = tabs.indexOf(this);
        tabs.removeClass('active');
        $(this).addClass('active');
        tabcons.hide().eq(index).show();
    });
}

// todo delete 去掉了公司
function initCompany() {
    var checkElems = $('#companyForm input[type=text], #companyForm input[type=tel], #companyForm input[type=number]');
    var companyElem = $('#ComName');
    var nameElem = $('#ComCName');
    var telElem = $('#ComMobile');
    var vcElem = $('#ComValidateCode');

    // 公司名字验证
    companyElem.bind('blur', function () {
        var nameval = $.trim($(this).val());
        if (!nameval) {
            showErrorMsg($(this), '请填写公司名称');
        } else if (!check.IsCompanyName(nameval)) {
            showErrorMsg($(this), '请填写正确的公司名称');
        } else {
            hideErrorMsg($(this));
        }
    });

    // 名字验证
    nameElem.bind('blur', function () {
        var nameval = $.trim($(this).val());
        if (!nameval) {
            showErrorMsg($(this), '请填写姓名');
        } else if (!check.isName($.trim(nameElem.val()))) {
            showErrorMsg(nameElem, '请输入正确的姓名');
        } else {
            hideErrorMsg($(this));
        }
    });

    // 手机号验证
    telElem.bind('blur', function () {
        var telval = $.trim(telElem.val());
       /* if (!telval) {
            showErrorMsg(telElem, '请填写手机号');
        } else */
        if (!check.isPhoneNumber($.trim(telElem.val()))&&telElem.val()!=='') {
            showErrorMsg(telElem, '请输入正确的手机号');
        } else {
            hideErrorMsg(telElem);

            //添加埋点
            try {
                bc.evt.send('mobile', 'mobblur', telElem.val());
            }
            catch (err) { }
        }
    });

    // 获取验证码
    $('#ComGetValidateCodeBtn').bind('tap', function (e) {
        e.preventDefault();
        var self = this;
        if ($(self).hasClass('disabled')) {
            return false;
        }
        if (check.isPhoneNumber($.trim(telElem.val()))) {
            $(self).addClass('disabled');
            check.getCode({
                length: 4,
                seconds: 60,
                tel_id: 'ComMobile',
                gvc_id: 'ComGetValidateCodeBtn'
            }, function (result) {
                if (!result.Result) {
                    tools.showAlert('您的手机号' + $('#Mobile').val() + '今日已达到下单次数限制，请前往个人中心查看订单详情。');
                }
                setTimeout(function () {
                    $(self).removeClass('disabled');
                }, 60 * 1000);
            });
        } else {
            showErrorMsg(telElem, '请输入正确的手机号');
        }
    });



    // 提交表单
    $('#companyForm .submit-btn').bind('tap', function (e) {
        e.preventDefault();
        var pass = true,
            btn = $(this);

        if (btn.hasClass('clicked')) {
            return false;
        }

        btn.addClass('clicked');
        checkElems.blur();
        // 非空验证
        checkElems.each(function () {
            var $this = $(this);
            if (!$.trim($this.val())) {
                showErrorMsg($this, '请填写' + $this.attr('placeholder').slice(3));
                pass = false;
            } else {
                hideErrorMsg($this, '请填写' + $this.attr('placeholder').slice(3));
            }
        });

        if (!pass) {
            btn.removeClass('clicked');
            return false;
        }

        // 验证公司名称
        if (!check.IsCompanyName($.trim(companyElem.val()))) {
            showErrorMsg($(this), '请填写正确的公司名称');
            btn.removeClass('clicked');
            return false;
        }

        // 验证姓名
        if (!check.isName($.trim(nameElem.val()))) {
            showErrorMsg(nameElem, '请输入正确的姓名');
            btn.removeClass('clicked');
            return false;
        }

        // 验证手机号
        if (!check.isPhoneNumber($.trim(telElem.val()))) {
            showErrorMsg(telElem, '请输入正确的手机号');
            btn.removeClass('clicked');
            return false;
        }

        btn.focus();
        // 先确认再提交
        Confirm.show(function () {
            // submit
            var orderForm = $('#formQ');
            $('#DrivingLicenceNumber').val('');
            $('#IdentityNumber').val('');
            $('#CompanyName').val($('#ComName').val());
            $('#Name').val($('#ComCName').val());
            $('#Telephone').val($('#ComMobile').val());
            $('#code').val($('#ComValidateCode').val());

            $.post(
                orderForm.attr('action'),
                orderForm.serialize(),
                function (result) {
                    if (result.Result) {
                        try {
                            //添加埋点
                            bc.evt.send('mobile', 'subclk', $("#Telephone").val(), '1', '开走吧M订单提交成功')
                        } catch (err) { }
                        location.href = applySuccessUrl + '?orderId=' + result.Data.OrderId + '&childOrderId=' + result.Data.ChildOrderId;
                    } else {
                        try {
                            //添加埋点
                            bc.evt.send('mobile', 'subclk', $("#Telephone").val(), '0', '开走吧M订单提交失败 原因' + result.Message)
                        } catch (err) { }
                        tools.showAlert(result.Message);
                    }
                    btn.removeClass('clicked');
                }
            );
        }, function () {
            btn.removeClass('clicked');
        });
    });
}

function initPerson() {
    var orderInfo = null;

    //step1();
    //step2(); // todo delete 去掉了第二步，现在实名认证去公共页

    // 第一步
    function step1() {
        var checkElems = $('#personForm1 input[type=text], #personForm1 input[type=tel], #personForm1 input[type=number]');
        var telElem = $('#Mobile');
        var vcElem = $('#ValidateCode');

        // 获取验证码
        $('#GetValidateCodeBtn').bind('tap', function (e) {
            e.preventDefault();
            var self = this;
            if ($(self).hasClass('disabled')) {
                return false;
            }
            if (check.isPhoneNumber($.trim(telElem.val()))) {
                $(self).addClass('disabled');
                $('#ValidateCode').attr('autofocus')
                if(tools.browser.versions.android){
                    setTimeout(()=>{
                        $('#ValidateCode').focus();
                    },200);
                }else{
                    $('#ValidateCode').focus();
                }
                check.getCode({
                    seconds: 60,
                    tel_id: 'Mobile',
                    gvc_id: 'GetValidateCodeBtn',
                    __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
                }, function (result) {
                    if (!result.Result) {
                        tools.showAlert('您的手机号' + $('#Mobile').val() + '今日已达到下单次数限制，请前往个人中心查看订单详情。');
                    }
                    setTimeout(function () {
                        $(self).removeClass('disabled');
                    }, 60 * 1000);
                });
            } else {
                showErrorMsg(telElem, '请输入正确的手机号');
                $('#Mobile').focus();
            }
        });

        // 身份证号验证
        telElem.bind('blur', function () {
            var telnum = $.trim($(this).val());
            /*if (!telnum) {
                showErrorMsg($(this), '请填写手机号');
            } else*/
            if (!check.isPhoneNumber(telnum)&&telnum!=='') {
                showErrorMsg($(this), '请输入正确的手机号');
            } else {
                hideErrorMsg($(this));
            }
        });

        // 验证码
        /*vcElem.bind('blur', function () {
            if (!$(this).val()) {
                showErrorMsg($(this), '请填写验证码');
            } else {
                hideErrorMsg($(this));
            }
        });*/

        // 提交表单
        $('#personForm1 .submit-btn').bind('tap', function (e) {
            e.preventDefault();
            var pass = true,
                btn = $(this);

            if (btn.hasClass('clicked')) {
                return false;
            }

            checkElems.blur();
            // 非空验证
            checkElems.each(function () {
                var $this = $(this);
                if (!$.trim($this.val())) {
                    showErrorMsg($this, '请填写' + $this.attr('placeholder').slice(3));
                    pass = false;
                } else {
                    hideErrorMsg($this, '请填写' + $this.attr('placeholder').slice(3));
                }
            });
            if (!pass) {
                return false;
            }

            // 验证手机号
            if (!check.isPhoneNumber($.trim(telElem.val()))) {
                showErrorMsg(telElem, '请输入正确的手机号');
                btn.removeClass('clicked');
                return false;
            }

            // submit
            btn.addClass('clicked').text('提交中');
            var orderForm = $('#formQ');
            $('#Telephone').val($('#Mobile').val());
            $('#code').val($('#ValidateCode').val());

            $.post(
                orderForm.attr('action'),
                orderForm.serialize(),
                function (result) {

                    if (result.Result) {
                        try {
                            _agtjs('loadEvent', { atsev: 101, 'atsusr': result.Data.OrderId });
                        } catch (err) {

                        }
                        // add by shangbinjie，2016/11/30
                        //登录状态
                        tools.getLoginStatus();
                        window.location.href = result.Data.RedirectUrl;

                    } else {
                        btn.removeClass('clicked').text('下一步');
                        tools.showAlert(result.Message);
                    }

                }
            )
        });
    }

    // 第二步
    function step2() {
        var checkElems = $('#personForm2 input[type=text], #personForm2 input[type=tel], #personForm2 input[type=number]');
        var nameElem = $('#personName');
        var personIdElem = $('#personID');
        var driveIdElem = $('#driveID');

        // 名字验证
        nameElem.bind('blur', function () {
            var nameval = $.trim($(this).val());
            if (!nameval) {
                showErrorMsg($(this), '请填写姓名');
            } else if (!check.isName($.trim(nameElem.val()))) {
                showErrorMsg(nameElem, '请输入正确的姓名');
            } else {
                hideErrorMsg($(this));
            }
        });

        // 身份证号验证
        personIdElem.bind('blur', function () {
            var personId = $.trim($(this).val());
            if (!personId) {
                showErrorMsg($(this), '请填写身份证号');
            } else if (!check.isID(personId)) {
                showErrorMsg($(this), '请输入正确的身份证号');
            } else {
                hideErrorMsg($(this));
            }
        });

        // 驾驶证档案编号验证
        /* driveIdElem.bind('blur', function() {
            var driveId = $.trim($(this).val());
            if (!driveId) {
                showErrorMsg($(this), '请填写驾驶证档案编号');
            } else if (driveId.length < 12) {
                showErrorMsg($(this), '驾驶证档案编号格式错误');
            } else {
                hideErrorMsg($(this));
            }
        }); */

        // 提交表单
        $('#personForm2 .submit-btn').bind('tap', function (e) {
            e.preventDefault();
            var pass = true,
                btn = $(this);

            if (btn.hasClass('clicked')) {
                return false;
            }

            checkElems.blur();
            // 非空验证
            checkElems.each(function () {
                var $this = $(this);
                if (!$.trim($this.val())) {
                    showErrorMsg($this, '请填写' + $this.attr('placeholder').slice(2));
                    pass = false;
                } else {
                    hideErrorMsg($this, '请填写' + $this.attr('placeholder').slice(2));
                }
            });
            if (!pass) {
                return false;
            }

            // 验证姓名
            if (!check.isName($.trim(nameElem.val()))) {
                showErrorMsg(nameElem, '请输入正确的姓名');
                btn.removeClass('clicked');
                return false;
            }

            // 验证身份证号
            if (!check.isID($.trim(personIdElem.val()))) {
                showErrorMsg(personIdElem, '请输入正确的身份证号');
                btn.removeClass('clicked');
                return false;
            }

            // 验证驾驶证档案编号
            /* if ($.trim(driveIdElem.val()).length < 12) {
                showErrorMsg(driveIdElem, '驾驶证档案编号格式错误');
                btn.removeClass('clicked');
                return false;
            } */

            btn.addClass('clicked').text('提交中');

            // tools.showAlert('提交中', 999999);
            // 验证身份证号、姓名是否匹配
            $.ajax({
                url: authUrl,
                type: "get",
                dataType: "jsonp",
                data: {
                    "realName": nameElem.val(),
                    "IdNo": personIdElem.val(),
                    "userId": UserId,
                    "phone": $('#Mobile').val()
                },
                success: function (res) {
                    if (res.Result) {
                        btn.focus();

                        $.ajax({
                            method: 'POST',
                            url: order_updating_url,
                            data: {
                                orderId: orderInfo.OrderId,
                                childOrderId: orderInfo.ChildOrderId,
                                name: nameElem.val(),
                                identityNumber: personIdElem.val()
                            },
                            success: function (respond) {
                                if (respond.Result) {
                                    window.location.href = respond.Data.BigDataUrl;
                                } else {
                                    tools.showAlert(respond.Message);
                                }
                                btn.removeClass('clicked').text('提交订单');
                            },
                            error: function () {
                                $("#showAlertBox").fadeOut(300);
                                btn.removeClass('clicked').text('提交订单');
                            }
                        });
                        /*
                        // 先确认再提交
                        Confirm.show(function() {
                            // submit
                            var orderForm = $('#formQ');
                            // $('#DrivingLicenceNumber').val($('#driveID').val());
                            $('#IdentityNumber').val($('#personID').val());
                            $('#CompanyName').val('');
                            $('#Name').val($('#personName').val());
                            $('#Telephone').val($('#Mobile').val());
                            $('#code').val($('#ValidateCode').val());

                            $.post(
                                orderForm.attr('action'),
                                orderForm.serialize(),
                                function (result) {
                                    if (result.Result) {
                                        if (result.Data.OrderPayAmount > 0) {
                                            location.href = payUrl + '?orderId=' + result.Data.OrderId;
                                        } else {
                                            location.href = applySuccessUrl + '?orderId=' + result.Data.OrderId + '&childOrderId=' + result.Data.ChildOrderId;
                                        }
                                    } else {
                                        tools.showAlert(result.Message);
                                    }
                                    btn.removeClass('clicked');
                                }
                            );
                        }, function() {
                            btn.removeClass('clicked');
                        }) ;
                        */
                    } else {
                        tools.showAlert("姓名与身份证不匹配");
                        btn.removeClass('clicked').text('提交订单');
                    }
                }
            });
        });
    }
}

function showErrorMsg(elem, msg) {
    var error = elem.parents('.row').find('.errormsg');
    if (!error.length) {
        error = $('<div class="errormsg">' + msg + '</div>');
        elem.parents('.row').append(error);
    } else {
        error.text(msg);
    }

    // 点击错误提示隐藏
    error.bind('touchend', function (e) {
        var $this = $(this);
        var $input = $this.siblings('input');
        $this.remove();
        $input.focus(); // todo 怎么focus
    });
}

function hideErrorMsg(elem, msg) {
    var error = elem.parents('.row').find('.errormsg');
    if (error.length) {
        if (msg) {
            if ($.trim(error.text()) === $.trim(msg)) {
                error.remove();
            }
        } else {
            error.remove();
        }
    }
}

function initForm() {
    // 数字输入框：仅能输入数字，小数位数，以及总长度限制
    $('input[type=number]').bind('input', function (e) {
        var floatlength = parseInt($(this).attr('floatlength')) || 0, // 小数位数
            maxlength = parseInt($(this).attr('maxlength')), // 输入长度
            val = parseFloat($(this).val()),
            valfix = floatlength && val * Math.pow(10, floatlength - 1);

        if (floatlength && valfix === parseInt(valfix)) {
            // do nothing
        } else {
            $(this).val(Math.floor(val * Math.pow(10, floatlength)) / Math.pow(10, floatlength));
        }

        if (maxlength && $(this).val().length > maxlength) {
            $(this).val($(this).val().substr(0, maxlength));
        }
    });

    // 电话输入框：仅能输入数字
    /* $('input[type=tel]').bind('input', function (e) {
        var val = $(this).val().trim();
        if (val) {
            $(this).val(parseInt(val));
        }
    }); */

    // 点击错误提示隐藏
    /* $('body').children().on('tap', '.errormsg', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $input = $this.siblings('input');
        $this.remove();
        $input.focus(); // todo 怎么focus
    }); */

    // 输入时 清除错误提示，2016/12/6
    $('input').on('input', function () {
        var error = $(this).siblings('.errormsg');
        if (error.length) {
            error.remove();
        }
    });

    $('form').each(function () {
        this.reset();
    });
}

$(function () {
    // initTab();
    // 验证 验证码 长度 ValidateCode
    /*$('#ValidateCode').bind('blur',function (e) {
        e.preventDefault();
        var self=$(this),val=self.val()
        if (val.length!==6&&val.length!==0){
            showErrorMsg(self, '请填写验证码');
        }else{
            hideErrorMsg($(this));
         }
    })*/

    initForm();
    // initCompany();
    initPerson();

    /* Confirm.init({
        selector: '.confirm',
        onReady: function() {
            $('#InfoUsing').bind('tap', function() {
                tools.serviceProvision({
                    "url": "/home/InfoUsingAuthorization",
                    "title": "信息使用授权书"
                });
            });
            $('#PersonalCredit').bind('tap', function() {
                tools.serviceProvision({
                    "url": "/home/PersonalCreditAuthorization",
                    "title": "个人征信授权书"
                });
            });
        }
    }); */
});

/*new vue*/
import Vue from 'vue'
import vueResource from 'vue-resource'
import leaselogin from './pages/leaselogin.vue'
Vue.use(vueResource)
var personFormlogin=new Vue({
    el:'#personForm1',
    props:[],
    template:`<leaselogin></leaselogin>`,
    components:{leaselogin}
})
