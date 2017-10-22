<template>
    <div id="citySelectComponent" class="defaultAniCity {{drawAniCity}}">
        <header class="vue-city-select-header-bar">
            <a @click="closeLayer" class="vue-city-select-backGoPage"></a>
            <h3 class="vue-city-select-font-navs">选择地区</h3>
        </header>
        <div class="relative-position">
            <div class="wrapper {{loading_gray}}">
                <div class="scroller">
                    <div class="citySelect-content">
                        <div v-show="!onlyCityList" id="no_list">
                            <!--搜搜-->
                            <section class="vue-citySelect-search">
                                <div letter="搜" @click="showsearch" class="vue-citySelect-search-content">
                                    <span class="vue-citySelect-search-icon"></span>
                                    <span class="vue-citySelect-search-text">搜索城市/省份</span>
                                </div>
                            </section>
                            <!--定位城市 -->
                            <section class="vue-citySelect-localCity">
                                <div letter="定" class="vue-citySelect-content-tips">定位城市</div>
                                <div class="vue-citySelect-content-cityBlock" @click="clickCity(curcity,1)">
                                    {{curcity.name}}
                                </div>
    
                                <div class="clear"></div>
                            </section>
                            <!--最近浏览-->
                            <section v-if="visitedCity&&visitedCity.length>0" class="citySelect-visitedCity">
                                <div class="vue-citySelect-content-tips">最近浏览</div>
                                <div v-for="info in visitedCity" class="vue-citySelect-content-cityBlock" @click="clickCity(info)">
                                    {{info.name}}
                                </div>
                                <div class="clear"></div>
                            </section>
                            <!--热门城市-->
                            <section class="citySelect-hotCity">
                                <div letter="热" class="vue-citySelect-content-tips">热门城市</div>
                                <div v-for="info in hotCityList" @click="clickCity(info)" class="vue-citySelect-content-cityBlock">
                                    {{info.name}}
                                </div>
                                <div class="clear"></div>
                            </section>
                        </div>
                        <!--所有城市-->
                        <section class="citySelect-allCity">
                            <div v-for="(j,allCity) in listCity" letter={{allCity.groupName}}>
                                <div class="citySelect-allCity-letter">{{allCity.groupName}}</div>
                                <div v-for="info in listCity[j].itemCollection" @click="clickCity(info)" class="citySelect-allCity-text">
                                    {{info.name}}
                                </div>
                            </div>
                            <div class="clear"></div>
                        </section>
                    </div>
                </div>
            </div>
            <!--首字母导航-->
            <section id="vue-citySelect-letterList" class="vue-citySelect-letterList ">
            </section>
            <!--滑动时提示字母-->
            <div class="vue-tipsLetter"></div>
        </div>
    </div>
</template>

<script>
import './index.scss'
import IScroll from 'iscroll'

var myScroll;

