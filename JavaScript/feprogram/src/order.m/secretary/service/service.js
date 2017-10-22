import store from '../store/store'
import check from 'libs/check/m'
import { getValue } from '../util/util'

const CERT_TYPE = 105;
const COUNTDOWN_TIME = 60;
const BUSINESS_LINE = window.businessLineId || 550;

export default {
    get_feaures_getting(callback) {
        tools.$ajax({
            url: feaures_getting_url,
            data: {
                ...store.data,
                From: window.from
            },
            type: 'POST',
            success: callback
        })
    },

    // 获取c2c电话
    get_adviser_tel(callback_success, callback_error) {
        tools.$ajax({
            type: 'get',
            url: adviser_api_url + '/group/getcallphone',
            data: {
                CityId: store.data.CityId || ''
            },
            dataType: 'jsonp',
            success: callback_success,
            error: callback_error
        });
    },

    // 下单
    post_creating(callback, callback_error) {
        tools.$ajax({
            url: order_creating_url,
            data: {
                ...store.data,
                From: window.from,
                line: BUSINESS_LINE,
                Channel: window.channel,
                Source: window.source,
                Orders: store.ordersFirst,
                AdviserId: store.AdviserId,
                TypeOfTakingCouponCard: store.TypeOfTakingCouponCard,
                CouponCardId: store.isClickCoupon?store.CouponCardId:''
            },
            type: 'POST',
            success: callback,
            error: callback_error
        })
    },

    // 下单 - 开走吧
    post_creating_lease(callback, callback_error) {
        tools.$ajax({
            url: ki_order_creating_url,
            data: {
                Name: store.data.Name,
                Telephone: store.data.Telephone,
                code: store.data.code,
                CarId: store.Ki_CarId,
                Orders: store.Ki_OrderId,
                CityId: store.data.CityId,
                Source: window.source,
                Channel: window.channel,
                From: window.from,
                line: BUSINESS_LINE
            },
            type: 'POST',
            success: callback,
            error: callback_error
        })
    },

    // 实名认证后，更新订单
    /* order_updating() {
        tools.$ajax({
            url: order_updating_url,
            data: {
                orderId: store.OrderId
            },
            type: 'POST'
        })
    }, */

    // 获得相似产品
    /* get_similar_products_getting(callback) {
        tools.$ajax({
            url: similar_products_getting_url,
            data: { productIds: store.productIds.join(','), carId: store.data.CarId },
            type: 'POST',
            success:callback
        })
    }, */

    // 帮助中心
    get_qa_list_getting(callback) {
        tools.$ajax({
            url: qa_list_getting_url,
            data: { packageId: store.packageId },
            type: 'POST',
            success: callback
        })
    },

    // 切换账号
    /* switch_account(callback, data){
        tools.$ajax({
            url: account_switching_url,
            data: {...data, line: store.BUSINESS_LINE},
            type: 'POST',
            success: callback
        })
    }, */

    // 登录
    login(callback, data) {
        tools.$ajax({
            url: user_sign_in_url,
            type: 'post',
            dataType: 'json',
            data: data,
            success: callback
        })
    },

    // 实名认证
    auth(callback, data) {
        tools.$ajax({
            url: id_checking_url,
            type: 'post',
            dataType: 'json',
            data: data,
            success: callback
        })
    },

    get_code(telId, gvcId) {
        check.getCode({
            length: 4,
            // 倒计时时间，单位秒
            'seconds': COUNTDOWN_TIME,
            // 手机号input输入框ID 字符串
            'tel_id': telId,
            // 验证码触发容器ID 字符串
            'gvc_id': gvcId,
            // 业务线
            'line': BUSINESS_LINE,
            '__RequestVerificationToken': $('input[name="__RequestVerificationToken"]').val()
        }, (res) => {
            if (!res.Result) {
                tools.showAlert(res.Message);
            }
        })
    },

    check_code(telId, gvcId, number, callback) {
        check.checkCode({
            // 验证码
            number: number,
            // 手机号input输入框ID 字符串
            tel_id: telId,
            // 验证码触发容器ID 字符串
            gvc_id: gvcId,
            // 业务线
            line: BUSINESS_LINE,
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        }, callback)
    },

    // 获取卡券
    special_coupon_card_info_getting() {
        tools.$ajax({
            url: special_coupon_card_info_getting_url,
            data: {
                from: window.from
            },
            type: 'POST',
            success: (res) => {
                if (res.Result) {
                    if (res.Data.IsHoldingOneCouponCard)
                        store.TypeOfTakingCouponCard = 0;
                    else
                        store.TypeOfTakingCouponCard = 1;
                    store.CouponCardId = res.Data.CouponCardId;
                    $('.card').show(1000).removeClass('hide');
                    $('.card-text').html('');
                    $('.card-icon').click(() => {
                        if ($('.card-icon').hasClass('card-icon-ok')) {
                            tools.showAlert('您已经领取过该券');
                            return;
                        }
                        $('.card-icon').addClass('card-icon-ok');
                        if (store.TypeOfTakingCouponCard == 1) {
                            store.isClickCoupon =  true;
                            tools.showAlert(res.Data.CardFullName + '领取成功，下单后发放至易鑫个人账户，自营产品可用', 3000);
                        }
                        else {
                            tools.showAlert('您已经领取过该券');
                        }
                    });
                } else {
                    //tools.showAlert(res.Message)
                }
            }
        })
    }
}