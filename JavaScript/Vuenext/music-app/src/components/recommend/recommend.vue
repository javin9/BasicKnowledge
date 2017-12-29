<template>
 <div>
 	
 </div>
</template>

<script>
import {ERR_OK} from 'api/config.js';
import {getRecommend} from 'api/recommend';

export default {
  name: 'recommend',
  data:function() {
  	/* body... */
  },
  created:function(){
       this.getRecommend();
  },
  methods:{
  	getRecommend:function () {
  		getRecommend().then((data)=>{
  			console.log(data)
  		});
  	}
  },
  data:function() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
