<template>
 <div>
		<h2>用户中心 </h2>
		<div  v-if="(userinfo&&userinfo.userName)">
			 <br />ID :{{$route.params.id}}
		     <br />tip :{{userinfo.tip}}
		     <br />用户名 :{{userinfo.userName}}
		     <br />爱好:{{userinfo.hobby}}
		</div>

    <table>
    	<tr v-for="(item,index) in userlist">
	    	<td>id</td><td>{{item.id}}</td>
	    	<td>tip</td><td>{{item.tip}}</td>
	    	<td>userName</td><td><router-link :to="'/user/'+item.id">{{item.userName}}</router-link></td>
	    	<td>hobby</td><td>{{item.hobby}}</td>
    	</tr>
    </table>
   <div class="bottom-div">
   	     <router-link to="?type=attention">我的关注</router-link>
   	   <router-link to="?type=share">我的分享</router-link>	
   	    <router-link exact :to="{path:'',query:{info:'follow'}}">他的关注</router-link>
      <router-link exact :to="{path:'',query:{info:'share'}}">他的分享</router-link>
   </div>
 </div>
</template>
<script>
  let data = [
    {
      id:1,
      tip:'vip',
      userName:"leo1",
      sex:'男',
      hobby:'写代码'
    },
    {
      id:2,
      tip:'vip',
      userName:"leo2",
      sex:'男',
      hobby:'唱歌'
    },
    {
      id:3,
      tip:'common',
      userName:"leo3",
      sex:'男',
      hobby:'读书'
    }
  ]
export default {
  name: 'hello',
  data:function() {
    return {
      msg: 'Welcome to Your Vue.js App',
      userlist:data,
      userinfo:{}
    }
  },
  watch:{
   $route:function(){
   console.log('watching·······');
   	this.getData();
   }
  },
  methods:{
  	getData:function () {
  	   var id=this.$route.params.id;
  	   console.log(id);
  	  if (id) {
  	  	 this.userinfo=this.userlist.filter(function(item) {
	   	  return item.id==id;
	   })[0];
  	  } else {
          this.userinfo = {};
  	  }
	  
  	}
  },
  created:function () {
    this.getData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 tr,td{border:1px solid #000;}
 .active{background:#B0E2FF;}
 .bottom-div{border-top:1px solid #000;}
</style>
