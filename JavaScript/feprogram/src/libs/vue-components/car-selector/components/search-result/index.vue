<template>
  <div class="component-search-result">
    <div v-if="list.length || pending">
      <p v-for="one in list" @Click="clickHandler(one)">
        <strong v-if="one.type ==='主品牌'">查看所有“{{one.showname}}”品牌车型</strong>
        <span v-else>{{one.showname}}</span>
      </p>
    </div>
    <div class="component-search-result-empty" v-else>无相关信息，请调整关键字</div>
  </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-search-result{
   padding:0 px2rem(30);

   &-empty{
    @include fsize(28);
    text-align: center;
    margin-top: px2rem(160);
    padding-top: px2rem(136);
    background: url(./empty.png) no-repeat center top;
    background-size: px2rem(126) px2rem(98);
    color:$dark-color;
   }

   p{
    @include borderBottom;
    @include fsize(32);
    line-height: px2rem(110);
    color:$dark-color;

    strong{
      font-weight: bold;
      color:$dark-color;
      background-size: px2rem(26);
    }

    &:last-child{
      border:0;
    }
   }
  }
</style>

<script>
export default {
  props:{
    interface: {
      type: String,
      default: 'http://59.151.102.96/yichesugforcar.php'
    },
    value: String
  },

  data () {
    return {
      pending:false,
      list: []
    }
  },

  watch:{
    value(value){
      this.getList(value)
    }
  },

  events:{
    // 触发搜索
    searchResultActive(){
      if(this.list.length){
        // 防止键盘不收回
        $('input').blur()
        this.clickHandler(this.list[0])
      }
    }
  },

  methods:{
    getList(){
      if(this.value){
        const params = {
          k: this.value,
          _: +new Date()
        }
        this.pending = true
        this.$http.jsonp(this.interface, {params}).then(response => response.json().then(res => {
          this.list = res && res.filter(item => item.type !== '品牌') || []
          this.pending = false
        }))
      }
    },

    clickHandler(item){
      if(item.type ==='主品牌'){
        this.$emit('callback', {
          brand: {
            id: +item.id,
            name: item.name,
            logo: item.logo
          }
        })
      }else{
        this.$emit('callback', {
          brand: {},
          series: {
            id: +item.id,
            name: item.name,
            logo: '',
            spell: item.spell
          }
        })
      }
    }
  },

  created(){
    this.getList()
  },

  components:{
  }
}
</script>