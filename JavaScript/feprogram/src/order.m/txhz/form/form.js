'use strict';

//css
import '../../common/css/common.scss';
import '../lib/css.scss';
//声明变量
import check from 'libs/check/m';
import app from '../../common/script/app';
import XTK from '../../common/script/XTK';
import Store from '../../common/script/Store';


var ViewModel = {
    loadDomView() {
        $('[action]').hide();
        if ($(window).width() <= 640) {
            $('.car-name').css('height', '1.2667rem')
        }
    },
    //初始页页面dom元素事件
    loadDomEvent() {
        $('.form-btn').click(() => {
            if ($('.form-btn').hasClass('no'))
                return false;
            $('.form-btn').addClass('no');
            Store.Creating(creating_url, creating_data).then((res) => {
                if (res.Result) {
                    location.href = res.Data.RedirectUrl;
                } else {
                    $('.form-btn').removeClass('no');
                    tools.showAlert(res.Message);
                }
            })
        })
        $('#tk').click(() => {
            tools.serviceProvision({
                url: '/home/InfoUsingAuthorization',
                title: '信息使用授权书'
            })
        })
    }
};

//view
$(function () {
    ViewModel.loadDomEvent();
    ViewModel.loadDomView();
    XTK.Action.bind();
})