<template>
<div>
	   <h3>简单的计算器</h3>
   <div>
   	 <input type="button" name="" value="-" @click="reduce">
   	 <span>{{count}}</span>
   	 <input type="button" name="" value="+" @click="add">
   	 <input type="button" name="" value="add1+" @click="add1">
   	 <input type="button" name="" value="+" @click="add2">
   	 <input type="button" name="" value="addAsync+" @click="addAsync">
   	 <div style="text-align:center;">{{count2}}</div>
   </div>
</div>


</template>

<script>
export default {
  name: 'hello',
  computed:{
    count(){
     	return this.$store.state.count;
    },
    count2(){
    	return this.$store.getters.filercontent;
    }
  },
  methods:{
  	add(){
  		this.$store.commit("add");//第一种写法
  	},
  	add1(){
  		this.$store.commit("add1",3);//第二种写法
  	},
  	add2(){//第三种写法
  		this.$store.commit({
  			type:"add2",
             addvalue:5
  		});
  	},
  	reduce(){
  		this.$store.commit("reduce");
  	},
  	addAsync(){
  		this.$store.dispatch("addActions");
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h3{font-size:20px;color:#555;text-align: center;padding-top:50px;}
</style>
