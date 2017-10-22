import './index.scss';
import Vue from 'vue';
import VueResource from 'vue-resource';
import startView from './views/start.vue';
import counterView from './views/counter.vue';
import gameView from './views/game.vue';
import resultView from './views/result.vue';
import boardView from './views/board.vue';


Vue.use(VueResource);
new Vue({
    el: '#app',
    props: {},
    data(){
        return {
            startShow: true,
            countShow: false,
            gameShow: false,
            resultShow: false,
            boardShow: false,
            counter: 5,  // 倒计时，单位s
            gameTime: 45, // 游戏时间，单位s
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
                {"RankIndex":"8","UserName":"测试","Count":"100","Department":"易鑫车贷_互联网产品中心_研发部_业务研发一组","Id":"17","IsPraise":false}],*/
            staffId: '',
            gameData: null,
            resultData: null,
            boardData: null,
            activityOver: window.IsGameOver
        }
    },
    template: `<div class="content-wrapper">
                    <start-view event-name="startGame" v-bind:is-show="startShow"></start-view>
                    <counter-view v-bind:counter="counter" v-bind:is-show="countShow"></counter-view>
                    <game-view v-bind:game-time="gameTime" v-bind:game-data="gameData" v-bind:is-show="gameShow"></game-view>
                    <result-view v-bind:result-data="resultData" v-bind:is-show="resultShow"></result-view>
                    <board-view v-bind:board-data="boardData" v-bind:is-show="boardShow"></board-view>
                </div>`,
    components: {
        startView,
        counterView,
        gameView,
        resultView,
        boardView
    },
    methods:{
        // 获取游戏数据（粽子和金币）
        getGameData() {
            $.ajax({
                url: InitActiveInfoURL,
                type: 'get',
                data: {employeeNumber: this.staffId},
                dataType: 'json',
                success: (res) => {
                    if (res.Result) {
                        this.gameData = res.Data;
                    }
                }
            });
        },
        // 游戏倒计时
        countDown() {
            this.startShow = false;
            this.countShow = true;
        },
        // 游戏正式开始
        initGame() {
            this.countShow = false;
            this.gameShow = true;
        }
    },
    events:{
        startGame(staffId) {
            // tools.showAlert('开始！！！');
            this.staffId = staffId;
            this.getGameData();
            this.countDown();
        },
        counterEnd() {
            if (this.gameData) {
                this.initGame();
            } else {
                tools.showAlert('游戏初始化失败，请重新尝试！', 2000);
                setTimeout(() => {
                    this.startShow = true;
                    this.countShow = false;
                }, 2000);
            }
        },
        // 游戏结束
        gameOver(getCoins, getDumplings) {
            $.ajax({
                url: SaveActivityRewardURL,
                type: 'post',
                data: {
                    employeeNumber: this.staffId,
                    prizeInfo: [{"name":"1","list":this.gameData[0].list.slice(0, getCoins)},
                                {"name":"2","list":this.gameData[1].list.slice(0, getDumplings)}]
                },
                dataType: 'json',
                success: (res) => {
                    if (res.Result) {
                        this.resultData = JSON.parse(res.Data);
                        this.gameShow = false;
                        this.resultShow = true;
                    } else {
                        tools.showAlert(res.Message || '游戏超时，再玩一次吧！');
                        this.gameShow = false;
                        this.startShow = true;
                    }
                }
            });
        },
        // 关闭结果
        closeResult() {
            this.resultShow = false;
            this.startShow = true;
        },
        // 查看排名
        checkBoard() {
            $.ajax({
                url: GetActivitycodeRankingURL,
                type: 'get',
                data: {},
                dataType: 'json',
                success: (res) => {
                    if (res.Result) {
                        this.boardData = res.Data;
                        this.resultShow = false;
                        this.boardShow = true;
                    }
                }
            });
        },
        // 重新游戏
        playAgain() {
            this.boardShow = false;
            this.startShow = true;
        }
    },
    ready() {
        if (this.activityOver === 'True') {
            setTimeout(() => {
                tools.showAlert('活动已结束', 99999);
            }, 250)
        }
    }
});