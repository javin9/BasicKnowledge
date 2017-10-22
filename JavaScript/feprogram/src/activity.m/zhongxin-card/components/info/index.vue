<template>
	<section class="component-info">
		<a href="javascript:void(0)" @click="openRule"></a>
	</section>
  <component-rule></component-rule>
</template>

<style scoped>
  @import 'sassHelper/vars';
  @import 'sassHelper/mixin';

	.component-info{
    background: url(./info.png) no-repeat left top / contain;
    height: px2rem(325);
    margin-bottom: px2rem(35);
    position: relative;

    >a{
      display: block;
      position: absolute;
      height: px2rem(50);
      width: px2rem(160);
      right:px2rem(30);
      bottom:px2rem(85);
    }
	}
</style>

<script>
import ComponentRule from '../rule'

export default {
  props:[],

  data() {
    return {
    }
  },


  methods:{
   openRule(){
    this.$broadcast('showRule')
   }
  },

  components: {
    ComponentRule
  }
}
</script>