import Vue from 'vue'
import morefiles from './morefiles.vue'
import vueAlert from '../components/vueAlert/vueAlert.vue'

//是否在app里
var isApp = tools.getCookie("YiXinAppInfo");

// 从上传页回退至此时，更新数据：
// tip1. onpageshow事件;
// tip2. 用ajax去取最新数据,ajax需要添加时间戳，保证数据更新;
// tip3. dom也有缓存，需要重新更新;

// important！！！
// 这个方法在某些安卓浏览器里仍然不行，放弃使用回退了，而是改用window.location.href = document.referrer;

// tip1
/* if ('onpageshow' in window) {
    window.onpageshow = getPage;
} else {
    window.onload = getPage;
} */
getPage();

function getPage() {
    // tip3
    // $('#main').html('<morefiles v-bind:list-data="listData" v-bind:back-url="snapIndexUrl" v-ref:morefiles></morefiles>');

    var vm = new Vue({
        el: '#main',
        data: {
            idCardUrl: idCard_url,
            anotherUrl: another_url,
            snapIndexUrl: snap_index_url + '?orderId=' + tools.getUrlParam('orderId')+"&childOrderId=" + tools.getUrlParam('childOrderId'),
            docItemInfos: []
        },
        computed: {
            listData: function () {
                var data = [];
                var i, item, obj;

                // 遍历上传入口
                for (i = 0; i < this.docItemInfos.length; i++) {
                    item = this.docItemInfos[i];
                    obj = {
                        type: item.IsIdCardDocType ? 'shenfenzheng' : 'liushui',    // 身份证，其他材料都用“流水”类名
                        title: item.DocName,
                        intro: item.DocDescription,
                        state: item.StateName,
                        href: (item.IsIdCardDocType ? this.idCardUrl : this.anotherUrl) + '?orderId=' + tools.getUrlParam('orderId') +'&childOrderId=' + tools.getUrlParam('childOrderId') + '&docType=' + item.DocType,
                        imageCount: item.SnapCount
                    }
                    data.push(obj);
                }

                return data;
            }
        },
        components: {
            'morefiles': morefiles
        },
        methods: {
        },
        ready: function() {
            // 安卓机有时浏览器地址栏空白？？？
            window.scrollTo(0,1);
            setTimeout(function() {
                window.scrollTo(0,0);
            }, 0);
        }
    });

    // tip2
    $.ajax({
        url: optional_doc_item_infos_url + '?time=' + new Date(),
        type: 'post',
        data: {
            orderId: tools.getUrlParam('orderId'),
            childOrderId:tools.getUrlParam('childOrderId')
        },
        success: function(respond) {
            if (respond.Result) {
                vm.docItemInfos = respond.Data.DtoItems;
            } else {
                vm.$refs.morefiles.showAlert({
                    content: respond.Message,
                    btns: [{
                        text: '确认',
                        todo: goUserCenter,
                        className: ['active']
                    }],
                    afterClose: goUserCenter
                });
                setTimeout(goUserCenter, 2000);
            }
        }
    });

    // 无列表数据，则跳转个人中心
    function goUserCenter() {
        if (isApp) {
            tools.jsNativeBridge("payResultAction","goOrder");
        } else {
            location.href = user_center_url;
        }
    }
};
