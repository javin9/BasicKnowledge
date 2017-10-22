<template>
	<div class="component-hot-car-series" data-bar-index="热">
		<h6>热卖车型</h6>
		<div class="component-hot-car-series-content">
			<div class="component-hot-car-series-car" v-for="one in list" @click="clickHandler(one)">
				<div class="component-hot-car-series-img">
					<img :src="one.ImageUrl">
				</div>
				<div class="component-hot-car-series-name">{{one.CarSerialName}}</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-hot-car-series{
    clear:both;
    background:#fff;
    margin:0 0 0 px2rem(30);
    padding:px2rem(40) 0;

    h6{
      @include fsize(36);
      font-weight: normal;
      color:$dark-color;
      line-height: $main-line-height;
    }

    &-content{
        overflow: hidden;
        margin-right: px2rem(-55);
    }

    &-car{
        float: left;
        margin-right: px2rem(55);
        margin-top: px2rem(30);
        text-align: center;

        img{
            width: px2rem(180);
            height:px2rem(120);
        }
    }

    &-name{
        @include fsize(26);
        color:$dark-color;
        @include ellipsis(px2rem(136));
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

  methods: {
    clickHandler(item){
      this.$emit('callback', {
        brand: {
          id: item.CarMasterBrandID,
          name: item.CarMasterBrandName
        },
        series: {
          id: item.CarSerialID,
          name: item.CarSerialName,
          logo: item.ImageUrl,
          spell: item.CarSerialAllSpell
        }
      })
    }
  },

  created(){
  	const params = {
  		amount: 6,
      type: this.category,
      _:+new Date()
  	}
  	this.$http.jsonp(`${this.api}api/carrecommend/GetStaticHotCarSerials`, {params}).then(response => response.json().then(res => {
  		if(res.Result){
  			this.list = res.Data
        this.$nextTick(() => this.$emit('rendered'))
  		}
  	}))
  },

  components:{
  }
}
</script>