<template>
    <section class="game-wrapper" v-show="isShow" transition="fade">
        <div class="game-canvas" id="game-canvas" v-on:touchstart="playerTap">
            <div v-for="item in items" v-if="item.live" class="icon" v-bind:class="[item.type, 'speed-'+item.speed]" v-bind:style="item.styleObj">
            </div>
        </div>
        <div class="timer">
            <div class="timer-bar">
                <div class="timer-inner" v-bind:style="timerStyleObj">
                    <div class="timer-inner-color"></div>
                    <div class="timer-inner-number" v-text="leftGameTime + 's'"></div>
                </div>
            </div>
        </div>
        <div class="dragonBoat"></div>
        <div class="dragonBoatHead"></div>
    </section>
</template>
<script type="text/ecmascript-6">
    export default{
        props:{
            isShow:{
                type:Boolean,
                default:false
            },
            gameTime:{
                type: Number,
                default: 45
            },
            gameData: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                leftGameTime: 0,
                creatInterval: 420, // 创建元素的间隔，单位毫秒
                timerStyleObj: {},
                docHeight: 0,
                itemObjs: [],
                items: [],
                iconType: ['fish', 'crab', 'dumpling', 'coin'],
                iconPos: [
                    ['0%', '40%', '80%'],
                    ['10%', '50%', '90%'],
                    ['20%', '60%', '100%']
                ],
                getCoins: 0,
                getDumplings: 0,
            }
        },
        computed: {
            barTransition: function() {
                return `all ${this.gameTime}s linear`;
            }
        },
        methods:{
            gameStart() {
                this.counterStart();
                this.initItems();
                this.getCoins = 0;
                this.getDumplings = 0;

                $(window).bind('touchmove', function(e) {
                    e.preventDefault();
                });
            },
            // 游戏倒计时
            counterStart() {
                this.leftGameTime = this.gameTime;
                this.timerStyleObj = {};
                setTimeout(() => {
                    this.timerStyleObj = {
                        width: '0%',
                        transition: this.barTransition
                    };

                    var countdown = setInterval(() => {
                        this.leftGameTime--;
                        if (!this.leftGameTime) {
                            clearInterval(countdown);

                            $(window).unbind('touchmove');

                            this.$dispatch('gameOver', this.getCoins, this.getDumplings);
                        }
                    },1000);
                }, 50);
            },
            // 初始化游戏元素
            initItems() {
                this.docHeight = $('#game-canvas').height();
                var itemlength = (this.gameTime - 3) * 1000 / this.creatInterval;
                for (var i = 0; i < itemlength; i++) {
                    var pos = this.iconPos[Math.floor(Math.random()*3)];
                    this.itemObjs.push({type: this.iconType[Math.floor(Math.random()*2)], speed: Math.ceil(Math.random()*2), live: true, styleObj: { left: pos[0] }});
                    this.itemObjs.push({type: this.iconType[Math.floor(Math.random()*2)], speed: Math.ceil(Math.random()*2), live: true, styleObj: { left: pos[1] }});
                    this.itemObjs.push({type: this.iconType[Math.floor(Math.random()*2)], speed: Math.ceil(Math.random()*2), live: true, styleObj: { left: pos[2] }});
                }
                var itemlength = this.itemObjs.length;

                var pointItemPos = [],
                    randomNum;
                for (var i = 0, max = Math.min(this.gameData[0].list.length + this.gameData[1].list.length, Math.round(itemlength * 0.8)); i < max; i++) {
                    randomNum = Math.floor(Math.random()*itemlength);
                    if (pointItemPos.indexOf(randomNum) < 0) {
                        pointItemPos.push(randomNum);
                        if (i < this.gameData[0].list.length) {
                            this.itemObjs[randomNum].type = this.iconType[3];    // 金币
                        } else {
                            this.itemObjs[randomNum].type = this.iconType[2];    // 粽子
                        }
                    } else {
                        i--;
                    }
                }

                var gameFactory = setInterval(() => {
                    if (this.itemObjs.length) {
                        this.creatElem(this.itemObjs.pop());
                        this.creatElem(this.itemObjs.pop());
                        this.creatElem(this.itemObjs.pop());
                    } else {
                        clearInterval(gameFactory);
                    }
                }, this.creatInterval);
            },
            // 游戏创建元素
            creatElem(item) {
                this.items.push(item);
                setTimeout(() => {
                    item.styleObj = {
                        left: item.styleObj.left,
                        transform: `translate3d(-50%, -${this.docHeight}px, 0)`
                    }
                }, 100);
                setTimeout(() => {
                    item.live = false;
                }, 4100);
            },
            // 游戏交互
            playerTap(event) {
                var item = $(event.target);
                item.addClass('taped');
                if (item.hasClass(this.iconType[3])) {
                    this.getCoins++;
                }
                if (item.hasClass(this.iconType[2])) {
                    this.getDumplings++;
                }
            }
        },
        watch: {
            isShow(value) {
                if (value) {
                    setTimeout(() => {
                        this.gameStart();
                    });
                }
            }
        }
    };


