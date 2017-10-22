<template>
    <div class="item-wrapper"  @click="clickHanlder($event,itemId,state)">
        <i :class="'item-icon' + itemId"></i>
        <dl>
            <dt>{{title}}</dt>
            <dd>{{describe}}</dd>
        </dl>
        <state :state="state"></state>
    </div>
</template>

<script type="text/ecmascript-6">
    import State from './state.vue';
    import {stateConfig} from '../stateConfig';
    export default{
        props:{
            title:{
                type:String,
                default:'基本信息'
            },
            describe:{
                type:String,
                default:'填写申请人基本信息'
            },
            link:{
                type:String,
                default:''
            },
            state:{
                type:Number,
                default:0
            },
            itemId:{
                type:Number,
                default:0
            },
            //运营商验证接口
            spCheckingUrl:{
                type:String,
                default:''
            },
            toLoginUrl:{
                type:String,
                default:''
            }
        },
        data(){
          return {
            orderId : tools.getUrlParam("orderId"),
            childOrderId : tools.getUrlParam("childOrderId"),
            isClick:true
          }
        },
        components:{
            State
        },
        methods:{
            clickHanlder(e,idx,state){
                if(state===stateConfig.authentication){
                    if(idx === 0){
                        window.location.href=`${this.link}?orderId=${this.orderId}&childOrderId=${this.childOrderId}`;
                    }else if(idx === 1){
                        window.location.href=`${this.link}&orderId=${this.orderId}&childOrderId=${this.childOrderId}`;
                    }else{
                        if(this.isClick){
                            this.isClick = false;
                            this.$http.post(this.spCheckingUrl,{
                                'orderId':this.orderId,
                                'childOrderId':this.childOrderId
                            }).then(response=>response.json().then(res=>{
                                this.isClick = true;
                                if(res.Result){
                                    window.location.href=res.Data.RedirectUrl;
                                }else if(res.Data === -1) {
                                    window.location.href = this.toLoginUrl;
                                }else{
                                    tools.showAlert(res.Message);
                                }
                            }))
                        }

                    }
                }else{
                    return false;
                }
            }
        },
        computed:{
        },
        ready(){

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .item-wrapper{
        border-top:1px solid #E5E5E5;
        display:flex;
        line-height:150%;
        height:px2rem(150);
        align-items:center;
        padding-right:px2rem(30);
        i{
            display:block;
            width:px2rem(60);
            height:px2rem(60);
            background-size:100% auto !important;
            &.item-icon0{
                background:url(../images/people_icon.png) no-repeat center center;
            }
            &.item-icon1{
                 background:url(../images/camera_icon.png) no-repeat center center;
            }
            &.item-icon2{
                 background:url(../images/mobile_icon.png) no-repeat center center;
            }
        }
        dl{
            display:block;
            flex:1;
            padding-left:px2rem(30);
            dt{
                @include fsize(32);
                line-height:150%;
                color: #333;
            }
            dd{
                @include fsize(26);
                line-height:150%;
                color: #999;
            }
        }
    }
</style>
