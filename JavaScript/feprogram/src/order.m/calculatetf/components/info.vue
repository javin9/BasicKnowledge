<template>
	<!-- 基本信息面板 -->
	<section class="pannel">
		<ul>
			<li @click="selectCar()">
				<span>品牌车型</span>
				<span class="select"><b>{{{car}}}</b></span>
			</li>
			<li @click="selectCity()">
				<span>购车城市</span>
				<span class="select">{{city || ''}}<i v-if="!city">请选择</i></span>
			</li>
			<li>
				<span v-if="price === sourcePrice">4S店平均报价</span>
        <span v-else>车价</span>
				<span><b><input type="number" v-model="price" lazy number @blur="editingPrice=false" v-show="editingPrice" id="editing-price"></b><em @click="editPrice()" v-show="!editingPrice">{{{price | format}}}</em></span>
			</li>
		</ul>
	</section>

  <car-selector :show-hot-series="true" :level="3" :show-search="false" @callback="carSelectHandler"></car-selector>
</template>

<style scoped>
  @import '../vars';
  @import '../mixin';

  .pannel {
    margin-bottom: 0;
    > ul li {
      border-bottom: 1px solid #e5e5e5;
    }
  }
  span em{
    line-height: px2rem(93);
  }

  input[type=number]{
    width: px2rem(200) !important;
  }
</style>

<script>
import citySelect from 'libs/citySelect'
import carSelector  from 'libs/vue-components/car-selector'

export default {
  data () {
    return {
      price:  ~~(initData.price*10000),
      sourcePrice:  ~~(initData.price*10000),
      city: initData.city,
      car: initData.car,

      params: {
        cityId: initData.cityId,
        carId: initData.carId,
        bar: initData.bar
      },

      // 修改价格控制
      editingPrice: false
    }
  },

  watch:{
    'params.cityId': function() {
      this.reloadPage()
    },
    'params.carId': function(){
      this.reloadPage()
    }
  },

  methods: {
  	// 选择城市
  	selectCity(){
  		citySelect.citySelect(ipLocationInfo, (result) => {
        this.params.cityId = result.CityId
      })
  	},

    editPrice(){
      this.editingPrice=true
      this.$nextTick(function(){
        document.getElementById('editing-price').focus()
      })
    },

  	// 选择车型
  	selectCar(){
      this.$broadcast('showCarSelector')
  	},

    carSelectHandler(res){
      this.params.carId = res.car.id
    },

    // 重新加载页面
    reloadPage(){
      window.location.href = window.location.origin + window.location.pathname + '?' + $.param(this.params)
    }
  },

  components:{
    carSelector
  }
}
</script>