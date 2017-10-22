<template>
    <div class="step-header">
        <div class="red-step" title="常住地址">1</div>
        <span :class="stepNum>1?'red-step':''"></span>
        <div :class="stepNum>1?'red-step':''" title="工作单位" >2</div>
        <span :class="stepNum>2?'red-step':''"></span>
        <div :class="stepNum>2?'red-step':''" title="紧急联系人">3</div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            stepNum:{
                type:Number,
                default:1
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
    .step-header{
        padding:px2rem(30) px2rem(62) px2rem(64) px2rem(62);
        display:flex;
        align-items:center;
        &>span{
            display:block;
            flex: 1;
            height:px2rem(3);
            background:#e5e5e5;
            margin:0 px2rem(10);
            &.red-step{
                 background:#E9474D;
            }
        }
        &>div{
            position: relative;
            height:px2rem(52);
            width:px2rem(52);
            background:#e5e5e5;
            border-radius: 50%;
            text-align:center;
            line-height:px2rem(52);
            color:#fff;
            font-size:px2rem(30);
            &:after{
                content:attr(title);
                position:absolute;
                left:50%;
                top:px2rem(60);
                white-space:nowrap;
                @include fsize(24);
                color: #9C9FA1;
                transform:translate3d(-50%,0,0);
            }
            &.red-step:after{
                 color: #E9474D;
            }
            &.red-step{
                 background: #E9474D;
            }
        }
    }
</style>
