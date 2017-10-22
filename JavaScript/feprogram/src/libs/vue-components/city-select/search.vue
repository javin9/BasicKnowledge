<template>
<div id="citySelectSearch" class="defaultAniCity {{drawAniCity}}">
    <div class="wrapper">
        <section class="vue-search">
                <div class="vue-search-content">
                    <span class="vue-search-icon"></span>
                    <input class="vue-search-input" v-model="search" placeholder="搜索城市/省份">
                    <div v-show="inputValue" @click="empty" class="vue-search-icon-colse"></div>
                </div>
                <div class="vue-colse" @click="closeLayer" >取消</div>
            </section>
            <div v-for="info in cityList" class="citySelect-allCity-text" @click="clickCity(info)">
                    {{info.name}}
            </div>
    </div>
</div>
</template>
<script>

import './index.scss'
import IScroll from 'iscroll'

var myScroll;

export default {
name: 'vue-city-select-search',
props: {
    //父组件-跳转方法
    go: {
        type: Function,
        default: function(){}
    },
    //父组件-关闭当前组件方法
    xsearch: {
        type: Function,
        default: function(){}
    },
    //搜索城市接口地址
    shareCityUrl: 
    {
        type: String
    },
},
data () {
    return {
        //文本框
        search:'',
        //城市list
        cityList:[],
        //文本框内容是否存在
        inputValue:false,
        //当然组件是否显示的class
        drawAniCity:''
    }
},
watch:{
    //监控文本框址当内容发生改变后，重新渲染页面
    search(value){
        this.render(value);
        if(value!=''){
            this.inputValue=true;
        }else{
            this.inputValue=false;
        }
    }
},
ready(){
      //滚动条
    myScroll = new IScroll('#citySelectSearch', {
        scrollbars: true,
        shrinkScrollbars: 'scale',
        fadeScrollbars: true,
        click: true,
        scrollbars: false
    });
},
events:{
    /**
    * 外部唤起组件方法打开当前组件
    */
    loadSearchView(){
        this.drawAniCity='drawAniCity';
    }
},
methods:{
     /**
    * 点击事件
    */
    clickCity(data){
        //callback父组件方法
       this.go(data);
    },
    empty(){
        this.search='';
    },
    /**
    * 渲染页面
    */
    render(value) {
       if(value!=''){
          let url=this.shareCityUrl+'?keyword='+value;
          this.$http.get(url).then(response => response.json().then(res => {
            if(res.result){
                this.cityList=res.data;
                this.$nextTick(()=>{
                    myScroll.refresh();
                })
            }
          }))
       }else{
            this.cityList=[];
       }
    },
    /**
    * 关闭当前组件
    */
    closeLayer(){
        this.drawAniCity='';
        this.$nextTick(()=>{
            this.xsearch();
        })
    }
  }
}
</script>