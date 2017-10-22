<template>
    <section class="game-board-wrapper" v-show="isShow" transition="fade">
        <div class="mask"></div>
        <div class="logo"></div>
        <div class="game-board">
            <div class="content">
                <ul class="table-title">
                    <li>名次</li>
                    <li>分数</li>
                    <li>车手</li>
                    <li>部门</li>
                </ul>
                <div class="scores" :class="{ 'loading': !this.boardData }" id="scores">
                    <div class="scroller">
                        <ul v-for="data in boardData">
                            <li v-text="data.RankIndex"></li>
                            <li v-text="data.Count"></li>
                            <li v-text="data.UserName"></li>
                            <li v-text="data.Department"></li>
                            <li><span class="praise" v-bind:data-id="data.Id" v-bind:class="[data.IsPraise ? 'active': '']" v-on:click="doPraise"></span></li>
                        </ul>
                    </div>
                </div>
            </div>
            <btn btn-text="再玩一次" btn-cls="btn ag-btn" event-name="playAgain"></btn>
        </div>
    </section>
</template>
<script type="text/ecmascript-6">
    import btn from '../components/button.vue';
    import iScroll from 'iscroll';

    export default{
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            boardData: {
                type: Array,
                default: null
            },
            staffId: {
                type: String,
                default: ''
            }
        },
        computed: {
        },
        components: {
            btn
        },
        methods: {
            playAgain(){
                this.$dispatch('playAgain');
            },
            doPraise(event) {
                var elem = $(event.target);
                if (elem.hasClass('active')) {
                    elem.addClass('jump');
                    setTimeout(() => {
                        elem.removeClass('jump')
                    }, 180);
                } else {
                    $.ajax({
                        url: SaveActivityPraiseURL,
                        type: 'post',
                        data: {
                            employeeNumber: this.staffId,
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
            boardData() {
                new iScroll("#scores", {
                    click: true
                });
            }
        },
        ready() {

        }
    };
</script>
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .game-board-wrapper {
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
    .game-board {
        z-index:101;
        position:absolute;
        left:50%;
        top:50%;
        transform:translate3d(-50%,-50%,0);

        .content{
            position: relative;
            box-sizing: border-box;
            width: px2rem(610);
            height: px2rem(876);
            padding-top: px2rem(94);
            margin: 0 auto;
            background: url(../images/board-bg.html.png) no-repeat center top;
            background-size: 100% auto;

            ul {
                transition: none;
                transform: none;
            }

            .scores {
                width: px2rem(510);
                padding: 0 px2rem(30);
                margin: 0 auto;
                overflow: auto;
                -webkit-overflow-scrolling: touch;
                height: px2rem(660);

                &.loading {
                    position: relative;

                    &:after {
                        content: '数据加载中…';
                        position: absolute;
                        left: 50%;
                        top: 45%;
                        font-size: px2rem(30);
                        line-height: 1.5;
                        text-align: center;
                        transform: translate(-50%, -50%);
                        color: #ffffff;
                    }
                }

                ul {
                    box-sizing: border-box;
                    font-size: px2rem(24);
                    line-height: px2rem(60);
                    color: #ffffff;
                    text-align: center;
                    height: px2rem(60);
                    overflow: hidden;
                    border-bottom: 1px solid #3687d4;

                    li {
                        float: left;
                        height: px2rem(60);
                        overflow: hidden;

                        &:nth-child(1) {
                            width: 11%;
                        }
                        &:nth-child(2) {
                            width: 12%;
                            margin-left: 4.8%;
                        }
                        &:nth-child(3) {
                            width: 22%;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        &:nth-child(4) {
                            width: 38%;
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
                        height: px2rem(60);
                        background: url(../images/praise.html.png) no-repeat 80% px2rem(-17);
                        background-size: px2rem(33) auto;
                        transition: transform 0.15s ease;

                        &.active {
                            background-position: 80% px2rem(-118);
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
                            background: url(../images/no1.html.png) no-repeat center center / px2rem(24) auto;
                        }
                    }
                    &:nth-child(2) {
                        li:nth-child(1) {
                            background: url(../images/no2.html.png) no-repeat center center / px2rem(24) auto;
                        }
                    }
                    &:nth-child(3) {
                        li:nth-child(1) {
                            background: url(../images/no3.html.png) no-repeat center center / px2rem(24) auto;
                        }
                    }
                }
            }

            ul.table-title {
                width: px2rem(510);
                margin: 0 auto;
                font-size: px2rem(30);
                line-height: px2rem(66);
                color: #ffffff;
                text-align: center;
                height: px2rem(66);
                overflow: hidden;

                li {
                    float: left;
                    height: px2rem(66);
                    white-space: nowrap;

                    &:nth-child(1) {
                        width: 11%;
                    }
                    &:nth-child(2) {
                        width: 12%;
                        margin-left: 4.8%;
                    }
                    &:nth-child(3) {
                        width: 22%;
                    }
                    &:nth-child(4) {
                        width: 38%;
                    }
                    &:nth-child(5) {
                        width: 10%;
                    }
                }
            }
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