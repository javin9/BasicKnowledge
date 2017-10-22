<template>
    <section class="start-wrapper" v-show="isShow" transition="fade">
        <div class="form-wrapper">
            <label>请输入工号</label>
            <div class="job-num-wrapper" v-bind:class="{'staff-show': staffNameShow}" v-on:click="focusStaffId">
                <div><input type="tel"  maxlength="5" placeholder="" name="staffId" id="staffId" v-model="staffId" v-on:input="getStaffName" /></div>
                <div v-if="staffNameShow">{{staffName}}</div>
            </div>
            <btn :btn-text="btnText" :btn-cls="btnCls" event-name="start"></btn>
            <div class="rule-btn" @click="openGameRule">游戏规则 ></div>
        </div>
        <game-rule :is-show="gameRuleShow"></game-rule>
    </section>
</template>

<script type="text/ecmascript-6">
    import btn from '../components/button.vue';
    import gameRule from '../components/gameRule.vue';
    function touchmoveHandler(e){
        e.preventDefault();
    }
    export default{
        props:{
            isShow:{
                type: Boolean,
                default: false
            },
            eventName:{
                type:String
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
                document.addEventListener("touchmove",touchmoveHandler)
                this.gameRuleShow = true;
            },
            getStaffName(event) {
                if (this.staffId.length === 5) {
                    $.ajax({
                        url: GetUserInfoURL,
                        type: 'get',
                        data: {employeeNumber: this.staffId},
                        dataType: 'json',
                        success: (res) => {
                            if (res.Result) {
                                this.staffName = res.Data.UserName;
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
                document.removeEventListener("touchmove",touchmoveHandler);
                this.gameRuleShow = false;
            },
            start() {
                if (this.staffName && this.staffName !== '易鑫员工') {
                    this.$dispatch(this.eventName, this.staffId);
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

        .form-wrapper {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 100%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            z-index:99;
            text-align:center;

            label {
                display: block;
                @include fsize(30);
                line-height: 1;
                margin-bottom: px2rem(20);
            }
        }
    }

    .job-num-wrapper{
        display:flex;
        width:px2rem(480);
        border-radius: px2rem(98);
        height:px2rem(98);
        line-height:px2rem(98);
        /* border:1px solid #218d49; */
        box-shadow: inset 0 0 0 1px #218d49;
        margin:0 auto px2rem(30) auto;
        @include fsize(32);
        box-sizing: border-box;
        background: #ffffff;
        color:#7f7f7f;

        div{
            position: relative;
            flex:1;
            width:50%;
            box-sizing: border-box;
            padding: 0 px2rem(8);
            text-align: left;

            input{
                @include fsize(32);
                font-family: inherit;
                width: 100%;
                padding: 0;
                height: 1.2em;
                line-height: 1.2em;
                border:none;
                background: transparent;
                color:#7f7f7f;
                text-align: center;

                &::placeholder{
                    color:#a3a3a3;
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
        text-align:center;
        display:inline-block;
        color:#1a1a1a;
        @include fsize(30);
        line-height: 1;
        margin:px2rem(30) auto 0 auto;
    }
</style>
