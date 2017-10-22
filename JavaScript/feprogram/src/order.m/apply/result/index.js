import './index.scss'
import Vue from 'vue'
import CouponModal from 'libs/vue-components/coupon/modal'

// 优惠券
if(window.coupon_card_info_getting_url){
    $.getJSON(window.coupon_card_info_getting_url, {cityId, packageId}, res => {
        if(res.Result){
            $('body').append('<div id="coupon-modal"></div>')
            const vm = new Vue({
                el: '#coupon-modal',
                template: '<coupon-modal :options="options"></coupon-modal>',
                data: {
                    options: {
                        rule: res.Data.RuleLink,
                        url: res.Data.ActivityLink,
                        cardValue: res.Data.CardValue,
                        cardName: res.Data.CardName
                    }
                },
                components: {
                    CouponModal
                }
            })
            vm.$broadcast('showCouponModal')
        }
    })
}

$(function () {
    $(".weixin-box .font-title a").on("click", function(e) {
        tools.showAlert("长按复制！");
    });
    var $goHome = $("#goHome"),
        $goOrder =  $("#goOrder"),
        $appDownload = $("#appDownload"),
        _isWebView = tools.isWebView();
    if(Boolean(_isWebView == 'yixinapp' || _isWebView == 'yixinbjapp')){
        $appDownload.addClass("app-down-hide");
        $goOrder.removeClass("app-down-show");
        $goHome.attr("href","#");
        $goOrder.attr("href","#");
        $goHome.on("click",function(e){                    
            tools.jsNativeBridge("payResultAction","goHome");
            return false;
        })
        $goOrder.on("click",function(e){
            tools.jsNativeBridge("payResultAction","goOrder");
            return false;
        })
    }else if(tools.getCookie("from")=="1038"){
        $goHome.attr("href",xin_che_url + "/Lease/beijing/?from=1038");
        $goOrder.attr("href",user_center_url + "/user/index?paramFlag=isLease");
    }
})