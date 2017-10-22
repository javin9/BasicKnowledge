<template>
    <section class="game-board-wrapper" v-show="isShow" transition="fade">
        <div class="game-board">
            <div class="content">
                <div class="scores">
                    <ul v-for="data in boardData">
                        <li v-text="data.RankIndex"></li>
                        <li v-text="data.Count"></li>
                        <li v-text="data.UserName"></li>
                        <li v-text="data.Department"></li>
                        <li><span class="praise" v-bind:data-id="data.Id" v-bind:class="[data.IsPraise ? 'active': '']" v-on:click="doPraise"></span></li>
                    </ul>
                </div>
            </div>
            <btn btn-text="再玩一次" btn-cls="btn" event-name="playAgain"></btn>
        </div>
    </section>
</template>
<script type="text/ecmascript-6">
    import btn from '../components/button.vue';

    export default{
        props:{
            isShow:{
                type:Boolean,
                default:false
            },
            boardData:{
                type: Array,
                default: []
            }
        },
        components:{
            btn
        },
        methods:{
            playAgain(){
                this.$dispatch('playAgain');
            },
            doPraise(event) {
                var elem = $(event.target);
                if (elem.hasClass('active')) {
                    elem.addClass('jump');
                    setTimeout(() => { elem.removeClass('jump')}, 180);
                } else {
                    $.ajax({
                        url: SaveActivityPraiseURL,
                        type: 'post',
                        data: {
                            LoanOrder_RewardID: elem.attr('data-id'),
                            IsPraise: true
                        },
                        dataType: 'json',
                        success: (res) => {
                            if (res.Result) {
                                elem.addClass('active');
                            }
                        }
                    });
                }
            }
        },
        watch: {
            isShow(value) {
                if (value) {
                    $('.content-wrapper').addClass('no-title');
                } else {
                    $('.content-wrapper').removeClass('no-title');
                }
            }
        }
    };
</script>
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .game-board-wrapper {
        position: absolute;;
        width:px2rem(750);
        left:50%;
        top: 0;
        height: 100%;
        z-index: 100;
        -webkit-transform:translate3d(-50%,0,0);
        transform:translate3d(-50%,0,0);
        background: linear-gradient(to top, rgba(193,252,253,1) 0%, rgba(193,252,253,1) 20%, rgba(193,252,253,0) 50%);
    }
    .game-board {
        z-index:101;
        position:absolute;
        left: 50%;
        top: 50%;
        -webkit-transform:translate3d(-50%,-46%,0);
        transform:translate3d(-50%,-46%,0);

        .content{
            box-sizing: border-box;
            width: px2rem(692);
            height: px2rem(750);
            background: url(../images/016.png) no-repeat center top;
            background-size: 100% auto;
            padding-top: px2rem(192);

            .scores {
                width: px2rem(550);
                padding: 0 px2rem(30);
                margin: 0 auto;
                overflow: auto;
                -webkit-overflow-scrolling: touch;
                height: px2rem(500);

                ul {
                    transition: none;
                    @include fsize(28);
                    line-height: px2rem(98);
                    color: #1a1a1a;
                    text-align: center;
                    height: px2rem(98);
                    overflow: hidden;
                    border-bottom: 1px solid #a3d6ae;

                    li {
                        float: left;
                        height: px2rem(98);
                        overflow: hidden;

                        &:nth-child(1) {
                            width: 11%;
                        }
                        &:nth-child(2) {
                            width: 12%;
                            margin-left: 4.8%;
                        }
                        &:nth-child(3) {
                            width: 24%;
                        }
                        &:nth-child(4) {
                            width: 36%;
                            margin-left: 2%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        &:nth-child(5) {
                            width: 10%;
                        }
                    }

                    .praise {
                        display: block;
                        width: 100%;
                        height: px2rem(98);
                        background: url(../images/praise.png) no-repeat 80% px2rem(2);
                        background-size: px2rem(33) auto;
                        transition: transform 0.15s ease;

                        &.active {
                            background-position: 80% px2rem(-99);
                        }

                        &.jump {
                            transform: translate3d(0, -4%, 0);
                        }
                    }

                    &:nth-child(1),
                    &:nth-child(2),
                    &:nth-child(3) {
                        li:nth-child(1) {
                            text-align: left;
                            text-indent: -100em;
                        }
                    }
                    &:nth-child(1) {
                        li:nth-child(1) {
                            background: url(../images/no1.png) no-repeat center center / px2rem(48) auto;
                        }
                    }
                    &:nth-child(2) {
                        li:nth-child(1) {
                            background: url(../images/no2.png) no-repeat center center / px2rem(48) auto;
                        }
                    }
                    &:nth-child(3) {
                        li:nth-child(1) {
                            background: url(../images/no3.png) no-repeat center center / px2rem(48) auto;
                        }
                    }

                    &:nth-last-child(1) {
                        border-bottom: 0;
                    }
                }
            }
        }

        .btn {
            margin-top: px2rem(20);
            /* margin-bottom: px2rem(25); */
        }
    }
</style>