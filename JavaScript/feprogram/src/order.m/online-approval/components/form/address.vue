<template>
    <dl class="components-address multi-line">
        <dt>详细地址</dt>
        <dd>
            <textarea placeholder="请输入详细地址" :class="'text-'+tipCls" maxlength="50" v-model="value" @keyup="keyupHandler" @focus="focusHandler"  @blur="blurHandler" v-el:address></textarea>
            <em v-show="tipCls" :class="tipCls" @click="closeHandler"></em>
        </dd>
    </dl>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            value:{
                type:String,
                default:''
            }
        },
        data(){
            return {
                tipCls:'',
                textareaHeight:'',
                historyValue:'',
                count:0
            }
        },
        watch:{
            value(val,oldVal){
                if(val != ""){
                    this.$els.address.style.cssText=`height:${this.$els.address.scrollHeight}px`;
                    this.$dispatch("checkForm","address",true,val)
                }else{
                    this.$els.address.style.cssText = `height:${this.textareaHeight}px`;
                    this.$dispatch("checkForm","address",false)
                }
            }
        },
        components: {
        },
        methods: {
            focusHandler(){
                if(this.value != ""){
                    this.tipCls = "close";
                }
            },
            blurHandler(){
                setTimeout(()=>{
                    if(this.value != ""){
                        this.tipCls = "";
                    }
                },300)
            },
            closeHandler(){
                this.count++;
                this.value = "";
                this.tipCls = "";
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
//            console.log(this.value);
            this.textareaHeight = this.$els.address.style.height;
            if(this.value != ""){
                this.historyValue = this.value;
                this.$dispatch("checkForm","address",true,this.value)
            }else{
                this.$dispatch("checkForm","address",false)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    @import './mixin';
    .components-address{
        @include form-element();
    }
</style>
