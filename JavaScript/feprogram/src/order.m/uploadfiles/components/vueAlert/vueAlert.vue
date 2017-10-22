<template>
    <section class="vue-alert" v-show="show" @click.self="close" transition="fade">
        <div class="alert-box" v-if="!loading">
            <div class="alert-con" v-html="content">
            </div>
            <div class="alert-btn">
                <div class="btn" v-for="(index, btn) in btns" v-text="btn.text" :class="btn.className" @click="btnclick(btn.todo, index, $event)"></div>
            </div>
        </div>
        <div class="loading-box" v-if="loading">
            loading
        </div>
    </section>
</template>

<style>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    $red: map-get($colors, red);
    .vue-alert {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 14000;

        .alert-box {
            position: absolute;
            left: 50%;
            top: 50%;
            width: px2rem(638);
            transform: translate(-50%, -50%);
            background: #f1f1f1;
            border-radius: px2rem(12);
            overflow: hidden;

            .alert-con {
                padding: px2rem(40) px2rem(30);
                @include fsize(30);
                line-height: px2rem(44);
                color: #666666;
                text-align: center;
                h3{
                    @include fsize(32);
                }
                h1,
                h2,
                h3,
                h4,
                h5,
                h6 {
                    margin: px2rem(20) 0 px2rem(8);
                    line-height: px2rem(46);
                    color: #000000
                }
            }

            .alert-btn {
                border-top: 1px solid #CDCED2;
                display: -webkit-box;
                display: flex;

                .btn {
                    flex-grow: 1;
                    width: 0;
                    text-align: center;
                    @include fsize(32);
                    line-height: px2rem(88);
                    color: #666666;
                    border-right: 1px solid #dddddd;

                    &:nth-last-child(1) {
                        border-bottom: 0;
                        border-right: 0;
                    }

                    &.active {
                        color: $red;
                    }

                    &.cancel {
                        color: #999999;
                    }
                }
            }
        }

        .loading-box {
            position: absolute;
            left: 50%;
            top: 50%;
            width: px2rem(90);
            height: px2rem(90);
            transform: translate(-50%, -50%);
            background: url(images/loading90.gif) no-repeat center center;
            background-size: cover;
            text-indent: -100em;
            overflow: hidden;
        }
    }

    /* always present */
    .fade-transition {
      transition: all .3s ease;
    }
    /* .expand-enter defines the starting state for entering */
    /* .expand-leave defines the ending state for leaving */
    .fade-enter, .fade-leave {
      opacity: 0;
    }
</style>
<script>
    export default{
        props: ['content', 'btns', 'show', 'loading', 'afterClose','isPadding'],
        data() {
            return {}
        },
        computed: {
        },
        components:{},
        methods: {
            close() {
                //console.log(this.content)
                //console.log(this.afterClose)
                if (typeof this.afterClose === 'function') {
                    this.afterClose.call();
                }
                this.$dispatch('alert.close');
            },
            btnclick(fn, index, event) {
                if (typeof fn === 'function') {
                    fn.call();
                }
                this.$dispatch('btn.itemclick', index, event);
            }
        }
    }
</script>
