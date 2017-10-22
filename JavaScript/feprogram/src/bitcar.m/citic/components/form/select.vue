<template>
    <ul class="select-wrapper" v-show="isShow" transition="opacity" v-el:select-wrapper>
        <li v-for="item in defaultData" :class="{'select-item':true,'cur':item.isCur}"  @click="clickHandler($event,$index)">{{item.text}}</li>
    </ul>
</template>

<script type="text/ecmascript-6">
    export default{
        props: {
            defaultData:{
                type:Array
            },
            isShow:{
                type:Boolean,
                default:false
            },
            name:{
                type:String
            }
        },
        data(){
            return {
                selectWrapperLi:null,
            }
        },
        components: {},
        methods: {
            clickHandler(e,idx){
                Array.prototype.forEach.call(this.selectWrapperLi,(value,index)=>{
                    if(idx == index){
                        value.className="select-item cur";
                    }else{
                        value.className="select-item";
                    }
                })
                this.isShow = false;
                let curValue = this.defaultData[idx].value;
                this.$emit('selected',this.name,curValue);
            }
        },
        computed: {},
        events:{
            updateOption(name,curItem){
                if(name === this.name){
                    for(let i = 0;i<this.defaultData.length;i++){
                        if(this.defaultData[i].value === curItem){
                            $(this.selectWrapperLi).eq(i).addClass("cur").siblings().removeClass("cur");
                            break;
                        }
                    }
                }
            }
        },
        ready(){
            this.selectWrapperLi = this.$els.selectWrapper.getElementsByClassName("select-item");
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';
    .select-wrapper{
        background:#f5f5f5;
        font-size:0;
        text-align:center;
        li{
            width:45%;
            background:#fff;
            @include fsize(24);
            display:inline-block;
            margin:px2rem(10);
            box-sizing: border-box;
            padding:px2rem(20);
            border:1px solid #fff;
            &.cur{
                border-color:#e9474d;
                color:#e9474d
            }
        }
    }
</style>
