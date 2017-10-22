
<template>
    <all v-if="allView" v-bind:only-city-list="onlyCityList" v-bind:get-hot-areas-url="getHotAreasUrl" v-bind:interface="interface" v-bind:go="go" v-bind:xall="xall" v-bind:showsearch="showsearch" v-bind:curcity="curcity">
    </all>
    <search v-if="searchView" v-bind:share-city-url="shareCityUrl" v-bind:xsearch="xsearch" v-bind:go="go"></search>
    <city v-if="cityView" v-bind:only-city-list="onlyCityList" v-bind:get-city-list="getCityList" v-bind:cinfo="cinfo" v-bind:xcity="xcity" v-bind:go="go"></city>
</template>
<script>
import './index.scss'
import All from './all.vue'
import Search from './search.vue'
import City from './city.vue'

export default {
    name: 'vue-city-select',
    props: {
        //获取全部省份接口地址
        interface:
        {
            type: String,
            default: 'http://test.webapi.daikuan.com/base/region/GetGroupingProvinceList'
        },
        //热门接口地址
        getHotAreasUrl:
        {
            type: String,
            default: 'http://test.ershouche.mr.daikuan.com/Interface/GetHotAreas'
        },
        //搜索城市接口地址
        shareCityUrl:
        {
            type: String,
            default: 'http://test.webapi.daikuan.com/base/region/SearchCity'
        },
        //城市接口地址
        getCityList:
        {
            type: String,
            default: 'http://test.webapi.daikuan.com/base/region/GetCityList'
        },
        //是否显示热门城市
        noHotCity: {
            type: Boolean,
            default: false
        },
        //定位城市ID
        locationCityId: {
            type: String,
            default: '201'
        },
        //定位城市Name
        locationCityName: {
            type: String,
            default: '北京'
        },
        //定位城市Spell
        locationCitySpell: {
            type: String,
            default: 'beijing'
        },
        //是否只显示城市列表
        onlyCityList:{
            type:Boolean,
            default:false,
        }
    },
    data() {
        return {
            //当前城市默认值
            curcity: {
                id: this.locationCityId,
                name: this.locationCityName,
                spell: this.locationCitySpell,
                level:2
            },
            //最近浏览城市
            visitedCity: [],
            //三个组件状态allView，searchView，cityView
            allView: false,
            searchView: false,
            cityView: false,
            //城市信息，组建之间参数
            cinfo: {}
        }
    },
    ready() {
        //让所有的文本框失去焦点
        $("input:focus").blur();
        //获取cookie里面的值，获取到最近访问城市记录
        var visitedCityCookie = tools.getCookie("visited_City")
        if (visitedCityCookie) {
            this.visitedCity = JSON.parse(visitedCityCookie);
        }
    },
    events: {
        /**
        * 外部唤起组件方法
        * 参数:data,func
        */
        showCitySelect() {
            this.allView = true;
            //首先移除监听事件
            $(document).off('click');
        }
    },
    methods: {
        /**
        * 关闭城市子组件
        */
        xall() {
            this.allView = false;
        },
        /**
        * 关闭搜索子组件
        */
        xsearch() {
            this.searchView = false;
        },
        /**
        * 关闭城市子组件
        */
        xcity() {
            this.cityView = false;
        },
        /**
        * 打开搜索子组件
        */
        showall() {
            this.allView = true;
            this.$nextTick(() => {
                this.$broadcast('loadAllView');
            });
        },
        /**
        * 打开搜索子组件
        */
        showsearch() {
            this.searchView = true;
            this.$nextTick(() => {
                this.$broadcast('loadSearchView');
            });
        },
        /**
        * 打开城市子组件
        */
        showCity() {
            this.cityView = true;
            this.$nextTick(() => {
                this.$broadcast('loadCityView');
            });
        },
        /**
        * 城市组件列表点击事件
        */
        go(data, toPage) {
            //如果type==1就是选择的不限省份，直接callback页面
            if (toPage & toPage == 1) {
                if (data.level == 2) {
                    //只有城市存入历史记录
                    this.setHistoryCtiy(data);
                } else {
                    this.setSelectProvinceIdCookie(data.id, data.level);
                }
                this.$emit('selected', data);
                this.xall(); 
                this.xcity() 
            } else {
                if (data.level == 2) {
                    //只有城市存入历史记录
                    this.setHistoryCtiy(data);
                   this.$emit('selected', data);
                    this.xall(); 
                    this.xcity() 
                } else {
                    this.cinfo = data;
                    this.showCity();
                }
            }
        },
        /**
        * 将城市存入历史记录
        * 参数:callbackData
        */
        setHistoryCtiy(callbackData) {
            //存入历史城市
            var _cityObj = callbackData, _visitedCityIndex, _visitedCitylength = this.visitedCity.length;

            for (let i = 0; i < this.visitedCity.length; i++) {
                if (_cityObj.id == this.visitedCity[i].id) {
                    _visitedCityIndex = i;
                    break;
                } else
                    _visitedCityIndex = -1;
            }
            if (_visitedCityIndex >= 0)
                this.visitedCity.splice(_visitedCityIndex, 1);
            else {
                if (_visitedCitylength == 3)
                    this.visitedCity.pop();
            }
            this.visitedCity.unshift(_cityObj);
            if (document.domain.search(".daikuan.com") != -1)
                tools.setCookie("visited_City", JSON.stringify(this.visitedCity), "", ".daikuan.com");
            else
                tools.setCookie("visited_City", JSON.stringify(this.visitedCity), "", document.domain);
            //后端需要的cookie
            if (this.curcity && this.curcity.isSaveCookie != false) {

                if (document.domain.search(".daikuan.com") != -1) {
                    tools.setCookie("selectProvinceId", null, "-1", ".daikuan.com");
                    tools.setCookie("selectCityId", _cityObj.id, "", ".daikuan.com");
                }

                else {
                    tools.setCookie("selectProvinceId", null, "-1", document.domain);
                    tools.setCookie("selectCityId", _cityObj.id, "", document.domain);

                }
            }
        },
        setSelectProvinceIdCookie(id, level) {
            //后端需要的cookie
            if (level == 1) {
                if (document.domain.search(".daikuan.com") != -1)
                    tools.setCookie("selectProvinceId", id, "", ".daikuan.com");
                else
                    tools.setCookie("selectProvinceId", id, "", document.domain);
            } else {
                if (document.domain.search(".daikuan.com") != -1)
                    tools.setCookie("selectProvinceId", 0, "", ".daikuan.com");
                else
                    tools.setCookie("selectProvinceId", 0, "", document.domain);
            }
        }
    }


    ,
    components: {
        All,
        Search,
        City
    }
}
</script>