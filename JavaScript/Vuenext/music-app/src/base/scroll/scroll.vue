<template>
  <div ref="wrapper"  class="abc">
  	<slot></slot>
  </div>
</template>

<script>
import BetterScroll from 'better-scroll';
export default {
  props:{
  	probeType:{
  		type:Number,
  		default:1
  	},
  	click:{
  		type:Boolean,
  		default:true
  	},
  	data:{
  		type:Array,
  		default:null
  	}
  },
  data:function() {
    return {
      msg:'name',
      scroll:null
    }
  },
  methods:{
  	initScroll(){
  		if (!this.$refs.wrapper) {return false;}
      console.log(this.$refs.wrapper);
  		this.scroll=new BetterScroll(this.$refs.wrapper,{
  			probeType:this.probeType,
  			click:this.click
  		});
  	},
  	enable(){
  		!!this.scroll&&this.scroll.enable();
  	},
  	disable(){
  		!!this.scroll&&this.scroll.disable();
  	},
  	refresh(){
      console.log('refresh');
  		!!this.scroll&&this.scroll.refresh();
  	}
  },
   mounted(){
  	var that=this;
  	 setTimeout(function(){
  	 	that.initScroll();
  	 },20)
  },
  watch:{
  	data(){
  		var that=this;
  		setTimeout(function () {
        console.log(that.data);
  			that.refresh();
  		},20);
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
