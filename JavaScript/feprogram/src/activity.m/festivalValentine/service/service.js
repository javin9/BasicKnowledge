import store from '../store/store'
import check from 'libs/check/m'
import {getValue} from '../util/util'

const CERT_TYPE = 105
const COUNTDOWN_TIME = 60
const BUSINESS_LINE = 550

export default {
    get_feaures_getting(callback) {
        tools.$ajax({
            url: feaures_getting_url,
            data: {...store.data},
            type: 'POST',
            success: callback
        })
    },

    post_creating(callback) {
        tools.$ajax({
            url: order_creating_url,
            data: {
                ...store.data, 
                From: tools.getCookie('from') || '',
                line: BUSINESS_LINE,
                IsLoggedIn: isLoggedIn,
                CertificateType: CERT_TYPE,
                Channel: channal,
                Source: source,
                orders: store.order_ID,
                AdviserId: store.AdviserId
            },
            type: 'POST',
            success:callback
        })
    },

    order_updating() {
        tools.$ajax({
            url: order_updating_url,
            data: {
                orderId: store.OrderId
            },
            type: 'POST'
        })
    },

    get_similar_products_getting(callback) {
        tools.$ajax({
            url: similar_products_getting_url,
            data: { productIds: store.productIds.join(','), carId: store.data.CarId },
            type: 'POST',
            success:callback
        })
    },

    switch_account(callback, data){
        tools.$ajax({
            url: account_switching_url,
            data: {...data, line: store.BUSINESS_LINE},
            type: 'POST',
            success: callback
        })
    },

    auth(callback, data){
        tools.$ajax({
            url:authUrl,
            type:'get',
            dataType:'jsonp',
            data: {
                ...data,
                userId:store.userId,
                phone: mobile
            },
            success: callback
        })
    },

    get_code(telId, gvcId){
        check.getCode({
            // 倒计时时间，单位秒
            'seconds':COUNTDOWN_TIME,
            // 手机号input输入框ID 字符串
            'tel_id':telId,
            // 验证码触发容器ID 字符串
            'gvc_id':gvcId,
            // 业务线
            'line':BUSINESS_LINE
        },() => {})
    }
}