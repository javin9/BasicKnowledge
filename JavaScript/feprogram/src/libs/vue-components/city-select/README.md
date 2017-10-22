# 通用登录弹层

### 使用html
<city-select @selected="selectedHanlder" v-bind:location-city-id="201" v-bind:location-city-name="北京" v-bind:location-city-spell="beijing"></city-select>

### js

import Vue from 'vue';
import VueResource from 'vue-resource'
import CitySelect from 'libs/vue-components/city-select'
Vue.use(VueResource)

View组件.$broadcast('showCitySelect')


methods:{
  selectedhanlder(res){
     console.log(res);
  }
}

### props
	* interface: String, 调用接口, 默认取 api/Common/GetGroupingCityList?callback=?
	* jsonp: Boolean, 是否跨域，默认false

### events
	* showCitySelect: 显示弹层

	