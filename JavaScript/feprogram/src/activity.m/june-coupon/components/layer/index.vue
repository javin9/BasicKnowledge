<template>
    <div class="layer-wrapper" v-show="isShow" transition="opacity" @touchmove.prevent>
        <div class="content-wrapper">
            <div class="content">
                <div class="close-btn" @click="closeLayer"></div>
                <dl>
                    <dt>{{title}}</dt>
                    <dd>{{content}}</dd>
                </dl>
                <div class="confirm-btn" @click="confirmHandler">{{btnText}}</div>
            </div>
        </div>
    </div>
    <mask></mask>
</template>

<script type="text/ecmascript-6">
    import Mask from 'libs/mask'
    export default{
        props:{
            title:{
                type:String,
                default:''
            },
            content:{
                type:String,
                default:''
            },
            btnText:{
                type:String,
                default:'立即下单'
            }
        },
        data(){
            return {
                isShow:false
            }
        },
        events:{
            openLayer(){
                this.isShow = true;
                this.$broadcast('showMask')
            }
        },
        methods:{
            closeLayer(){
                this.isShow = false;
                this.$broadcast('hideMask')
            },
            confirmHandler(){
                this.$emit("confirm")
            }
        },

        components:{
            Mask
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .content-wrapper{
        z-index:10000;
        position:fixed;
        left:50%;
        top:50%;
        transform:translate3d(-50%,-50%,0);
        width:px2rem(600);
        height:px2rem(500);
        background:#fff;
        border-radius: px2rem(15);
        .content{
            position:relative;
            .close-btn{
                position: absolute;
                right:px2rem(30);
                top:px2rem(-40);
                width:px2rem(80);
                height:px2rem(80);
                background:url("close_btn.png") no-repeat no-repeat left top;
                background-size:contain;
            }
            dt{
                height:px2rem(120);
                padding-top:px2rem(40);
                color:#f84372;
                @include fsize(32);
                box-sizing: border-box;
                text-align:center;
            }
            dd{
                @include fsize(28);
                line-height:150%;
                color:#333;
                padding:0 px2rem(55);
                height:px2rem(220);
            }
            .confirm-btn{
                width:px2rem(528);
                height:px2rem(114);
                background:url("btn_bg.png") no-repeat left top;
                background-size:contain;
                margin:0 auto;
                color:#fff;
                @include fsize(32);
                line-height:px2rem(114);
                text-align:center;
            }
        }
    }
</style>
