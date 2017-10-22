<template>
    <section class="load-wrapper" v-show="isShow" transition="fade">
        <div class="logo"><div></div></div>
        <div class="load-bar">
            <div class="process-bar" :style="{ width: processString }"></div>
            <div class="car-bar"><div class="car" :style="{ left: processString }"></div></div>
        </div>
    </section>
</template>

<script type="text/ecmascript-6">
    import btn from '../components/button.vue';
    import gameRule from '../components/gameRule.vue';
    function touchmoveHandler(e){
        e.preventDefault();
    }
    export default{
        props:{
            isShow:{
                type: Boolean,
                default: false
            },
            process:{
                type: Number,
                default: 0
            }
        },
        data(){
            return {
            }
        },
        computed: {
            processString() {
                return this.process * 100 + '%';
            }
        },
        components:{
        },
        methods:{
        },
        events:{
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    .load-wrapper{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: url(../images/loading-bg.html.jpg) no-repeat center bottom #01205a;
        background-size: cover;
        overflow: hidden;

        .logo {
            position: absolute;
            left: 0;
            bottom: px2rem(96);
            width: 100%;
            height: px2rem(43);
            overflow: hidden;

            div {
                position: absolute;
                left: 0;
                top: 0;
                width: px2rem(750);
                height: px2rem(43);
                background: url(../images/logo-ki.html.png) no-repeat center center;
                background-size: contain;
            }
        }

        .load-bar {
            position: absolute;
            left: 50%;
            top: 50%;
            margin-top: px2rem(-80);
            width: px2rem(660);
            height: px2rem(10);
            background: url(../images/loading-bar.html.png) no-repeat center center;
            background-size: 100% 100%;
            transform: translate(-50%, -50%);

            .process-bar {
                position: absolute;
                left: 0;
                bottom: 0;
                width: 0;
                height: px2rem(7);
                border-radius: px2rem(7);
                overflow: hidden;
                background: #ff5258;
                transition: width 0.25s linear 0s;
            }

            .car-bar {
                position: absolute;
                left: px2rem(70);
                right: px2rem(60);
                top: 0;
                bottom: 0;
                z-index: 10;

                .car {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    width: px2rem(171);
                    height: px2rem(98);
                    background: url(../images/loading-car.html.png) no-repeat center center;
                    background-size: contain;
                    transform: translate(-50%, -50%);
                    transition: left 0.25s linear 0s;
                }
            }
        }
    }
</style>
