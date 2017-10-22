<template>
    <dl class="components-name">
        <dt>姓名</dt>
        <dd>
            <input type="text" placeholder="请输入紧急联系人姓名" :class="'text-'+tipCls" maxlength="8" v-model="value" @keyup="keyupHandler"  @focus="focusHandler"  @blur="blurHandler"/>
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
                this.tipCls = "";
            },
            focusHandler(){
                if(this.value != ""){
                    this.tipCls = "close";
                }
            },
            blurHandler(){
                setTimeout(()=>{
                    if(this.value != ""){
                        if(this.historyValue!=this.value){
                            if(check.isName(this.value)){
                                this.tipCls = ""
                                this.$dispatch("checkForm","name",true,this.value);
                            }else{
                                tools.showAlert("请输入正确姓名")
                                this.tipCls = "error"
                                this.$dispatch("checkForm","name",false)
                            }
                        }else{
                            this.tipCls = "";
                        }

                    }else{
                        this.tipCls = "";
                        this.$dispatch("checkForm","name",false)
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
                this.$dispatch("checkForm","name",true,this.value);
            }else{
                this.$dispatch("checkForm","name",false)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    @import './mixin';
    .components-name{
        @include form-element();
    }
</style>
