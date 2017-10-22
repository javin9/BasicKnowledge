<template>
<div>
    <div class="picker-mask" v-show="isShow" transition="fadeIn"></div>
    <div class="picker-wrapper-android" v-if="type==='android'" v-show="isShow" transition="fadeUp">
        <ul v-el:picker-ul>
            <li @click="confirmHandler($event,$index)" v-for="pickerItem in pickerListData[0]" data-val="{{pickerItem.value}}" :class="selectedIndex[0]==$index?'cur':''">{{pickerItem.text}}</li>
        </ul>

        <div class="picker-confirm-android" @click="cancelHandler">取消</div>
    </div>
    <div v-else class="picker-wrapper"  v-show="isShow" transition="fadeUp">
        <div class="picker-panel">
            <div class="picker-choose">
                <span class="cancel" @click="cancelHandler">取消</span>
                <span class="confirm" @click="confirmHandler">确定</span>

                <h1 class="picker-title">{{title}}</h1>
            </div>
            <div class="picker-content">
                <div class="mask-top"></div>
                <div class="mask-bottom"></div>
                <div class="wheel-wrapper wheel-wrapper-hook">
                   <picker-item  v-for="pickerList in pickerListData" :is-show="isShow" :index="$index" :default-index-item="defaultIndex[$index]" :items="pickerList"></picker-item>
                </div>
            </div>
            <div class="picker-footer footer-hook"></div>
        </div>
    </div>
</div>
</template>

<script type="text/ecmascript-6">
    import pickerItem from './item.vue';
    export default{
        props:{
            pickerData:{
                type:Array,
                default:[]
            },
            defaultIndex:{
                type:Array,
                default:[0]
            },
            title:{
                type:String,
                default:''
            },
            type:{
                type:String,
                default:'ios'
            }
        },
        data(){
            return {
                isShow:false,
                isScroll:[0],//0表示否1表示是（是否滚动）
                changeIndex:[].concat(this.defaultIndex)
            }
        },
        events:{
            openPicker(){
                this.isShow = true;
            },

            scrollStart(idx){
                this.isScroll[idx] = 1;
            },
            scrollEnd(idx,itemIdx){
                let _selectData = [];
                this.isScroll[idx] = 0;
                this.changeIndex[idx] = itemIdx;
                for(let i = 0 ;i<this.pickerListData.length;i++){
                    _selectData.push(this.pickerListData[i][this.changeIndex[i]]);
                }
                this.$emit('change',_selectData,this.changeIndex);
            }
        },
        components:{
            pickerItem
        },
        computed:{
            pickerListData(){
                //转化为多维数组
                for(let i=0;i<this.pickerData.length;i++){
                    if(this.pickerData[i] instanceof Array){
                        return this.pickerData;
                    }else{
                        return [this.pickerData];
                    }
                }
            }
        },
        methods:{
            cancelHandler(){
                //取消
                this.isShow = false;
                this.$broadcast('deselect')
                this.$emit('cancel');
            },
            confirmHandler(e,idx){
                let _selectData=[];
                //确定
                if(this.type !== "android"){
                    if(this.isScroll.indexOf(1)<0){
                        this.isShow = false;
                        this.changeIndex.forEach((item,index)=>{
                            this.defaultIndex.$set(index,item);
                        })
//                        this.$broadcast('confirm');
                    }else{
                        return false;
                    }
                }else{
                    for(let i=0;i<this.$els.pickerUl.getElementsByTagName("li").length;i++){
                        if(i!=idx){
                            this.$els.pickerUl.getElementsByTagName("li")[i].className = "";
                        }
                    }
                    e.target.className = "cur";
                    this.isShow = false;
                    this.defaultIndex[0]=idx;
                }
                for(let i = 0 ;i<this.pickerListData.length;i++){
                    _selectData.push(this.pickerListData[i][this.defaultIndex[i]]);
                }
                this.$emit('selected',_selectData);
            }
        },
        ready(){
//            console.log(this.defaultIndex.length)
            //初始化滚动状态
            for(let i=0;i<this.defaultIndex.length;i++){
                this.isScroll[i]=0;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/mixin';
    @import 'sassHelper/vars';

    /*动画*/
    .fadeIn-enter {
        animation: fade-in .5s;
    }
    .fadeIn-leave {
        animation: fade-out .5s;
    }
    .fadeUp-enter {
        animation: fade-up .5s;
    }
    .fadeUp-leave {
        animation: fade-down .5s;
    }
    @keyframes fade-in {
        0% {
            opacity:0;
        }
        100% {
            opacity: 1;
        }
    }
    @keyframes fade-out {
        0% {
            opacity: 1;
        }
        100% {
            opacity: 0;
        }
    }
    @keyframes fade-up {
        0% {
            transform:translate3d(0,100%,0);
        }
        100% {
            transform:translate3d(0,0,0);
        }
    }
    @keyframes fade-down {
        0% {
            transform:translate3d(0,0,0);
        }
        100% {
            transform:translate3d(0,100%,0);
        }
    }
    .picker-mask{
        position: fixed;
        top:0;
        z-index: 500;
        width: 100%;
        height: 100%;
        display:block;
        background: rgba(0, 0, 0, .4);
    }
    .picker-wrapper-android{
        position: fixed;
        bottom: 0;
        z-index: 510;
        width: 100%;
        background: #F5F5F5;
        color:#394043;
        @include fsize(30);
        text-align:center;

        .picker-confirm-android{
            background:#fff;
            height:px2rem(100);
            line-height:px2rem(100);
            margin-top:px2rem(20);
        }
        &>ul{
            padding:0 px2rem(30);
            background:#fff;
            li{
                height:px2rem(100);
                line-height:px2rem(100);
                border-bottom:1px solid #E5E5E5;
                &:last-child{
                    border-bottom:none;
                }
                &.cur{
                    color:#E9474D;
                }
            }
        }
    }
    .picker-wrapper{
        position: fixed;
        top: 0;
        z-index: 510;
        width: 100%;
        height: 100%;
        overflow: hidden;
        text-align: center;
        @include fsize(28);
        user-select: none;
        .picker-footer{
            height:px2rem(40);
        }
        .picker-panel{
            position: absolute;
            z-index: 600;
            bottom: 0;
            width: 100%;
            height: px2rem(486);
            background: #fff;
            .wheel-wrapper{
                display:flex;
                padding: 0 px2rem(20);
            }
            .picker-content{
                position: relative;
                .mask-top, .mask-bottom{
                    position: absolute;
                    z-index: 10;
                    width: 100%;
                    height:px2rem(136);
                    pointer-events: none;
                    transform: translateZ(0);
                }
                .mask-top{
                    border-bottom:1px solid #ccc;
                    top: 0;
                    background:-webkit-gradient(linear, left bottom, left top, from(rgba(255, 255, 255, 0.4)), to(rgba(255, 255, 255, 0.8)));
                }
                .mask-bottom{
                    border-top:1px solid #ccc;
                    bottom:0;
                    background: -webkit-gradient(linear, left top, left bottom, from(rgba(255, 255, 255, 0.4)), to(rgba(255, 255, 255, 0.8)));
                }
            }
            .picker-choose{
                position: relative;
                height:px2rem(100);
                color: #878787;
                @include fsize(28);
                .picker-title{
                    line-height:px2rem(100);
                    @include fsize(38);
                    text-align: center;
                    color: #333;
                }
                .confirm, .cancel{
                    position: absolute;
                    padding:px2rem(20);
                    top:px2rem(12);
                }
                .confirm{
                    right: 0;
                    color: #fa8919;
                }
                .cancel{
                    left: 0;
                }
            }
        }
    }
</style>
