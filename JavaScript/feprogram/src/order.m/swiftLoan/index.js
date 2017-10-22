require("./index.scss");
var citySel = require('libs/citySelect');
var carSel = require('libs/carSelect');
var check = require('libs/check/m');
var tools = require('libs/tools.m.js');

class swiftLoanIndex {
    constructor() {
        this.selCity();
        this.selCar();
        this.bindEvent();
    }
    selCity() {
        $("#SelProvinceTrigger").on('click', function (e) {
            e.preventDefault();
            var $this = $(this);
            citySel.citySelect(ipLocationInfo, function (res) {
                $this.text(res.CityName);
                // console.log(res)
                $("#BuyCarCityID").val(res.CityId)
                $("#CityId").val(res.CityId);
            });

            let $xqtis = $('#SelProvinceTrigger').parents('li').next('.xqtis');
            if ($xqtis.attr('display') != 'none') {
                $xqtis.removeClass('show').hide();
            }
        });
    }
    selCar() {
        $('#SelCar').on('click', function (e) {
            e.preventDefault();
            var $this = $(this);
            carSel.carSelect({
                onlyOnSale: true,
                showLevel: 3,
                showAllBrand: false,
                showSearch: false,
                hide: true
            }, function (res) {
                // console.log(res)
                var carDisplayName = res.masterBrand.name + " " + res.brand.name + " " + res.carType.name;;
                if (res.masterBrand.name != null) {
                    if (res.brand.name.indexOf(res.masterBrand.name) >= 0) {
                        carDisplayName = res.brand.name + " " + res.carType.name;
                    }
                }
                $this.find("em").addClass("active").text(carDisplayName);
                $('#CarId').val(res.carType.id);
                $('#CarPrice').val(res.carType.price);

                let $xqtis = $('#SelCar').parents('li').next('.xqtis');
                if ($xqtis.attr('display') != 'none') {
                    $xqtis.removeClass('show').hide();
                }
            });
        });
    }

    bindEvent() {
        let self = this;

        // 失焦验证
        $('#form input').on('blur', function () {
            self.chkIpt($(this).attr('id'));
        })

        // 获取验证码
        $('#GetValidateCodeBtn').on('click', function () {
            if ($(this).hasClass('disable')) {
                return false;
            }
            if (check.isPhoneNumber($.trim($('#Telephone').val()))) {
                check.getCode({
                    length: 4,
                    // 倒计时时间，单位秒
                    'seconds': 60,
                    // 手机号input输入框ID 字符串
                    'tel_id': 'Telephone',
                    // 验证码触发容器ID 字符串
                    'gvc_id': 'GetValidateCodeBtn',
                    // 业务线
                    'line': '',
                    '__RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
                }, function () { });
            } else {
                $('#Telephone').parents('li').next('.xqtis').text('请输入手机号').addClass('show').show();
                return false;
            }
        })

        // 点击提交按钮
        $('#submitIndex').on('click', function () {
            if (self.chkForm()) {
                if ($('.loadingCtn') != null) {
                    $('.loadingCtn').css('display', 'block');
                }

                check.checkCode({
                    number: $.trim($('#ValidateCode').val()),
                    tel_id: 'Telephone',
                    line: ''
                }, function (res) {
                    if (!res.Result) {
                        $('#ValidateCode').parents('li').next('.xqtis').text('请输入正确的验证码').addClass('show').show();
                        $('#GetValidateCodeBtn').removeClass('disable');
                    } else {
                        self.submitForm();
                    }
                });
            }
        })
    }

    // 表单验证
    chkForm() {
        let self = this;

        $('#form input').each(function () {
            self.chkIpt($(this).attr('id'));
        })

        if ($('.xqtis.show').length > 0) {
            return false;
        } else {
            return true;
        }
    }
    // 验证条目
    chkIpt(id) {
        let _curid = id,
            $curdom = $('#' + id),
            _curval = $curdom.val(),
            $xqtis = $curdom.parents('li').next('.xqtis');

        switch (_curid) {
            case 'BuyCarCityID':
                if (_curval == '') {
                    $xqtis.text('请选择城市').addClass('show').show();
                }
                break;
            case 'CarId':
                if (_curval == '') {
                    $xqtis.text('请选择车型').addClass('show').show();
                }
                break;
            case 'Name':
                // 姓名
                if (_curval == '') {
                    $xqtis.text('请输入姓名').addClass('show').show();
                } else if (!check.isName(_curval)) {
                    $xqtis.text('请输入正确的姓名').addClass('show').show();
                } else {
                    $xqtis.removeClass('show').hide();
                }
                break;
            case 'Telephone':
                // 手机号
                if (_curval == '') {
                    $xqtis.text('请输入手机号').addClass('show').show();
                } else if (!check.isPhoneNumber(_curval)) {
                    $xqtis.text('请输入正确的11位手机号码').addClass('show').show();
                } else {
                    //添加埋点
                    try {
                        bc.evt.send('mobile', 'mobblur', _curval);
                    } catch (err) { }
                    $xqtis.removeClass('show').hide();
                }
                break;
            case 'ValidateCode':
                // 验证码
                if (_curval == '') {
                    $xqtis.text('请输入验证码').addClass('show').show();
                } else {
                    $xqtis.removeClass('show').hide();
                }
                break;
        }
    }
    // 表单提交
    submitForm() {
        let data = {};

        $('#form input').each(function () {
            data[$(this).attr('id')] = $.trim($(this).val());
            // console.log(data);
        });

        tools.$ajax({
            url: addOrderUrl,
            data: data,
            success: function (res) {
                if (!res.Result) {
                    try {
                        //添加埋点
                        bc.evt.send('mobile', 'sbtclk', $('#Telephone').val(), '0', '手机QQ城市服务新车M订单提交失败 原因' + res.Message)
                    } catch (err) { }

                    tools.showAlert(res.Data);
                } else {
                    try {
                        //添加埋点
                        bc.evt.send('mobile', 'sbtclk', $('#Telephone').val(), '1', '手机QQ城市服务新车M订单提交成功')
                    } catch (err) { }


                    window.location.href = `${QuaUrl}?orderid=${res.Data.OrderId}`;
                }
            },
            error: function () {

            }
        });
    }
}


new swiftLoanIndex();