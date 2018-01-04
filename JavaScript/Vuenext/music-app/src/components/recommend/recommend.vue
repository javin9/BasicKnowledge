<template>
 <div class="recommend">
 	<div class="recommend-content">
	  <swiper :options="swiperOption" >
		    <swiper-slide class="slider-item" v-for="item in sliderList">
		    	<a :href="item.linkUrl">
	 		   		<img :src="item.picUrl">
	 		   	</a>
		    </swiper-slide>
		    <div class="swiper-pagination" slot="pagination"></div>
	  </swiper>
 		<div class="radio-wrapper">
 			<h1 class="radio-title">热门电台</h1>
 			<ul></ul>
 		</div>
 	</div>
 </div>
</template>

<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {ERR_OK} from 'api/config.js';
import {getRecommend,getHotSongs} from 'api/data.js';

export default {
  data:function() {
  	return {
  		sliderList:[],
  		hotsongs:[],
  		swiperOption:{
          pagination: {
            el: '.swiper-pagination'
          },
          autoplay:true,
          loop:true
  		}
  	}
  },
  computed:{
     
  },

  created:function(){
       this.getRecommend();
       this.getHotSongs();
  },
  mounted:function () {
  
  },
  methods:{
  	getRecommend() {
  		getRecommend().then((data)=>{
  			if (data.code===ERR_OK) {
  				this.sliderList=data.data.slider;
  				this.radioList=data.data.radioList;
  			}
  		});
  	},
  	getHotSongs(){
         getHotSongs().then((data)=>{
          if (data.code===ERR_OK) {
            this.hotsongs=data.data.list;
          }
         });
  	}
  },
  components:{
  	swiper,
    swiperSlide
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.radio-title{
  text-align:center;
}
</style>
