<template>
  <div>
  	<ul>
  		<li v-for="item of  singers">{{item.Fsinger_name}}</li>
  	</ul>
  </div>
</template>

<script>
import {getSingers} from 'api/data.js';

class SingerClass{
  constructor({mid,name}){
      this.mid=mid,
      this.name=name,
      this.avatar=`https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
  }
};
export default {
  created(){
      this.getSingers();
  },
  data:function() {
    return {
      singers:[]
    }
  },
  methods:{
     getSingers(){
     	 var that=this;
     	getSingers().then(function (data) {
     		console.log(data)
     		that.singers=data.data.list;
     		that.normalizeSingers(that.singers);
     	});
     },
     normalizeSingers(list){
         var map={
         	hot:{
         		char:'热',
         		list:[]
         	}
         };

         list.forEach((item,index)=>{
         	if (index<9) {
                map.hot.list.push(new SingerClass({
            	mid:item.Fsinger_mid,
            	name:item.Fsinger_name
            }));
         	}

            var key=item.Findex;
            if (!map[key]) {
            	map[key]={
            		char:key,
            		list:[]
            	}
            }
            map[key].list.push(new SingerClass({
            	mid:item.Fsinger_mid,
            	name:item.Fsinger_name
            }));
         });
         console.log(map)
     }
  },
  computed:{

  },
  components:{

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
