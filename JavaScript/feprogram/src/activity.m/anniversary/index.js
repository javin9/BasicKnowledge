import './index.scss';
import Vue from 'vue';
import VueResource from 'vue-resource';
import loadView from './views/load.vue';
import startView from './views/start.vue';
import carView from './views/car.vue';
import gameView from './views/game.vue';
import resultView from './views/result.vue';
import boardView from './views/board.vue';
import wxBridge from 'wx-bridge'    // 微信分享


const IMAGE_BASE = BASE_URL + 'activity.m/anniversary/images/',
        SOUND_BASE = BASE_URL + 'activity.m/anniversary/sounds/';
const TEXT = {
    a: '游戏初始化失败，请重新尝试！',
    b: '游戏结果获取中…',
    c: '游戏超时，再玩一次吧！'
};
let music = {};

Vue.use(VueResource);
new Vue({
    el: '#app',
    props: {},
    data(){
        return {
            orientation: '',
            loadShow: true,
            startShow: false,
            carShow: false,
            gameShow: false,
            resultShow: false,
            boardShow: false,
            gameTime: 45, // 游戏时间，单位s
            sound: true,
            SOUND_BASE: SOUND_BASE,
            documentHidden: false,
            cars: [
                {
                    name: 'maserati',
                    image: `${IMAGE_BASE}carimage.maserati.html.png`,
                    appearance: 87,
                    boost: 95,
                    control: 90
                },
                {
                    name: 'audi',
                    image: `${IMAGE_BASE}carimage.audi.html.png`,
                    appearance: 85,
                    boost: 89,
                    control: 88
                },
                {
                    name: 'bmw',
                    image: `${IMAGE_BASE}carimage.bmw.html.png`,
                    appearance: 89,
                    boost: 92,
                    control: 93
                },
                {
                    name: 'polo',
                    image: `${IMAGE_BASE}carimage.polo.html.png`,
                    appearance: 80,
                    boost: 85,
                    control: 85
                },
                {
                    name: 'datong',
                    image: `${IMAGE_BASE}carimage.datong.html.png`,
                    appearance: 78,
                    boost: 80,
                    control: 83
                }
            ],
            car: null,
            loader: null,
            loadedProcess: 0,
            staffId: '',
            gameData: [], // todo check，这个没用了
            resultData: null,
            boardData: null,
            /* gameData: [{"name":"1","list":['a', 'b', 'c','a', 'b', 'c','a', 'b', 'c','a', 'b', 'c','a', 'b', 'c']},
             {"name":"2","list":['a', 'b', 'c','a', 'b', 'c','a', 'b', 'c','a', 'b', 'c','a', 'b', 'c']}], // 游戏数据，开始游戏时候获取
             resultData: {"count":"100","perinfo":"20%","rankinginfo":"10"},
             boardData: [{"RankIndex":"1","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"1","IsPraise":true},
             {"RankIndex":"2","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"3","IsPraise":false},
             {"RankIndex":"3","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"12","IsPraise":false},
             {"RankIndex":"4","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"15","IsPraise":false},
             {"RankIndex":"5","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false},
             {"RankIndex":"6","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"12","IsPraise":false},
             {"RankIndex":"7","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"15","IsPraise":false},
             {"RankIndex":"8","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false},
             {"RankIndex":"9","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false},
             {"RankIndex":"10","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false},
             {"RankIndex":"11","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false},
             {"RankIndex":"12","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false},
             {"RankIndex":"13","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false},
             {"RankIndex":"14","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false},
             {"RankIndex":"15","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false}],*/
            activityOver: window.IsGameOver,
            superCar: false
        }
    },
    components: {
        loadView,
        startView,
        carView,
        gameView,
        resultView,
        boardView
    },
    template: `<div class="content-wrapper">
                    <load-view :is-show="loadShow" :process="loadedProcess"></load-view>
                    <start-view :is-show="startShow"></start-view>
                    <car-view :is-show="carShow" :cars="cars" :loader="loader" :sound="sound" :orientation="orientation"></car-view>
                    <game-view :is-show="gameShow" :game-time="gameTime" :game-data="gameData" :staff-id="staffId" :car="car" :loader="loader" :sound="sound" :document-hidden="documentHidden" :super-car="superCar"></game-view>
                    <result-view :is-show="resultShow" :result-data="resultData"></result-view>
                    <board-view :is-show="boardShow" :board-data="boardData" :staff-id="staffId"></board-view>

                    <audio loop id="selectMusic">
                        <source :src="SOUND_BASE + 'select.mp3'" type="audio/mpeg">
                    </audio>
                    <audio loop id="gameMusic">
                        <source :src="SOUND_BASE + 'game.mp3'" type="audio/mpeg">
                    </audio>
                </div>
                <div class="landscape-layer">
                    <div class="text">请用竖屏进行游戏</div>
                </div>`,
    methods:{
        loading() {
            // createjs
            let manifest = [
                // loading
                {src: "logo-ki.html.png"},
                {src: "loading-bar.html.png"},
                {src: "loading-car.html.png"},
                {src: "loading-bg.html.jpg"},

                // other
                {src: "bg.html.jpg"},
                {src: "car-attr.html.png"},
                {src: "car-attr-bg.html.png"},
                {src: "car-bg.html.jpg"},
                {src: "carimage.maserati.html.png"},
                {src: "carimage.audi.html.png"},
                {src: "carimage.bmw.html.png"},
                {src: "carimage.polo.html.png"},
                {src: "carimage.datong.html.png"},
                {src: "close-btn.html.png"},
                {src: "job-num.html.png"},
                {src: "logo.html.png"},
                {src: "meteor.html.png"},
                {src: "ok-btn.html.png"},
                {src: "rule-bg.html.png"},
                {src: "rule-btn.html.png"},
                {src: "start-btn.html.png"},
                {src: "start-label.html.png"},
                {src: "title.html.png"},
                {src: "result-bg.html.png"},
                {src: "board-btn.html.png"},
                {src: "ag-btn.html.png"},
                {src: "board-bg.html.png"},
                {src: "no1.html.png"},
                {src: "no2.html.png"},
                {src: "no3.html.png"},
                {src: "praise.html.png"},
                {src: "sound-on.html.png"},
                {src: "sound-off.html.png"},
                {src: "taoche.html.png"},
                {src: "wxshare.html.jpg"},

                // game
                {src: "road.html.jpg", id: "road"},
                {src: "car.maserati.html.png", id: "maserati"},
                {src: "car.audi.html.png", id: "audi"},
                {src: "car.bmw.html.png", id: "bmw"},
                {src: "car.polo.html.png", id: "polo"},
                {src: "car.datong.html.png", id: "datong"},
                {src: "left-btn.html.png", id: "leftBtn"},
                {src: "right-btn.html.png", id: "rightBtn"},
                {src: "barricade.html.png", id: "barricade"},
                {src: "coin.html.png", id: "coin"},
                {src: "fuel.html.png", id: "fuel"},
                {src: "counter-circle.html.png", id: "counterCircle"},
                {src: "counter-1.html.png", id: "counter1"},
                {src: "counter-2.html.png", id: "counter2"},
                {src: "counter-3.html.png", id: "counter3"},
                {src: "timer-bg.html.png", id: "timerBg"},
                {src: "timer-bar.html.png", id: "timerBar"},
                {src: "timer-inner.html.png", id: "timerInner"}
            ];

            this.loader = new createjs.LoadQueue(false);
            this.loader.addEventListener("progress", (event) => {
                this.loadedProcess = event.progress;
            });
            this.loader.addEventListener("complete", () => {
                // 等进度条动画完成
                setTimeout(() => {
                    this.loadShow = false;
                    this.startShow = true;
                }, 300);
            });
            this.loader.loadManifest(manifest, true, IMAGE_BASE);

            // sound
            music.select = document.getElementById('selectMusic');
            music.game = document.getElementById('gameMusic');
        },
        setRem() {
            !function (N, M) {
                function L() {
                    var a = I.getBoundingClientRect().width;
                    a / F > 540 && (a = 540 * F);
                    var d = a / 10;
                    I.style.fontSize = d + "px", D.rem = N.rem = d
                }

                var K, J = N.document, I = J.documentElement, H = J.querySelector('meta[name="viewport"]'), G = J.querySelector('meta[name="flexible"]'), F = 0, E = 0, D = M.flexible || (M.flexible = {});
                if (H) {
                    console.warn("将根据已有的meta标签来设置缩放比例");
                    var C = H.getAttribute("content").match(/initial\-scale=([\d\.]+)/);
                    C && (E = parseFloat(C[1]), F = parseInt(1 / E))
                } else {
                    if (G) {
                        var B = G.getAttribute("content");
                        if (B) {
                            var A = B.match(/initial\-dpr=([\d\.]+)/), z = B.match(/maximum\-dpr=([\d\.]+)/);
                            A && (F = parseFloat(A[1]), E = parseFloat((1 / F).toFixed(2))), z && (F = parseFloat(z[1]), E = parseFloat((1 / F).toFixed(2)))
                        }
                    }
                }
                if (!F && !E) {
                    var y = N.navigator.userAgent, x = (!!y.match(/android/gi), !!y.match(/iphone/gi)), w = x && !!y.match(/OS 9_3/), v = N.devicePixelRatio;
                    F = x && !w ? v >= 3 && (!F || F >= 3) ? 3 : v >= 2 && (!F || F >= 2) ? 2 : 1 : 1, E = 1 / F
                }


                L();
            }(window, window.lib || (window.lib = {}));
        },
        initalOrientation() {
            window.addEventListener('orientationchange', (event) => {
                this.setRem();
                setOrientation.call(this);
            });
            setOrientation.call(this);

            function setOrientation() {
                if (window.orientation === 180 || window.orientation === 0) {
                    // 竖屏
                    $('body').removeClass('landscape');
                    this.orientation = 'portrait';
                }
                if(window.orientation === 90 || window.orientation === -90) {
                    // 横屏
                    $('body').addClass('landscape');
                    this.orientation = 'landscape';
                }
            }
        }
    },
    events:{
        // 登陆完毕，加载选车
        loadCarSelect(staffId) {
            this.staffId = staffId;
            this.startShow = false;
            this.carShow = true;
        },
        // 选车完毕，加载游戏
        gameStart(car) {
            music.game.play();
            music.game.pause();

            $.ajax({
                url: InitActiveInfoURL,
                type: 'get',
                data: {
                    employeeNumber: this.staffId
                },
                dataType: 'json',
                success: (res) => {
                    // 进入游戏
                    this.car = car;
                    this.carShow = false;
                    this.gameShow = true;
                },
                error: () => {
                    tools.showAlert(TEXT.a, 2000);
                }
            });
        },
        // 游戏结束
        gameOver(score) {
            music.game.pause();

            this.resultData = TEXT.b;
            this.resultShow = true;

            // 存储游戏结果
            $.ajax({
                url: SaveActivityRewardURL,
                type: 'post',
                data: {
                    score: score
                },
                dataType: 'json',
                success: (res) => {
                    if (res.Result) {
                        this.resultData = JSON.parse(res.Data);
                    } else {
                        this.resultData = res.Message || TEXT.c;
                    }
                }
            });
        },
        // 查看排名
        checkBoard() {
            this.resultShow = false;
            this.boardShow = true;

            $.ajax({
                url: GetActivitycodeRankingURL,
                type: 'get',
                data: {
                    employeeNumber: this.staffId
                },
                dataType: 'json',
                success: (res) => {
                    if (res.Result) {
                        this.boardData = res.Data;
                    }
                }
            });
        },
        // 重新游戏
        playAgain() {
            this.gameShow = false;
            this.boardShow = false;
            this.resultShow = false;
            this.carShow = true;
        },

        soundOn() {
            this.sound = true;
        },

        soundOff() {
            this.sound = false;
        },

        superCar() {
            this.superCar = true;
        }
    },
    ready() {
        $(window).bind('touchmove', function (e) {
            e.preventDefault();
        });

        if (this.activityOver === 'True') {
            setTimeout(() => {
                tools.showAlert('活动已结束', 99999);
            }, 250)
        }

        this.loading();

        // 横竖屏
        this.initalOrientation();

        // 声音在微信进入后台后不播放
        let soundCache = this.sound;
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                soundCache = this.sound;
                this.sound = false;
                this.documentHidden = true;
            } else {
                this.sound = soundCache;
                this.documentHidden = false;
            }
        },false);

        // 微信分享
        wxBridge(Object.assign({}, window.__WX_AUTH__ || {}, {
            debug: false,
            title: '易鑫3周年-极速鑫车游戏',
            desc: '易鑫集团3周年司庆活动，极速鑫车带你重温儿时赛车梦想。',
            imgUrl: `${IMAGE_BASE}wxshare.html.jpg`,
            shareUrl: window.location.href
        }));
    },
    watch: {
        sound(value) {
            if (value) {
                if (this.carShow) {
                    music.select.play();
                } else if (this.gameShow) {
                    music.game.play();
                }
            } else {
                music.select.pause();
                music.game.pause();
            }
        },
        carShow(value) {
            if (value) {
                if (this.sound) {
                    music.select.play();
                }
            } else {
                music.select.pause();
                music.select.currentTime = 0;
            }
        },
        gameShow(value) {
            if (value) {
                if (this.sound) {
                    music.game.play();
                }
            } else {
                music.game.pause();
                music.game.currentTime = 0;
            }
        }
    }
});