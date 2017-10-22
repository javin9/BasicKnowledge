<template>
    <vue-header header-title="提交资料" :prevent-back="true"></vue-header>
    <div class="top-tips">您的资料已加密处理，仅用于申请分期</div>
    <div class="advantage">
        <p>上传资料，获得顾问优先服务:</p>
        <ul>
            <li>即时联系</li>
            <li>全程协助完成审批</li>
            <li>周期缩短12天</li>
        </ul>
    </div>

    <!--<percent-bar text="信息完整度" :percent="uploadedPercent" :info="uploadedInfo" v-if="listData.length>0"></percent-bar>-->

    <!-- 资料列表 -->
    <ul class="file-list" v-if="listData.length>0">
        <li v-for="data in listData" @click="goto(data.href, data.type)">
            <div class="icon" :class="['icon-'+data.type]"></div>
            <div class="text">
                <div class="tit" v-text="data.title"></div>
                <div class="intro" v-text="data.intro"></div>
            </div>
            <div class="btn" :class="[getBtnClass(data.state)]" v-text="data.state" v-if="data.state"></div>
        </li>
    </ul>

    <!--分享有礼-->
    <div v-bind:class="{'no-after':true,'sharing-courtesy':'true'}" @click="shareJump" v-if="shareData.isShareBox">
        <div v-if="isUploadedIdCardDocType">
            <div class="icon icon-share"></div>
            <div class="text">
                <div class="intro" v-text="shareData.shareLinkTxt"></div>
            </div>
            <div class="btn" v-if="isUploadedIdCardDocType">去分享</div>
        </div>
        <div v-else class="no-share-btn">
            <div class="text" style="margin-left:0;margin-right:0">
                <span class="tit">分享有礼</span>
                <span class="intro">上传资料后<span v-text="shareData.shareLinkTxt"></span></span>
            </div>
        </div>

    </div>
    <div class="tips" v-if="adviserPhone">
        <p v-if="!adviserName">如有疑问或咨询，点击拨打电话<a href="javascript:void(0)" @click="telCall" v-text="adviserPhoneNum"></a></p>
        <p v-else>顾问{{adviserName}}为您服务，点击拨打电话<a href="javascript:void(0)" @click="telCall" v-text="adviserPhoneNum"></a></p>
        <!--<p>最新审批进度随时查看，请下载<a href="javascript:void(0)" @click="appDown">易鑫车贷App</a></p>-->
    </div>

    <vue-alert :content="alertParam.content" :btns="alertParam.btns" :after-close="alertParam.afterClose" :loading="alertParam.loading" :show="alertParam.show"></vue-alert>

    <div class="layer-wrapper" v-show="isShow" transition="opacity" @touchmove.prevent>
        <div class="content-wrapper">
            <div class="content">
                <div class="close-btn" @click="closeLayer"></div>
                <div class="con">
                    分享活动，召唤小伙伴助力加油！<br/>
                    首付优惠最高立减6000元！<br/>
                    更有一大波0息免息券等你来抢！
                </div>
                <div class="confirm-btn" @click="confirmHandler">马上抢</div>
            </div>
        </div>
    </div>
    <mask></mask>
