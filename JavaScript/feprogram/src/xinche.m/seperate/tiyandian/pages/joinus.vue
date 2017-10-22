<template>
    <div id="yxWrapper">
        <component-header title="易鑫体验店招商"></component-header>

        <section class="banner"></section>

        <section class="sec">
            <div class="head"><span>四大股东 重金打造</span></div>
            <div class="logo"></div>
        </section>

        <section class="profit sec">
            <div class="head"><span>盈利全方位 汽车新零售</span></div>
            <div class="intro">易鑫体验店皆在为消费者提供汽车金融产品、新车二手车交易、租赁、保险、保养、轻维修、车品等一站式综合服务，是线上线下相结合超越传统4S经营模式的新零售业态；易鑫体验店整合自身强大的线上线下资源，将金融，交易和客户体验完美结合。</div>
        </section>

        <section class="sec">
            <div class="head"><span>易鑫体验店，让投资更有价值</span></div>
            <ul class="advantage">
                <li>
                    <h6>品牌</h6>
                    <p>全国统一门店形象<br/>线上线下推广支持</p>
                </li>
                <li>
                    <h6>获客</h6>
                    <p>日均10000+条<br/>全国购车线索</p>
                </li>
                <li>
                    <h6>车源</h6>
                    <p>集中采购市场畅销车型</p>
                </li>
                <li>
                    <h6>资金</h6>
                    <p>库存融资</p>
                </li>
            </ul>
        </section>

        <section class="sec">
            <div class="head"><span>合作申请 仅需5步</span></div>
            <ul class="join-step">
                <li>提交申请书</li>
                <li>初步评审</li>
                <li>现场考察</li>
                <li>综合评估审批</li>
                <li>签署意向协议</li>
            </ul>
            <h5>申请基本条件：</h5>
            <ol>
                <li>对易鑫体验店充满信心，愿和易鑫长期共同发展；</li>
                <li>经国家工商管理机构注册登记，具有合法经营凭证，注册资金不低于100万元；</li>
                <li>企业经营状况良好，拥有汽车行业销售服务经验者将被优先考虑；</li>
                <li>拥有符合易鑫体验店经营所需的场地所有权或使用权，场地面积，使用年限，位置等符合易鑫体验店各级别要求；</li>
                <li>有能力组建符合易鑫体验店标准的经营管理团队，其中关键岗位人员必须具备2年以上汽车行业经验。</li>
            </ol>
        </section>

        <section class="sec">
            <div class="head"><span>2017年重点招商城市</span></div>
            <div class="city-list">
                <table>
                    <tr v-for="one in cityList">
                        <td width="20%">{{one.name}}</td>
                        <td>{{one.value}}</td>
                    </tr>
                </table>
                <p>有意向申请单位如果在“重点招商城市”名单外的城市提交申请，易鑫将根据当地市场实际情况进行综合评估判断。</p>
            </div>
        </section>

        <section class="join-now sec">
            <div class="head"><span>申请加入</span></div>
            <div class="btn-wrap">
                <a :href="downloadHref" class="btn download"><span>下载合作申请书</span></a>
            </div>
            <dl class="mail">
                <dt>联系邮箱</dt>
                <dd>tiyandianzhaoshang@yxqiche.com</dd>
            </dl>
        </section>

        <section class="escdk13">
            <div class="escdk131 font-ctn">腾讯、京东、百度、易车旗下的互联网汽车金融平台</div>

            <div class="escdk132">
                <div><span>触屏版</span></div>
                <div>
                    <a href="http://www.daikuan.com/?from=newmweb">电脑版</a>
                </div>
                <div>
                    <a href="http://m.daikuan.com/map/">网站地图</a>
                </div>
                <div>
                    <a href='http://m.daikuan.com/home/about#!/'>关于我们</a>
                </div>
                <div>
                    <a href='http://m.daikuan.com/Feedback/'>意见反馈</a>
                </div>
            </div>

            <div class="escdk133">服务电话：4000-169-169 (9:00-21:00)</div>
        </section>
    </div>
</template>

