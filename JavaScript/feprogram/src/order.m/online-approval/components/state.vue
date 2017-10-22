<template>
    <div class="state-sign not-Authentication" v-if="state==stateCode.notAuthentication">
        未认证
    </div>
    <div class="state-sign authentication" v-if="state==stateCode.authentication">
        去认证
    </div>
    <div class="state-sign authenticated" v-if="state==stateCode.authenticated">
        已认证
    </div>
</template>

<script type="text/ecmascript-6">
    import {stateConfig} from '../stateConfig';
    export default{
        props:{
            state:{
                type:Number,
                default:0
            }
        },
        data(){
            return {
                stateCode:stateConfig
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .state-sign{
        @include fsize(30);
        width:px2rem(130);
        line-height:px2rem(50);
        text-align:center;
    }
    .not-Authentication{
        @include fsize(30);
        color: #C4C4C4;
    }
    .authentication{
        background: #E9474D;
        border-radius:px2rem(64);
        color: #fff;
    }
    .authenticated{
        color: #10CD6F;
        position:relative;
        &:after{
            content:' ';
            position:absolute;
            background:url("../images/correct_icon.png") no-repeat left top;
            background-size:contain;
            width:px2rem(24);
            height:px2rem(24);
            left:px2rem(-20);
            top:50%;
            transform: translate3d(0,-50%,0);
        }
    }
</style>
