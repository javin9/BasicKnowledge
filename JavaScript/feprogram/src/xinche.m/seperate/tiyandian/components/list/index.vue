<template>
  <div class="component-list" :class="{'loading' : loading && !list.length}">
    <ul>
      <li v-for="(key, one) in list">
        <a href="http://api.map.baidu.com/marker?location={{one.Latitude}},{{one.Longitude}}&title={{one.Name}}&content={{one.Address}}&output=html&src=daikuan.com" class="location">
          <em>{{key+1}}</em>
          <div class="content">
            <h6><span>{{one.Name}}</span></h6>
            <p>{{one.Address}}</p>
          </div>
        </a>
        <a href="tel:{{one.Mobile}}" class="tel">{{one.Mobile}}</a>
      </li>
    </ul>
    <div v-if="list.length >= 10">
      <div class="no-more" v-if="loadedAll">没有更多了</div>
      <div class="pull-request" v-else>{{loading ? '正在加载数据' : '上拉刷新'}}</div>
    </div>
  </div>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

  .component-list{
    @include borderTop;
    background: #fff;
    position: relative;
    min-height: px2rem(400);

    &.loading{
      background: url(./loading.gif) no-repeat center center;
      -webkit-background-size: px2rem(50) px2rem(50);
      background-size: px2rem(50) px2rem(50);
    }

    ul{
      padding:0 px2rem(30);
      min-height:calc(100vh-90px);

      a{
        text-decoration: none;
      }

      li{
        @include borderBottom;
        padding:px2rem(40) 0;
        background: url(./location.png) no-repeat right px2rem(40);
        background-size: px2rem(80) px2rem(80);

        .location{
          position: relative;
        }

        .location > em{
          @include border($main-color);
          text-align: center;
          position: absolute;
          font-size:px2rem(24);
          color:$main-color;
          line-height: px2rem(30);
          min-width: px2rem(32);
          border-radius:px2rem(6);
          padding:0 px2rem(5);
          top:0;
          left:px2rem(0);
        }

        .content{
          padding-left: px2rem(60);
          padding-right: px2rem(100);
        }

        h6{
          @include fsize(34);
          font-weight: normal;
          color:$dark-color;
          margin-bottom: px2rem(16);
          line-height: 1.2;
        }

        p{
          @include fsize(24);
          color:$light-color;
          margin-bottom: px2rem(20);
        }

        .tel{
          @include fsize(32);
          color:$main-color;
          margin-left: px2rem(60);
          padding-left: px2rem(57);
          background: url(./tel.png) no-repeat left center;
          background-size: contain;
          line-height: px2rem(44);
          display: inline-block;
        }
      }
    }

    .no-more{
      @include fsize(24);
      color:$light-color;
      text-align: center;
      padding:px2rem(40) px2rem(30);
    }
  }

  .pull-request{
    @include fsize(24);
    color:$light-color;
    text-align: center;
    padding:px2rem(40) px2rem(30);
    background: #fff;
    width: 100%;
  }
</style>

<script>
export default {
  props:{
    cityId: {
      type: Number,
      default: 0
    },
    localCityId: {
      type: Number,
      default: 0
    },
    apiUrl: {
      type: String,
      default : window.APIURL || '/'
    }
  },

  data () {
    return {
      list: [],

      loadedAll: false,

      loading: true,

      params: {
        pageSize: 10,
        pageIndex: 1,
        locateCityId: this.localCityId,
        longitude:0,
        latitude:0
      }
    }
  },

  watch: {
    cityId(){
      this.loadedAll = false
      this.getList()
    }
  },

  methods:{
    getPosition(){
      const geolocation = new BMap.Geolocation()
      let geoSuccess = false
      const setPosition = (lng, lat) => {
        this.params.longitude = lng
        this.params.latitude = lat
      }
      const getList = () => {
        this.getList()
        this.bindScrollEvent() 
      }
      try{
        setTimeout(()=>{
          if(!geoSuccess){
            getList()
          }
        },3000)

        geolocation.getCurrentPosition(function(r){
          geoSuccess = true
          if(this.getStatus() == BMAP_STATUS_SUCCESS){
            setPosition(r.point.lng, r.point.lat)
          }
          getList() 
        },{enableHighAccuracy: true})
      }catch(e){
        getList() 
      }
    },

    getList(page=1){
      const params = Object.assign({}, this.params, {selectCityId: this.cityId, pageIndex: page})
      this.loading = true
      this.$http.jsonp(`${this.apiUrl}api/ExperienceStore/GetTydList`, {params}).then(response => response.json().then(res => {
        this.loading = false

        if(res.Result && res.Data.length > 0){
          this.params.pageIndex = page

          // 第一页直接替换数据，后续页只新增数据，确保切换城市重新获取第一页数据准确
          if(page === 1){
            this.list = res.Data
          }else{
            this.list = this.list.concat(res.Data)
          }

          // 获取数据小于pageSize,数据已经全部加载完毕
          if(res.Data.length < this.params.pageSize){
            this.loadedAll = true
          }

          this.$dispatch('updateCount', res.RowCount)
        }else{
          this.loadedAll = true
        }
      }))
    },

    bindScrollEvent(){
      const $win = $(window)
      const $doc = $(document)
      $win.scroll(()=>{
        const scrollTop = $win.scrollTop()
        const scrollHeight = $doc.height()
        const windowHeight = $win.height()
        const CAPACITY = 10
        if (!this.loading && !this.loadedAll && scrollTop + windowHeight >= scrollHeight - CAPACITY) {
          this.getList(this.params.pageIndex+1)
        }
      })
    }
  },

  created(){
    this.getPosition()
  },

  components: {
  }
}
</script>