</template>
<style>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    $red: map-get($colors, red);
    $gold: map-get($colors, gold);
    $green: #00CC99;
    $yellow: #FFC957;
    $gray: #DCDCDC;
    .content-wrapper{
        z-index:10000;
        position:fixed;
        left:50%;
        top:50%;
        transform:translate3d(-50%,-50%,0);
        width:px2rem(640);
        height:px2rem(900);
        background:url("images/layer_bg.png") no-repeat left top;
        background-size:contain;
        .content{
            position:relative;
            .close-btn{
                position: absolute;
                right:px2rem(30);
                top:px2rem(-40);
                width:px2rem(80);
                height:px2rem(80);
                background:url("images/close_btn.png") no-repeat no-repeat left top;
                background-size:contain;
            }
            .con{
                padding-top:px2rem(512);
                padding-bottom:px2rem(50);
                text-align:center;
                lint-height:150%;
                font-size:px2rem(26);
                color:#333;
            }
            .confirm-btn{
                width:px2rem(506);
                height:px2rem(130);
                background:url("images/btn.png") no-repeat left top;
                background-size:contain;
                margin:0 auto;
                color:#fff;
                @include fsize(32);
                line-height:px2rem(130);
                text-align:center;
            }
        }
    }
    /* .info {
      padding: px2rem(20) px2rem(30);
      @include fsize(26);
      line-height: px2rem(40);
      color: #999999;

      em {
        font-style: normal;
        color: $red;
      }
    } */
    .top-tips{
        height:px2rem(66);
        line-height:px2rem(66);
        background:#fff4ea;
        @include fsize(26);
        color: #FF8C39;
        padding:0 px2rem(30);
    }
    .advantage {
        padding: px2rem(24) px2rem(30) px2rem(1);
        margin-bottom: px2rem(20);
        background: #ffffff;

        p {
            @include fsize(26);
            line-height: px2rem(40);
            color: #666666;
            margin-bottom: px2rem(23);
            span{
                color:#f00;
            }
        }

        ul {
            overflow: hidden;
            margin-right: px2rem(-30);

            li {
                float: left;
                margin-right: px2rem(30);
                padding-left: px2rem(36);
                background: url(images/advantage@2x.png) no-repeat left center;
                background-size: px2rem(26) auto;
                white-space: nowrap;
                @include fsize(24);
                line-height: px2rem(36);
                color: #333333;
                margin-bottom: px2rem(16);
            }
        }
    }

    .sharing-courtesy {
        position: relative;
        padding: 0 px2rem(30);
        height:px2rem(100);
        line-height:px2rem(100);
        background: #FFFFFF;
        margin-bottom: 1px;
        overflow: hidden;
        margin-top:px2rem(20);
        .no-share-btn{
            .text{
                .intro{
                    color:#999;
                    @include fsize(28);
                    margin-left:px2rem(20);
                }
            }
        }
        &:after {
             content: '';
             box-sizing: border-box;
             position: absolute;
             top: 50%;
             right: px2rem(30);
             width: px2rem(16);
             height: px2rem(16);
             border-top: 1px solid #666666;
             border-right: 1px solid #666666;
             margin-top: px2rem(-8);
             transform-origin: 50% 50%;
             transform: rotate(45deg);
             margin-right: px2rem(4);
        }
        &.no-after:after{
             display:none;
         }
        .btn{
            position:absolute;
            right:px2rem(30);
            padding-right: px2rem(30);
            top:0;
            color:#E9474D;
            @include fsize(30);
            &:after{
                content: '';
                box-sizing: border-box;
                position: absolute;
                top: 50%;
                right: 0;
                width: px2rem(16);
                height: px2rem(16);
                border-top: 1px solid #666666;
                border-right: 1px solid #666666;
                margin-top: px2rem(-8);
                transform-origin: 50% 50%;
                transform: rotate(45deg);
                margin-right: px2rem(4);
            }
        }

        .icon {
            background-image: url(images/fenxiang@2x.png);
            float: left;
            width: px2rem(60);
            height: px2rem(60);
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
            margin: px2rem(15) 0;
        }
        .icon-share {
            background-image: url(images/fenxiang@2x.png);
            background-size: px2rem(35) px2rem(46);
            margin: px2rem(15) 0;
        }
        .text {
            margin-left: px2rem(90);
            margin-right: px2rem(192);

            .tit {
                @include fsize(30);
                line-height: px2rem(46);
                margin-bottom: px2rem(4);
                color: #000000;
            }

            .intro {
                @include fsize(30);
                /*line-height: px2rem(40);*/
                color: #333;
            }
        }

     }

    .file-list {
      margin-top: 1px;

      li{
        position: relative;
        padding: px2rem(24) px2rem(30);
        background: #FFFFFF;
        margin-bottom: 1px;
        overflow: hidden;

        .icon {
          float: left;
          width: px2rem(60);
          height: px2rem(60);
          background-repeat: no-repeat;
          background-position: center center;
          background-size: cover;
          margin: px2rem(15) 0;

          &.icon-shiming {
            background-image: url(images/shiming@2x.png);
          }

          &.icon-shenfenzheng {
            background-image: url(images/shenfenzheng@2x.png);
          }

          &.icon-liushui {
            background-image: url(images/liushui@2x.png);
          }

          &.icon-cailiao {
            background-image: url(images/cailiao@2x.png);
          }
        }

        .text {
          margin-left: px2rem(90);
          margin-right: px2rem(192);

          .tit {
            @include fsize(30);
            line-height: px2rem(46);
            margin-bottom: px2rem(4);
            color: #000000;
          }

          .intro {
            @include fsize(26);
            line-height: px2rem(40);
            color: #999999;
          }
        }

        .btn {
          position: absolute;
          top: 50%;
          right: px2rem(45);
          width: px2rem(120);
          height: px2rem(54);
          margin-top: px2rem(-27);
          border-radius: px2rem(54);
          background: $gray;
          color: #FFFFFF;
          @include fsize(26);
          line-height: px2rem(54);
          text-align: center;

          &.btn-pass {
            background: $green;
               margin-right:px2rem(20);
          }
          &.btn-pending {
            background: $yellow;
               margin-right:px2rem(20);
          }
          &.btn-none {
            background: $gray;
            background: transparent;
            color: #E9474D;
            @include fsize(30);
          }
        }

        &:after {
          content: '';
          box-sizing: border-box;
          position: absolute;
          top: 50%;
          right: px2rem(30);
          width: px2rem(16);
          height: px2rem(16);
          border-top: 1px solid #666666;
          border-right: 1px solid #666666;
          margin-top: px2rem(-8);
          transform-origin: 50% 50%;
          transform: rotate(45deg);
          margin-right: px2rem(4);
        }
      }
    }

    .tips {
        margin-top: px2rem(20);
        margin-bottom: px2rem(160);
        padding: 0 px2rem(30);

        p {
            @include fsize(26);
            line-height: px2rem(40);
            color: #686868;
        }

        a {
            color: #5A67AE;
            text-decoration: underline;
            margin-left: px2rem(10);
        }

        .tel-btn {
            display: inline-block;
            margin-top: px2rem(30);
            padding: 0 px2rem(24) 0 px2rem(60);
            background: url(images/callicon@2x.png) no-repeat px2rem(24) center;
            background-size: px2rem(25) auto;
            border: 1px solid #666666;
            border-radius: px2rem(5);
            @include fsize(28);
            line-height: px2rem(60);
            color: #333333;
        }
    }
    @media only screen
    and (device-width : 320px)
    and (-webkit-device-pixel-ratio: 2){
        [data-dpr="2"] .sharing-courtesy .no-share-btn .text .intro{
            font-size:20px;
        }
        [data-dpr="2"] .sharing-courtesy .text .intro{
            font-size:26px;
        }
    }