export default {
    name: 'vue-city-select-all',
    props: {
        //父组件-跳转方法
        go: {
            type: Function,
            default: function () { }
        },
        //父组件-打开搜索组件方法
        showsearch: {
            type: Function,
            default: function () { }
        },
        //接口地址
        interface:
        {
            type: String
        },
        //接口地址
        getHotAreasUrl:
        {
            type: String
        },
        //当前城市
        curcity:
        {
            type: Object,
            default: {}
        },
        //父组件-关闭当前组件方法
        xall:
        {
            type: Function,
            default: function () { }
        },
        //是否只显示城市列表
        onlyCityList: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            //字母ABCD
            letterArr: [],
            //城市列表list
            listCity: [],
            //热门城市list
            hotCityList: [],
            //历史访问记录
            visitedCity: [],
            //出场动画
            drawAniCity: '',
            //加载图
            loading_gray: ''
        }
    },
    ready() {
        setTimeout(() => {
            //初始化组件
            this.init(this.curcity);
            //滚动条
            myScroll = new IScroll('#citySelectComponent .wrapper', {
                scrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: true,
                click: true,
                scrollbars: false
            });
        }, 500)
    },
    events: {
        /**
        * 外部唤起组件方法打开当前组件
        */
        loadAllView() {
            this.drawAniCity = 'drawAniCity';
        }
    },
    methods: {
        /**
        * 城市组件列表点击事件
        * 参数:data（城市数据），toPage（制定跳转的位置，当topage等于1时，不许跳转下一级城市，直接跳转）
        */
        clickCity(data, toPage) {
            //id=0的时候说明选择的是全国，直接跳转
            if (data.id == 0)
                this.go(data, 1);
            else
                this.go(data, toPage);
        },
        /**
        * 渲染组件
        * 参数:data（城市数据）
        */
        render(cityDatas) {
            //初始化数据
            this.listCity = cityDatas.listCity;
            this.curcity = cityDatas.curcity;
            this.$nextTick(() => {
                myScroll.refresh();
            })
        },
        /**
        * 初始化组件
        * 参数:curcity（当前城市数据）
        */
        init(curcity) {
            //创建静态DOM
            this.domOpration();
            //获取cookie里城市
            var visitedCityCookie = tools.getCookie("visited_City")
            if (visitedCityCookie) {
                this.visitedCity = JSON.parse(visitedCityCookie);
            }
            //异步获取数据
            let params = {}
            const request = this.jsonp ? this.$http.jsonp.bind(this.$http) : this.$http.get.bind(this.$http)
            request(this.interface, this.jsonp ? { params } : params).then(response => response.json().then(res => {
                if (res.result) {
                    var cityDatas = {};
                    cityDatas.curcity = this.curcity;
                    cityDatas.listCity = res.data;
                    var html = '';
                    if (!this.onlyCityList) {
                        html += '<div>搜</div>';
                        html += '<div>定</div>';
                        html += '<div>热</div>';
                    }
                    for (var i = 0; i < res.data.length; i++) {
                        html += '<div>' + res.data[i].groupName + '</div>';
                    }
                    this.render(cityDatas);
                    $('#vue-citySelect-letterList').html(html).show();
                    myScroll.refresh();

                } else {
                    console.log('获取城市数据异常' + res.message)
                }
            }))
            //异步热门城市数据
            this.$http.get(this.getHotAreasUrl).then(response => response.json().then(res => {
                if (res.Result) {
                    this.hotCityList = res.Data;
                    this.loading_gray = '';
                }
            }))
        },
        /**
        * 显示or隐藏组件方法
        */
        selectAnimate(state, callback) {
            var $citySelectComponent = $('#citySelectComponent');
            if (state == "show") {
                this.drawAniCity = 'drawAniCity';
            } else {
                this.drawAniCity = '';
                this.$nextTick(() => {
                    this.xall();
                });
            }
        },
        /**
        * 隐藏组件
        */
        closeLayer() {
            this.selectAnimate("hide");
        },
        /**
        * 加载页面需要的dom
        */
        domOpration() {
            var windowHeight = $(window).height();
            //DOM操作
            var $citySelect;
            $citySelect = $('#citySelectComponent');
            $citySelect.css({
                'width': '10rem',
                'height': windowHeight,
            });
            var $wrapper = $('#citySelectComponent .wrapper');
            //this.loading_gray='loading_gray';
            $wrapper.height(windowHeight);

            // 解决某些android浏览器 在浏览器工具栏显示隐藏后 城市控件高度不变的问题
            $(window).on('touchmove', '#citySelectComponent', function () {
                $citySelect.height(document.documentElement.clientHeight);
                $wrapper.height(document.documentElement.clientHeight);
            });

            var selCityNum = 1;
            var selCityClear = ""
            clearInterval(selCityClear);
            function updateHeight() {
                if (selCityNum < 10) {
                    $citySelect.height(windowHeight);
                    $wrapper.height(windowHeight);
                    selCityNum++;
                } else {
                    clearInterval(selCityClear);
                }
            }
            if (navigator.userAgent.indexOf("KOT49H") >= 0 || navigator.userAgent.indexOf("MQQBrowser") >= 0 || navigator.userAgent.indexOf("MicroMessenger") >= 0) {
                selCityClear = setInterval(updateHeight, 500);
            } else {
                this.$nextTick(() => {
                    updateHeight();
                })
            }
            //动画显示
            this.selectAnimate("show");
            setTimeout(() => {
                //字母提示框
                var $tipsLetter = $('.vue-tipsLetter');
                //字母列表操作
                var $letterList = $('.vue-citySelect-letterList');
                //将所有字母元素保存到数组中
                var letterArr = $letterList.find('div');
                //触摸事件处理
                $letterList.on("touchstart", function (e) {
                    e.preventDefault();
                    $tipsLetter.text($(e.target).text());
                    $tipsLetter.show();
                    myScroll.scrollToElement('div[letter="' + $(e.target).text() + '"]', 100);
                });
                $letterList.on("touchmove", function (e) {
                    e.preventDefault();

                    var touch = e.targetTouches[0];
                    var position = 0;
                    var dpr = $('html').attr('data-dpr');
                    if (dpr == '1') {
                        position = touch.clientY - 75;
                    }
                    if (dpr == '2') {
                        position = touch.clientY - 150;
                    }
                    if (dpr == '3') {
                        position = touch.clientY - 225;
                    }
                    var index = parseInt(position / ($($letterList.find('div')[0]).height()));
                    if (index < 0) {
                        index = 0;
                    } else if (index > $letterList.find('div').length - 1) {
                        index = $letterList.find('div').length - 1;
                    }
                    $tipsLetter.text($($letterList.find('div')[index]).text());
                    myScroll.scrollToElement('div[letter="' + $($letterList.find('div')[index]).text() + '"]', 100);
                });
                $letterList.on("touchend", function (e) {
                    e.preventDefault();
                    $tipsLetter.hide();
                });
            }, 500)
        }
    }
}
</script>