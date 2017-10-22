<template>
    <div id="citySelectCity" class="defaultAniCity {{drawAniCity}}">
        <div class="wrapper">
            <header class="vue-city-select-header-bar">
                <a @click="closeLayer" class="vue-city-select-backGoPage"></a>
                <h3 class="vue-city-select-font-navs">{{cinfo.name}}</h3>
            </header>
            <div v-if="cinfo.level!=0" v-show="!onlyCityList" class="citySelect-allCity-text" @click="clickCity(cinfo,1)">
                <span>不限</span>
            </div>
            <div v-for="info in cityList" @click="clickCity(info)" class="citySelect-allCity-text">
                {{info.name}}
            </div>
        </div>
    </div>
</template>

<script>
import './index.scss'
import IScroll from 'iscroll'

var myScroll;

export default {
    name: 'vue-city-select-city',
    props: {
        //父组件-关闭当前组件
        xcity: {
            type: Function,
            default: function () { }
        },
        //父组件-跳转方法
        go: {
            type: Function,
            default: function () { }
        },
        //当前点击的城市
        cinfo: {
            type: Object,
            default: {}
        },
        //搜索城市接口地址
        getCityList:
        {
            type: String,
        },
        //是否只显示城市列表
        onlyCityList: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            cityList: [],
            drawAniCity: ''
        }
    },
    events: {
        /**
        * 外部唤起组件方法打开当前组件
        */
        loadCityView() {
            this.drawAniCity = 'drawAniCity';
        }
    },
    ready() {
        //让所有的文本框失去焦点
        $("input:focus").blur();
        //滚动条
        myScroll = new IScroll('#citySelectCity', {
            scrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            click: true,
            scrollbars: false
        });
        this.render(this.cinfo);
    },
    methods: {
        /**
        * 点击城市列表
        */
        clickCity(data, toPage) {
            //如果type==1强制跳转
            if (toPage && toPage == 1) {
                //callback父组件方法
                this.go(data, toPage);
            } else {
                if (data.level == 2) {
                    this.go(data);
                } else {
                    this.cityList = [];
                    this.render(data);
                }
            }
        },
        /**
       * 渲染页面
       */
        render(info) {
            if (info) {
                //判断当前城市是否去区域 level=0 就是京津冀级别的区域
                if (info.level == 0) {
                    this.cityList = info.children;
                } else {
                    this.cinfo = info;
                    let url = this.getCityList + '?provinceId=' + info.id;
                    this.$http.get(url).then(response => response.json().then(res => {
                        if (res.result) {
                            this.cityList = res.data;
                            this.$nextTick(() => {
                                myScroll.refresh();
                            })
                        }
                    }))
                }
            } else {
                this.cityList = [];
            }
        },
        /**
        * 关闭当前组件
        */
        closeLayer() {
            this.drawAniCity = '';
            this.$nextTick(() => {
                this.xcity();
            })


        }
    }
}
</script>