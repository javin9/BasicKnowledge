<template>
    <dl class="components-id">
        <dt>{{title}}</dt>
        <dd>
            <input type="text" placeholder="请输入{{title}}" :class="'text-'+tipCls"  maxlength="18" v-model="value" @keyup="keyupHandler"  @focus="focusHandler"  @blur="blurHandler"/>
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
                default:'身份证号码'
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
                            if(check.isID(this.value)){
                                this.tipCls = ""
                                this.$dispatch("checkForm","id",true,this.value);
                            }else{
                                tools.showAlert("请输入正确的身份证号码")
                                this.tipCls = "error"
                                this.$dispatch("checkForm","id",false)
                            }
                        }else{
                            this.tipCls = "";
                        }
                    }else{
                        this.tipCls = "";
                        this.$dispatch("checkForm","id",false)
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
                this.$dispatch("checkForm","id",true,this.value);
            }else{
                this.$dispatch("checkForm","id",false)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    @import './mixin';
    .components-id{
        @include form-element();
        >dt {
             width: px2rem(250);
         }
    }
</style>

