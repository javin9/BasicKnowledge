import './index.scss'
import Vue from 'vue'
import CouponTag from 'libs/vue-components/coupon/tag'
import user from './components/user';
user.init();

class IndexPage {
    constructor(){
        // 业务标示，isLease isInsurance isChedidai
        this.paramFlag = tools.getUrlParam('paramFlag');
        if(this.paramFlag)
            this.paramFlag = this.paramFlag.toLowerCase();

        this.init();
        this.bindEvent();
        this.userPhoto();
    }

    // 初始化渲染
    init(){
        let self = this;

        /*默认*/
        $('.header_right').removeClass('show');
        $('#maskLayer').hide();

        new Vue({
            el: document.body,
            components:{
                CouponTag
            }
        })
        
        switch (self.paramFlag){
            // 租车
            case 'islease':
                self.getLease();
                self.hideOtherExit();
                break;
            // 保险
            case 'isinsurance':
                self.getInsurance();
                self.hideOtherExit();
                break;
            // 车抵贷
            case 'ischedidai':
                self.getChedidai();
                self.hideOtherExit();
                break;
            // 缺省
            default:
                self.getPay();
                self.getOrder();
        }
    }

    bindEvent(){
        $('.u_i_myO_ul .chezhudai').on('click', function () {
            tools.showAlert('未完待续...');
        })

        $('#userExit').on('click', function (e) {
            //e.stopPropagation();
           // e.preventDefault();
            $(this).parent('.header_right').addClass('show');
            $('#maskLayer').css({ 'background': 'transparent', 'width': '100%', 'hegith': '100%', 'z-index': '90' });
            $('#maskLayer').show();

            e.stopPropagation();
        })

        $('.header_user_top a').on('click', function (e) {
            e.preventDefault();
            var thisHref=$(this).attr('href');
            if($(this).parent('li').index() == $('.header_user_top li').length-1 ){
                $.ajax({
                    url:'/User/NotifyLogout',
                    dataType:'json',
                    type:'post',
                    success:function (res) {
                        if(res.Result){
                            $.ajax({
                                url:res.NotifyUrl,
                                dataType:'jsonp',
                                success:function (res) {

                                }
                            })
                        }
                        setTimeout(function(){
                            window.location.href=thisHref;
                        },300)

                    },
                    error:function(){
                        window.location.href=thisHref;
                    }
                })
            }else{
                window.location.href = thisHref;
            }
            $('.header_right').removeClass('show');
            $('#maskLayer').hide();
        })
        $('#maskLayer').on('click', function () {
            $('.header_right').removeClass('show');
            $('#maskLayer').hide();
        })
        //关闭贷款礼包弹层
        $(".pop-up-layer .close-layer").on('click',function(e){
            $("#gift-layer,#maskLayer").hide();
            e.stopPropagation();
        });

        //贷款礼包 详情
        $(".get-gifts").on('click',function(){
            var data ={
                childOrderId:$(this).data("id")
            };
            $.ajax({
                    type: 'get',
                    url: '/MyOrder/GetPackageGiftsByChildOrderId',
                    data: data,
                    dataType: 'json',
                    success: function (res) {
                        if (res.Result) {
                            var str = "<dt>恭喜您贷款成功，您已获得：</dt>",
                                temp="<dd>$GiftName<span>价值$GiftValue元</span></dd>";
                            if(res.Data!=null && res.Data.length > 0){
                                for (var i =0;i < res.Data.length ;i++){
                                    var item = res.Data[i];
                                    str += temp.replace("$GiftName",item.GiftName)
                                            .replace("$GiftValue",item.GiftValue);
                                }
                                $("#gift-layer dl").html("").html(str)
                                $("#gift-layer,#maskLayer").show();
                                $("#gift-layer .confirm-btn").data("id",data.childOrderId);
                            }                   
                        }
                        else{
                            tools.showAlert(res.Message);
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {    
                        if (xhr.status == 401)
                        {
                            tools.showAlert("请先登录",24 * 60 * 60 * 1000);
                            window.location = usercenter;
                            return;
                        }                               
                        tools.showAlert("服务器异常,请稍后再试");
                    }
                })
        });
        //确认领取礼包
        $("#gift-layer .confirm-btn").on('click',function(){
            var data = {
                childOrderId : $(this).data("id")
            };              
            $.ajax({
                url : "/MyOrder/UpdateChildOrderPackageGiftReceived",
                type : "POST",
                dataType : 'json',
                data : data,
                success : function (res) {                      
                    if (res.Result) {
                        $("#gift-layer").hide();                            
                        window.location.href = window.location.href;
                    } else {                            
                        tools.showAlert(res.Message);   
                    }
                },
                error: function (xhr, textStatus, errorThrown) {    
                        if (xhr.status == 401)
                        {
                            tools.showAlert("请先登录",24 * 60 * 60 * 1000);
                            window.location = usercenter;
                            return;
                        }                               
                        tools.showAlert("服务器异常,请稍后再试");
                }
            });
        });

        // 去支付
        $('.btnPay').on('click', function(){
            //LiuFL 2016-08-19 Alter
            var childOrderId="";
            if(typeof curOrderInfo!="undefined")
            {
                childOrderId=curOrderInfo.childOrderId;     
            }
            else{
                childOrderId = $(this).data("childorderid")
            }
            $.ajax({
                url: '/MyOrder/CheckPayment?childOrderId=' + childOrderId,
                type: "GET",
                dataType : 'json',
                success: function (res) {
                    if (res.Result) {
                        window.location.href = res.Data;
                    } else {
                        tools.showAlert(res.Message,24 * 60 * 60 * 1000);
                        window.location.href=window.location.href;
                    }
                },
                error: function (xhr, textStatus, errorThrown) {    
                        if (xhr.status == 401)
                        {
                            tools.showAlert("请先登录",24 * 60 * 60 * 1000);
                            window.location = usercenter;
                            return;
                        }                               
                        tools.showAlert("服务器异常,请稍后再试");
                }

            })
        });
        
        // 退款按钮
        $('.btnRefund').on('click', function(){
            var childOrderId="";
            if(typeof curOrderInfo!="undefined")
            {
                childOrderId=curOrderInfo.childOrderId;     
            }
            else{
                childOrderId = $(this).data("childorderid")
            }
            $.ajax({
                url: '/MyOrder/CheckRefund?childOrderId=' + childOrderId,
                type: "GET",
                dataType : 'json',
                success: function (res) {
                    if (res.Result) {
                        window.location.href = res.Data;
                    } else {
                        tools.showAlert(res.Message,24 * 60 * 60 * 1000);
                        window.location.href=window.location.href;
                    }
                },
                error: function (xhr, textStatus, errorThrown) {    
                        if (xhr.status == 401)
                        {
                            tools.showAlert("请先登录",24 * 60 * 60 * 1000);
                            window.location = usercenter;
                            return;
                        }                               
                        tools.showAlert("服务器异常,请稍后再试");
                }

            })
        });

        // 增险
        $('#popInsuranceTrig').click(function(){
            var _insuranceCompanyName = $(this).parents('.sec_insurance').find('img').data('companyname');
            if( _insuranceCompanyName == 'syzx' ){
                tools.setCookie('InsComp', '2');
            } else {
                tools.setCookie('InsComp', '1');
            }
            tools.serviceProvision({
                "url":"/home/AccidentInsurance", 
                "title":"100万出行意外险说明"
            });
        });
    }

    getOrder(){
        $("#loading").show();
        $.ajax({
            url: window.getAlixOrdersUrl,
            type: 'POST',
            dataType: 'json',
            success: function (r) {
                if (!r.Result) {
                    $("#loading p").html("您未申请易鑫线下订单");
                    setTimeout(function () {
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

                    html += '<li class="order_item">' +
                        '<section class="header_tit">' +
                            '<div class="btn_box"><a href="' + detailUrl + '?yxOrderID=' + alixItem.AlixOrderID + '" class="btn_blue">新车贷</a></div>' +
                            '<div class="time_box"><span class="time ">下单时间：' + alixItem.OrderCreateTime + '</span></div>' +
                            '<div class="state_box"><span class="state col_red" stateid="' + alixItem.Status + '">' + alixItem.StatusDesc + '</span></div>' +
                        '</section>' +
                        '<a href="' + detailUrl + '?yxOrderID=' + alixItem.AlixOrderID + '">' +
                            '<section class="info info_box arr_r">' +
                                '<div class="img_box"><img src="' + (alixItem.CarSerialImgUrl||defaultCarImg)  +'"/></div>' +
                                '<div class="txt_box">' +
                                    '<div class="h6_tit font-28 ut-s">' + alixItem.CarName + '</div>' +
                                    '<div class="three_box"><div class="subscription col_grey6"><p>金融产品：<span>' + alixItem.PackageName + '</span></p><p>参考报价：<span>' + alixItem.CarPriceText + '</span></p></div>' +
                                '</div>' +
                            '</section>' +
                        '</a>';
                    if (alixItem.Status == "06" || alixItem.Status == "07" || alixItem.Status == "08") {
                        html += '<section class="two_box">' +
                            '<div class="with_deal font-28 col_black"></div>' +
                            '<div class="btn_box">' +
                                '<a href="' + planUrl + '?yxOrderID=' + alixItem.AlixOrderID + '" class="btn_line_yellow font-28">还款计划账单</a>' +
                            '</div>' +
                        '</section>';
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
    }

    // 还款计划列表
    getPay(){
        // 无还款计划
        if ( ( typeof bsbRepaymentChilderOrderIds == 'undefined' ) || ( bsbRepaymentChilderOrderIds == '') ){
            $('#sectionPay').hide();
            return;
        }
        // 有还款计划
        $('#loadingPay').show();
        $.ajax({
            url: 'Bsb/GetRepaymentPlan',
            type: 'GET',
            data: { childOrderIds: bsbRepaymentChilderOrderIds },
            dataType: 'json',
            success: function(res){
                if( !res.Result || (res.Data.length == 0) ){
                    setTimeout(function(){
                        $('#loadingPay').remove();
                        $('#sectionPay').hide();
                    }, 1000);
                    return;
                }

                let html = '';
                for (let i = 0; i < res.Data.length; i++) {
                    let _data = res.Data[i];

                    html += '<div class="pay_item">' +
                        '<a href="myorder/OrderDetail?childOrderId=' + _data.ChildOrderId + '">' +
                            '<div class="pay_item_hd uf uf_ac">' +
                                '<img src="' + _data.CarImageUrl + '" alt="' + _data.CarFullName + '" class="car_pic">' +
                                '<div class="car_info uf_f1">' +
                                    '<h4>' + _data.ProjectName + '</h4>' +
                                    '<p>' + _data.CarFullName + ' (' + _data.CarPriceText + '）</p>' +
                                '</div>' +
                            '</div>' +
                        '</a>' +
                        '<div class="pay_item_bd">' +
                            '<ul class="money_list uf uf_ac">' +
                                '<li class="uf_f1">贷款总额<span>¥<b>' + _data.LoanAmountText + '</b></span></li>' +
                                '<li class="uf_f1">已还款<span>¥<b>' + _data.RepaymentedAmountText + '</b></span></li>' +
                                '<li class="uf_f1">剩余应还<span>¥<b>' + _data.NoRepaymentPeriodsAmountText + '</b></span></li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="pay_item_ft uf uf_ac">' +
                            '<div class="status uf_f1">' +
                                '<b>本期应还[<span class="col_red">' + _data.CurPeriod + '</span>/' + _data.LoanPeriod + '期]</b>' +
                                '<p>还款日：' + _data.RepaymentDate + '</p>' +
                            '</div>' +
                            '<a class="num_box arr_r" href="bsb/RepaymentPlan?childOrderId=' + _data.ChildOrderId + '">' +
                                '<span>' + _data.CurShdRepaymentAmountText + '</span>';

                            // 还款状态
                            if (_data.RepaymentStatus == '已逾期'){
                                html += '<i class="tag tag_red">' + _data.RepaymentStatus + '</i>';
                            } else if (_data.RepaymentStatus == '已还清'){
                                html += '<i class="tag tag_green">' + _data.RepaymentStatus + '</i>';
                            } else {
                                
                            }
                        html += '</a>' +
                        '</div>' +
                    '</div>';
                }
                $(".u_i_pay").append(html);

                $('#loadingPay').remove();
            },
            error: function(){
                // $("#loadingPay p").html("网络延迟，刷新试试!");
                setTimeout(function() {
                    $("#loadingPay").remove();
                    $('#sectionPay').hide();
                }, 1000);
            }
        });
    }

    // 更换头像
    userPhoto() {
        var flg, oldNumber = '', potoID = '';
        //poto
        $('.poto').on('click', function () {
            potoID = $('.poto_img').attr('data-id')
            $('.potoIMg').show();
            var height = -($('.potoIMg_box').height()/2)
            $('.potoIMg_box').css({ 'margin-top': height + 'px' })
            $('.poto_img_ul .itme .poto_div').each(function () {
                if ($(this).attr('data-id') == potoID) {
                    $('.poto_div').removeClass('cur')
                    $(this).addClass('cur');
                    $('.poto_img_ul').attr('data-id', 'true');
                }
            })
            $('body').bind('touchmove', function (e) {
                e.preventDefault();
            });
        })
        //
        $('.poto_div').on('click', function (e) {
            $('.poto_div').removeClass('cur')
            $(this).addClass('cur')
            //$(this).attr('data-id')
            $('.poto_img_ul').attr('data-id', 'true');
            $('.potoIMg').hide();
            if ($('.poto_img_ul').attr('data-id') == 'true') {
                var data = new Object();
                var potoImgSrc = $('.poto_img_ul .cur img').attr('src');
                $.ajax({
                    url: '/User/ChangeUserRandomHeadportrait',
                    type: "POST",
                    data: { headprotraitId: Number($('.poto_img_ul .cur').attr('data-id')) },
                    success: function (res) {
                        $('.poto_img').attr('src', potoImgSrc)
                        $('.poto_img').attr('data-id', $('.poto_img_ul .cur').attr('data-id'))
                        $('body').unbind('touchmove');
                    },
                    error: function (xhr, textStatus, errorThrown) {    
                        if (xhr.status == 401)
                        {
                            tools.showAlert("请先登录",24 * 60 * 60 * 1000);
                            window.location = usercenter;
                            return;
                        }                               
                        tools.showAlert("服务器异常,请稍后再试");
                    }

                })
            }
        })
        //关闭
        $('.closeMin').on('click', function () {
            $('body').unbind('touchmove');
            $('.potoIMg').hide();
            if ($('.poto_img_ul').attr('data-id') == 'true') {
                var data = new Object();
                var potoImgSrc = $('.poto_img_ul .cur img').attr('src');
                $.ajax({
                    url: '/User/ChangeUserRandomHeadportrait',
                    type: "POST",
                    data: { headprotraitId: Number($('.poto_img_ul .cur').attr('data-id')) },
                    success: function (res) {
                        $('.poto_img').attr('src', potoImgSrc)
                        $('.poto_img').attr('data-id', $('.poto_img_ul .cur').attr('data-id'))
                        $('body').unbind('touchmove');
                    },
                    error: function (xhr, textStatus, errorThrown) {    
                        if (xhr.status == 401)
                        {
                            tools.showAlert("请先登录",24 * 60 * 60 * 1000);
                            window.location = usercenter;
                            return;
                        }                               
                        tools.showAlert("服务器异常,请稍后再试");
                    }

                })
            }
        })
    }
    // 租车订单
    getLease() {
        let self = this;

        $('.u_i_myorder, #sectionPay, ul.order_ul, .u_i_two').hide();
        $('.order_ul .so_tit').text('我的订单');

        tools.$ajax({
            url: usercenter + '/myorder/GetOrderByType?carLoanType=3',
            type: 'Get',
            dataType: 'json',
            success: (res) => {
                if (!res.Result){
                    tools.showAlert(res.Message);
                } else {
                    if( res.RowCount > 0 ){
                        $('#loading').show();

                        let insHtml = '';
                        for( let i = 0; i < res.Data.length; i++ ){
                            let data = res.Data[i].ViewUserCenterOrder;
                            let insItemHtml = '';

                            // 订单时间
                            let _creatTime = self.dataFormat( data.CreateTime.replace(/[^0-9]/ig,"").toString().substr(0,10) );

                            insItemHtml = '<li class="order_item">' +
                                            '<section class="header_tit">' +
                                                '<div class="btn_box"><a href="" class="btn_green">租车</a></div>' +
                                                '<div class="time_box"><span class="time col_grey9 ">下单时间：' + _creatTime + '</span></div>' +
                                                '<div class="state_box"><span class="state col_red " stateid="0">' + data.UserStateName + '</span></div>' +
                                            '</section>' +
                                            '<section class="info">' +
                                                '<a href="/MyOrder/OrderDetail?childOrderId=' + data.ChildOrderId + '&carLoanType=3" class="info_box">' +
                                                    '<div class="img_box"><img src="' + data.CarImageUrl + '" /></div>' +
                                                    '<div class="txt_box">' +
                                                        '<div class="h6_tit font-28 ut-s">' + data.BrandName + ' ' + data.CarSerialName + ' ' + data.CarName + '</div>' +
                                                        '<div class="three_box">' +
                                                            '<div class="subscription col_grey6">租金：' + data.MonthlyRental + '*' + data.RentRepaymentPeriod + '期</div>' +
                                                            '<div class="tip_box"><mark class="tip_r"></mark></div>' +
                                                        '</div>' +
                                                        '<div class="pro_box col_grey6">贷款方案：' + data.PackageName + '（' + data.CompanyName + '）' + '</div>' +
                                                    '</div>' +
                                                '</a>' +
                                            '</section>' +
                                        '</li>';

                            insHtml += insItemHtml;
                        }

                        $('#loading').hide();

                        $('.user_index').append('<ul class="order_ul">' + insHtml + '</ul>');
                    } else {
                        $('#loading').hide();
                        $('#noOrder').hide();
                    }
                } 
            },
            error:(res) => {
                tools.showAlert(res.Message);
            }
        });
    }
    // 时间戳格式化
    dataFormat(/** timestamp=0 **/){
        var ts = arguments[0] || 0;
        var t, y, m, d, h, i, s;
        t = ts ? new Date(ts * 1000) : new Date();
        y = t.getFullYear();
        m = t.getMonth() + 1;
        d = t.getDate();
        h = t.getHours();
        i = t.getMinutes();
        s = t.getSeconds();
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
                + ' ' + (h < 10 ? '0' + h : h) + ':' + (i < 10 ? '0' + i : i)
                + ':' + (s < 10 ? '0' + s : s);
    }
    // 保险业务
    getInsurance(){
        $('.u_i_myorder, #sectionPay, .order_ul').hide();
        $('.tit_insurance').siblings('.tit_box').hide();
        
        // console.log('保险业务');
    }
    // 车抵贷业务
    getChedidai(){
        $('.u_i_myorder, #sectionPay, ul.order_ul, .u_i_two').hide();
        $('.order_ul .so_tit').text('我的订单');

        // console.log('车抵贷业务');
    }
    // 右上角下拉菜单只显示“退出登录”
    hideOtherExit(){
        $('.header_user_top li').last().show().siblings().hide();
    }
}

$(function () {
    let indexPage = new IndexPage();
})