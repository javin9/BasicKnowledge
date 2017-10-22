<template>
    <!-- 更多选择 -->
    <div class="sel_Left hide" id="moreShow">
        <header class="header-bar" style="border:solid 1px #fff;">
            <span id="carmore_close"></span>
            <h1 class="font-nav">筛选</h1>
            <span></span>
        </header>
        <div class="wrap_page" id="morewrappage">

            <div class="iscroll">
                <div class="ul_box">
                    <div class="item downpay" v-bind:data="ajaxdata.downpay" v-bind:url="url.downpay"><!--1-->
                        <div class="tit">首付<span class="col_grey9">/元</span></div>
                        <dl class="radio">
                            <dd class="cur"><a href="javascript:;" data-url='' data-id>不限</a></dd>
                            <dd><a href="javascript:;" data-url="d1" data-id='0|1'>0-1万</a></dd>
                            <dd><a href="javascript:;" data-url="d2" data-id='0|3'>0-3万</a></dd>
                            <dd><a href="javascript:;" data-url="d3" data-id='3|5'>3-5万</a></dd>
                            <dd><a href="javascript:;" data-url="d4" data-id='5|10'>5-10万</a></dd>
                            <dd><a href="javascript:;" data-url="d5" data-id='10|99999'>10万以上</a></dd>
                        </dl>
                        <div class="tit_2">自定义</div>
                        <div class="custom">
                            <div class="input"><input type="number" maxlength="4" name="min">万</div>
                            <div class="line">-</div>
                            <div class="input"><input type="number" maxlength="4" name="max">万</div>
                            <div class="btn"><span>确定</span></div>
                        </div>
                    </div>
                    <div class="item brand" v-bind:url="url.brand" v-bind:data="ajaxdata.Mbid!=''?ajaxdata.Mbid:ajaxdata.Brandid"><!--3 Mbid Brandid -->
                        <div class="tit_box">
                            <div class="tit_name">品牌</div>
                            <div class="tit_info" v-text="brandname">不限</div>
                        </div>
                    </div>
                    <div class="item carprice" v-bind:url="url.carprice"  v-bind:data="ajaxdata.carPrice"><!--4 自定义-->
                        <div class="tit">车价<span class="col_grey9">/元</span></div>
                        <dl class="radio">
                            <dd class="cur"><a href="javascript:;" data-url='' data-id=''>不限</a></dd>
                            <dd><a href="javascript:;" data-url="c1" data-id='0|1'>0-1万</a></dd>
                            <dd><a href="javascript:;" data-url="c2" data-id='0|3'>0-3万</a></dd>
                            <dd><a href="javascript:;" data-url="c3" data-id='3|5'>3-5万</a></dd>
                            <dd><a href="javascript:;" data-url="c4" data-id='5|10'>5-10万</a></dd>
                            <dd><a href="javascript:;" data-url="c5" data-id='10|15'>10-15万</a></dd>
                            <dd><a href="javascript:;" data-url="c6" data-id='15|20'>15-20万</a></dd>
                            <dd><a href="javascript:;" data-url="c7" data-id='20|30'>20-30万</a></dd>
                            <dd><a href="javascript:;" data-url="c8" data-id='30|99999'>30万以上</a></dd>
                        </dl>
                        <div class="tit_2">自定义</div>
                        <div class="custom">
                            <div class="input"><input type="number" maxlength="4" name="min">万</div>
                            <div class="line">-</div>
                            <div class="input"><input type="number" maxlength="4" name="max">万</div>
                            <div class="btn"><span>确定</span></div>
                        </div>
                    </div>

                    <div class="item year" v-bind:url="url.year" v-bind:data="ajaxdata.Year"><!--5 自定义-->
                        <div class="tit">车龄</div>
                        <dl class="radio">
                            <dd class="cur"><a href="javascript:;" data-url='' data-id=''>不限</a></dd>
                            <dd><a href="javascript:;" data-url="y1" data-id='-1|0'>0-1年</a></dd>
                            <dd><a href="javascript:;" data-url="y2" data-id='-3|0'>0-3年</a></dd>
                            <dd><a href="javascript:;" data-url="y3" data-id='-5|-3'>3-5年</a></dd>
                            <dd><a href="javascript:;" data-url="y4" data-id='-10|-5'>5-10年</a></dd>
                            <dd><a href="javascript:;" data-url="y5" data-id='-99999|-10'>10年以上</a></dd>
                        </dl>
                        <div class="tit_2">自定义</div>
                        <div class="custom">
                            <div class="input"><input type="number" maxlength="4" name="min">年</div>
                            <div class="line">-</div>
                            <div class="input"><input type="number" maxlength="4" name="max">年</div>
                            <div class="btn"><span>确定</span></div>
                        </div>
                    </div>

                    <div class="item lmili" v-bind:url="url.lmili" v-bind:data="ajaxdata.Lmili"><!--6 自定义-->
                        <div class="tit">里程<span class="col_grey9">/公里</span></div>
                        <dl class="radio">
                            <dd class="cur"><a href="javascript:;" data-url='' data-id=''>不限</a></dd>
                            <dd><a href="javascript:;" data-url="g1" data-id='0|10000'>0-1万</a></dd>
                            <dd><a href="javascript:;" data-url="g2" data-id='0|30000'>0-3万</a></dd>
                            <dd><a href="javascript:;" data-url="g3" data-id='30000|50000'>3-5万</a></dd>
                            <dd><a href="javascript:;" data-url="g4" data-id='50000|100000'>5-10万</a></dd>
                            <dd><a href="javascript:;" data-url="g5" data-id='100000|999999'>10万以上</a></dd>
                        </dl>
                        <div class="tit_2">自定义</div>
                        <div class="custom">
                            <div class="input inputwidth"><input type="number" maxlength="4" name="min">万公里</div>
                            <div class="line">-</div>
                            <div class="input inputwidth"><input type="number" maxlength="4" name="max">万公里</div>
                            <div class="btn"><span>确定</span></div>
                        </div>
                    </div>

                    <div class="item blk30 level" v-bind:url="url.level"  v-bind:data="ajaxdata.Carlevelid"><!--7 多选-->
                        <div class="tit">级别</div>
                        <dl class="radio checkbox" data-url="l">
                            <dd class="cur"><a href="javascript:;" data-url="" data-id="">不限</a></dd>
                            <dd><a href="javascript:;" data-url="1" data-id='1'>轿车</a></dd>
                            <dd><a href="javascript:;" data-url="2" data-id='2'>SUV</a></dd>
                            <dd><a href="javascript:;" data-url="3" data-id='3'>MPV</a></dd>
                            <dd><a href="javascript:;" data-url="4" data-id='4'>跑车</a></dd>
                            <dd><a href="javascript:;" data-url="5" data-id='5'>微型车</a></dd>
                            <dd><a href="javascript:;" data-url="6" data-id='6'>皮卡</a></dd>
                            <dd><a href="javascript:;" data-url="7" data-id='7'>面包车</a></dd>
                        </dl>
                    </div>

                    <div class="item line2 selcet atatus" v-bind:url="url.atatus"  v-bind:data="ajaxdata.Status"><!--8 多选-->
                        <div class="tit_box">
                            <div class="tit_name">车辆来源</div>
                            <div class="tit_info" v-text="txt.atatus">不限</div>
                        </div>
                        <dl class="radio checkbox" data-url="k">
                            <dd class="cur"><a href="javascript:;" data-url='' data-id=''>不限</a></dd>
                            <dd><a href="javascript:;" data-url="1" data-id='1'>优质车</a></dd>
                            <dd><a href="javascript:;" data-url="3" data-id='3'>保障车</a></dd>
                            <dd><a href="javascript:;" data-url="2" data-id='2'>品牌认证车</a></dd>
                        </dl>
                    </div>

                    <div class="item line2 selcet transmission" v-bind:url="url.transmission" v-bind:data="ajaxdata.GearBoxType"><!--9-->
                        <div class="tit_box">
                            <div class="tit_name">变速箱</div>
                            <div class="tit_info" v-text="txt.transmission">不限</div>
                        </div>
                        <dl class="radio"><!--/t车辆来源  l级别 g里程 y车龄 h月供 d首付 c1p车价 变速箱e 排量f 排放标准i  都是从1开始-->
                            <dd class="cur"><a href="javascript:;" data-url='' data-id=''>不限</a></dd>
                            <dd><a href="javascript:;" data-url="e1" data-id='1'>手动</a></dd>
                            <dd><a href="javascript:;" data-url="e2" data-id='2'>自动</a></dd>
                        </dl>
                    </div>

                    <div class="item line2 selcet displacement" v-bind:url="url.displacement" v-bind:data="ajaxdata.Exhaust"><!--10 多选-->
                        <div class="tit_box">
                            <div class="tit_name">排量</div>
                            <div class="tit_info" v-text="txt.displacement">不限</div>
                        </div>
                        <dl class="radio checkbox" data-url="f">
                            <dd class="cur"><a href="javascript:;" data-url='' data-id=''>不限</a></dd>
                            <dd><a href="javascript:;" data-url="1" data-id='1'>1.0L以下</a></dd>
                            <dd><a href="javascript:;" data-url="2" data-id='2'>1.0-1.6L</a></dd>
                            <dd><a href="javascript:;" data-url="3" data-id='3'>1.6-2.0L</a></dd>
                            <dd><a href="javascript:;" data-url="4" data-id='4'>2.0-3.0L</a></dd>
                            <dd><a href="javascript:;" data-url="5" data-id='5'>3.0L以上</a></dd>
                        </dl>
                    </div>

                    <div class="item line2 selcet emissionstandards" id="scrollBotm" v-bind:url="url.emissionstandards"  v-bind:data="ajaxdata.EnvirStandard"><!--11-->
                        <div class="tit_box">
                            <div class="tit_name">排放标准</div>
                            <div class="tit_info" v-text="txt.emissionstandards">不限</div>
                        </div>
                        <dl class="radio">
                            <dd class="cur"><a href="javascript:;" data-url='' data-id=''>不限</a></dd>
                            <dd><a href="javascript:;" data-url="i1" data-id='1'>OBD</a></dd>
                            <dd><a href="javascript:;" data-url="i2" data-id='2'>京5</a></dd>
                            <dd><a href="javascript:;" data-url="i3" data-id='3'>欧5</a></dd>
                            <dd><a href="javascript:;" data-url="i4" data-id='4'>欧4</a></dd>
                            <dd><a href="javascript:;" data-url="i5" data-id='5'>欧3</a></dd>
                            <dd><a href="javascript:;" data-url="i6" data-id='6'>国5</a></dd>
                            <dd><a href="javascript:;" data-url="i7" data-id='7'>国4</a></dd>
                            <dd><a href="javascript:;" data-url="i8" data-id='8'>国3</a></dd>
                            <dd><a href="javascript:;" data-url="i9" data-id='9'>国2</a></dd>
                        </dl>
                    </div>
                </div>
            </div>

        </div>
        <div class="multi_button font-title">
            <a href="javascript:void(0)" class="multi_reset" id="">重置全部</a>
            <a href="javascript:void(0)" id="carview">查看<span id="count">--</span>辆车源</a>
            <!--<a href="javascript:void" id="carview">查看<span></span>车源</a>-->
        </div>
    </div>
    <!-- 更多选择 end-->
    {{data.img}}