</script>
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    .game-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        width: 100%;
        height: 100%;
        background: url("../images/bg.jpg") no-repeat center bottom / 100% auto, white;
        overflow: hidden;
    }

    .dragonBoat {
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        height: px2rem(300);
        background: url("../images/dragon_boat.png") no-repeat left bottom / px2rem(750) auto;
    }
    .dragonBoatHead {
        position: absolute;
        left: 0;
        bottom: px2rem(300);
        width: px2rem(270);
        height: px2rem(134);
        background: url("../images/dragon_boat.png") no-repeat left top / px2rem(750) auto;
    }

    .timer {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 22%;
        background: linear-gradient(to bottom, rgba(193,252,253,1) 0%, rgba(193,252,253,1) 75%, rgba(193,252,253,0) 100%);

        .timer-bar {
            position: absolute;
            left: 50%;
            top: px2rem(50);
            width: px2rem(560);
            height: px2rem(40);
            -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0);
            -webkit-border-radius: px2rem(40);
            border-radius: px2rem(40);
            background: #8de0db;

            .timer-inner {
                position: relative;
                width: 100%;
                height: px2rem(40);

                .timer-inner-color {
                    position: relative;
                    width: 100%;
                    height: px2rem(40);
                    overflow: hidden;

                    &:after {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: px2rem(560);
                        height: px2rem(40);
                        -webkit-border-radius: px2rem(40);
                        border-radius: px2rem(40);
                        overflow: hidden;
                        background: linear-gradient(to right, #ff4f2b 0%, #ff7200 100%);
                    }
                }

                .timer-inner-number {
                    position: absolute;
                    right: 0;
                    top: px2rem(40);
                    @include fsize(28);
                    line-height: px2rem(72);
                    color: #1a1a1a;
                    -webkit-transform: translate(50%, 0);
                    transform: translate(50%, 0);
                }
            }
        }
    }

    .dragonBoat,
    .dragonBoatHead,
    .timer {
        z-index: 10;
    }

    .game-canvas {
        position: absolute;
        left: 15%;
        top: 0;
        bottom: 0;
        width: 70%;

        .icon {
            position: absolute;
            left: 50%;
            top: 100%;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100% 100%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);

            &.coin {
                width: px2rem(150);
                height: px2rem(150);
                background-image: url(../images/010.png);
                background-size: px2rem(79) px2rem(78);
                z-index: 2;
            }
            &.dumpling {
                width: px2rem(150);
                height: px2rem(150);
                background-image: url(../images/011.png);
                background-size: px2rem(92) px2rem(101);
                z-index: 2;
            }
            &.fish {
                width: px2rem(106);
                height: px2rem(77);
                background-image: url(../images/009.png);
            }
            &.crab {
                width: px2rem(138);
                height: px2rem(95);
                background-image: url(../images/012.png);
            }

            &.speed-1 {
                transition: transform 3.5s linear, opacity 0.5s ease;
            }
            &.speed-2 {
                transition: transform 3.5s ease, opacity 0.5s ease;
            }

            &.taped {
                opacity: 0;

                &.coin {
                    &:after {
                        content: '+5';
                        position: absolute;
                        top: 5%;
                        right: 5%;
                        font-weight: bold;
                        @include fsize(34);
                        color: #f15822;
                    }
                }

                &.dumpling {
                    &:after {
                        content: '+2';
                        position: absolute;
                        top: 5%;
                        right: 5%;
                        font-weight: bold;
                        @include fsize(34);
                        color: #f15822;
                    }
                }
            }
        }
    }
</style>