<style scoped>
    @import 'sassHelper/vars';
    @import 'sassHelper/mixin';

    $main: map-get($colors, red);
    $border-color: #e5e5e5;

    .banner {
        height: px2rem(260);
        background: url(images/banner.jpg) no-repeat center center / cover;
    }

    .sec {
        background: #ffffff;
        margin-bottom: px2rem(20);

        h5{
            @include fsize(32);
            padding: px2rem(20) px2rem(40);
            color:$dark-color;
            line-height: $main-line-height;
            font-weight: normal;
        }

        ol{
            @include fsize(26);
            color:$light-color;
            line-height: $main-line-height;
            padding:0 px2rem(40) px2rem(40);

            li{
                padding: px2rem(20) 0;
                list-style-type: decimal;
                list-style-position: inside;
            }
        }

    .head {
    @include fsize(34);
        line-height: px2rem(120);
        font-weight: bold;
        color: #394043;
        text-align: center;

    span {
        display: inline-block;
        position: relative;

    &:before {
        content: '';
        position: absolute;
        top: 50%;
        left: px2rem(-50);
        width: px2rem(40);
        height: px2rem(2);
        background: #D8D8D8;
        transform: translate(0, -50%);
    }

    &:after {
        content: '';
        position: absolute;
        top: 50%;
        right: px2rem(-50);
        width: px2rem(40);
        height: px2rem(2);
        background: #D8D8D8;
        transform: translate(0, -50%);
    }

    }
    }

    .btn-wrap {
        padding: px2rem(60) px2rem(75);
    }

    }

    .advantage {
        border-top: 1px solid $border-color;
        overflow: hidden;

    li {
        box-sizing: border-box;
        float: left;
        width: 50%;
        padding-top: px2rem(124);
        height: px2rem(280);
        text-align: center;
        border-bottom: 1px solid $border-color;
        background-repeat: no-repeat;
        background-position: center px2rem(34);
        background-size: px2rem(80) auto;

    &:nth-child(2n) {
        border-left: 1px solid $border-color;
    }

    &:nth-child(1) {
        background-image: url(images/advantage01.png);
    }

    &:nth-child(2) {
        background-image: url(images/advantage02.png);
    }

    &:nth-child(3) {
        background-image: url(images/advantage03.png);
        border-bottom:0;
    }

    &:nth-child(4) {
        background-image: url(images/advantage04.png);
        border-bottom:0;
    }

    h6 {
    @include fsize(32);
        line-height: px2rem(46);
        color: #4A4B5B;
    }

    p {
    @include fsize(24);
        line-height: px2rem(33);
        color: #8C8C8C;
        margin: px2rem(4) 0;
    }

    }
    }

    .btn-alt {
        display: block;
        box-sizing: content-box;
        height: px2rem(78);
        line-height: px2rem(78);
        border: 1px solid $main;
        border-radius: px2rem(5);
        text-align: center;
    @include fsize(30);
        text-decoration: none;
        color: $main;

    &.download {

    span {
        display: inline-block;
        padding-left: px2rem(42);
        background: url(images/download-alt.png) no-repeat left center / px2rem(34) auto;
    }

    }
    }

    .btn {
        display: block;
        box-sizing: content-box;
        height: px2rem(78);
        line-height: px2rem(78);
        border: 1px solid $main;
        border-radius: px2rem(5);
        text-align: center;
    @include fsize(30);
        text-decoration: none;
        color: #fff;
        background: $main;

    &.download {

    span {
        display: inline-block;
        padding-left: px2rem(42);
        background: url(images/download.png) no-repeat left center / px2rem(34) auto;
    }

    }
    }

    .logo {
        height: px2rem(304);
        background: url(images/logo.png) no-repeat center center / px2rem(559) auto;
        border-top: 1px solid $border-color;
    }

    .profit {

    .head {
        line-height: px2rem(48);
        padding-top: px2rem(40);
        padding-bottom: px2rem(40);

    &:nth-child(1) {
        padding-bottom: px2rem(26);
    }

    }

        .intro {
            padding: 0 px2rem(30) px2rem(40);
            @include fsize(30);
            line-height: 1.5;
            color: #999;
        }
    }

    .join-step {
        padding: px2rem(78) 0 px2rem(40);
        border-top: 1px solid $border-color;
        overflow: hidden;

    li {
        position: relative;
        float: left;
        width: px2rem(200);
        margin-right: px2rem(75);
        padding-top: px2rem(146);
        text-align: center;
    @include fsize(24);
        line-height: px2rem(33);
        color: #394043;
        background-repeat: no-repeat;
        background-position: center top;
        background-size: px2rem(108) auto;

    &:after {
        content: '';
        position: absolute;
        top: px2rem(66);
        right: px2rem(-37.5);
        width: px2rem(60);
        height: px2rem(2);
        background: url(images/dashed.png) repeat-x left center / auto px2rem(2);
        transform: translate(50%, -50%);
    }

    &:nth-child(3n) {
        margin-right: 0;

    &:after {
        display: none;
    }

    }

    &:nth-child(n+4) {
        margin-top: px2rem(36);
    }

    &:nth-child(1) {
        background-image: url(images/step1.png);
    }

    &:nth-child(2) {
        background-image: url(images/step2.png);
    }

    &:nth-child(3) {
        background-image: url(images/step3.png);
    }

    &:nth-child(4) {
        background-image: url(images/step4.png);
        margin-left: px2rem(140);
    }

    &:nth-child(5) {
        background-image: url(images/step5.png);
        &:after{
            display:none;
        }
    }

    }
    }

    .join-now {

    .head {
        line-height: px2rem(48);
        padding-top: px2rem(40);
        padding-bottom: px2rem(0);
    }

    .btn-wrap {
        padding-bottom: px2rem(30);
    }

    .mail {
        text-align: center;
    @include fsize(34);
        line-height: px2rem(48);
        padding-bottom: px2rem(40);

    dt {
        color: #686868;
    }

    dd {
        color: #b2b2b2;
    }

    }
    }

    .city-list{
        table{
            font-size:px2rem(26);
            margin:0 px2rem(30);
            color:$dark-color;
            margin-bottom: px2rem(30);

            tr{
                td:first-child{
                    text-align:center;
                }
            }

            td{
                @include border(#979797);
                min-height:px2rem(60);
                padding:px2rem(11) px2rem(20);
                line-height: $main-line-height;
            }
        }
        p{
            font-size:px2rem(24);
            color:$dark-color;
            padding: 0 px2rem(30) px2rem(60);
            line-height: $main-line-height;
        }
    }
</style>

<script>
    import ComponentHeader from 'libs/header'

    export default {
        props: {
            downloadHref: String
        },

        data () {
            return {
                cityList: [
                    {name: '直辖市', value: '北京 上海 天津 重庆'},
                    {name: '安徽', value: '合肥 阜阳 安庆 宿州 六安 芜湖 蚌埠 亳州 滁州 宣城 马鞍山 淮北'},
                    {name: '福建', value: '漳州 莆田 龙岩 宁德 三明 南平'},
                    {name: '甘肃', value: '兰州 庆阳 天水 张掖 武威 白银 定西 平凉 酒泉 陇南'},
                    {name: '广东', value: '深圳 河源 潮州 阳江 云浮 广州 肇庆 清远 湛江 江门'},
                    {name: '广西', value: '河池 崇左 贺州 来宾 防城港'},
                    {name: '贵州', value: '贵阳 毕节 安顺 六盘水 都匀 铜仁'},
                    {name: '海南', value: '三亚'},
                    {name: '河北', value: '邯郸 廊坊 张家口 保定 邢台 唐山 衡水 承德 秦皇岛'},
                    {name: '河南', value: '南阳 信阳 平顶山 濮阳 周口 许昌 商丘 新乡 焦作 漯河 三门峡'},
                    {name: '黑龙江', value: '哈尔滨 齐齐哈尔 大庆 佳木斯 绥化'},
                    {name: '湖北', value: '襄阳 恩施 黄冈 十堰 孝感 黄石 咸宁 荆门'},
                    {name: '湖南', value: '衡阳 邵阳 郴州 常德 怀化 永州 株洲 娄底 益阳 湘潭'},
                    {name: '吉林', value: '长春 吉林'},
                    {name: '江苏', value: '常州 宿迁 苏州 无锡 徐州 南通 盐城 泰州 连云港 淮安 镇江'},
                    {name: '江西', value: '上饶 宜春 抚州 萍乡 吉安'},
                    {name: '辽宁', value: '鞍山 铁岭 阜新 丹东'},
                    {name: '内蒙古', value: '通辽 赤峰 包头 呼伦贝尔 巴彦淖尔'},
                    {name: '宁夏', value: '固原 吴忠'},
                    {name: '青海', value: '西宁'},
                    {name: '山东', value: '菏泽 济宁 潍坊 聊城 烟台 德州 淄博 泰安 滨州 枣庄 威海 临沂'},
                    {name: '山西', value: '大同 临汾 运城 晋中 吕梁 长治 忻州 晋城 朔州'},
                    {name: '陕西', value: '咸阳 榆林 渭南 汉中 延安 安康'},
                    {name: '四川', value: '成都 绵阳 宜宾 泸州 巴中 凉山 广安 广元 德阳 乐山 遂宁 自贡 眉山 内江'},
                    {name: '新疆', value: '哈密 阿勒泰 喀什'},
                    {name: '云南', value: '大理 昭通 文山 红河 玉溪 保山'},
                    {name: '浙江', value: '杭州 温州 宁波 台州 嘉兴 绍兴 湖州'}
                ]
            }
        },

        events: {},
        compiled() {
            let _terminal = window.navigator.userAgent,
                _terminalArr = _terminal.split("/");
            if (_terminal.indexOf("iPhone") >= 0 && _terminal.split("/")[_terminalArr.length - 2].indexOf("Safari") >= 0 || /MicroMessenger/.test(_terminal)) {
                this.downloadHref = "http://img1.yixinfinance.com/jinrong/assets/易鑫体验店申请书3.0__XXX省_XXX市_XXX公司.docx"
            }
        },

        components: {
            ComponentHeader
        }
    }
</script>