'use strict';

//css
import '../../common/css/common.scss';
import '../lib/wallet.scss';
//声明变量
import app from '../../common/script/app';
import XTK from '../../common/script/XTK';
import Store from '../../common/script/Store';

import Vue from 'vue'
import VueResource from 'vue-resource'
import LoginModal from 'libs/vue-components/login-modal'

var _couponCardId = '';
Vue.use(VueResource)

var _isApp = tools.isWebView();
if(_isApp) {
    tools.jsNativeBridge('getTitle', '领券中心');
}


const vm = new Vue({
    el: 'body',
    components: {
        LoginModal
    },
    methods: {
        loginCallback() {
            var params = {
                couponCardId: _couponCardId
            }
            Store.receive(params).then((res) => {
                if (res.Result) {
                    Tools.showAlert(res.Message);
                    setTimeout(() => {
                        location.reload();
                    }, 500)
                } else {
                    Tools.showAlert(res.Message);
                }
            });
        }
    }
})



//view
$(function () {
    XTK.Action.bind();
    $('.click_link').on('click', function () {
        location.href = $(this).attr('data-link');
    })
    $('.click_receive').on('click', function () {
        Tools.getLoginStatus((res) => {
            if(res.Islogin){
                isLogin='true';
            }else{
                 isLogin='false';
            }
            _couponCardId = $(this).attr('data-couponcardid');
            if (isLogin != 'true') {
                vm.$broadcast('showLoginModal')
            } else {
                var params = {
                    couponCardId: _couponCardId
                }
                Store.receive(params).then((res) => {
                    if (res.Result) {
                        Tools.showAlert('领取成功');
                        setTimeout(() => {
                            location.reload();
                        }, 500)
                    } else {
                        Tools.showAlert(res.Message);
                    }
                });
            }
        });
    })
})