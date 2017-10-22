<template>
    <section class="game-result-wrapper" v-show="isShow" transition="fade">
        <div class="mask"></div>
        <div class="logo"></div>
        <div class="game-result">
            <div class="content" v-if="typeof resultData === 'object'">
                <h3>本轮游戏得分</h3>
                <h2 v-text="resultData.count"></h2>
                <p>历史最高战绩战胜了<em v-text="resultData.perinfo"></em>的小伙伴</p>
                <p>当前排名<em v-text="resultData.rankinginfo"></em>名</p>
            </div>
            <div class="content error" v-else>
                <h3>{{resultData}}</h3>
            </div>
            <btn btn-text="查看游戏排名" btn-cls="btn board-btn" event-name="checkBoard"></btn>
            <btn btn-text="再玩一次" btn-cls="btn ag-btn" event-name="playAgain"></btn>
        </div>
    </section>
</template>
<script type="text/ecmascript-6">
    import btn from '../components/button.vue';
    export default{
        props:{
            isShow:{
                type: Boolean,
                default:false
            },
            resultData:{
                type: [Object, String],
                default: {}
            }
        },
        components:{
            btn
        },
        methods:{
            checkBoard() {
                this.$dispatch('checkBoard');
            }
        }
    };
</script>
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .game-result-wrapper {
        position: fixed;
        left:0;
        top:0;
        right: 0;
        bottom: 0;
        z-index: 100;
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
    .game-result{
        z-index:101;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate3d(-50%,-50%,0);

        .content{
            box-sizing: border-box;
            width: px2rem(610);
            height: px2rem(420);
            padding: 0;
            background: url(../images/result-bg.html.png) no-repeat center center;
            background-size: contain;
            line-height: 1.4;
            text-align: center;
            color: #ffffff;
            text-shadow: px2rem(2) px2rem(2) 0 rgba(6,54,172,0.47);

            h3 {
                font-size: px2rem(52);
                letter-spacing: px2rem(4);
                padding-top: px2rem(30);
            }

            h2 {
                font-size: px2rem(140);
                line-height: 1.1;
                font-weight: bold;
                padding-bottom: px2rem(10);
            }

            p {
                font-size: px2rem(36);

                em {
                    font-style: normal;
                    font-weight: bold;
                    color: #ff5258;
                }
            }

            &.error {
                position: relative;

                h3 {
                    position: absolute;
                    top: 50%;
                    left: px2rem(30);
                    right: px2rem(30);
                    transform: translate(0, -50%);
                    padding: 0;
                    font-size: px2rem(44);
                    letter-spacing: px2rem(0);
                    line-height: 1.1;
                    font-weight: bold;
                    color: #ffffff;
                }
            }
        }

        .board-btn {
            width: px2rem(554);
            height: px2rem(125);
            background: url(../images/board-btn.html.png) no-repeat center center;
            background-size: contain;
            text-align: left;
            text-indent: -100em;
            overflow: hidden;
            margin-top: px2rem(36);
        }

        .ag-btn {
            width: px2rem(554);
            height: px2rem(122);
            background: url(../images/ag-btn.html.png) no-repeat center center;
            background-size: contain;
            text-align: left;
            text-indent: -100em;
            overflow: hidden;
            margin-top: px2rem(18);
        }
    }
</style>

