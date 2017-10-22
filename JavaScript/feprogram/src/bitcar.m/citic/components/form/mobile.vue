<template>
    <dl class="components-mobile">
        <dt>{{title}}</dt>
        <dd>
            <input :id="el" type="tel" placeholder="请输入{{title}}" :class="'text-'+tipCls"  maxlength="11" v-model="value" @keyup="keyupHandler"  @focus="focusHandler"  @blur="blurHandler"/>
            <em v-show="tipCls" :class="tipCls" @click="closeHandler"></em>
        </dd>
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
                default:'手机号'
            },
            mark:{
                type:String,
                default:'mobile'
            },
            el:{
                type:String
            },
            state:{
                type:String,
                default:''
            }
        },
        watch:{
            value(val,oldVal){

            },
            state(){
                if(this.value != ""){
                    this.tipCls =  this.state;
                }
                tools.showAlert("请输入正确的手机号")
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
                            if(check.isPhoneNumber(this.value)){
                                this.tipCls = ""
                                this.$dispatch("checkForm",this.mark,true,this.value);
                            }else{
                                tools.showAlert("请输入正确的手机号")
                                this.tipCls = "error"
                                this.$dispatch("checkForm",this.mark,false)
                            }
                        }else{
                            this.tipCls = "";
                        }
                    }else{
                        this.tipCls = "";
                        this.$dispatch("checkForm",this.mark,false)
                    }
                },300)
            },
            keyupHandler(){
                this.count++;
                if(this.value.length === 11){
                    if(check.isPhoneNumber(this.value)){
                        this.$dispatch("checkForm",this.mark,true,this.value);
                    }else{
                        this.$dispatch("checkForm",this.mark,false);
                    }
                }

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
                this.$dispatch("checkForm",this.mark,true,this.value);
            }else{
                this.$dispatch("checkForm",this.mark,false)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    @import './mixin';
    .components-mobile{
        @include form-element();
        >dt {
             width: px2rem(250);
         }
    }
</style>

