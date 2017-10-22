require("./index.scss");
var check =  require("libs/check/m"),
    car = require("libs/carSelect"),  
    carSelect_thirdLevel = require("libs/carSelect/carThirdLevel");
    // 车贷服务条款
    $('.agree a').bind('tap', function() {
        tools.serviceProvision({
            "url":"/home/InfoUsingAuthorization",
            "title":"信息使用授权书"
        })
    });

    // 表单验证
    var checkElems = $('form input[type=text]');
    var nameElem = $('#realName');
    var idElem = $('#IdNo');
    $('#submit-btn').bind('click', function(e) {
        e.preventDefault();

        if ($(this).hasClass('notagree')) {
            tools.showAlert("请阅读同意服务条款");
            return false;
        }
        var pass = true,
            btn = $(this);

        if (btn.hasClass('clicked')) {
            return false;
        }

        // 非空验证
        checkElems.each(function() {
            var $this = $(this);
            if (!$.trim($this.val())) {
                showErrorMsg($this, '请填写'+ $this.attr('mylabel'));
                pass = false;
            }
        });

        // 验证姓名
        if (!check.isName($.trim(nameElem.val()))) {
            showErrorMsg(nameElem, '请输入正确真实姓名');
            pass = false;
        }

        // 验证身份证号
        if (!check.isID($.trim(idElem.val()))) {
            showErrorMsg(idElem, '请输入正确18位有效身份证号码');
            pass = false;
        }

        if (!pass) { return false; }

        // 实名验证
        btn.addClass('clicked');
        var realNameForm = $('#realNameForm');
        $.ajax({
            url: APIURL + 'api/YxRiskOnline/RealNameAuthenticate',
            dataType: 'jsonp',
            data: realNameForm.serialize(),
            success: function (result) {
                if (result.Result) {
                    location.href = NextPage + '?orderid=' + tools.getUrlParam('orderid');
                } else {
                    tools.showAlert('验证不通过');
                }
            },
            complete: function() {
                btn.removeClass('clicked');
            }
        });
    });

    checkElems.bind('focus', function(e) {
        hideErrorMsg($(this));
    });

    function showErrorMsg(elem, msg) {
        var error = elem.parent().next();
        if (!error.is('.errormsg')) {
            elem.parent().after('<div class="errormsg">' + msg + '</div>');
        }
    }

    function hideErrorMsg(elem) {
        var error = elem.parent().next();
        if (error.is('.errormsg')) {
            error.remove();
        }
    }

    $('#continuBtn').bind('click', function() {
        if ($(this).hasClass('notagree')) {
            tools.showAlert("请阅读同意服务条款");
            return false;
        }
        location.href = NextPage + '?orderid=' + tools.getUrlParam('orderid');
    });

    // 同意条款
    $('.agree').bind('tap', function() {
        if ($(this).hasClass('disabled')) {
            $(this).removeClass('disabled');
            $('#continuBtn').removeClass('notagree');
            $('#submit-btn').removeClass('notagree');
        } else {
            $(this).addClass('disabled');
            $('#continuBtn').addClass('notagree');
            $('#submit-btn').addClass('notagree');
        }
    });
