'use strict';

//css
import '../../common/css/common.scss';
import '../lib/share.scss';
import '../lib/share'
//声明变量
import app from '../../common/script/app';
import XTK from '../../common/script/XTK';
import Store from '../../common/script/Store';
import check from 'libs/check/m'
import wxBridge from 'wx-bridge'

Store.userAPI = api_url;
//页面dom元素初始化
var $body = $('body')
var $getCodeBtn = $("#getCodeBtn");
var $CheckCode = $("#CheckCode");
var $index_btn = $('.index-btn');
var $Telphone = $('#Telphone');

var __RequestVerificationToken = $('input[name=__RequestVerificationToken]').data("id");

var submiting = false

var code = '';
var ViewModel = {
    loadDomView: function () {

    },
    //初始页页面dom元素事件
    loadDomEvent: function () {

        $getCodeBtn.on('click', () => {
            const value = $Telphone.val()
            if (value !== ''){
                // 手机号合法需要focus到验证码输入框，且考虑兼容性不能写在ajax回调中
                if(check.isPhoneNumber(value.replace(/\s/g, ''))){
                    $('#CheckCode').focus()
                }
                ViewModel.getCode();
            }else{
                Tools.showAlert('请输入手机号');
            }
        });

        $index_btn.on('click', () => {
            ViewModel.checkCode();
        });

        $Telphone.on('keyup', function () {
            var oEvent = window.event;
            if (oEvent.keyCode != 8) {
                ViewModel.Mobile1();
            }
        });
        $Telphone.on('blur', function () {
            ViewModel.Modile2();
        });


    },
    //获取验证码
    getCode() {
        Store.getCode({
            "seconds": 60,
            "tel_id": "Telphone",
            "gvc_id": "getCodeBtn",
            "line": 550,
            '__RequestVerificationToken': __RequestVerificationToken,
            "url": CODE_GETTING_URL

        }, function (res) {
            //发送完验证码要做的事情
        });
    },
    IsPhoneNumber: function (number) {
        var phoneRexp = new RegExp(/^1[3|4|5|7|8][0-9]{9}$/);
        if (number == "") {
            return "";
        } else {
            return phoneRexp.test(number);
        }
    },
    //验证码
    checkCode() {
        if(submiting){
            return false
        }
        if ($Telphone.val() == '') {
            Tools.showAlert('请输入手机号')
            return;
        }
        if (!this.IsPhoneNumber($Telphone.val().replace(/ /g, ""))) {
            Tools.showAlert('手机号格式不正确')
            return;
        }
        if ($CheckCode.val() == '') {
            Tools.showAlert('请输入验证码')
            return;
        }
        submiting = true
        Store.checkCode({
            "number": $CheckCode.val(),
            "tel_id": "Telphone",
            "gvc_id": "getCodeBtn",
            "line": 550,
            '__RequestVerificationToken': __RequestVerificationToken,
            "url": CODE_VALIDATING_URL
        }, function (result) {
            if (result.Result) {
                var params = {
                    mobile: $Telphone.val().replace(/ /g, ""),
                    validateCode:$CheckCode.val(),
                    sign: Sign,
                    WeiXinUserSessionId:WeiXinUserSessionId
                }
                Store.ReceiveCouponCard(params).then((res) => {
                    if (res.Result) {
                        if (res.RowCount != 1) {
                            submiting = false
                            Tools.showAlert(res.Message)
                        }
                        setTimeout(() => {
                            window.location.href = res.Data;
                        }, 500);
                    } else {
                        submiting = false
                        Tools.showAlert(res.Message)
                    }
                })
            }
            else {
                submiting = false
                Tools.showAlert(result.Message);
            }
        })
    },
    Mobile1() {
        var Xtext = $Telphone[0];
        var str = Xtext.value;
        if (str.length == 3 || str.length == 8)
            Xtext.value = Xtext.value + " ";
    },
    Modile2() {
        var reg = /^(\d{3})(\d{4})(\d{4})$/;
        var matches = reg.exec($Telphone.val());
        if (matches) {
            var newNum = matches[1] + ' ' + matches[2] + ' ' + matches[3];
            $Telphone.val(newNum);
        }
    },

    showShareTip(type){
        $('body').addClass('share-view')
        if(tools.isWebView()){
            tools.jsNativeBridge("showShare",{     
                title:'【发福利】你贷款购车，我送你1000元京东E卡',     
                img:'http://img4.bitautoimg.com/jinrong/newmweb/images/pic300.jpg',     
                url: window.location.href,     
                des:'福利来袭，易鑫助您轻松购车'}
            )
        }
        $body.append(`<div class="share-tip share-${type}"></div>`)
        $(window).bind('touchmove', e => e.preventDefault())
    },

    hideShareTip(){
        $body.find('.share-tip').remove()
        this.showView()
        $(window).unbind('touchmove')
    },

    showView(){
        $body.find('#app').show()
    }
}


//view
$(function () {
    if(window.showShare){
        if(dev){
            ViewModel.showShareTip('browser')
            // ViewModel.showShareTip('weixin')
        }else{
            ViewModel.showShareTip(/MicroMessenger/.test(window.navigator.userAgent) ? 'weixin' : 'browser')
        }
    }else{
        ViewModel.showView()
        ViewModel.loadDomEvent();
        ViewModel.loadDomView();
        XTK.Action.bind();
    }
})