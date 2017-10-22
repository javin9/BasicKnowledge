<template>
    <vue-header header-title="补充资料" :prevent-back="true"></vue-header>
    <!-- 资料列表 -->
    <ul class="file-list-simple" v-if="listData.length>0">
        <li v-for="data in listData" @click="goto(data.href)">
            <div class="text">
                <div class="tit" v-text="data.title"></div>
            </div>
            <div class="count" v-text="data.imageCount + '张图'" v-if="data.imageCount"></div>
            <div class="btn" :class="[getBtnClass(data.state)]" v-text="data.state" v-if="data.state && data.imageCount"></div>
        </li>
    </ul>
    <vue-alert :content="alertParam.content" :btns="alertParam.btns" :after-close="alertParam.afterClose" :loading="alertParam.loading" :show="alertParam.show"></vue-alert>
</template>
<style>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    $red: map-get($colors, red);
    $gold: map-get($colors, gold);
    $green: #00CC99;
    $yellow: #FFC957;
    $gray: #DCDCDC;

    .file-list-simple {
      li {
        position: relative;
        padding: px2rem(31) px2rem(30);
        background: #FFFFFF;
        margin-bottom: 1px;
        overflow: hidden;
        line-height: px2rem(46);

        .text {
          float: left;

          .tit {
            @include fsize(30);
            color: #000000;
          }
        }

        .count {
          float: right;
          margin-right: px2rem(42);
          @include fsize(30);
          color: $red;
        }

        .btn {
          position: absolute;
          top: 50%;
          right: px2rem(102);
          margin-right: px2rem(88);
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
          }
          &.btn-pending {
            background: $yellow;
          }
          &.btn-none {
            background: $gray;
            background: transparent;
            color: #666666;
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
          margin-top: px2rem(-6);
          transform-origin: 50% 50%;
          transform: rotate(45deg);
          margin-right: px2rem(4);
        }
      }
    }
</style>
<script>
    import vueHeader from '../components/vueHeader/vueHeader.vue'
    import vueAlert from '../components/vueAlert/vueAlert.vue'

    export default{
        props: ['listData', 'backUrl'],
        data() {
            return {
                alertParam: {
                    content: '',
                    btns: [],
                    afterClose: function() {},
                    show: false,
                    loading: false
                }
            }
        },
        computed: {
        },
        components: {
            'vue-header': vueHeader,
            'vue-alert': vueAlert
        },
        events:{
            'header.back': function() {
                location.href = this.backUrl;
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
                        default:
                        // case '去确认':
                        // case '去上传':
                            className = 'btn-none';
                            break;
                    }
                }
                return className;
            },
            goto: function(href) {
                if (href) {
                    location.href = href;
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
        }
    }
</script>
