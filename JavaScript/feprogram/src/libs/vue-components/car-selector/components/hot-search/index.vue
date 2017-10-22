<template>
  <div class="component-hot-search">
    <h2>热门搜索</h2>
    <ul>
      <li v-for="one in list" @click="clickHandler(one)">{{one.CarSerialName}}</li>
    </ul>
  </div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-hot-search{
    background: #fff;
    padding:px2rem(50) px2rem(30);

    h2{
      @include fsize(36);
      font-weight: normal;
      line-height: 1.5;
    }

    ul{
      margin-top: px2rem(30);
      margin-right: px2rem(-40);
      font-size:0;

      li{
        font-size: px2rem(26);
        display: inline-block;
        border-radius: px2rem(5);
        background: #f5f5f5;
        color: $normal-color;
        line-height: px2rem(68);
        text-align: center;
        margin: 0 px2rem(15) px2rem(25) 0;
        width: px2rem(210);
        overflow: hidden;
        box-sizing: border-box;
        padding: 0 px2rem(10);
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>

<script>
export default {
  props:{
    api: String,
    category: String
  },
  data () {
    return {
      list: []
    }
  },

  methods:{
    clickHandler(series){
      this.$emit('callback', {
        brand: {},
        series: {
          id: series.CarSerialID,
          name: series.CarSerialName,
          logo: series.ImageUrl,
          spell: series.CarSerialAllSpell
        }
      })
    }
  },

  created(){
    const params = {
      type: this.category,
      _: +new Date()
    }
    this.$http.jsonp(`${this.api}api/carrecommend/GetHotSearchCarSerials`, {params}).then(response => response.json().then(res => {
      if(res.Result){
        this.list = res.Data
      }
    }))
  },

  components:{
  }
}
</script>