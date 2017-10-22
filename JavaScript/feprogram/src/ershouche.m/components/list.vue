<template>
    <div id="listtab" class="ok_page">
        <ul class="tabs">
            <li class="cur" data-id="0" v-if="lione">
                <span>同车系</span>
            </li>
            <li class="" data-id="1" v-if="litwo">
                <span>同价位</span>
            </li>
        </ul>
        <div class="list_cont_box">
            <div class="list_new_cont"  v-if="lione">
                <ul class="ok_list">
                    <li v-for="item in prodcuts">
                        <a v-bind:href="item.url" v-bind:ucarid="item.ucarid" v-bind:orderindex="item.i">
                            <div class="img">
                                <img v-bind:src="item.src" v-bind:data-echo="item.src">
                            </div>
                            <div class="info">
                                <h6 class="tit" v-text="item.carname">朗逸 2011款 2.0L 自动品悠自动品悠版</h6>
                                <div class="txt" v-text="item.infotext">11.68万/2011年/6.4万公里</div>
                                <div class="pricetag">
                                    <div class="price">首付<span v-text="item.price">3.50万</span>
                                    </div>
                                    <div class="tag" v-html="item.tag">
                                        <span>品牌认证</span>
                                        <span>质保</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
            <div class="list_new_cont hide" v-if="litwo">
                <ul class="ok_list">
                    <li v-for="item in cars">
                        <a v-bind:href="item.url">
                            <div class="img">
                                <img v-bind:src="item.src" v-bind:data-echo="item.src">
                            </div>
                            <div class="info">
                                <h6 class="tit" v-text="item.carname">朗逸 2011款 2.0L 自动品悠自动品悠版</h6>
                                <div class="txt" v-text="item.infotext">11.68万/2011年/6.4万公里</div>
                                <div class="pricetag">
                                    <div class="price">首付<span v-text="item.price">3.50万</span>
                                    </div>
                                    <div class="tag" v-html="item.tag"></div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<!--
页面需要引用以下:
<list v-bind:sourceIdOne="sourceIdOne" v-bind:sourceIdTwo="sourceIdTwo" v-bind:proSize="proSize" v-bind:cityId="cityId"></list>

需要传递的参数:
sourceIdOne:888888888, //同车系 source id
sourceIdTwo:999999999, //同价位 source id
proSize:24,            //请求多少条
cityId:201,            //城市ID



-->

<script>
export default {
    name: 'list',
    props: ['car', 'sourceidone', 'sourceidtwo', 'prosize', 'cityid'],
    ready() {
        this.init();

    },
    //数据：
    data() {
        return {
            clashow: true,
            lione:true,
            litwo:true,
            prodcuts: [],//最新发布 s数据
            cars: [],//推荐车源 s数据
        }
    },
    methods: {
        //事件
        click: function () {
            $('.tabs li').on('click', function () {
                let _this = $(this), num = _this.attr('data-id'), con = $('.list_cont_box .list_new_cont')
                $('.tabs li').removeClass('cur')
                _this.addClass('cur')

                if (num == 0) {
                    con.addClass('hide')
                    con.eq(num).removeClass('hide')
                } else if (num == 1) {
                    con.addClass('hide')
                    con.eq(num).removeClass('hide')
                }
            })
        },
        urlajax: function (url, prodcuts, source,li) {
            let _self = this;
            $.ajax({
                url: url,
                type: 'post',
                success: function (res) {
                    if (res.Data !== null) {
                        let newData = res.Data.UcarList
                        if (res.Data.AllCount === 0) {
                            if (li ==='lione' ){
                                return _self.lione = false;
                            }
                            if (li ==='litwo' ){
                                return _self.litwo = false;
                            }

                        }
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
                            proData.url = '/' + cityInfo.citySpell + '/u' + pData.UcarID + '/?source=' + source + '&channel='+channel;//href
                            proData.ucarid = pData.UcarID;//后台统计数据
                            proData.i = i + 1;//后台统计数据

                            proData.src = pData.FirstPicturePath;//图片路径
                            proData.carname = pData.CarFullName;//产品名称
                            proData.infotext = paiz + mil;//'11.68万/'+paiz+'/'+mil+'万公里';//11.68万/2011年/6.4万公里
                            proData.price = sf + '起';//首付---
                            proData.tag = '全款' + DisplayPrice;//<span>品牌认证</span>
                            prodcuts.push(proData)
                        }
                    }
                }
            })
        },
        init: function () {
            var _self = this,
                newurl = ershoucheUrl + 'Interface/SameSerialsCar?serialId=' + this.car.serialId + '&psize=' + _self.prosize,
                url = ershoucheUrl + 'Interface/SamePriceCar?carprice=' + this.car.carPrice + '&psize=' + _self.prosize;
            _self.urlajax(newurl, _self.prodcuts, _self.sourceidone,'lione');//同车系
            _self.urlajax(url, _self.cars, _self.sourceidtwo,'litwo');//同价位
            _self.click();
            this.$nextTick(() => {
                Echo.init({
                    offset: 0,
                    throttle: 0
                });
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