</style>
<script>
    import vueHeader from '../components/vueHeader/vueHeader.vue'
//    import percentBar from '../components/percentBar/percentBar.vue'
    import vueAlert from '../components/vueAlert/vueAlert.vue'
    import Mask from 'libs/mask'
    var cardfrom = 1138;
    export default{
        props: ['listData', 'adviserPhone','adviserName','isUploadedIdCardDocType','userCount','usercenterUrl'],
        data() {
            return {
                alertParam: {
                    content: '',
                    btns: [],
                    afterClose: function() {},
                    show: false,
                    loading: false
                },
                shareData:{
                    isShareLink:false,
                    shareLinkTxt:'',
                    shareLink:'',
                    isShareBox:false,
                },
                activityUrl:window.activity_url?window.activity_url:"",
                isShow:false
            }
        },
        computed: {
            // 需要材料数量
            requireFileNum: function() {
                var data = this.listData,
                    counter = 0;
                for (var i = 0; i < data.length; i++) {
//                    if (data[i].type !== 'liushui') {
                        counter++;
//                    }
                }
                return counter;
            },
            // 已提交材料数量
            uploadedFileNum: function() {
                var data = this.listData,
                    counter = 0;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].state === '通过' || data[i].state === '审核中' || data[i].state === '待审核') {
                        counter++;
                    }
                }
