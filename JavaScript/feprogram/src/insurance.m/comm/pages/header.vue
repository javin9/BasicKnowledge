<template>
  <header class="top_title">
  	<a href="javascript:history.back();" class='left'>
	  	<!-- <i class="icon" :class="leftClass"></i> -->
      <img src="../images/icon/fanhui.png" alt="Alternate Text" />
	  	<span v-html="left" ></span>
  	</a>
  	<a href="javascript:void(0)" class="fontSize_17 center">{{title}}</a>
  	<a href="javascript:history.back();" class='right'>
  		<i class="icon" :class="rightClass"></i>
  		<span v-html="right"></span>
  	</a>
  </header>
</template>
<script>
export default {
	props: ['title','left','right','leftClass','rightClass'],
  	data () {
	    return {
        
	    }
  	},
  	created(){
  		// console.log(this.title)
  	}
}
</script>