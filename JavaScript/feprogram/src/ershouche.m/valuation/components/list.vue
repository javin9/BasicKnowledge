<template>
    <div class="list" v-bind:class="clashow?' a':' hide'">
        <div class="title">
            <div class="left">我的估值</div>
        </div>
        <ul class="ul">
            <li v-for="item in prodcuts">
                <a v-bind:href="item.url" v-bind:ucarid="item.ucarid" v-bind:orderindex="item.i">
                    <h6 class="tit" v-text="item.carname">朗逸 2011款 2.0L 自动品悠自动品悠版</h6>
                    <div class="txt" v-text="item.infotext">2011年/6.4万公里/北京</div>
                    <div class="price">买车估值：<span v-text="item.price">11.68-15.68万</span></div>
                </a>
            </li>
        </ul>
    </div>
</template>
<script>
    export default{
        el: '#listtab',
        ready(){
            this.init();
            setTimeout(function () {
                Echo.init({
                    offset: 0,
                    throttle: 0
                });
            },500)
        },
        //数据：
        data() {
            return {
                clashow:false,
                prodcuts:[],//最新发布 s数据
            }
        },
        methods: {
            urlajax:function (url,prodcuts,source) {
                let _self = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    success: function (res) {
                        let newData = res.Data
                        if (res.RowCount===0){
                            _self.clashow = false;
                            return false
                        }else {
                            _self.clashow = true;
                        }
                        for (var i = 0; i < newData.length; ++i) {
                            var proData = {},
                                pData = newData[i],
                                mil = ''//'/'+(parseFloat(pData.Mileage / 10000)).toFixed(2)+'公里';
                            // 换算成万公里
                            mil = (parseFloat(pData.Mileage)).toFixed(2)+'万公里'
                            console.log('mil----',mil)

                            //买车估值
                            var up = "",lo=''  ///up大值2 lo小值1
                            if (pData.UpperLim >= 1) {
                                up = (pData.UpperLim).toFixed(2)// + "万";
                            } else {
                                up = parseInt(pData.UpperLim * 10000).toFixed(0)// + "元";
                            }
                            if (pData.LowerLim >= 1) {
                                lo = (pData.LowerLim).toFixed(2)// + "万";
                            } else {
                                lo = parseInt(pData.LowerLim * 10000).toFixed(0)// + "元";
                            }

                            proData.url = ershoucheUrl+'valuation/detail?valid=' + pData.valID;//href
                            proData.ucarid = pData.UcarID;//后台统计数据
                            proData.i = i+1;//后台统计数据


                            proData.carname = pData.carName;//产品名称
                            proData.infotext = pData.timeBrand+'/'+mil+'/'+pData.cityName;//上牌日期 2011年/6.4万公里/北京
                            proData.price =lo+'-'+up+'万'//买车估值：11.68-15.68万

                            prodcuts.push(proData)
                            /*20*/

                        }
                    }
                })
            },
            init: function () {
                var _self = this;
                var newurl = ershoucheUrl + InterfaceUrl.GetHistory
                    /*if(cityInfo.level==0)
                        newurl = ershoucheUrl + "Interface/getcarlist?Psize=12"
                    if(cityInfo.level==1)
                        newurl = ershoucheUrl + "Interface/getcarlist?pid=" + cityInfo.id + "&Psize=12"
                    if(cityInfo.level==2)
                        newurl = ershoucheUrl + "Interface/getcarlist?cid=" + cityInfo.id + "&Psize=12"*/
                _self.urlajax(newurl,_self.prodcuts,1070);
              
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
