<template>
    <section class="game-counter" v-show="isShow" transition="fade" v-text="leftTime">
    </section>
</template>
<script type="text/ecmascript-6">
    export default{
        props:{
            isShow:{
                type:Boolean,
                default:false
            },
            counter:{
                type: Number,
                default: 5
            }
        },
        data() {
            return {
                leftTime: 0,
            }
        },
        methods:{
            counterStart() {
                if (this.counter > 0) {
                    this.leftTime = this.counter;
                    var countdown = setInterval(() => {
                        this.leftTime--;
                        if (this.leftTime <= 0) {
                            clearInterval(countdown);
                            this.$dispatch('counterEnd');
                        }
                    },1000);
                }

                setTimeout(function() {
                    $('html, body').scrollTop(0);
                });
            }
        },
        watch: {
            isShow(value) {
                if (value) {
                    this.counterStart();
                }
            }
        }
    };


</script>
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    .game-counter {
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        width: px2rem(190);
        height: px2rem(190);
        -webkit-box-shadow: inset 0 0 0 1px #218d49;
        box-shadow: inset 0 0 0 1px #218d49;
        -webkit-border-radius: 100%;
        border-radius: 100%;
        text-align: center;
        line-height: px2rem(190);
        @include fsize(92);
        color: #218d49;
    }
</style>