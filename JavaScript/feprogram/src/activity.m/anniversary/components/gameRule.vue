<template>
    <section class="game-rule-wrapper" v-show="isShow" transition="fade">
        <div class="mask" @click.self="closeLayer"></div>
        <div class="logo"></div>
        <div class="game-rule">
            <div class="content">
                <dl>
                    <dt>游戏攻略</dt>
                    <dd>输入工号开始游戏；</dd>
                    <dd>选择自己喜欢的车型；</dd>
                    <dd>在45秒内点击左右按钮控制小汽车的移动；</dd>
                    <dd>行驶过程中撞到金币(+3),赢得游戏积分；</dd>
                    <dd>注意:撞到加油站可瞬间加速,撞到障碍物游戏结束,积分保留；</dd>
                    <dd>游戏登陆时间:2017年8月7日—8月9日间可任意玩耍,易鑫车手的最高积分将列入“鑫”车排行榜；</dd>
                </dl>
                <dl>
                    <dt>互动秘籍</dt>
                    <dd>游戏结束后车手可以查看极速“鑫”车排行榜，给你支持的易鑫车手点赞~</dd>
                </dl>
            </div>
            <div class="close" @click="closeLayer"></div>
        </div>
    </section>
</template>
<script type="text/ecmascript-6">
    /**
     * Created by shangbinjie on 2017/5/11.
     */
    export default{
        props:{
            isShow:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                tapped: 0
            }
        },
        methods:{
            closeLayer(){
                this.$dispatch('closeGameRule');
            }
        },
        ready() {
            $('.game-rule-wrapper .logo').click(() => {
                this.tapped++;
                if (this.tapped >= 20) {
                    this.$dispatch('superCar');
                }
            });
        }
    };
</script>
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .game-rule-wrapper {
        position: fixed;
        width:px2rem(750);
        height:100%;
        left:50%;
        top:0;
        z-index: 100;
        -webkit-transform:translate3d(-50%,0,0);
        transform:translate3d(-50%,0,0);
    }
    .mask{
        background:rgba(0,26,77,0.7);
        position: absolute;
        width:100%;
        height:100%;
        left:0;
        top:0;
        z-index: 100;
    }
    .logo {
        position: absolute;
        z-index: 101;
        top: px2rem(30);
        left: px2rem(30);
        width: px2rem(214);
        height: px2rem(43);
        background: url(../images/logo.html.png) no-repeat center center;
        background-size: cover;
    }
    .game-rule{
        z-index:101;
        position:absolute;
        left:50%;
        top:50%;
        width: px2rem(634);
        height: px2rem(840);
        -webkit-transform:translate3d(-50%,-50%,0);
        transform:translate3d(-50%,-50%,0);
        background: url(../images/rule-bg.html.png) no-repeat center center;
        background-size: cover;

        .close{
            position: absolute;
            top: px2rem(12);
            right: px2rem(37);
            width:px2rem(137);
            height:px2rem(56);
            background:url(../images/close-btn.html.png) no-repeat left top;
            background-size:contain;
        }

        .content{
            width:px2rem(460);
            margin: px2rem(260) auto 0;
            color: #e8f9ff;

            dl{
                padding-top: 1px;

                dt {
                    font-size: px2rem(30);
                    line-height: px2rem(50);
                    margin-top: px2rem(10);
                }

                dd {
                    font-size: px2rem(24);
                    line-height: px2rem(30);
                    position: relative;
                    padding-left: px2rem(30);

                    &:before {
                        content: ' ';
                        position: absolute;
                        left: px2rem(6);
                        top: px2rem(15);
                        width: px2rem(12);
                        height: px2rem(12);
                        background: #e8f9ff;
                        transform: translate(0, -50%) rotate(45deg);
                    }
                }
            }
        }
    }
</style>