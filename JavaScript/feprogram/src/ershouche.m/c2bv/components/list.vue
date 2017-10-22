<template>
    <div id="list" class="sharelist" v-if="clashow">
        <div class="title" v-if="clashowtit">
            <i class="icon_love"></i><span class="left">你可能感兴趣的车</span>
        </div>
        <div class="list_cont_box">
            <div class="list_new_cont">
                <ul class="new_ul">
                    <li v-for="item in prodcuts">
                        <a v-bind:href="item.url">
                            <div class="img"><img v-bind:src="item.src"></div>
                            <div class="info">
                                <h6 class="tit" v-text="item.carname">朗逸 2011款 2.0L 自动品悠自动品悠版</h6>
                                <div class="txt" v-text="item.infotext">11.68万/2011年/6.4万公里</div>
                                <div class="pricetag">
                                    <div class="price">首付<span v-text="item.price">3.50万</span></div>
                                    <div class="tag" v-html="item.tag">
                                        <span>品牌认证</span>
                                        <span>质保</span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    </li>
                </ul>
                <a v-bind:href="morehref" class="more_btn" v-if="clashowtit">更多车源<i></i></a>
            </div>
        </div>
    </div>
</template>
<script>
    import check from 'libs/check/m'
    export default{
        name: 'list',
        props: ['sodata','channelurl'],
        ready(){
            this.morehref=ershoucheUrl + cityInfo.citySpell + "/a"+this.sodata.if.morehreflink+"/?source="+source+this.channelurl;
            this.init();
        },
        //数据：
        data() {
            return {
                clashow:true,
                clashowtit:false,
                morehref:'',
                prodcuts:[],//最新发布 s数据
                cars:[],//推荐车源 s数据
                //sharelist:true,//推荐车源 s数据
            }
        },
        methods: {
            //事件
            urlajax:function (url,prodcuts,source) {
                let _self = this;
                let channelurl = ''
                let channels = tools.getUrlParam('channel')||''
                if(channels){
                    channelurl='&channel='+channels
                }
                $.ajax({
                    url: url,
                    type: 'post',
                    success: function (res) {
                        let newData = res.Data.UcarList
                        /*//console.log(res.Data.AllCount)
                        //console.log(res.Data.UcarList)*/
                        if (res.Data.AllCount==0){
                            _self.clashow = false;
                            _self.clashowtit = false;
                            return
                        }else {
                            _self.clashow = true;
                            _self.clashowtit = true;
                        }
                        //console.log(_self.clashow,_self.clashowtit)
                        for (var i = 0; i < newData.length; ++i) {
                            var proData = {},
                                    pData = newData[i],
                                    mil = '/'+(parseFloat(pData.Drivingmileage / 10000)).toFixed(2)+'万公里';//换算成万公里
                            //2011年---获取买车 年
                            var ny = pData.BuyCarDate;
                            var d = jsonDateFormat(ny);
                            var n = d.split('-');
                            //debugger
                            var paiz='';
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
                            proData.url = '/' + cityInfo.citySpell + '/u' + pData.UcarID + '/?source=' + source + channelurl;//
                            proData.src = pData.FirstPicturePath;//图片路径
                            proData.carname = pData.CarFullName;//产品名称
                            proData.infotext = paiz+mil;//'11.68万/'+paiz+'/'+mil+'万公里';//11.68万/2011年/6.4万公里
                            proData.price = sf+'起';//首付---
                            proData.tag = '全款'+DisplayPrice;//<span>品牌认证</span>
                            prodcuts.push(proData)
                        }
                    }
                })
            },
            init: function () {
                var _self = this,//
                    newurl = ershoucheUrl + 'Interface/getcarlist?cid=' + cityInfo.cityId + '&Psize=6&CarPrice='+this.sodata.if.listcarprice
                _self.urlajax(newurl,_self.prodcuts,source);
                //AllCount
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
