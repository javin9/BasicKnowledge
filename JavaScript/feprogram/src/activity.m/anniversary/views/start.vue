<template>
    <section class="start-wrapper" v-show="isShow" transition="fade">
        <div class="logo"></div>
        <div class="title"></div>
        <div class="meteor"></div>
        <div class="form-wrapper">
            <label>请输入工号</label>
            <div class="job-num-wrapper" v-bind:class="{'staff-show': staffNameShow}" v-on:click="focusStaffId">
                <div><input type="tel"  maxlength="5" placeholder="" name="staffId" id="staffId" v-model="staffId" v-on:input="getStaffName" /></div>
                <div v-if="staffNameShow">{{staffName}}</div>
            </div>
            <btn :btn-text="btnText" :btn-cls="btnCls" event-name="start"></btn>
        </div>
        <div class="rule-btn" @click="openGameRule">游戏规则 ></div>
        <game-rule :is-show="gameRuleShow"></game-rule>
    </section>
</template>

<script type="text/ecmascript-6">
    import btn from '../components/button.vue';
    import gameRule from '../components/gameRule.vue';

    export default{
        props:{
            isShow:{
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                staffId:'',// 工号
                staffName:'',// 姓名
                btnText:'开始游戏',
                btnCls:'start-btn',
                gameRuleShow:false
            }
        },
        computed: {
            staffNameShow: function() {
                return (this.staffName !== '');
            }
        },
        components:{
            btn,
            gameRule
        },
        methods:{
            openGameRule(){
                this.gameRuleShow = true;
            },
            getStaffName(event) {
                if (this.staffId.length === 5) {
                    $.ajax({
                        url: GetUserInfoURL,
                        type: 'get',
                        data: {
                            employeeNumber: this.staffId
                        },
                        dataType: 'json',
                        success: (res) => {
                            if (res.Result) {
                                this.staffName = res.Data.UserName.length > 4 ? res.Data.UserName.slice(0, 4) + '…' : res.Data.UserName;
                            } else {
                                this.staffName = '易鑫员工';
                            }
                        },
                        error: (res) => {
                            this.staffName = '易鑫员工';
                        }
                    });
                } else {
                    this.staffName = '';
                }
            },
            focusStaffId() {
                $('#staffId').focus();
            }
        },
        events:{
            closeGameRule(){
                this.gameRuleShow = false;
            },
            start() {
                if (this.staffName && this.staffName !== '易鑫员工') {
                    this.$dispatch('loadCarSelect', this.staffId);
                } else if (!this.staffName) {
                    tools.showAlert('请输入正确格式的员工号');
                    this.focusStaffId();
                } else {
                    tools.showAlert('请输入正确的员工号');
                    this.focusStaffId();
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .start-wrapper{
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: url(../images/bg.html.jpg) no-repeat center bottom;
        background-size: cover;
        overflow: hidden;

        .logo {
            position: absolute;
            top: px2rem(30);
            left: px2rem(30);
            width: px2rem(214);
            height: px2rem(43);
            background: url(../images/logo.html.png) no-repeat center center;
            background-size: cover;
        }

        .title {
            position: absolute;
            top: px2rem(150);
            left: 50%;
            z-index: 10;
            width: px2rem(567);
            height: px2rem(173);
            background: url(../images/title.html.png) no-repeat center center;
            background-size: cover;
            transform: translate(-50%, 0);
        }

        .meteor {
            position: absolute;
            top: px2rem(-30);
            right: 0;
            width: px2rem(270);
            height: px2rem(194);
            background: url(../images/meteor.html.png) no-repeat center center;
            background-size: auto px2rem(194);
            animation-name: meteor;
            animation-duration: 4s;
            animation-iteration-count: infinite;
        }

        @keyframes meteor {
            0%   { transform: translate(80%, -80%); opacity: 3; }
            100% { transform: translate(-200%, 200%); opacity: 0; }
        }


        .form-wrapper {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 100%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            z-index:99;
            text-align:center;
            overflow: hidden;

            label {
                display: block;
                width: px2rem(336);
                height: px2rem(70);
                background: url(../images/start-label.html.png) no-repeat center center;
                background-size: cover;
                margin: 0 auto;
                text-indent: -100em;
                text-align: left;
                overflow: hidden;
            }

            .start-btn {
                width: px2rem(554);
                height: px2rem(130);
                background: url(../images/start-btn.html.png) no-repeat center center;
                background-size: cover;
                text-indent: -100em;
                text-align: left;
                overflow: hidden;
            }
        }
    }

    .job-num-wrapper{
        display:flex;
        position: relative;
        left: 50%;
        width:px2rem(794);
        height:px2rem(130);
        line-height:px2rem(126);
        margin: 0;
        transform: translate(-50%, 0);
        font-size: px2rem(44);
        letter-spacing: px2rem(4);
        box-sizing: border-box;
        background: url(../images/job-num.html.png) no-repeat center center;
        background-size: cover;
        color:#ffffff;
        text-shadow: px2rem(2) px2rem(2) 0 rgba(6,54,172,0.47);
        font-weight: bold;

        div{
            position: relative;
            flex:1;
            width:50%;
            box-sizing: border-box;
            padding: 0 px2rem(15);
            text-align: left;

            input{
                font-size: px2rem(44);
                letter-spacing: px2rem(2);
                font-family: inherit;
                width: 100%;
                padding: 0;
                height: px2rem(50);
                line-height: px2rem(50);
                padding: px2rem(40) 0;
                border:none;
                background: transparent;
                color:#ffffff;
                text-shadow: px2rem(2) px2rem(2) 0 rgba(6,54,172,0.47);
                font-weight: bold;
                text-align: center;

                &::placeholder{
                    color: #ffffff;
                }
            }
        }

        &.staff-show {
            input {
                 text-align: right;
            }
        }
    }
    .rule-btn{
        position: absolute;
        left: 0;
        bottom: 0;
        width: px2rem(220);
        height: px2rem(108);
        background: url(../images/rule-btn.html.png) no-repeat center center;
        background-size: px2rem(159) auto;
        text-indent: -100em;
        overflow: hidden;
    }
</style>
