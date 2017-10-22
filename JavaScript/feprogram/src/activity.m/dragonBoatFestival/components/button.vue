<template>
    <div :class="['btn', btnCls]" @click="submit">{{btnText}}</div>
</template>

<script type="text/ecmascript-6">
    export default{
        props:{
            btnText:{
                type:String
            },
            btnCls:{
                type:String
            },
            eventName:{
                type:String
            }
        },
        methods:{
            submit(){
                this.$dispatch(this.eventName);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    .btn{
        display: block;
        width:px2rem(400);
        height:px2rem(106);
        background:url("../images/btn400.png") no-repeat center center;
        background-size: 100% 100%;
        @include fsize(32);
        line-height:px2rem(106);
        margin:0 auto;
        color:#fff;
        text-align:center;

        &.start-btn{
            background:url("../images/btn480.png") no-repeat center center;
            background-size: 100% 100%;
            width:px2rem(480);
            height:px2rem(106);
        }
    }
</style>
