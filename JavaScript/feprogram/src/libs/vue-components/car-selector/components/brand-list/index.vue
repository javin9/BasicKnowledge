<template>
  <ul class="component-brand-list" v-el:list>
    <li v-for="one in list"  data-bar-index="{{one.categoryName}}">
      <h6>{{one.categoryName}}</h6>
      <div class="component-brand-list-item" v-for="item in one.categoryCollection" @click="clickHandler(item)">
        <div class="component-brand-list-item-img" v-if="showLogo">
          <img :src="item.imgUrl" v-if="one.inview"/>
        </div>
        <div class="component-brand-list-item-name">{{item.name}}<em v-if="item.tagText">{{item.tagText}}</em></div>
      </div>
    </li>
  </ul>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-brand-list{
    width: 100%;

    li{
      h6{
        @include fsize(32);
        color:$dark-color;
        padding:0 px2rem(30);
        background: #f5f5f5;
        line-height: px2rem(56);
      }
    }

    &-item{
      display:flex;
      align-items: center;
      height:px2rem(120);
      padding:0 px2rem(30);

      &:last-child &-name{
        border:0;
      }

      &-img{
        width: px2rem(80);
        display: block;
        margin-right: px2rem(30);

        img{
          width: 100%;
        }
      }

      &-name{
        @include borderBottom;
        @include fsize(32);
        color:$dark-color;
        flex:1;
        display: block;
        line-height: px2rem(120);
        height: 100%;
        color:$dark-color;
        position: relative;

        em{
          @include border(#46ADF3);
          font-size:px2rem(24);
          position:absolute;
          border-radius:px2rem(16) 0 px2rem(16) 0;
          right:px2rem(33);
          top:50%;
          transform:translateY(-50%);
          color:#46ADF3;
          padding:0 px2rem(10);
          line-height: px2rem(32);
        }
      }
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
    tag: Boolean,
    from: [String, Number]
  },

  data () {
    return {
      // 不懒加载的条目最少数量
      notLazyMinCount:15,

      list: []
    }
  },

  computed: {
    apiUrl(){
      return this.interface || `${this.api}base/car/GetCarSelectorCarMasterBrandList`
    },
    isPost(){
      return this.method === 'post'
    }
  },

  events:{
    scrollEnd(){
      const winH = $(window).height()
      const $list = $(this.$els.list).find('li')
      this.list.forEach((item, index)=>{
        const $target = $list.eq(index).find('h6').eq(0)
        const top = $target.offset().top
        if(top <= winH && !item.inview){
          item.inview = true
        }
      })
    }
  },

  methods: {
    clickHandler(brand){
      this.$emit('callback', {
        brand: {
          id: brand.id,
          name: brand.name,
          logo: brand.imgUrl
        }
      })
    }
  },

  created(){
    const params = {
      onlyOnSale: this.onlyOnSale,
      needTag: this.tag,
      from: this.from
    }
    this.$http[this.method](this.apiUrl, this.isPost ? params : {params}).then(response => response.json().then(res => {
      if(res.result){
        let notLazyTotal = 0
        this.list = res.data.map((item, index)=>{
          item.inview = notLazyTotal <= this.notLazyMinCount
          notLazyTotal += item.categoryCollection.length
          return item
        })
        this.$nextTick(() => this.$emit('update', (res.data || []).map(res => res.categoryName)))
        this.$nextTick(() => this.$emit('rendered', 'brandlist'))
      }
    }))
  },

  components:{
  }
}
</script>