<template>
    <div class="component-series-list">
      <dl v-if="brandName" class="title" >
        <dt v-if="brandLogo"><img :src="brandLogo"></dt>
        <dd>{{brandName}}</dd>
      </dl>
      <p v-if="showAllSeries">★</p>
      <h6 v-if="showAllSeries" @click="clickAllSeriesHandler">全部车型</h6>
      <div v-for="one in list">
        <p>{{one.categoryName}}</p>
        <dl v-for="item in one.categoryCollection" @click="clickHandler(item)">
          <dt v-if="showLogo">
            <img :src="item.imgUrl">
          </dt>
          <dd>
            <em><b>{{item.name}}</b><i v-if="item.tagText">{{item.tagText}}</i></em>
            <span>{{item.price}}</span>
          </dd>
        </dl>
      </div>
    </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-series-list{
    dl{
      @include borderBottom;
      height: px2rem(120);
      box-sizing:border-box;
      margin:0 px2rem(30);
      background: #fff;
      display:flex;
      align-items: center;
      height:px2rem(180);
      line-height: $main-line-height;

      &:last-child{
        border:0;
      }

      &.title{
        height: px2rem(130);
        border:0;
      }

      &.title dt{
        width: px2rem(100);
        margin-right: px2rem(30);
      }

      &.title dd{
        @include fsize(32);
        color:$dark-color;
        border:0;
        padding:0;
        line-height: px2rem(130);
      }

      dt{
        @include fsize(28);
        display: flex;
        width: px2rem(180);
        height:px2rem(120);
        margin-right: px2rem(40);
        justify-content: center;
        align-items: center;

        img{
          width: 100%;
          display: block;
        }
      }

      dd{
        @include fsize(34);
        color:#000;
        display: block;
        height: 100%;
        flex: 1;
        padding-top: px2rem(38);
        box-sizing:border-box;

        em{
          @include fsize(34);
          color:#000;
          font-style: normal;
          display: block;
          font-weight: normal;

          b,i{
            font-style:normal;
            vertical-align: middle;
            display: inline-block;
            color:#000;
            font-weight:normal;
          }

          i{
            @include border(#46ADF3);
            font-size:px2rem(24);
            border-radius:px2rem(16) 0 px2rem(16) 0;
            margin-left: px2rem(20);
            color:#46ADF3;
            padding:0 px2rem(10);
            line-height: px2rem(32);
          }
        }

        span{
          @include fsize(28);
          display: block;
          white-space: nowrap;
          color:#e15436;
          margin-top: px2rem(16);
        }
      }
    }

    p{
      @include fsize(26);
      background: #f5f5f5;
      padding:0 px2rem(30);
      line-height: px2rem(66);
      color:$dark-color;
    }

    h6{
      @include fsize(36);
      font-weight: normal;
      color:$dark-color;
      line-height: $main-line-height;
      padding:px2rem(38) px2rem(30);
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAUCAQAAAAT+RSaAAAAzUlEQVQYGWXBMS9DYRiG4fdIalGrGbtBdwtmk4HVZmSy+QEdbE3u5yuS6nQmsUgjjb0WP8AqmCRnoQl9jE6/c13BnSbXq9GkMdYrG5G7XNYY6zNtRa5cpMT60l7kvEAP60dH0ZTOMeYsmjjmF3PhInJpn2+sIa3IpW1VmPvBUuTo8IH1GLmrdV4wzzGPjt4xT4OVqNOuKsyobEddOtQUc0Mr6nSqGVbXRfxzoS7WjJOoo6Uh1lQHUVe2GWFV/Z2YpwfMW38zcrrVJK1Fwx++tXCARQG0twAAAABJRU5ErkJggg==) no-repeat right px2rem(30) center;
      background-size: px2rem(12) px2rem(20);
    }
  }
</style>

<script>
export default {
  props:{
    api: String,
    interface: String,
    method: String,
    onlyOnSale: Boolean,
    showLogo: Boolean,
    showAllSeries: Boolean,
    brandId: Number,
    brandName: String,
    brandLogo: String,
    tag: Boolean,
    from: [String, Number]
  },
  data () {
    return {
      list: []
    }
  },

  computed: {
    apiUrl(){
      return this.interface || `${this.api}base/car/GetCarSelectorCarSerialList`
    },
    isPost(){
      return this.method === 'post'
    }
  },

  watch: {
    brandId(value){
      if(value){
        this.getList()
      }else{
        this.list = []
      }
    }
  },

  methods:{
    getList(){
      const params = {
        mbId: this.brandId,
        onlyOnSale: this.onlyOnSale,
        needTag: this.tag,
        from: this.from
      }
      this.$http[this.method](this.apiUrl, this.isPost ? params : {params}).then(response => response.json().then(res => {
        if(res.result){
          this.list = res.data
          this.$nextTick(() => this.$emit('rendered'))
        }
      }))
    },

    clickAllSeriesHandler(){
      this.$emit('callback', {
        series: {
          id: 0
        }
      })
    },

    clickHandler(series){
      this.$emit('callback', {
        series: {
          id: series.id,
          name: series.name,
          logo: series.imgUrl,
          spell: series.spell,
          price: series.price,
          allbrand: series.allbrand
        }
      })
    }
  },

  created(){
  },

  components:{
  }
}
</script>