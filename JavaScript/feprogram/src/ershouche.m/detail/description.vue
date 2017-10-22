<template>
    <div v-show="isShowDescription" class="all-description" transition="fadeUp">
        <div v-show="isShowClose" class="description-colse" v-on:click="closeDescription">
        </div>
        <div id="description" class="description">
            <div class="wrapper">
                <div class="description-title">卖家描述</div>
                <div class="description-text">
                    <descriptions>
                    <slot name="descriptions"></slot>
                    </descriptions>
                </div>
                <div class="description-h30"></div>
            </div>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import IScroll from 'iscroll'
var myScroll;
export default {
    props: ['isShowDescription', 'closeDescription', 'desc'],
    data() {
        return {
            isShowClose: false,
            maskLayer: $('#maskLayer'),
        }
    },
    watch: {

        isShowDescription(value) {
            const $body = $('body')
            const TOUCH_MOVE_EVENT = 'touchmove'
            if (value) {
                $body.bind(TOUCH_MOVE_EVENT, e => e.preventDefault())
                this.isShowClose = true
                this.showDescription();
            } else {
                this.isShowClose = false;
                $body.unbind(TOUCH_MOVE_EVENT)
                this.hideDescription();
            }
        }
    },
    events: {

    }
    ,
    methods: {
        showDescription() {
            this.maskLayer.show();
            this.maskLayer.on('touchmove', e => e.preventDefault());
            myScroll = new IScroll('#description', {
                'preventDefault': false,
                'bounce': false
            });
        },
        hideDescription() {
            this.maskLayer.hide();
            this.maskLayer.off('touchmove');
            this.closeDescription();
        },
        loadDomEvent() {

            this.maskLayer.click(() => this.closeDescription())
        }
    },
    ready() {
        this.loadDomEvent();
    }
    ,
    components: {

    }
}
</script>
<style scoped>
@import 'sassHelper/mixin';
@import 'sassHelper/vars';
.all-description {
    padding-left: px2rem(40);
    background: #FFFFFF;
    height: px2rem(782);
    z-index: 99999;
    position: fixed;
    bottom: px2rem(100);
    width: 100%;
}

.description {
    height: px2rem(782);
    overflow: hidden;
    &-colse {
        width: px2rem(80);
        height: px2rem(80);
        position: absolute;
        top: px2rem(-40);
        z-index: 999999;
        right: px2rem(100);
        background: url('../images/cggb.png') no-repeat;
        background-size: 100% 100%;
    }
    .wrapper {
        position: relative;
        z-index: 99;
        overflow: hidden;
        background-color: #fff;
    }
    &-title {
        color: #333333;
        font-weight: bold;
        @include fsize(40);
        height: px2rem(54);
        margin-top: px2rem(60);
        margin-bottom: px2rem(40);
    }
    &-name {
        color: #394043;
        font-weight: bold;
        @include fsize(32);
        height: px2rem(52);
        width: px2rem(660);
        line-height: px2rem(52);
        margin-top: px2rem(40);
    }
    &-text {
        width: px2rem(660);
        color: #888888;
        @include fsize(28);
        line-height: px2rem(52);
        margin-top: px2rem(10);
    }
    &-h30 {
    height: px2rem(30);
}
}


</style>
