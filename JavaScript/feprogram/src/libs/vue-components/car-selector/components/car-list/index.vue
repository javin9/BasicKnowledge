<template>
    <div class="component-car-list">
      <dl v-if="seriesName">
        <dt v-if="seriesLogo"><img :src="seriesLogo"></dt>
        <dd :class="{'ellpsis': allbrandLink}">{{{seriesName}}}</dd>
        <dd v-if="allbrandLink" class="allbrandlink"><a :href="allbrandHref">全部品牌</a></dd>
      </dl>
      <div v-for="one in list">
        <p>{{one.categoryName}}</p>
        <dl v-for="item in one.categoryCollection" @click="clickHandler(item)" class="large"
            :class="{'highlightCur':item.id === selected}">
          <dt v-if="showLogo"><img :src="item.logo"></dt>
          <dd>
            <em>{{item.name}}</em>
            <span><b>{{item.price}}万</b><i v-if="item.tagText">{{item.tagText}}</i></span>
          </dd>
        </dl>
      </div>
    </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-car-list{
    dl{
      position: relative;
      height: px2rem(120);
      /*line-height: px2rem(120);*/
      box-sizing:border-box;
      background: #fff;
      display:flex;
      align-items: center;
      margin:0 px2rem(30);

      &.large{
        @include borderBottom;
        padding:px2rem(30) 0;
        height:auto;

        &:last-child{
          border:0;
        }
        &.highlightCur {
          dd {
            em { color: #E15436; }
            &:after {
               content: '';
               display: block;
               position: absolute;
               right: 0;
               top: 50%;
               margin-top: px2rem(-15);
               width:px2rem(30);
               height:px2rem(30);
               background: transparent url(./tick.png) 0 0 no-repeat;
               background-size: 100% 100%;
             }
          }
        }
      }

      dt{
        @include fsize(28);
        display: flex;
        width: px2rem(120);
        margin-right: px2rem(30);
        justify-content: center;
        align-items: center;

        img{
          max-width: 100%;
          max-height: 100%;
          display: block;
        }
      }

      dd{
        @include fsize(28);
        color:$dark-color;
        display: block;

        em{
          @include fsize(32);
          color:#000;
          font-style: normal;
          display: block;
          font-weight: normal;
          line-height: $main-line-height;
        }

        span{
          @include fsize(28);
          display: block;
          white-space: nowrap;
          color:#e15436;
          margin-top: px2rem(16);
          line-height: $main-line-height;

          b,i{
            font-style:normal;
            vertical-align: middle;
            display: inline-block;
            color:#e15436;
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
      }
      dd.ellpsis {
        width: 5em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      dd.allbrandlink {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(0, -50%);
        color: #9C9FA1;
        @include fsize(28);
        a {
          display: block;
          height: 100%;
          padding: px2rem(20) px2rem(32) px2rem(20) 0;
          color: #9C9FA1;
          background: #fff url(./right_arrow.png) right center no-repeat;
          background-size: px2rem(12) auto;
        }
      }
    }

    p{
      @include fsize(32);
      color:$dark-color;
      background: #f5f5f5;
      padding:0 px2rem(30);
      line-height: px2rem(56);
    }

    h6{
      @include fsize(28);
      font-weight: normal;
      line-height: px2rem(74);
      color:#000;
      padding:0 px2rem(30);
    }
  }
</style>

<script>
export default {
  props:{
    api: String,
    interface: String,
    method: String,
    seriesId: Number,
    seriesName: String,
    seriesLogo: String,
    onlyOnSale: Boolean,
    showLogo: Boolean,
    cityId: Number,
    selected: Number,
    tag: Boolean,
    from: [String, Number],
    allbrandLink: Boolean,
    allbrandHref: String
  },
  data () {
    return {
      list: []
    }
  },

  computed: {
    apiUrl(){
      return this.interface || `${this.api}base/car/GetCarSelectorCarList`
    },
    isPost(){
      return this.method === 'post'
    }
  },

  watch: {
    seriesId(value){
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
        csId: this.seriesId,
        onlyOnSale: this.onlyOnSale,
        needTag: this.tag,
        cityId: this.cityId || 0,
        from: this.from
      }
      this.$http[this.method](this.apiUrl, this.isPost ? params : {params}).then(response => response.json().then(res => {
        if(res.result){
          this.list = res.data
            // console.log(res.data)
          this.$nextTick(() => this.$emit('rendered'))
        }
      }))
    },

    clickHandler(car){
      this.$emit('callback', {
        car: {
          id: car.id,
          name: car.name,
          logo: car.imgUrl,
          spell: car.spell,
          price: car.price
        }
      })
    },
  },

  created(){
  },

  components:{
  },
}
</script>