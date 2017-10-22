<template>
  <div class="component-all-brand">全部品牌</div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';
  
  .component-all-brand{
    @include fsize(36);
    line-height: $main-line-height;
    padding:px2rem(38) px2rem(30);
    color:$dark-color;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAUCAQAAAAT+RSaAAAAzUlEQVQYGWXBMS9DYRiG4fdIalGrGbtBdwtmk4HVZmSy+QEdbE3u5yuS6nQmsUgjjb0WP8AqmCRnoQl9jE6/c13BnSbXq9GkMdYrG5G7XNYY6zNtRa5cpMT60l7kvEAP60dH0ZTOMeYsmjjmF3PhInJpn2+sIa3IpW1VmPvBUuTo8IH1GLmrdV4wzzGPjt4xT4OVqNOuKsyobEddOtQUc0Mr6nSqGVbXRfxzoS7WjJOoo6Uh1lQHUVe2GWFV/Z2YpwfMW38zcrrVJK1Fwx++tXCARQG0twAAAABJRU5ErkJggg==) no-repeat right px2rem(30) center;
    background-size: px2rem(12) px2rem(20);
  }
</style>

<script>
export default {
  props:{},
  data () {
    return {
      
    }
  },

  components:{
  }
}
</script>