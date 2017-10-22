<template>
    <dl class="components-company multi-line">
        <dt>单位全称</dt>
        <dd>
            <textarea placeholder="请输入工作单位全称" :class="'text-'+tipCls"  maxlength="50" v-model="value" @keyup="keyupHandler" @focus="focusHandler"  @blur="blurHandler" v-el:company></textarea>
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
                    this.$els.company.style.cssText=`height:${this.$els.company.scrollHeight}px`;
                    this.$dispatch("checkForm","company",true,val)
                }else{
                    this.$els.company.style.cssText = `height:${this.textareaHeight}px`;
                    this.$dispatch("checkForm","company",false)
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
                    this.tipCls = "close";
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
            this.textareaHeight = this.$els.company.style.height;
            if(this.value != ""){
                this.historyValue = this.value;
                this.$dispatch("checkForm","company",true,this.value)
            }else{
                this.$dispatch("checkForm","company",false)
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    @import './mixin';
    .components-company{
        @include form-element();
    }
</style>
