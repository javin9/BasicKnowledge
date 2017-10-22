<template>
    <div :class="{'step-btn':true,'disabled':disabled}">{{text}}</div>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            text:{
                type:String,
                default:'下一步'
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
        methods: {},
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
        position: relative;
        clear:both;
        background: #E9474D;
        @include fsize(32);
        color: #FFFFFF;
        height:px2rem(100);
        margin-top:px2rem(-100);
        line-height:px2rem(100);
        text-align:center;
        &.disabled{
             background: #D6D6D6;
        }
    }
</style>
