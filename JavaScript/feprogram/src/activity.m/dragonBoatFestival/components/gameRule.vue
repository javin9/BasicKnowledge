<template>
    <section class="game-rule-wrapper" v-show="isShow" transition="fade">
        <div class="mask"></div>
        <div class="game-rule">
            <div class="content">
                <header>又是一年端午时，情浓粽飘香。<br/>易鑫“粽”动员，邀你齐欢享。</header>
                <dl>
                    <dt>过关攻略：</dt>
                    <dd>
                        <p>输入工号开始游戏；</p>
                        <p>在45秒内点击蹦出的<b>金币（+5分）</b>、<b>粽子（+2分）</b>，赢得游戏积分；</p>
                        <p>注意：点到海产物（鱼、蟹）不加分哦；</p>
                        <p>游戏登陆时间：2017年5月22日——5月24日间可任意玩耍，易鑫玩家的最高积分将列入 “粽”动员排行榜；</p>
                        <p>将根据积分排名发放易鑫端午神秘礼品，玩家人数越多，中奖率越大哦；</p>
                    </dd>
                </dl>
                <dl>
                    <dt>互动秘籍：</dt>
                    <dd>
                        <div>游戏结束后玩家可查看易鑫“粽”动员排行榜，小伙伴们还可以给你支持的易鑫玩家点赞哦。</div>
                    </dd>
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
        methods:{
            closeLayer(){
                this.$dispatch('closeGameRule');
            }
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
        background:rgba(0,0,0,0.6);
        position: absolute;
        width:100%;
        height:100%;
        left:0;
        top:0;
        z-index: 100;
    }
    .game-rule{
        z-index:101;
        position:absolute;
        left:50%;
        top:50%;
        -webkit-transform:translate3d(-50%,-50%,0);
        transform:translate3d(-50%,-50%,0);
        .close{
            width:px2rem(72);
            height:px2rem(72);
            background:url("../images/close_btn.png") no-repeat left top;
            background-size:contain;
            margin:px2rem(30) auto 0 auto;
        }
        .content{
            width:px2rem(680);
            background:#fff;
            border-radius: px2rem(10);
            line-height:150%;
            header{
                font-size:px2rem(28);
                text-align:center;
                padding:px2rem(40) 0;
                line-height:150%;
            }
            dl{
                &:last-child{
                    margin-top:px2rem(35);
                }
                width:px2rem(620);
                margin:0 auto;
                border-top:1px solid #1d8643;
                position: relative;
                &:after{
                    content:' ';
                    position:absolute;
                    width:px2rem(210);
                    height:px2rem(40);
                    background:#1d8643;
                    left:0;
                    top:0;
                }
                &:before{
                    content:' ';
                    position:absolute;
                    width: 0;
                    height: 0;
                    top:0;
                    left:px2rem(191);
                    border-left: px2rem(20) solid transparent;
                    border-right: px2rem(20) solid transparent;
                    border-top: px2rem(40) solid #1d8643;
                }
            }
            dt{
                position:relative;
                z-index: 2;
                color:#fff;
                padding-left:px2rem(35);
                font-size:px2rem(30);
                line-height:px2rem(40);
            }
            dd{
                position:relative;
                font-size:px2rem(28);
                line-height:150%;
                color:#1a1a1a;
                div{
                    padding:px2rem(30) 0 px2rem(30) px2rem(35);
                }
                p{
                    padding-left:px2rem(35);
                    position:relative;
                    display:block;
                    margin-top:px2rem(10);
                    &:after{
                        position:absolute;
                        content: ' ';
                        width:px2rem(10);
                        height:px2rem(10);
                        background:#cbcbcb;
                        border-radius: 50%;
                        left:0;
                        top:px2rem(17);
                     }
                }
                b{
                    color:#ff7200;
                }
            }
        }
    }
</style>