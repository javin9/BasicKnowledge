import './apply.scss'
import 'zepto/src/touch';
import check from 'libs/check/m';
import citySelect from 'libs/citySelect';
import selectControl from 'libs/selectControl';
// requirejs(["zepto", 'tools', 'citySelect', 'selectControl', 'check'], function($, tools, citySelect, selectControl, check) {

    var CardData = new Object();
    var isApp = tools.getCookie("YiXinAppInfo");

    var cardApply = {
        init: function() {
            $("#Age").selectControl({
                CallBacks:function(obj){
                    // console.log($(obj.item));
                    $(obj.item).attr({'data-age':obj.id, 'data-id':true}).find(".td").text(obj.txt);
                }
            });

            function UserNameBlur() {
                if (!check.isName($('#UserNameInput').val()) || $('#UserNameInput').val() == '') {
                    $('#UserNameInput').val('请输入姓名');
                    $('#UserNameInput').addClass('col_red');
                    $('#UserNameInput').parents('li').attr('data-id', 'false')
                } else if ($('#UserNameInput').val() == '请输入姓名') {
                    $('#UserNameInput').addClass('col_red');
                    $('#UserNameInput').parents('li').attr('data-id', 'false')
                } else {
                    $('#UserNameInput').removeClass('col_red');
                    $('#UserNameInput').parents('li').attr('data-id', 'true')
                }
            }

            function UserNameTap() {
                if ($('#UserNameInput').val() == '请输入姓名') {
                    $('#UserNameInput').val('');
                    $('#UserNameInput').removeClass('col_red');
                }
            }
            $('#UserNameInput').blur(function() {
                UserNameBlur()
            });
            $('#UserName .ft_box').on('tap', function() {
                UserNameTap()
            });
            $('#UserName .ft_box input').focus(function() {
                UserNameTap()
            });

            function OfficePhoneBlur() {
                if (!check.isLandline($('#OfficePhoneInput').val())) {
                    // $('#OfficePhoneInput').attr('type', 'text');
                    $('#OfficePhoneInput').val('请输入单位电话');
                    $('#OfficePhoneInput').addClass('col_red');
                    $('#OfficePhoneInput').parents('li').attr('data-id', 'false');
                    return false;
                } else if ($('#OfficePhoneInput').val() == '') {
                    // $('#OfficePhoneInput').attr('type', 'text');
                    $('#OfficePhoneInput').val('请输入单位电话');
                    $('#OfficePhoneInput').addClass('col_red');
                    $('#OfficePhoneInput').parents('li').attr('data-id', 'false');
                    return false;
                } else {
                    // $('#OfficePhoneInput').attr('type', 'text');
                    $('#OfficePhoneInput').removeClass('col_red');
                    $('#OfficePhoneInput').parents('li').attr('data-id', 'true');
                }
            }
            function OfficePhoneTap() {
                if ($('#OfficePhoneInput').val() == '请输入单位电话') {
                    // $('#OfficePhoneInput').attr('type', 'text');
                    $('#OfficePhoneInput').val('');
                    $('#OfficePhoneInput').removeClass('col_red');
                }
            }
            $('#OfficePhoneInput').blur(function() {
                OfficePhoneBlur()
            });
            $('#OfficePhone .ft_box').on('tap', function() {
                OfficePhoneTap()
            });
            $('#OfficePhone .ft_box input').focus(function() {
                OfficePhoneTap()
            });

            function TelphoneBlur() {
                if (!check.isPhoneNumber($('#TelphoneInput').val())) {
                    $('#TelphoneInput').attr('type', 'text');
                    $('#TelphoneInput').val('请输入手机号');
                    $('#TelphoneInput').addClass('col_red');
                    $('#TelphoneInput').parents('li').attr('data-id', 'false')
                    return
                } else if ($('#TelphoneInput').val() == '') {
                    $('#TelphoneInput').attr('type', 'text');
                    $('#TelphoneInput').val('请输入手机号');
                    $('#TelphoneInput').addClass('col_red');
                    $('#TelphoneInput').parents('li').attr('data-id', 'false')
                    return
                } else {
                    //添加埋点
                    try {
                        bc.evt.send('mobile', 'mobblur', $('#TelphoneInput').val());
                    }catch (err) { }

                    $('#TelphoneInput').attr('type', 'number');
                    $('#TelphoneInput').removeClass('col_red');
                    $('#TelphoneInput').parents('li').attr('data-id', 'true')
                }
            }

            function TelphoneTap() {
                if ($('#TelphoneInput').val() == '请输入手机号') {
                    $('#TelphoneInput').attr('type', 'number');
                    $('#TelphoneInput').val('');
                    $('#TelphoneInput').removeClass('col_red');
                }
            }
            $('#TelphoneInput').blur(function() {


                TelphoneBlur()
            });
            $('#Telphone .ft_box').on('tap', function() {
                TelphoneTap()
            });
            $('#Telphone .ft_box input').focus(function() {
                TelphoneTap()
            });
            $('#GetCode').on('tap', function() {
                TelphoneBlur();
                check.getCode({
                    seconds: 60,
                    tel_id: 'TelphoneInput',
                    gvc_id: 'GetCode',
                    line: line,
                    url: CODE_GETTING_URL
                }, function(result) {
                    if (result.Result) {
                        codeBlur();
                    } else {
                        return tools.showAlert(result.Message);
                    }
                });
            })

            function codeBlur() {
                TelphoneBlur();
                var numberCode = $('#code').val();
                if (numberCode == '') {
                    $('#code').addClass('col_red');
                    $('#code').attr('type', 'text');
                    $('#code').val('请输入验证码');
                }
                check.checkCode({
                    number: numberCode,
                    tel_id: 'TelphoneInput',
                    line: line,
                    url: CODE_VALIDATING_URL
                }, function(res) {
                    if (res.Result) {
                        $('#code').attr('type', 'number');
                        $('#code').removeClass('col_red')
                        $('#code').parents('li').attr('data-id', 'true');
                    } else {
                        $('#code').attr('type', 'text');
                        $('#code').addClass('col_red')
                        $('#code').val('请输入验证码');
                        $('#code').parents('li').attr('data-id', 'false')
                    }
                })
            }

            function codeTap() {
                if ($('#code').val() == '请输入验证码') {
                    $('#code').attr('type', 'number');
                    $('#code').val('');
                    $('#code').removeClass('col_red');
                }
            }
            $('#code').blur(function() {
                codeBlur()
            })
            $('#ValidateCode .ft_box').on('tap', function() {
                codeTap()
            })
            $('#ValidateCode .ft_box input').focus(function() {
                codeTap()
            })
            $('#CityId').click(function(e) {
                e.preventDefault();
                $('#citySelectComponent').focus();
                var self = this;
                citySelect.citySelect({isSaveCookie:false}, function(result) {
                    $(self).find('.td').text(result.CityName);
                    $(self).attr('data-city-id', result.CityId);
                    $(self).attr('data-id', 'true');
                });
            });

            function SubmitOrderInfo() {
                $('#ContactInfo').unbind('click', SubmitOrderInfo)
                if ($('#UserName').attr('data-id') == 'true' && $('#Age').attr('data-id') == 'true' && $('#Telphone').attr('data-id') == 'true' && $("#OfficePhone").attr("data-id") == 'true' && $('#ValidateCode').attr('data-id') == 'true' && $('#CityId').attr('data-id') == 'true') {

                    CardData.Name = $('#UserNameInput').val();
                    CardData.Age = $('#Age').attr("data-age");
                    CardData.Telphone = $('#TelphoneInput').val();
                    CardData.OfficePhone = $("#OfficePhoneInput").val();
                    CardData.ValidateCode = $('#code').val();
                    CardData.CityId = $('#CityId').attr('data-city-id');
                    CardData.Source = source;
                    CardData.Channel = isApp?"87":channel;
                    CardData.ProductID = productId;
                    CardData.From = tools.getCookie("from")

                    $.ajax({
                        url: applyUrl,
                        type: "post",
                        dataType: "json",
                        data: CardData,
                        success: function (res) {
                            $('#ContactInfo').bind('click', SubmitOrderInfo);
                            var res = eval('(' + res + ')');
                            if (!res.Result) {

                                try {
                                    //添加埋点
                                    bc.evt.send('mobile', 'sbtclk', $('#TelphoneInput').val(), '0', '车型列表页M订单提交失败 原因' + res.Message)
                                } catch (err) { }
                                return tools.showAlert(res.Message);
                            } else {


                                try {
                                    //添加埋点
                                    bc.evt.send('mobile', 'sbtclk',$('#TelphoneInput').val(), '1', '车型列表页M订单提交成功')
                                } catch (err) { }
                                window.location.href = '/'+ city.citySpell +'/result/?id=' + productId;
                            }
                        },
                        error: function (res) {
                            $('#ContactInfo').bind('click', SubmitOrderInfo);
                            return tools.showAlert(res.Message);
                        }
                    })
                } else {
                    UserNameBlur();
                    OfficePhoneBlur();
                    codeBlur();
                    if ($('#CityId').attr('data-id') != 'true') {
                        $('#CityId .choose').addClass('col_red');
                    }
                    if (!$("#Age").attr("data-id")) {
                        $('#Age .choose').addClass('col_red');
                    }
                    $('#ContactInfo').bind('click', SubmitOrderInfo);
                }
            }
            ContactInfoFun()

            function ContactInfoFun() {
                $('#ContactInfo').bind('click', SubmitOrderInfo);
            }
        }
    }
    // return cardApply;
    $(function(){
        cardApply.init();
    })
