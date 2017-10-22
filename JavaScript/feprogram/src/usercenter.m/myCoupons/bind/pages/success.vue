<template>
  <h1>
    <p>兑换成功，前去易鑫车贷下单立享优惠，</p>
    <p>或查看已获得的优惠券</p>
  </h1>
  <a class="submit-button" :href="successLink" v-if="successLink">{{successLinkText}}</a>

  <section v-if="successMoreLink">
    <a :href="successMoreLink">{{successMoreLinkText}}&nbsp;&gt;&gt;</a>
  </section>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  h1{
    padding:px2rem(22) 0 px2rem(59);

    p{
      @include fsize(32);
      text-align: center;
      line-height: $main-line-height;
      color:#fff;
      font-weight: normal;
    }
  }

  section{
    text-align: center;
    margin-top:px2rem(57);
    text-align: center;

    a{
      @include fsize(28);
      color:#fff !important;
      text-decoration: underline;
      line-height: $main-line-height;
    }
  }
</style>

<script>
export default {
  props:[
    'successLink',
    'successLinkText',
    'successMoreLink',
    'successMoreLinkText'
  ],
  data () {
    return {
    }
  },

  created(){
  },

  components:{
  }
}
</script>