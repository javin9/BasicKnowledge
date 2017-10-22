<template>
    <div>
        <div class="list-bottom">
            <span class="list-bottom-y-bian"></span>
            <span class="list-bottom-text">看了又看</span>
            <span class="list-bottom-z-bian"></span>
        </div>
        <ul class="list-tabs">
            <li v-if="data_cityList.length>0" v-on:click="showCity()" v-bind:class="isShowCity?'cur':''" >
                <span>外地相同</span>
            </li>
            <li v-if="data_serialList.length>0" v-on:click="showBrach()"  v-bind:class="isShowBrach?'cur':''" >
                <span>本地相似</span>
            </li>
        </ul>
        <div v-if="data_cityList.length>0" v-show="isShowCity" id="list_city">
            <div class="list-supplement">
                <a href="javascript:;" v-for="(i,info) in data_cityList" v-on:click="cityEvent(i,info)" class="{{info.select?'select':''}}">{{info.name}}</a>
            </div>
            <div class="list_bg">
                <ul class="new_ul" v-html="cityListHtml">
                    {{cityListHtml}}
                </ul>
            </div>
        </div>
        <div v-if="data_serialList.length>0" v-show="isShowBrach" id="list_branch">
            <div class="list-supplement">
                <a href="javascript:;" v-for="(i,info) in data_serialList" v-on:click="serialEvent(i,info)" class="{{info.select?'select':''}}">{{info.name}}</a>
            </div>
            <div class="list_bg">
                <ul class="new_ul" v-html="serialListHtml">
                    {{serialListHtml}}
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
import Store from '../script/Store';
Store.ershoucheAPI = ershoucheUrl;
let cityListPage = 1;
let serialListPage = 1;
export default {
    //props: ['cityList','serialList'],
    data() {
        return {
            isShowCity: true,
            isShowBrach: false,
            data_cityList: [],
            data_serialList: [],
            cityListHtml: '',
            serialListHtml: '',
            cityListIsLoad: true,
            cityListParams: {
                brandId: BrandId,
                serialId: SerialId,
                chooserStr: chooserUrl,
                citySpell: cityInfo.spell,
                source: '1177',
            },
            serialListIsLoad: true,
            serialListParams: {
                serialId: SerialId,
                chooserStr: chooserUrl,
                citySpell: cityInfo.spell,
                source: '1178',
            }
        }
    },
    events: {
    },
    ready() {
        this.loadDomEvent();
        cityList != ''?this.isShowCity=true:this.isShowBrach=true;
        if (cityList != '') {
            cityList = $.parseJSON(cityList);
            this.cityEvent(0, cityList[0]);
        }
        if (serialList != '') {
            serialList = $.parseJSON(serialList);
            this.serialEvent(0, serialList[0]);
        }
      
        if (totalCount < 20) {
            window.onscroll = () => {
                if (this.getScrollTop() + this.getClientHeight() === this.getScrollHeight()) {
                    if (this.isShowCity) {
                        if (this.cityListIsLoad) {
                            this.cityListIsLoad = false;
                            cityListPage += 1;
                            var params = {
                                brandId: this.cityListParams.brandId,
                                serialId: this.cityListParams.serialId,
                                chooserStr: this.cityListParams.chooserStr + 'p' + cityListPage,
                                citySpell: this.cityListParams.citySpell,
                                source: this.cityListParams.source,
                            }
                            Store.getCarList(params).then((res) => {
                                this.cityListIsLoad = true;
                                this.cityListHtml += res;
                                this.$nextTick(() => {
                                    Echo.init({
                                        offset: 100,
                                        throttle: 0
                                    });
                                })
                            })
                        }
                    }
                    if (this.isShowBrach) {
                        if (this.serialListIsLoad) {
                            this.serialListIsLoad = false;
                            serialListPage += 1;
                            var params = {
                                serialId: this.serialListParams.serialId,
                                chooserStr: this.serialListParams.chooserStr + 'p' + serialListPage,
                                citySpell: this.serialListParams.citySpell,
                                source: this.serialListParams.source,
                            }
                            Store.getCarList(params).then((res) => {
                                this.serialListIsLoad = true;
                                this.serialListHtml += res;
                                this.$nextTick(() => {
                                    Echo.init({
                                        offset: 100,
                                        throttle: 0
                                    });
                                })
                            })
                        }
                    }
                }
            }
        }
    },
    methods: {
        getListBySerial(id) {
            this.serialListParams.serialId = id;
            serialListPage = 1;
            Store.getCarList(this.serialListParams).then((res) => {
                this.serialListHtml = res;
                this.$nextTick(() => {
                    Echo.init({
                        offset: 100,
                        throttle: 0
                    });
                })
            })
        },
        getListByCity(spell) {
            this.cityListParams.citySpell = spell;
            cityListPage = 1;
            Store.getCarList(this.cityListParams).then((res) => {
                this.cityListHtml = res;
                this.$nextTick(() => {
                    Echo.init({
                        offset: 100,
                        throttle: 0
                    });
                })

            })
        },
        showCity() {
            this.isShowCity = true;
            this.isShowBrach = false;
        },
        showBrach() {
            this.isShowCity = false;
            this.isShowBrach = true;
        },
        cityEvent(index, info) {
            for (let i = 0; i < cityList.length; i++) {
                if (i == index) {
                    this.getListByCity(info.spell);
                    cityList[i].select = true;
                } else {
                    cityList[i].select = false;
                }
            }
            this.data_cityList = cityList;
        },
        serialEvent(index, info) {
            for (let i = 0; i < serialList.length; i++) {
                if (i == index) {
                    this.getListBySerial(info.id)
                    serialList[i].select = true;
                } else {
                    serialList[i].select = false;
                }
            }
            this.data_serialList = serialList;
        },
        loadDomEvent() {
            let $li = $('.list-tabs li');
            $li.click(function () {
                $li.removeClass('cur');
                $(this).addClass('cur');
            })
        },
        //获取滚动条当前的位置 
        getScrollTop() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            }
            else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
        //获取当前可是范围的高度 
        getClientHeight() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);
            }
            else {
                clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
            }
            return clientHeight;
        },
        //获取文档完整的高度 
        getScrollHeight() {
            return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        }

    }
}
</script>
