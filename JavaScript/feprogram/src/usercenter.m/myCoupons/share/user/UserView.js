'use strict';

//css
import '../lib/share.scss';
//声明变量
import vue from 'vue';
import app from '../../common/script/app';
import XTK from '../../common/script/XTK';
import Store from '../../common/script/Store';
import Share from 'libs/share';
import '../lib/share'
//view
$(function () {
    XTK.Action.bind();
    if (IsPopup == 'True') {
        setTimeout(function () {
            Tools.showAlert(PopupMsg);
        }, 500);
    }
    $('#app').append('<share :options="shareOptions" qrcode-title="请朋友扫码，贷款后各得' + CouponWayValue + CouponWayName + '"></share>')
    const vm = new vue({
        el: '#app',
        data: {
            shareOptions: {
                title: '【发福利】你贷款购车，我送你1000元京东E卡',
                url: ShareUrl,
                desc: '福利来袭，易鑫助您轻松购车',
                image: 'http://img4.bitautoimg.com/jinrong/newmweb/images/pic300.jpg'
            }
        },
        components: {
            Share
        }
    })
    // $('.over-box-btn').click(() => {
    //     vm.$broadcast('showShare', 'share')
    // })

})