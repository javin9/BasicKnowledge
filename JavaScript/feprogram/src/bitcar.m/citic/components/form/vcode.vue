<template>
    <dl class="components-vcode">
        <dt>{{title}}</dt>
        <dd>
            <input id="validateCodeInput" type="tel" placeholder="请输入验证码" :class="'text-'+tipCls"  maxlength="{{maxlength}}" v-model="value" @keyup="keyupHandler"  @focus="focusHandler"  @blur="blurHandler"/>
            <em v-show="tipCls" :class="tipCls" @click="closeHandler"></em>
        </dd>
        <p class="component-vcode-button">
            <a :id="el" @click="getCode" href="javascript:void(0)">获取验证码</a>
        </p>
    </dl>
</template>

<script type="text/ecmascript-6">
    import check from 'libs/check/m';
    export default{
        props: {
            value:{
                type:String,
                default:''
            },
            title:{
                type:String,
                default:'手机验证码'
            },
            el: {
                type: String,
                default: 'GetValidateCode'
            },
            mobileCorrect: {
                type: Boolean,
                default:false
            },
            maxlength: {
                type: Number,
                default: 4
            }
        },
        watch:{
            value(val,oldVal){

            }
        },
        data(){
            return {
                tipCls:'',
                historyValue:'',
                count:0
            }
        },
        components: {},
        methods: {
            getCode(){
                if(this.mobileCorrect){
                    $("#validateCodeInput").focus();
                    check.getCode({length:4}, res =>{})
                }else{
                    this.$dispatch('mobileError')
                }
            },
            closeHandler(){
                this.count++;
                this.value = "";
            },
            focusHandler(){
                this.$dispatch("inputStatus","focus");
                if(this.value != ""){
                    this.tipCls = "close";
                }
            },
            blurHandler(){
                this.$dispatch("inputStatus","blur");
                setTimeout(()=>{
                    if(this.value != ""){
                        if(this.historyValue!=this.value){
                            if(this.value.length === 4){
                                this.tipCls = ""
                                this.$dispatch("checkForm","vcode",true,this.value);
                            }else{
                                tools.showAlert("请输入正确的验证码")
                                this.tipCls = "error"
                                this.$dispatch("checkForm","vcode",false)
                            }
                        }else{
                            this.tipCls = "";
                        }
                    }else{
                        this.tipCls = "";
                        this.$dispatch("checkForm","vcode",false)
                    }
                },300)
            },
            keyupHandler(){
                this.count++;
                if(this.count === 1 && this.historyValue){
                    this.value = "";
                }
                if(this.value != ""){
                    this.tipCls = "close";
                }else{
                    this.tipCls = "";
                }
            }
        },
        computed: {},
        ready(){
            if(this.value != ""){
                this.historyValue = this.value;
                this.$dispatch("checkForm","vcode",true,this.value);
            }else{
                this.$dispatch("checkForm","vcode",false)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    @import './mixin';
    .components-vcode{
        @include form-element();
        >dt {
             width: px2rem(250);
        }
        dd em{
            right:px2rem(10);
        }
        .component-vcode-button{
            font-size: 0;
            display: block;
            &:before{
                content:'';
                @include borderRight;
                height:px2rem(50);
                display: inline-block;
                font-size:px2rem(26);
                background:#E5E5E5;
                vertical-align: middle;
                margin-right: px2rem(27);
            }
            a{
                font-size:px2rem(26);
                color:$main-color;
                margin:0;
                width: px2rem(170);
                text-align: center;
                background: transparent;
                border-radius:px2rem(5);
                line-height: px2rem(50);
                display: inline-block;
                vertical-align: middle;
                box-shadow: inset 0 0 0 1px #e9474d;
                color: #e9474d;
                border-radius:px2rem(20);
                border: 0;
                &.disable{
                     box-shadow: inset 0 0 0 1px #d0d0d0;
                     color: #d0d0d0;
                }
            }
        }
    }

</style>