</template>
<script>
    var $moreShow=$('#moreShow')
    export default{
       // el:'#moreShow',
        ready(){
        },
        data(){},
        props:['url','sorthih','ajaxdata','txt','brandname'],
        methods:{
            /*onclickme:function () {
                console.log(this.url)
                console.log(this.sorthih)
                console.log(this.ajaxdata)
            }*/
        },
    }
</script>

<!--<div class="item selcet">
   <div class="tit_box">
       <div class="tit_name">颜色</div>
       <div class="tit_info">不限</div>
   </div>
   <dl class="radio selcet">
       <dd class="cur"><a href="javascript:;" data-url>不限</a></dd>
       <dd><a href="javascript:;" data-url="">白色</a></dd>
       <dd><a href="javascript:;" data-url="">黑色</a></dd>
       <dd><a href="javascript:;" data-url="">红色</a></dd>
       <dd><a href="javascript:;" data-url="">银灰色</a></dd>
       <dd><a href="javascript:;" data-url="">蓝色</a></dd>
       <dd><a href="javascript:;" data-url="">深灰色</a></dd>
       <dd><a href="javascript:;" data-url="">香槟色</a></dd>
   </dl>
</div>

<div class="item selcet">
   <div class="tit_box">
       <div class="tit_name">配置</div>
       <div class="tit_info">不限</div>
   </div>
   <dl class="checkbox radio">
       <dd class="cur"><a href="javascript:;" data-url>不限</a></dd>                            <dd><a href="javascript:;" data-url="">天窗</a></dd>
       <dd><a href="javascript:;" data-url="">GPS导航</a></dd>
       <dd><a href="javascript:;" data-url="">倒车影像</a></dd>
       <dd><a href="javascript:;" data-url="">儿童锁</a></dd>
       <dd><a href="javascript:;" data-url="">涡轮增加</a></dd>
       <dd><a href="javascript:;" data-url="">无钥匙启动</a></dd>
       <dd><a href="javascript:;" data-url="">四轮碟刹</a></dd>
       <dd><a href="javascript:;" data-url="">真皮座椅</a></dd>
       <dd><a href="javascript:;" data-url="">ESP</a></dd>
       <dd><a href="javascript:;" data-url="">氙气大灯</a></dd>
       <dd><a href="javascript:;" data-url="">定速巡航</a></dd>
       <dd><a href="javascript:;" data-url="">自动空调</a></dd>
       <dd><a href="javascript:;" data-url="">胎压监测</a></dd>
       <dd><a href="javascript:;" data-url="">自动泊车</a></dd>
       <dd><a href="javascript:;" data-url="">空气净化器</a></dd>
       <dd><a href="javascript:;" data-url="">换挡拨片</a></dd>
       <dd><a href="javascript:;" data-url="">电动座椅</a></dd>
   </dl>
