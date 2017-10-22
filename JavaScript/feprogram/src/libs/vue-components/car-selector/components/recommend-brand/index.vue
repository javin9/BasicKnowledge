<template>
	<div class="component-recommend-brand" data-bar-index="荐">
		<h6>推荐品牌</h6>
		<div class="component-recommend-brand-list">
			<div class="component-recommend-brand-item" v-for="one in list" @click="clickHandler(one)">                    
				<div class="component-recommend-brand-img">
					<img :src="one.Logo">
				</div>                                    
				<div class="component-recommend-brand-name">{{one.CarMasterBrandName}}</div>                                
			</div>
		</div>
	</div>
</template>

<style scoped>
  @import 'sassHelper/mixin';
  @import 'sassHelper/vars';

  .component-recommend-brand{
  	padding:px2rem(40) 0 px2rem(30);
    margin:0 px2rem(30);

  	h6{
  		@include fsize(36);
  		font-weight: normal;
      color:$dark-color;
      line-height: $main-line-height;
  	}

  	&-list{
  		background-color: #fff;
  		margin-top: px2rem(30);
	    width: 120%;
	    overflow: hidden;
  	}

  	&-item{
			width: px2rem(130);
      margin-right: px2rem(45);
	    float: left;
	    text-align: center;
	    background-color: #ffffff;
	    position: relative;
      margin-bottom: px2rem(10);
  	}

  	&-img{
			height: 0.8235294117647059rem;
	    text-align: center;

	    img{
	    	height: 100%;
		    display: inline-block;
	    }
		}

		&-name{
			@include fsize(26);
			line-height: px2rem(74);
		}
  }
</style>

<script>
export default {
  props:{
  	api: String,
    onlyOnSale: Boolean,
  	category: String
  },
  data () {
    return {
      list: []
    }
  },

  methods:{
    clickHandler(brand){
      this.$emit('callback', {
        brand: {
          id: brand.CarMasterBrandID,
          name: brand.CarMasterBrandName,
          logo: brand.Logo
        }
      })
    }
  },

  created(){
  	const params = {
  		onlyOnSale: this.onlyOnSale,
  		type: this.category,
      _:+new Date()
  	}
  	this.$http.jsonp(`${this.api}api/carrecommend/GetRecommendCarMasterBrands`, {params}).then(response => response.json().then(res => {
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