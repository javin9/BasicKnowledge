<template>
  <div class="component-nav" @click="selectCity">
    <div class="component-nav-left">
      <label>{{current}}</label>
      <em v-if="count">{{count}}家门店</em>
    </div>
    <div class="component-nav-right">
      <span>换城市</span><i></i>
    </div>
  </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-nav{
    overflow: hidden;
    background: #fff;
    padding:px2rem(30);

    &-left{
      float: left;
      font-size:0;

      label{
        @include fsize(32);
        @include ellipsis(px2rem(180));
        display: inline-block;
        vertical-align: middle;
        color: $dark-color;
        margin-right: px2rem(10);
        line-height: $main-line-height;
      }

      em{
        @include fsize(28);
        color:$main-color;
        display: inline-block;
        vertical-align: middle;
        line-height: $main-line-height;
      }
    }

    &-right{
      float: right;
      margin-top: px2rem(8);

      span{
        @include fsize(24);
        color:$light-color;
        display: inline-block;
        vertical-align: middle;
      }

      i{
          content:' ';
          width: px2rem(12);
          height:px2rem(20);
          background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAUCAYAAAC58NwRAAAABGdBTUEAALGPC/xhBQAAAZhJREFUKBWFkjFLw1AQx5sXoxR1yCIi+BFcBBfBRVwUB8EaEQcJtCl1LCiO7lZwcGmLuihIB5WiKA5FBCcFv4KjWwNVEIuJvytJKZq0B4/Lu/v93929F61YLFY1TRs1DMOybfst0cMU8KDv+1PNZvMJ8UQPPqF0XV9CVEM0hn8sl8sz3USaJCuVSn+9Xj/lcwXRF37VcZyq5P5aSyBBKqhSqXTIZw7RDx6Ncyy5TlPhBsjLZrObSqldxDrriJl2wnzo2xXCgHjAHE6qyYEHVMpzoM93IlIgCYZPeZ4ncw0An1HRpoNmrCAQzQJesYbZ3yWTyVRXgYhobxJ3yxqh0kN7aElGGX+AS7whOSqZehQUxuR0oBr7cdYLLc3HtsSbzAFdBP3fm6a5bFnWR2RL3NAa8E0Ay00tCoz/f62cnCdeAGZGrZDJZLbxrTcQQbuCAMB7+H1JYHkebKsTlmBrBoYzSJwAr+O/iW8Anwvw1xR/6hDB6wBu8C8txMEi7nNd9xIvN/IucDqdfpVEnMkMn7TxDDzdC5ZDfgF5IaKPIPpUKAAAAABJRU5ErkJggg==) no-repeat center center;
          background-size: contain;
          display: inline-block;
          vertical-align: middle;
          margin-left: px2rem(12);
        }
    }
  }
</style>

<script>
import city from 'libs/citySelect'
export default {
  props:{
    count: {
      type: Number,
      default: 0
    },
    localCityId: {
      type: Number,
      default: 0
    },
    localCityName: {
      type: String,
      default: ''
    },
    apiUrl: {
      type:String,
      default: window.APIURL
    }
  },
  data () {
    return {
      current: '全国'
    }
  },

  methods:{
    selectCity(){
      city.citySelect({
          CityName: '全国',
          loadCityUrl: `${this.apiUrl}api/ExperienceStore/GetTydCityList?cityId=${this.localCityId}`,
          showVisitedCity: false,
          showCitySearch:false
      }, res =>{
        this.current = res.CityName
        this.$dispatch('changeCity', res.CityId)
      })
    }
  },

  created(){
  },

  components: {
  }
}
</script>