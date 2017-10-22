import '../list/list.scss';
import 'zepto/src/touch';
import check from 'libs/check/m';

    var isApp = tools.getCookie("YiXinAppInfo");
var regPage =  {
        init: function () {
            var self = this;

            self.bindEvent();
            self.checkForm();
            self.preFunc();

            var str = '';
            var now = ''

           var filter_staff_from_exist = function () {
                now = $.trim($('#name').val());
                if (now != '' && now != str) {
                    //console.log(now);
                    $('#name').trigger('keyup');
                }
                str = now;
            }
            var filter_time = function () {
                var time = setInterval(filter_staff_from_exist, 100);
                $(this).on('blur', function () {
                    clearInterval(time);
                });
            };
            $('#name').on('focus', filter_time);
        },

        preFunc:function(){
            var self = this;
            var $valiTxt = $("#valiTxt");

            $("#registerMain input").each(function () {
                if ($valiTxt.css('display') == 'none')
                    $(this).trigger('keyup');
                else
                    return;
            });
        },

        // 事件
        bindEvent: function () {
            var self = this;

            $('#backA').on('click', function () {
                if (document.referrer.indexOf("/login/index") >= 0) {
                    window.history.go(-2);
                    return false;
                } else {
                    window.history.go(-1);
                    return false;
                }
            })

            // 提交申请
            $('#submit').click(function (e) {
                e.preventDefault();
                self.submitFunc();
            });
        },
        //验证表单数据
        checkForm: function () {
            var ID2STR = {
                Name: '姓名',
                Mobile: '手机号',
                Code: '验证码'
            };
            var $valiTxt = $("#valiTxt");

            //输入验证begin
            $("input").on("keyup", function () {
                var inputName = $(this).attr("name"),
                    inputValue = $(this).val();
                switch (inputName) {
                    case 'Name':
                        checkInput(check.isName(inputValue), inputName);
                        break;
                    case 'Mobile':
                        if (checkInput(check.isPhoneNumber(inputValue), inputName)) {
                            if (inputValue == userMobile) {
                                $("#GetValidateCode").parent().hide();
                            }
                            else {
                                $("#GetValidateCode").parent().removeClass('hide');
                                $("#GetValidateCode").parent().show();
                            }
                        }
                        break;
                    case 'Code':
                        if ($("#mobile").val() != userMobile) {
                            if ($.trim($(this).val()) == "") {
                                checkInput("", inputName);
                                return false;
                            } else {
                                $valiTxt.hide();
                                return false;
                            }
                        }
                        break;
                }

                if ($valiTxt.css('display') == 'none') {
                    $('#submit').addClass("btn-yellow");
                }
                else {
                    $('#submit').removeClass("btn-yellow");
                }
            });
            function checkInput(checkFunction, name) {
                if (checkFunction === "") {
                    $valiTxt.show().text("请输入" + ID2STR[name]);
                    return false;
                } else if (checkFunction === false) {
                    $valiTxt.show().text("请输入正确的" + ID2STR[name]);
                    return false;
                } else {
                    $valiTxt.hide();
                    return true;
                }


            }
            //输入验证end
            /*添加防伪标记*/
            function addAntiForgeryToken(data) {
                data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
                return data;
            }
            function getCode(data, successFunc){
                var defaultData = {
                    seconds:60,
                    tel_id:'mobile',
                    gvc_id:'GetValidateCode',
                    line:'550',
                    url:CODE_GETTING_URL
                }
                var Tdata = $.extend(defaultData, data);

                if (Tdata.seconds <= 0) {
                    alert(倒计时时间不能小于0);
                    return false;
                };
                if ($("#"+Tdata.gvc_id).hasClass("disable")) {
                    return false;
                };

                var telNum = $("#"+Tdata.tel_id).val();
                if (check.isPhoneNumber(telNum)) {
                    tools.$ajax({
                        url: Tdata.url,
                        data:addAntiForgeryToken({mobile:telNum, line:Tdata.line}),
                        success:function(res){
                            successFunc(res);
                        }
                    });
                    $("#"+Tdata.gvc_id).addClass("disable").text(Tdata.seconds+"秒后获取");
                    window.tmo = setInterval(function(){
                        if(--Tdata.seconds == 0){
                            clearInterval(tmo);
                            $("#"+Tdata.gvc_id).removeClass("disable").text("获取验证码");
                            return;
                        }
                        $("#"+Tdata.gvc_id).text(Tdata.seconds+"秒后获取");
                    }, 1000);
                    return true;
                }else{
                    return false;
                }
            }
            //获取验证码
            $("#GetValidateCode").tap(function () {
                var $that = $(this),
                    gId = $that.attr('id');
                if (!getCode({ gvc_id: gId, line: BusinessLine }, successFunc)) {
                    checkInput(check.isPhoneNumber($("#mobile").val()), 'Mobile');
                    return false;
                } else {
                    getCode({ gvc_id: gId, line: BusinessLine }, successFunc);
                    $("#mobile").parents(".input-item").next(".jyts").addClass("hide");
                }

                function successFunc(res) {
                }

            });
        },
        // 提交申请
        submitFunc: function () {

            var self = this;
            self.preFunc();
            var $valiTxt = $("#valiTxt");

            //验证手机验证码
            if ($("#mobile").val() != userMobile) {
                check.checkCode({ number: $("#ValidateCode").val(), line: BusinessLine, }, function (res) {
                    if (!res.Result) {
                        $valiTxt.css("display","block").text("您的验证码有误");
                        return false;
                    }
                });
            }

            setTimeout(function(){
                if ($valiTxt.css('display') == 'none') {

                    var orderCookie = tools.getCookie('OrderData');
                    var data = null, q = null;
                    //此种情况为 快速申请，去贷款，低息贷，极速贷
                    if (orderCookie == null || orderCookie == "") {
                        data = Object();
                        data['Source'] = tools.getUrlParam('source');
                    } else {
                        var orderArr = orderCookie.split('|');
                        var data = JSON.parse(orderArr[0]);
                        if (orderArr[1] != "") {
                            q = JSON.parse(orderArr[1]);
                        }
                    }

                    // 从url得到数据
                    data['Name'] = $('#name').val();
                    data['Mobile'] = $('#mobile').val();
                    data['Channel'] = isApp?"87":"";

                    tools.$ajax({
                        url: url_addInfoInStep1,
                        data: { "order": data, "q": q },
                        type: 'POST',
                        async: true,
                        beforeSend: function () {
                        },
                        success: function (res) {
                            if (res.Result) {
                                //清除ookie
                                delCookie('OrderData');
                                var _nextHref = "";
                                if (res.Data.Extensions == null || res.Data.Extensions.length < 1) {
                                    _nextHref = '/mortgage/apply?order_id=' + res.Data.ID;
                                }
                                else {
                                    _nextHref = '/mortgage/apply?order_id=' + res.Data.ID + '&productsId=' + res.Data.Extensions[0].ProductId;
                                }
                                window.location.href = window.unescape(_nextHref);
                            } else {
                                tools.showAlert(res.Message);
                            }
                        }
                    });
                }
            },300)


            function delCookie(name) {

                var exp = new Date();
                exp.setTime(exp.getTime() + -2 * 24 * 60 * 60 * 1000);
                exp = exp.toGMTString();

                tools.setCookie(name, "", exp);
            }
        }
    }

regPage.init();