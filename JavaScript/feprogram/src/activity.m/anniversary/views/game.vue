<template>
    <section class="game-wrapper" v-show="isShow" transition="fade">
        <canvas class="game-canvas" id="game-canvas"></canvas>
        <div class="sound-btn" :class="{ 'sound-off': !sound }" @click="toggleSound"></div>
    </section>
</template>
<script type="text/ecmascript-6">
    import aes from "libs/aes"; 	// 加密

    let stage, w, h, road, car, itemsContainer, fpsLabel, timeLabel;
    let leftButtonReal, rightButtonReal, soundBtnReal;
    let timerInnerImg, timerInner;
    let counterContainer, counterNumber, countdownInterval;
    let scale;  // 屏幕适配比例: 浏览器宽度 / 设计图宽度
    let boostTimer;
    let itemBitmaps = {};
    let items = [];

    const ACCELERATION = 16,       // 加速度
            H_SPEED = 60,
            LANE = [233, 375, 517],
            GRID_Y = 130,       // y轴格子
            GRID_BEGIN = 1300   // 格子起始高度

    export default{
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            gameTime: {
                type: Number,
                default: 45
            },
            gameData: {
                type: Array,
                default: []
            },
            car: {
                type: Object,
                default: null
            },
            loader: {
                type: Object,
                default: null
            },
            sound:{
                type:Boolean,
                default:true
            },
            documentHidden:{
                type:Boolean,
                default:false
            },
            staffId: {
                type:String,
                default:''
            },
            superCar:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                introTime: 3,
                leftGameTime: 0,
                getCoins: 0,
                acceleration: ACCELERATION,
                distance: 0, // 行程
                itemProbability: {
                    barricade: 0.09,
                    coin: 0.4
                },
                gameOvered: false // 用于在倒计时阶段，出现退出微信电话等状况，游戏提前结束
            }
        },
        computed: {
            speed() {
                return this.acceleration * 50;
            },
            maxSpeed() {
                return Math.round(this.acceleration * (50 + 20 * (this.car.boost - 40) / 60));
            },
            hspeed() {
                return Math.round(H_SPEED * (this.car.control - 40) / 60);
            }
        },
        methods: {
            initGame() {
                this.leftGameTime = this.gameTime;
                this.initItems();
                this.handleComplete();
            },

            initItems() {
                // 创建items
                // 速度*时间
                let max = Math.round(ACCELERATION * 70 * 1.25 * this.gameTime / GRID_Y);    // 1.25是考虑每5s提速1加的系数
                let random;
                items = [];

                for (let i = 0; i < max; i++) {
                    for (let j = 0; j < 3; j++) {
                        random = Math.random();
                        // 每隔100个格子 添加一个油桶
                        if ((3 * i + j) % 60 + items.length % 3 === 10) {
                            items.push({type: 'fuel', x: j, y: i});
                        } else if (random < this.itemProbability.barricade) {
                            if (baricadeAble(j, i)) {
                                items.push({type: 'barricade', x: j, y: i});
                                this.itemProbability.barricade = 0.09;
                            } else {
                                this.itemProbability.barricade += 0.03;
                            }
                        } else if (random < this.itemProbability.barricade + this.itemProbability.coin) {
                            items.push({type: 'coin', x: j, y: i});
                        }
                    }
                }

                // todo 优化算法
                function baricadeAble(x, y) {
                    let baricadesNearby = [];
                    let able = true;
                    for (let i = items.length - 1; i >= 0; i--) {
                        if (items[i].y < y - 6) {
                            break;
                        }
                        if (items[i].type === 'barricade') {
                            baricadesNearby.push(items[i]);
                            if (baricadesNearby.length >= 2) {
                                if (y - baricadesNearby[0].y < 4 && baricadesNearby[0].y - baricadesNearby[1].y < 4) {
                                    able = false;
                                    break;
                                }
                            }
                        }
                    }
                    return able;
                }
            },

            handleComplete() {
                if (!stage) {
                    // 新游戏
                    // createjs
                    stage = new createjs.Stage("game-canvas");

                    // grab canvas width and height for later calculations:
                    w = stage.canvas.width;
                    h = stage.canvas.height;

                    // enable touch interactions if supported on the current device:
                    createjs.Touch.enable(stage);

                    // enable mouse over / out events, required for button rollovers
                    // stage.enableMouseOver(10);

                    let roadImg = this.loader.getResult("road");
                    scale = document.documentElement.clientWidth / w; // 屏幕宽度/canvas宽度（既设计图宽度750）
                    road = new createjs.Shape();
                    road.graphics.beginBitmapFill(roadImg, 'repeat-y').drawRect(0, 0, w, roadImg.height + h);
                    road.tileH = roadImg.height;
                    road.x = 0;
                    road.y = -road.tileH;
                    road.cache(0, 0, w, roadImg.height + h);

                    car = this.createBitmap(this.car.name);
                    car.width = car.image.width;
                    car.height = car.image.height;
                    car.cWidth = 90;
                    car.cHeight = 230;
                    car.acceleration = this.acceleration;
                    car.speed = 0;
                    car.hspeed = 0; // 水平速度（变更车道）
                    car.lane = 1;   // 车道
                    car.x = LANE[car.lane] - car.width / 2;
                    car.y = h + car.height * 0.5;   // 从外面入场

                    // Coins, Fuel & Barricade
                    itemBitmaps.coin = [this.createBitmap('coin')];
                    itemBitmaps.fuel = [this.createBitmap('fuel')];
                    itemBitmaps.barricade = [this.createBitmap('barricade')];

                    itemsContainer = new createjs.Container();
                    itemsContainer.y = -GRID_Y;
                    itemsContainer.cache(0, 0, w, h + GRID_Y);
                    stage.addChild(road, itemsContainer, car);

                    // 添加界面
                    this.addPanel();

                    // 倒计时界面
                    this.addCounterPanel();

                    // 绑定操控
                    this.bindEvents();

                    createjs.Ticker.timingMode = createjs.Ticker.RAF;

                } else {
                    // 重玩一次的情况
                    this.getCoins = 0;
                    this.distance = 0;
                    this.acceleration = ACCELERATION;

                    // 重置路
                    road.y = -road.tileH;

                    // 重置车
                    car.image = this.loader.getResult(this.car.name);
                    car.width = car.image.width;
                    car.height = car.image.height;
                    car.acceleration = this.acceleration;
                    car.speed = 0;
                    car.hspeed = 0; // 水平速度（变更车道）
                    car.lane = 1;   // 车道
                    car.x = LANE[car.lane] - car.width / 2;
                    car.y = h + car.height * 0.5;   // 从外面入场

                    // 清空障碍物
                    while(itemsContainer.numChildren) {
                        this.removeItem(0);
                    }
                    itemsContainer.y = -GRID_Y;
                    itemsContainer.updateCache();

                    // 界面面板
                    timerInner.graphics.clear()
                            .beginBitmapFill(timerInnerImg, 'no-repeat')
                            .drawRect(0, timerInnerImg.height * (1 - (this.leftGameTime / this.gameTime)), timerInnerImg.width, timerInnerImg.height);
                    timeLabel.text = Math.round(this.leftGameTime);
                    timeLabel.x = 110 - timeLabel.getMeasuredWidth();

                }

                if (this.superCar) {
                    car.cWidth = 410;
                    car.cHeight = 230;
                }

                // 倒计时
                this.countDown();
                createjs.Ticker.addEventListener("tick", this.introTick);
            },

            countDown() {
                let introTime = this.introTime;

                let updateCounterNumber = () => {
                    counterNumber.image = this.loader.getResult("counter" + introTime);
                    counterNumber.x = w / 2 - counterNumber.image.width / 2;
                    counterNumber.y = h * 0.4 - counterNumber.image.height / 2;
                    counterContainer.updateCache();
                    stage.update();
                }

                stage.addChild(counterContainer);
                updateCounterNumber();

                countdownInterval = setInterval(() => {
                    introTime--;
                    if (introTime) {
                        updateCounterNumber();
                    } else {
                        stage.removeChild(counterContainer);
                        clearInterval(countdownInterval);
                        this.startGame();
                    }
                }, 1000);
            },

            startGame() {
                if (this.leftGameTime === this.gameTime) {
                    createjs.Ticker.removeEventListener("tick", this.introTick);

                    if (!this.gameOvered) {
                        createjs.Ticker.addEventListener("tick", this.tick);
                    } else {
                        this.gameOver();
                        this.gameOvered = false;
                    }
                }

                if (createjs.Ticker.paused) {
                    createjs.Ticker.paused = false;
                }
            },
            
            pauseGame() {
                createjs.Ticker.paused = true;
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    stage.removeChild(counterContainer);
                }
            },
            
            resumeGame() {
                this.countDown();
            },

            addPanel() {
                let panelContainer = new createjs.Container();

                // "left" button:
                let leftButton = this.createBitmap("leftBtn");
                leftButton.x = 15;
                leftButton.y = h - car.height * 0.75 - leftButton.image.height / 2;
                // 因为canvas的同域安全问题，暂时不用图片做按钮
                leftButtonReal = new createjs.Shape();
                leftButtonReal.graphics.beginFill("rgba(0,0,0,0.01)").drawCircle(15 + leftButton.image.width / 2, h - car.height * 0.75, leftButton.image.width / 2 * 3);
                new createjs.ButtonHelper(leftButtonReal);

                // "right" button:
                let rightButton = this.createBitmap("rightBtn");
                rightButton.x = w - 15 - rightButton.image.width;
                rightButton.y = h - car.height * 0.75 - rightButton.image.height / 2;
                rightButtonReal = new createjs.Shape();
                rightButtonReal.graphics.beginFill("rgba(0,0,0,0.01)").drawCircle(w - 15 - rightButton.image.width / 2, h - car.height * 0.75, rightButton.image.width / 2 * 3);
                new createjs.ButtonHelper(rightButtonReal);

                // 添加游戏计时
                let timerContainer = new createjs.Container();
                timerContainer.x = 26;
                timerContainer.y = 65 - (document.documentElement.clientHeight / scale - h);
                let timerContainerD = timerContainer.clone();

                let timerBg = this.createBitmap("timerBg");
                timerBg.x = 42;
                timerBg.y = 15;

                timeLabel = new createjs.Text(this.leftGameTime, `italic bold 40px Arial`, "#FFF");
                //timeLabel.shadow = new createjs.Shadow("#002777", 2, 2, 1);
                timeLabel.x = 110 - timeLabel.getMeasuredWidth();
                timeLabel.y = 20;

                let sLabel = new createjs.Text("S", `italic 28px Arial`, "#FFF");
                //sLabel.shadow = new createjs.Shadow("#002777", 2, 2, 1);
                sLabel.x = 112;
                sLabel.y = 31;

                let timerBar = this.createBitmap("timerBar");

                timerInnerImg = this.loader.getResult("timerInner");
                timerInner = new createjs.Shape();
                timerInner.graphics
                        .beginBitmapFill(timerInnerImg, 'no-repeat')
                        .drawRect(0, 0, timerInnerImg.width, timerInnerImg.height);
                timerInner.x = 5;
                timerInner.y = 6;

                timerContainer.addChild(timerBg, sLabel, timerBar);
                timerContainerD.addChild(timeLabel, timerInner);

                panelContainer.addChild(timerContainer, leftButton, leftButtonReal, rightButton, rightButtonReal);
                panelContainer.cache(0, 0, w, h);   // 静态不变的元素放一起，cache

                stage.addChild(panelContainer, timerContainerD);

                // add a text object to output the current FPS:
                // fpsLabel = new createjs.Text("-- fps", "bold 30px Arial", "#FFF");
                // fpsLabel.x = 30;
                // fpsLabel.y = 20 - (document.documentElement.clientHeight / scale - h);
                // stage.addChild(fpsLabel);

            },

            addCounterPanel() {
                // 添加入场倒计时相关ui
                counterContainer = new createjs.Container();
                
                // let counterBg = new createjs.Shape();
                // counterBg.graphics.beginFill("rgba(0,0,0,0.3)").drawRect(0, 0, w, h);

                let counterCircle = this.createBitmap("counterCircle");
                counterCircle.x = w / 2 - counterCircle.image.width / 2;
                counterCircle.y = h * 0.4 - counterCircle.image.height / 2;

                counterNumber = this.createBitmap("counter" + this.introTime);
                counterNumber.x = w / 2 - counterNumber.image.width / 2;
                counterNumber.y = h * 0.4 - counterNumber.image.height / 2;

                counterContainer.addChild(counterCircle, counterNumber);
                counterContainer.cache(0, 0, w, h);
                // stage.addChild(counterContainer);
            },

            bindEvents() {
                leftButtonReal.on("click", this.turnLeft);
                rightButtonReal.on("click", this.turnRight);

                // 左右点击
                /* window.addEventListener("keydown", (e) => {
                    if (e.keyCode === 37) {
                        this.turnLeft();
                    } else if (e.keyCode === 39) {
                        this.turnRight();
                    }
                }); */
            },

            createBitmap(id) {
                return new createjs.Bitmap(this.loader.getResult(id));
            },

            // 加速
            boost() {
                if (boostTimer) {
                    clearTimeout(boostTimer);
                } else {
                    car.speed = this.maxSpeed;
                    this.hspeed = Math.round(H_SPEED * (this.car.control - 40) / 60) * 1.5;
                }
                boostTimer = setTimeout(() => {
                    car.speed = this.speed;
                    this.hspeed = Math.round(H_SPEED * (this.car.control - 40) / 60);
                    boostTimer = null;
                }, 5000);
            },

            // 左转
            turnLeft() {
                if (this.leftGameTime === this.gameTime) return;
                if (car.lane > 0 && car.hspeed >= 0) {
                    car.lane--;
                    car.hspeed = -this.hspeed;
                }
            },

            // 右转
            turnRight() {
                if (this.leftGameTime === this.gameTime) return;
                if (car.lane < 2 && car.hspeed <= 0) {
                    car.lane++;
                    car.hspeed = this.hspeed;
                }
            },

            introTick(event) {
                let deltaS = event.delta / 1000;
                let speed = 400;

                car.y -= speed * deltaS;
                if (car.y <= h - car.height * 1.25) {
                    car.y = h - car.height * 1.25;
                }

                // fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";

                stage.update(event);
            },

            tick(event) {
                if (event.paused) return;

                let deltaS = event.delta / 1000;

                // 倒计时
                this.leftGameTime -= deltaS;
                if (this.leftGameTime <= 0) {
                    this.gameOver();
                }

                // 变速
                if (car.acceleration) {
                    car.speed += car.acceleration;
                    if (Math.abs(car.speed - this.speed) < Math.abs(car.acceleration)) {
                        car.acceleration = 0;
                        car.speed = this.speed;
                    } else if (Math.abs(car.speed - this.maxSpeed) < Math.abs(car.acceleration)) {
                        car.acceleration = 0;
                        car.speed = this.maxSpeed;
                    }
                }

                // 变道
                if (car.hspeed) {
                    car.x += car.hspeed;

                    if (car.hspeed < 0 && car.x <= LANE[car.lane] - car.width / 2 ||
                            car.hspeed > 0 && car.x >= LANE[car.lane] - car.width / 2) {
                        car.x = LANE[car.lane] - car.width / 2;
                        car.hspeed = 0;
                    }
                }

                // 道路变化
                road.y = road.y + deltaS * car.speed;
                if (road.y > 0) {
                    road.y = road.y - road.tileH
                }

                // 道路物体变化
                itemsContainer.y = itemsContainer.y + deltaS * car.speed;
                if (itemsContainer.y > 0) {
                    itemsContainer.y = itemsContainer.y - GRID_Y;
                    this.updateItems();
                }

                // 总距离
                this.distance = this.distance + deltaS * car.speed;

                // 碰撞检测
                this.collide();

                // 每过10s，提速1，增加游戏难度
                let newAcc = ACCELERATION + Math.floor((this.gameTime - this.leftGameTime) / 10);
                if (newAcc > this.acceleration) {
                    this.acceleration = newAcc;
                    if (boostTimer) {
                        // car.speed = this.maxSpeed; // 加速中就不提速了，降低难度
                    } else {
                        car.speed = this.speed;
                    }
                }

                // 进度条
                timerInner.graphics.clear()
                        .beginBitmapFill(timerInnerImg, 'no-repeat')
                        .drawRect(0, timerInnerImg.height * (1 - (this.leftGameTime / this.gameTime)), timerInnerImg.width, timerInnerImg.height);
                timeLabel.text = Math.round(this.leftGameTime > 0 ? this.leftGameTime : 0);
                timeLabel.x = 110 - timeLabel.getMeasuredWidth();

                // fpsLabel.text = Math.round(createjs.Ticker.getMeasuredFPS()) + " fps";

                // console.log(car.acceleration)
                // console.log(car.speed)

                stage.update(event);
            },

            updateItems() {
                // 更新位置
                for (let i = 0, max = itemsContainer.numChildren; i < max; i++) {
                    itemsContainer.getChildAt(i).y += GRID_Y;
                }

                // 去掉超出的
                while(itemsContainer.numChildren && itemsContainer.getChildAt(0).y + itemsContainer.y > h) {
                    this.removeItem(0);
                }

                // 添加新的
                while(items.length && items[0].y <= Math.floor(this.distance / GRID_Y) - 1) {
                    if (items[0].y === Math.floor(this.distance / GRID_Y) - 1) {
                        this.addItem(items[0]);
                    }
                    items.shift();
                }

                itemsContainer.updateCache();

                //console.log(itemsContainer.numChildren);
                //console.log(itemBitmaps);
            },

            addItem(data) {
                let item = itemBitmaps[data.type].length > 1 ? itemBitmaps[data.type].pop() : itemBitmaps[data.type][0].clone();

                item.width = item.image.width;
                item.height = item.image.height;
                item.type = data.type;
                item.x = LANE[data.x] - item.width / 2;
                item.y = GRID_Y/2;

                switch (item.type) {
                    case 'barricade':
                        item.cWidth = 104;
                        item.cHeight = 60;
                        break;
                    case 'coin':
                        item.cWidth = 50;
                        item.cHeight = 72;
                        break;
                    case 'fuel':
                        item.cWidth = 90;
                        item.cHeight = 80;
                        break;
                    default:
                        break;
                }

                itemsContainer.addChild(item);
            },

            removeItem(index) {
                // 删除的对象，放到itemBitmaps里缓存，用于下次添加，不需要再克隆对象了
                let item = itemsContainer.getChildAt(index)
                itemBitmaps[item.type].push(item);
                itemsContainer.removeChildAt(index);
            },

            collide() {
                let item, itemCenter,
                    carCenter = {
                        x: car.x + car.width / 2,
                        y: car.y + car.height / 2
                    }
                for (let i = 0, max = itemsContainer.numChildren; i < max; i++) {
                    item = itemsContainer.getChildAt(i);
                    // 只检测可能的碰撞范围
                    if (item.y + item.height + itemsContainer.y >= car.y) {
                        itemCenter = {
                            x: item.x + item.width / 2,
                            y: item.y + item.height / 2 + itemsContainer.y
                        }
                        // 碰撞发生
                        if (Math.abs(carCenter.x - itemCenter.x) < (car.cWidth + item.cWidth) / 2 &&
                            Math.abs(carCenter.y - itemCenter.y) < (car.cHeight + item.cHeight) / 2) {
                            // console.log(item.type);
                            if (item.type === 'barricade') {
                                if (!this.superCar) {
                                    this.gameOver();
                                }
                            } else if (item.type === 'coin') {
                                this.getCoins++;
                                this.removeItem(i);
                                i--;
                                max--;
                            } else if (item.type === 'fuel') {
                                this.boost();
                                this.removeItem(i);
                                i--;
                                max--;
                            }
                        }
                    } else {
                        break;
                    }
                }
            },

            // 游戏结束
            gameOver() {
                createjs.Ticker.removeEventListener("tick", this.tick);

                // 去掉减速防止倒车
                if (boostTimer) {
                    clearTimeout(boostTimer);
                    boostTimer = null;
                }

                let result = aes.encrypt(this.staffId + ',' + this.getCoins * 3);
                tools.setCookie('__ag_cv_', result);
                this.$dispatch('gameOver', result);
            },

            toggleSound() {
                if (this.sound) {
                    this.$dispatch('soundOff');
                } else {
                    this.$dispatch('soundOn');
                }
            }
        },
        watch: {
            isShow(value) {
                if (value) {
                    setTimeout(() => {
                        this.initGame();
                    });
                }
            },
            documentHidden(value) {
                if (!this.isShow) return;
                if (value) {
                    // this.pauseGame();

                    // 游戏开始才能gameover
                    if (this.leftGameTime < this.gameTime) {
                        this.gameOver();
                    } else {
                        this.gameOvered = true;
                    }
                } else {
                    // this.resumeGame();
                }
            }
        },
        ready() {
            $('#game-canvas').attr({
                width: 750,
                height: 1300
            });
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
        background: white;
        overflow: hidden;
    }

    .game-canvas {
        position: absolute;
        left: 50%;
        bottom: 0;
        width: px2rem(750);
        height: px2rem(1300);
        transform: translate3d(-50%, 0, 0);
        background: url(../images/road-nosupport.html.jpg) no-repeat;
    }

    .sound-btn {
        position: absolute;
        top: px2rem(70);
        right: px2rem(30);
        z-index: 200;
        width: px2rem(88);
        height: px2rem(88);
        background: url(../images/sound-on.html.png) no-repeat center center;
        background-size: contain;

        &.sound-off {
            background-image: url(../images/sound-off.html.png);
        }
    }
</style>