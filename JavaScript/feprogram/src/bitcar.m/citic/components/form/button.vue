<template>
    <div class="step-btn"><div :class="{'disabled':disabled}" @click="submitClickHandler">{{text}}</div></div>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            text:{
                type:String,
                default:'提交'
            },
            disabled:{
                type:Boolean,
                default:true
            }
        },
        data(){
            return {}
        },
        components: {},
        methods: {
            submitClickHandler(){
                if(!this.disabled){
                    this.$emit('submitclick');
                }
            }
        },
        computed: {},
        ready(){
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .step-btn{
        width:100%;
        heeight:px2rem(120);
        box-sizing: border-box;
        padding: px2rem(20) px2rem(30) px2rem(30);
        user-select:none;
        color: #FFFFFF;
        text-align:center;
        background: #f2f2f2;
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 20;
        div{
            @include fsize(32);
            height: auto;
            line-height:0;
            padding: px2rem(45) 0;
            background: #e9474d;
            border-radius: px2rem(5);
            &.disabled{
                 background: #D6D6D6;
            }
        }
    }
</style>
