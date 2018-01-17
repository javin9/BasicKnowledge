<template>
  <scroll class="recommend" :data="hotsongs" ref="scroller">
    <div class="recommend-content" >
      <div>
        <swiper :options="swiperOption">
          <swiper-slide class="slider-item" v-for="item in sliderList">
            <a :href="item.linkUrl">
            <img :src="item.picUrl"  @load="imageLoad">
          </a>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <loading v-if="needLoading"></loading>
        <div class="radio-wrapper" v-if="!needLoading">
          <h1 class="radio-title">热歌推荐</h1>
          <ul class="hotsongs-list">
            <li v-for="item in hotsongs">
              <a href="#" class="song-item">
           <img class="song-img"   v-lazy="item.imgurl">
         </a>
              <div class="song-info">
                <h3 v-html="item.creator.name"></h3>
                <p v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </scroll>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { ERR_OK } from 'api/config.js';
import { getRecommend, getHotSongs } from 'api/data.js';

import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';

export default {
  data: function() {
    return {
      sliderList: [],
      hotsongs: [],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: true,
        loop: true
      },
      imageIsLoaded: false
    }
  },
  computed: {
    needLoading: function() {
      return !!!this.hotsongs.length;
    }
  },
  created: function() {
    this.getRecommend();
    this.getHotSongs();
  },
  mounted: function() {

  },
  methods: {
    getRecommend() {
      getRecommend().then((data) => {
        if (data.code === ERR_OK) {
          this.sliderList = data.data.slider;
        }
      });
    },
    getHotSongs() {
      this.axios
        .get('https://easy-mock.com/mock/59bf2621e0dc663341ad67cc/example/hotsongs')
        .then((res) => {
          var data = res.data;
          if (data.code === ERR_OK) {
            this.hotsongs = data.data.list;
          }
        });
      //自定义方式
      // getHotSongs().then((data)=>{
      //   data=eval("("+data+")");
      //   console.log(data);
      //   if (data.code===ERR_OK) {
      //      console.log(data.data.list);
      //      this.hotsongs=data.data.list;
      //   }
      // });
    },
    imageLoad() {
      if (!this.imageIsLoaded) {
        this.imageIsLoaded = true;
        this.$refs.scroller.refresh();
      }
    }
  },
  components: {
    swiper,
    swiperSlide,
    Scroll,
    Loading
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "../../common/less/mixin.less";
.recommend {
  background: #E9E9E9;
  position: fixed;
  width: 100%;
  top: 180/@r;
  left: 0;
  bottom: 0;
  z-index: -1;
}
.recommend .radio-title {
  margin: 20/@r 0;
  height: 65/@r;
  line-height: 65/@r;
  text-align: center;
  .fz(16px);
  color: #000;
  background-color: #fff;
}
.recommend .hotsongs-list {
  padding: 20/@r;
}
.recommend .hotsongs-list li {
  display: flex;
  flex-diection: row;
  text-decoration: none;
  background: #fff;
  margin-bottom: 20/@r;
  overflow: hidden;
}

.recommend .song-item .song-img {
  max-width: 200/@r;
  max-height: 200/@r;
}
.recommend .song-info {
  padding-left: 30/@r;
  padding-top: 20/@r;
}

.recommend .song-info h3 {
  .fz(18px);
}
.recommend .song-info p {
  .fz(16px);
  margin-top: 40/@r;
  color: #999;
}

</style>