//                if(counter > 0){
//                    this.shareData.isShareBtn = false;
//                }else{
//                    this.shareData.isShareBtn = true;
//                }
                return counter;
            },
            // 剩余材料数量
            restFileNum: function() {
                return (this.requireFileNum - this.uploadedFileNum);
            },
            // 完成度
            uploadedPercent: function() {
                return (Math.round(this.uploadedFileNum / this.requireFileNum * 100) + '%');
            },
            // 完成度描述文字
            uploadedInfo: function() {
                var info = '';
                if (this.restFileNum > 0) {
                    info = `还需填写<em>${this.restFileNum}</em>项资料`;
                } else {
                    info = '等待资料核实';
                }
                return info;
            },
            // 显示的电话号码
            adviserPhoneNum: function() {
                var phonenum = '';
                if (this.adviserPhone.slice(0, 4) === '4000') {
                    phonenum = this.adviserPhone.slice(0, 4) + '-' + this.adviserPhone.slice(4, 7) + '-' +  this.adviserPhone.slice(7);
                } else {
                    phonenum = this.adviserPhone;
                }
                return phonenum;
            }
        },
        components: {
            'vue-header': vueHeader,
//            'percent-bar': percentBar,
            'vue-alert': vueAlert,
            Mask
        },
        events: {
            'header.back': function() {
                // 回退去个人中心页
                location.href = this.usercenterUrl;
            }
        },
        methods: {
            getBtnClass: function(state) {
                var className = '';
                if (state) {
                    switch (state) {
                        case '通过':
                            className = 'btn-pass';
                            break;
                        case '审核中':
                        case '待审核':
                            className = 'btn-pending';
                            break;
                        // case '去认证':
                        // case '去确认':
                        // case '去上传':
                        default:
                            className = 'btn-none';
                            break;
                    }
                }
                return className;
            },
            //关闭层
            closeLayer(){
                this.isShow = false;
                this.$broadcast('hideMask');
            },
            //点击层中按钮
            confirmHandler(){
                window.location.href= this.activityUrl;
            },
            goto: function(href, type) {
                var _this = this;
//                console.log(type)
                if (!href) { return false;}
                // 增加验证，如果未认证不能上传，而是显示认证弹窗
                if (this.isUploadedIdCardDocType || type == 'shenfenzheng') {
                    location.href = href;
                } else {
                    this.showAlert({
                        content: '<p style="padding: 1em 0;">请先上传身份证</p>',
                        btns: [{
                            text: '取消',
                            todo: function() {
                                _this.closeAlert();
                            },
                            className: ['cancel']
                        },{
                            text: '去上传',
                            todo: function() {
                                location.href = _this.listData[0].href;
                            },
                            className: ['active']
                        }]
                    })
                }
            },
            telCall: function() {
                // tools.ifPopExtnum('tel:'+ this.adviserPhone);
                location.href = 'tel:'+ this.adviserPhone;
            },
            appDown:function(){
                //app下载
                location.href = xin_che_url  + '/app/down/?from=1172';
            },
            shareJump:function(){
                //分享跳转
                if(this.isUploadedIdCardDocType){
                    location.href = this.shareData.shareLink;
                }

            },
            // 显示提示弹层
            showAlert: function(options) {
                this.alertParam.content = options.content || '';
                this.alertParam.btns = options.btns || [];
                this.alertParam.afterClose = options.afterClose || function() {};
                this.alertParam.loading = false;
                this.alertParam.show = true;
            },
            // 关闭提示弹层
            closeAlert: function() {
                this.alertParam.show = false;
            }
        },
        ready:function(){
            let that =this,
                orderId = tools.getUrlParam('orderId'),
                cookieOrderId = tools.getCookie(orderId);
            if(window.activity_url && cookieOrderId !== "true"){
                this.isShow =  true;
                tools.setCookie(orderId,'true');
                this.$broadcast('showMask');
            }
            //获取是否显示分享
            $.ajax({
                url: coupon_card_info_getting_url,
                type: 'post',
                data: {
                    cardfrom:cardfrom,
                    cityId:cityId,
                    packageId:packageId
                },
                success: function(res) {
//                    var res = JSON.parse(res);
                    if(res.Result){
                        that.shareData.isShareLink = true;
                        that.shareData.shareLink = res.Data.ActivityLink;
                        that.shareData.shareLinkTxt = '邀请好友可得'+res.Data.CardValue +'元'+res.Data.CardName;
                        that.shareData.isShareBox = true;
                    }else{
                        window.isNotCompletely = true;
                    }
                }
            })



        }
    }
</script>
