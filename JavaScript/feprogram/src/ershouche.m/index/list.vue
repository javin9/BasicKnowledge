<template>
    <div id="listtab" class="list_box">
        <ul class="tabs">
            <li v-if="prodcutsCount!=0" v-on:click="showFav()" v-bind:class="isShowFav?'cur':''" data-id="0">
                <span>猜你喜欢</span>
            </li>
            <li v-if="carsCount!=0" v-on:click="showHis()" v-bind:class="isShowHis?'cur':''" data-id="1">
                <span>最近浏览</span>
            </li>
        </ul>
        <div class="list_cont_box">
            <div v-if="prodcutsCount!=0" v-show="isShowFav" class="list_new_cont">
                <ul class="ok_list">
                    <li v-for="item in prodcuts">
                        <a v-bind:href="item.url" v-bind:id="item.ucarid+'|'+item.i" >
                            <div class="img">
                                <img src="../images/imgbg.html.png" v-bind:data-echo="item.src">
                            </div>
                            <div class="info">
                                <h6 class="tit" v-text="item.carname"></h6>
                                <div class="txt" v-text="item.infotext"></div>
                                <div class="pricetag">
                                    <div class="price">首付<span v-text="item.price"></span>
                                    </div>
                                    <div class="tag" v-html="item.tag">
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
                <a v-bind:href="morehref" class="btn_more">更多车源
                    <i></i>
                </a>
            </div>
            <div v-if="carsCount!=0" v-show="isShowHis" class="list_new_cont">
                <ul class="new_ul">
                    <li v-for="item in cars">
                        <a v-bind:href="item.url"  v-bind:id="item.ucarid+'|'+item.i" >
                            <div class="img">
                                <img src="" v-bind:data-echo="item.src">
                            </div>
                            <div class="info">
                                <h6 class="tit" v-text="item.carname"></h6>
                                <div class="txt" v-text="item.infotext"></div>
                                <div class="pricetag">
                                    <div class="price">首付<span v-text="item.price"></span>
                                    </div>
                                    <div class="tag" v-html="item.tag"></div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
                <a v-bind:href="morehref" class="btn_more">更多车源
                    <i></i>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    el: '#listtab',
    ready() {
        this.init();
    },
    //数据：
    data() {
        return {
            morehref: ershoucheUrl + cityInfo.spell + "/list/?source=" + 1174,
            prodcuts: [],//猜你喜欢 s数据
            cars: [],//最近浏览 s数据
            prodcutsCount: 0,
            carsCount: 0,
            isShowFav: true,
            isShowHis: false
        }
    },
    methods: {
        showFav() {
            this.isShowFav = true;
            this.isShowHis = false;
        },
        showHis() {
            this.isShowFav = false;
            this.isShowHis = true;
        },
        //事件
        urlajax: function (data, prodcuts, source, type) {
            let _self = this;
            type === 1 ? this.prodcutsCount = data.AllCount : this.carsCount = data.AllCount;
            if (data.AllCount == 0)
                return;
            let newData = data.UcarList
            for (var i = 0; i < newData.length; ++i) {
                var proData = {},
                    pData = newData[i],
                    mil = '/' + (parseFloat(pData.Drivingmileage / 10000)).toFixed(2) + '万公里';//换算成万公里
                //2011年---获取买车 年
                var ny = pData.BuyCarDate;
                var d = jsonDateFormat(ny);
                var n = d.split('-');
                //debugger
                var paiz = '';
                if (n[0] == '1') {
                    paiz = '未上牌';
                } else {
                    paiz = n[0] + '年';
                    //paiz = n[0] + '年'+n[1] + '月上牌';
                }
                //车价:11.68万
                var DisplayPrice = ''
                if (pData.DisplayPrice >= 1) {
                    DisplayPrice = (pData.DisplayPrice).toFixed(2) + "万";
                } else {
                    DisplayPrice = parseInt(pData.DisplayPrice * 10000).toFixed(0) + "元";
                }
                //首付
                var sf = "";
                if (pData.DownPaymentAmount >= 1) {
                    sf = (pData.DownPaymentAmount).toFixed(2) + "万";
                } else {
                    sf = parseInt(pData.DownPaymentAmount * 10000).toFixed(0) + "元";
                }
                proData.url = '/' + cityInfo.spell + '/u' + pData.UcarID + '/?source=' + source + '';//href
                proData.ucarid = pData.UcarID;//后台统计数据
                proData.i = i + 1;//后台统计数据
                proData.src = pData.FirstPicturePath;//图片路径
                proData.carname = pData.CarFullName;//产品名称
                proData.infotext = paiz + mil;//'11.68万/'+paiz+'/'+mil+'万公里';//11.68万/2011年/6.4万公里
                proData.price =sf + '起';//首付---'首付'+ 
                proData.tag = '全款' + DisplayPrice;//<span>品牌认证</span>
                prodcuts.push(proData)

            }
        },
        init: function () {
            var _self = this;

            $.ajax({
                url: ershoucheUrl + "Interface/GetUserFavAndHis?cid=" + cityInfo.id,
                type: 'get',
                success: function (res) {
                    _self.urlajax(res.Data.Fav, _self.prodcuts, 1174, 1);
                    _self.urlajax(res.Data.His, _self.cars, 1175, 2);
                    _self.$nextTick(() => {
                        Echo.init({
                            offset: 100,
                            throttle: 0
                        });
                    })


                }
            })

        },
    }
}

function jsonDateFormat(jsonDate) {//json日期格式转换为正常格式
    try {
        var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();
        return date.getFullYear() + "-" + month + "-" + day;
    } catch (ex) {
        return "";
    }
}

</script>
