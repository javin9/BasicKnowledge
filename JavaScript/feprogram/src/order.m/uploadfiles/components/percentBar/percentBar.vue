<template>
    <section class="percentBar">
        <div class="text">
            <div class="primary">
                <span v-html="text"></span>
                <span class="percent" :style="{ color: mainColor }" v-text="percent"></span>
            </div>
            <div class="info" v-html="info"></div>
        </div>
        <div class="bar">
            <div class="inner" :style="{ width: percent, background: mainColor }"></div>
        </div>
    </section>
</template>
<style>
    @import 'sassHelper/mixin';

    .percentBar {
        padding: px2rem(40) px2rem(30);
        background: #ffffff;

        .text {
            @include fsize(32);
            line-height: px2rem(48);
            color: #000000;
            overflow: hidden;

            .primary {
                float: left;

                .percent {
                    margin-left: 0.4em;
                    color: #128CED;
                }
            }

            .info {
                float: right;
                @include fsize(26);
                color: #999999;

                em {
                    color: #E9474D;
                }
            }
        }

        .bar {
            box-sizing: border-box;
            height: px2rem(30);
            box-shadow: inset 0 0 0 1px #e5e5e5;
            border-radius: px2rem(30);
            background: #ffffff;
            overflow: hidden;
            margin-top: px2rem(20);

            .inner {
                width: 0;
                height: 100%;
                background: #128CED;
            }
        }
    }
</style>
<script>
    export default{
        props: ['text', 'percent', 'mainColor', 'info'],
        data() {},
        components:{}
    }
</script>