</div>

<div class="item selcet">
   <div class="tit_box">
       <div class="tit_name">车身</div>
       <div class="tit_info">不限</div>
   </div>
   <dl class="radio">
       <dd class="cur"><a href="javascript:;" data-url>不限</a></dd>                            <dd><a href="javascript:;" data-url="">两厢</a></dd>
       <dd><a href="javascript:;" data-url="">三厢</a></dd>
       <dd><a href="javascript:;" data-url="">旅行版</a></dd>
   </dl>
</div>

<div class="item selcet">
   <div class="tit_box">
       <div class="tit_name">驱动</div>
       <div class="tit_info">不限</div>
   </div>
   <dl class="radio">
       <dd class="cur"><a href="javascript:;" data-url>不限</a></dd>                            <dd><a href="javascript:;" data-url="">前驱</a></dd>
       <dd><a href="javascript:;" data-url="">后驱</a></dd>
       <dd><a href="javascript:;" data-url="">四驱</a></dd>
   </dl>
</div>

<div class="item selcet">
   <div class="tit_box">
       <div class="tit_name">燃料</div>
       <div class="tit_info">不限</div>
   </div>
   <dl class="radio">
       <dd class="cur"><a href="javascript:;" data-url>不限</a></dd>                            <dd><a href="javascript:;" data-url="">汽油</a></dd>
       <dd><a href="javascript:;" data-url="">柴油</a></dd>
       <dd><a href="javascript:;" data-url="">纯电动</a></dd>
       <dd><a href="javascript:;" data-url="">油电混合</a></dd>
       <dd><a href="javascript:;" data-url="">油气混合</a></dd>
   </dl>
</div>

<div class="item selcet">
    <div class="tit_box">
        <div class="tit_name">国别</div>
        <div class="tit_info">不限</div>
    </div>
    <dl class="radio">
        <dd class="cur"><a href="javascript:;" data-url>不限</a></dd>
        <dd><a href="javascript:;" data-url="">中国</a></dd>
        <dd><a href="javascript:;" data-url="">日本</a></dd>
        <dd><a href="javascript:;" data-url="">德国</a></dd>
        <dd><a href="javascript:;" data-url="">美国</a></dd>
        <dd><a href="javascript:;" data-url="">法国</a></dd>
        <dd><a href="javascript:;" data-url="">英国</a></dd>
        <dd><a href="javascript:;" data-url="">韩国</a></dd>
        <dd><a href="javascript:;" data-url="">意大利</a></dd>
        <dd><a href="javascript:;" data-url="">瑞典</a></dd>
    </dl>
</div>-->

