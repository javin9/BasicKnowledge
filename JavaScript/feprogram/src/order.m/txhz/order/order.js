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
        ViewModel.getOrderListHtml();
        $('#orderData').html('<div class="loading-gray"></div>')
    },

    //初始页页面dom元素事件
    loadDomEvent() {
        $('.ok-btn').click(() => {
            location.href = MyOrder.OrderApplyUrl;
        });

    },
    getOrderListHtml() {
        var html = "";
        Store.GetRentCarLoanOrder().then((res) => {
            if (!res.Result) {
                tools.showAlert(res.Message);
                return;
            }
            for (var i = 0; i < res.Data.length; i++) {
                var info = res.Data[i];
                html += '<div class="order-list">';
                html += '<div class="list-top">';
                html += '<span class="list-icon">租车</span>';
                html += '<span class="list-time">下单时间：' + info.CreateTime + '</span>';
                html += '<span class="list-state">' + info.UserStateName + '</span>';
                html += '</div>';
                html += '<div url="' + MyOrder.OrderDetailUrl + info.ChildOrderId + '"  class="order-car-info">';
                html += '<div class="car-img">';
                html += '<img src="' + info.CarImageUrl + '">';
                html += '</div>';
                html += '<div class="car-info">';
                html += '<div class="car-name">' + info.CarFullName + ' </div>';
                html += '<div class="car-pay">';
                html += '<span>首次支付：<a>' + info.DownPayMentRentalText + '</a></span>';
                html += ' <span>月租：<a>' + info.MonthlyRentalText + '</a></span>';
                html += '</div>';
                html += '</div>';
                html += '<a href="' + MyOrder.OrderDetailUrl + info.ChildOrderId + '" class="goto"></a>';
                html += '</div>';
                html += '</div>';
            }
            $('#orderData').html(html);
            if ($(window).width() <= 640) {
            $('.car-name').css('height', '1.2667rem')
        }
            $('.order-car-info').click(function () {
                location.href = $(this).attr('url');
            })
        });
    }
};

//view
$(function () {
    ViewModel.loadDomEvent();
    ViewModel.loadDomView();
    XTK.Action.bind();
})