import Vue from 'vue'
import myfiles from './myfiles.vue'

//是否在app里
var isApp = Boolean(tools.isWebView() == 'yixinapp');
if(isApp){
    tools.jsNativeBridge("getTitle","提交资料");
}
var cardfrom = 1138;
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
    // $('#main').html('<myfiles v-bind:list-data="listData" v-bind:adviser-phone="adviserPhone" v-bind:adviser-name="adviserName" v-bind:usercenter-url="usercenterUrl" v-ref:myfiles></myfiles>');
    // 初始化页面
    var vm = new Vue({
        el: '#main',
        data: {
            isAuthenticated: false, // 是否实名认证过
            usercenterAuthUrl: '', // 实名认证链接
            idCardUrl: idCard_url,  // 上传身份证链接
            anotherUrl: another_url, // 上传文件链接
            optionsUrl: options_url, // 补充材料链接
            usercenterUrl: user_center_url, // 个人中心链接
            adviserPhone: '', // 顾问电话
            adviserName:'',//顾问名字
            docItemInfos: [], // 列表数据
            userCount:0,
            isUploadedIdCardDocType:false

        },
        computed: {
            listData: function() {
                var data = [];
                // 实名认证
                // var shiming = [{
                //     type: 'shiming',
                //     title: '实名认证',
                //     intro: '用于确定您的真实身份',
                //     state: this.isAuthenticated ? '通过' : '去认证',
                //     href: this.usercenterAuthUrl
                // }];
                // 上传资料
                var upload = [];
                // 补充材料
                // var cailiao = [{
                //     type: 'cailiao',
                //     title: '补充材料',
                //     intro: '非必填',
                //     state: '',
                //     href: this.optionsUrl + '?orderId=' + tools.getUrlParam('orderId') +'&childOrderId=' + tools.getUrlParam('childOrderId')
                // }];
                var i, item, obj;

                if (this.docItemInfos.length) {
                    // 遍历上传入口
                    for (i = 0; i < this.docItemInfos.length; i++) {
                        item = this.docItemInfos[i];
                        obj = {
                            type: item.IsIdCardDocType ? 'shenfenzheng' : 'liushui',    // 身份证，其他材料都用“流水”类名
                            title: item.DocName,
                            intro: item.DocDescription,
                            state: item.StateName,
                            href: (item.IsIdCardDocType ? this.idCardUrl : this.anotherUrl) + '?orderId=' + tools.getUrlParam('orderId') + '&childOrderId=' + tools.getUrlParam('childOrderId')+ '&docType=' + item.DocType
                        }
                        upload.push(obj);
                    }
                    // data = shiming.concat(upload, cailiao);
                    data = upload;
                }

                return data;
            },
            isShowShare:function(){
                return this.isShowShare;
            },
            cardfrom:function () {
                return this.cardfrom;
            }
        },
        components: {
            'myfiles': myfiles
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
        url: required_doc_item_infos_url + '?time=' + new Date(),
        type: 'post',
        data: {
            orderId: tools.getUrlParam('orderId'),
            childOrderId:tools.getUrlParam('childOrderId')
        },
        success: function(respond) {
            // var respond = JSON.parse(respond);
            if (respond.Result) {
                vm.docItemInfos = respond.Data.DtoItems;
                vm.adviserPhone = respond.Data.AdviserPhone;
                vm.isAuthenticated = respond.Data.IsAuthenticated;
                vm.usercenterAuthUrl = respond.Data.UserCenterAuthUrl;
                vm.isUploadedIdCardDocType = respond.Data.IsUploadedIdCardDocType;
                vm.userCount = respond.Data.UserCount||0;
                vm.adviserName = respond.Data.AdviserName;
                //增加返回弹层
                var isApp = Boolean(tools.isWebView() == 'yixinapp' || tools.isWebView() == 'yixinbjapp'),
                    _contentTxt = '<h3>提交成功！</h3><p style="position:relative;white-space:nowrap;" class="font-title">请保持手机畅通，等候贷款顾问联系<br/>下载易鑫集团App查看申请进度</p>';
                if(location.hash.indexOf('uploaded')>=0 && respond.Data.IsRequiredDocSnapUploadedCompletely && tools.getCookie("uploadok")=="true"){
                    var _btnArr =[];
                    if(isApp){
                        _contentTxt = '<h3>提交成功！</h3><p style="position:relative;white-space:nowrap;" class="font-title">请保持手机畅通，等候贷款顾问联系</p>'
                        _btnArr = [{
                            text: '完成',
                            todo: ()=>{
                                var cookieString = "uploadok=false;path=/;domain=" + tools.wildcardUrl();
                                document.cookie = cookieString;
                                vm.$refs.myfiles.closeAlert();
                                if(!window.isNotCompletely){
                                    window.location.href = user_center_url + '/CouponCard/Index?cardfrom=' + cardfrom;
                                }
                            }
                        }];
                    }else{
                        _btnArr = [{
                            text: '完成',
                            todo: ()=>{
                                var cookieString = "uploadok=false;path=/;domain=" + tools.wildcardUrl();
                                document.cookie = cookieString;
                                vm.$refs.myfiles.closeAlert();
                                if(!window.isNotCompletely) {
                                    window.location.href = user_center_url + '/CouponCard/Index?cardfrom=' + cardfrom;
                                }
                            }
                        },{
                            text: '立即下载',
                            todo: ()=>{
                                var cookieString = "uploadok=false;path=/;domain=" + tools.wildcardUrl();
                                document.cookie = cookieString;
                                window.location.href = xin_che_url+'/app/down/?from=1172'
                            },
                            className: ['active']
                        }];

                    }

                    vm.$refs.myfiles.showAlert({
                        content:_contentTxt,
                        btns: _btnArr,
                        afterClose: ()=>{}
                    });
                }
            } else {
                vm.$refs.myfiles.showAlert({
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
