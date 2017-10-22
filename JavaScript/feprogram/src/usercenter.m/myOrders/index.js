import './order.scss'
import events from './libs/orderEvents'

events.init()   

$(function() {
    if(window.carLoanType < 2){
        $("#loading").show();
        $.ajax({
            url: window.getAlixOrdersUrl,
            type: 'POST',
            dataType: 'json',
            success: function(r) {
                if (!r.Result) {
                    $("#loading p").html("您未申请易鑫线下订单");
                    setTimeout(function() {
                        $("#loading").remove();
                        if ($("#noOrder").length > 0) {
                            $("#noOrder").show();
                        }
                    }, 1000);
                    return;
                }
                $("#loading").remove();
                var html = "";
                for (var i = 0; i < r.Data.length; i++) {
                    var alixItem = r.Data[i];
                    html += '<li class="order_item">';
                    html += '<section class="header_tit">';
                    html += '<div class="btn_box"><a href="' + window.detailUrl + '?yxOrderID=' + alixItem.AlixOrderID + '" class="btn_blue">新车贷</a></div>';
                    html += '<div class="time_box"><span class="time col_grey9 ">下单时间：' + alixItem.OrderCreateTime + '</span></div>';
                    html += '<div class="state_box"><span class="state col_red " stateid="' + alixItem.Status + '">' + alixItem.StatusDesc + '</span></div>';
                    html += '</section>';
                    html += '<section class="info">';
                    html += '<a href="' + window.detailUrl + '?yxOrderID=' + alixItem.AlixOrderID + '" class="info_box">';
                    html += '<div class="img_box"><img src="' + alixItem.CarSerialImgUrl + '" onerror="this.src=\'' + window.defaultCarImg + '\'"/></div>';
                    html += '<div class="txt_box">';
                    html += '<div class="h6_tit font-28 ut-s">' + alixItem.CarName + '</div>';
                    html += '<div class="three_box"><div class="subscription col_grey6">参考报价：' + alixItem.CarPriceText + '</div><div class="tip_box"><mark class="tip_r"></mark></div></div>';
                    html += '<div class="pro_box col_grey6">金融产品：' + alixItem.PackageName + '</div></div></a>';
                    html += '</section>';
                    if (alixItem.Status == "06" || alixItem.Status == "07" || alixItem.Status == "08") {
                        html += '<section class="two_box"><div class="with_deal font-28 col_black"></div><div class="btn_box"><a href="' + window.planUrl + '?yxOrderID=' + alixItem.AlixOrderID + '" class="btn_line_yellow font-28">还款计划账单</a></div></section>';
                    }
                    html += '</li>';
                }
                $("ul.order_ul").prepend(html);
            },
            error: function() {
                $("#loading p").html("网络延迟，刷新试试!");
                setTimeout(function() {
                    $("#loading").remove();
                    if ($("#noOrder").length > 0) {
                        $("#noOrder").show();
                    }
                }, 1000);
            }
        });
    }else if(!$('.order_item').length){
        $("#noOrder").show()
    }
});
