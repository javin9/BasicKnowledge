import '../main.scss';
import './list.scss';
import Vue from 'vue';

import Share from 'libs/share/index';
import CarSelector from 'libs/vue-components/car-selector'


// import down from '../components/appDown.vue';
import citySelect from 'libs/citySelect';
import YXSlider from 'libs/yxSlider';
import 'libs/swiper';
import iScroll from 'iScroll';

tools.appDown(true);
const $maskLayer = $('#maskLayer'),
    $html = $('html'),
    $quality = $('#quality'),
    $selTop = $('#sel-top'),
    $formDom = $("#orderInfoForm"),
    $toolsNav = $('#tools-nav'),
    $navTips = $('#navTips'),
    $searchcar = $('#searchcar'),
    loginBox = $('.login-box'),//加载中
    defaultBox = $('.default-box'),//缺省页
    listBox = $('.content-ctn'),//列表页内容
    isApp = tools.getCookie("YiXinAppInfo"),//判断是否为app

    productsUrl = APIURL + "api/FinancialProduct/SearchFinancialProducts";

var vm = new Vue({
    el: '#list',
    ready() {
        this.domInit();
    },
    components: {
        Share,
        CarSelector
    },
    data() {
        var _imgUrl = $('#wx_pic img').attr('src');
        return {
            carSelectorLevel: 2,
            onlySearch:false,
            //分享数据
            shareOptions: {
                title: car.carSerialShowName,
                url: window.location.href,
                desc: '易鑫车贷，一站式互联网汽车金融平台，尽享优惠快捷！（分享来自@易鑫车贷平台）',
                image: _imgUrl
            },
            // 首付
            downPaymentArr: [
                { 'text': 0, 'isDisable': false, 'isDefault': false, 'unit': '%' },
                { 'text': 10, 'isDisable': false, 'isDefault': false, 'unit': '%' },
                { 'text': 20, 'isDisable': false, 'isDefault': false, 'unit': '%' },
                { 'text': 30, 'isDisable': false, 'isDefault': true, 'unit': '%' },
                { 'text': 40, 'isDisable': false, 'isDefault': false, 'unit': '%' },
                { 'text': 50, 'isDisable': false, 'isDefault': false, 'unit': '%' },
                { 'text': 60, 'isDisable': false, 'isDefault': false, 'unit': '%' },
                { 'text': 70, 'isDisable': false, 'isDefault': false, 'unit': '%' }
            ],
            downPaymentNoUnit: [
                { 'text': 0, 'isDisable': false, 'isDefault': false },
                { 'text': 10, 'isDisable': false, 'isDefault': false },
                { 'text': 20, 'isDisable': false, 'isDefault': false },
                { 'text': 30, 'isDisable': false, 'isDefault': false },
                { 'text': 40, 'isDisable': false, 'isDefault': false },
                { 'text': 50, 'isDisable': false, 'isDefault': false },
                { 'text': 60, 'isDisable': false, 'isDefault': false },
                { 'text': 70, 'isDisable': false, 'isDefault': false }
            ],
            downPaymentPercentArr: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
            // 期限
            termArr: [
                { 'text': 12, 'isDisable': false, 'isDefault': false, 'unit': '期' },
                { 'text': 18, 'isDisable': false, 'isDefault': false, 'unit': '期' },
                { 'text': 24, 'isDisable': false, 'isDefault': false, 'unit': '期' },
                { 'text': 36, 'isDisable': false, 'isDefault': true, 'unit': '期' },
                { 'text': 48, 'isDisable': false, 'isDefault': false, 'unit': '期' },
                { 'text': 60, 'isDisable': false, 'isDefault': false, 'unit': '期' }
            ],
            termNoUnitArr: [
                { 'text': 12, 'isDisable': false, 'isDefault': false },
                { 'text': 18, 'isDisable': false, 'isDefault': false },
                { 'text': 24, 'isDisable': false, 'isDefault': false },
                { 'text': 36, 'isDisable': false, 'isDefault': false },
                { 'text': 48, 'isDisable': false, 'isDefault': false },
                { 'text': 60, 'isDisable': false, 'isDefault': false }
            ],
            termPercentArr: [12, 18, 24, 36, 48, 60],
            /*------dom相关------*/
            //排序类型
            sortObj: {
                'isMR': true,
                'isZCB': false,
                'isYG': false,
                'isRQ': false
            },
            quaArr: ['career', 'creditRecord', 'housingStatus', 'insuranceCertificate', 'fundStatus'],
            quaSignArr: [],
            defaultOrloginHeight: null,
            // 防止刷新接口
            isShowData: true,
            scrollSign: false,
            isShowLogin: true,//是否显示加载中
            isShowDefault: false,//是否显示缺省页
            isShowListCtn: false,//是否显示列表内容

            isShowCondition: false,//是否显示筛选条件
            isSort: false,
            isShowSort: false,//是否显示排序
            isShowSClass: false,
            isSortArrow: false,//排序箭头是否打开
            sotText: '综合排序',//排序文案
            isShowQuality: false,//是否显示资质
            isQualityArrow: false,//资质箭头是否打开
            isShowQClass: false,
            isOverFlowHidden: false,//是否禁止页面滚动
            quaCount: 0,//资质选择条数
            showQuaNum: false,
            // isShowTips: false, //是否显示税费弹层

            isShowBtn: true,
            isShowAdv: false, //是否显示顾问按钮
            isShowAdvTel: false,//顾问tel
            isShowAdvName: '--',//顾问名字
            isShowMonth: false, //是否显示月供、收付按钮
            isShowMonthText: '--',//月供
            isShowPay: '--',//首付
            isShowNoChecked: true, //是否显示未选择产品

            isShowEmpty: false, //是否显示空dom
            isApplyNow: true,//是否可点击申请
            Quality: '',
            scrollHeight: 0,
            /*------接口相关------*/
            sortType: 'MR',//排序类型
            // 五大特点
            company: '',//易鑫自营 472
            tiexi: false,//贴息促销  true
            filterName: '',//VIP顾问 VIIPGM
            isYouXuan: false, //优选商户 true
            elasticTail: false, //弹性尾款 true

            // 资质
            career: 0,//职业身份
            creditRecord: 0,//信用记录
            insuranceCertificate: 0,//社保证明
            fundStatus: 0,//公积金
            housingStatus: 0,//住房状态


            /*---贷款数据---*/
            carPrice: car.carPrice, //车款报价
            downPaymentPercent: 0.3, // 首付比例
            downPayment: '--', //首付
            suggestMonthlyPayment: '--',//建议月供
            loanVolumn: '--', //贷款额度
            taxes: 0, //税费
            purchaseTax: '--', //购置税
            purchaseTaxText: '--', //购置税显示文本
            purchaseTaxRate: car.purchaseTaxRate, //购置税率
            repaymentPeriod: 36, // 分期类别

            /***产品列表相关**/
            itemTotal: '--',//产品总数
            pageIndex: 1,
            pageIndexNum: 1,
            pageSize: 6,//产品数据页大小
            pageCount: 0,
            newPageSize: 0,
            pageTotal: 0,//产品总页数
            products: [],//产品数据
            productsView: [], //产品视图

            loanAdviserOrders: [], //贷款顾问
            loanAdviserShows: [],
            loanAdviserCount: 0, //贷款顾问数量
            isLoanAdviser: false,//是否显示贷款顾问

            adviserId: 0,//随机贷款顾问ID

            isShowLoanCost: true,//是否隐藏贷款成本
            ABTestkey: 1,//是否隐藏贷款成本传递参数
        }
    },
    methods: {
        //dom渲染
        domInit() {
            let self = this;

            $('#list').removeClass('hide');

            //分享按钮
            $("#shareNavTip").on('click', function (e) {
                self.$nextTick(() => self.$broadcast('showShare', 'share'))
            });

            // 判断是否是不显示贷款成本的城市
            /*let noLoanCityArr = noLoanCostCityIds.split(',');
             if (noLoanCityArr.indexOf(city.CityId) >= 0) {
             self.isShowLoanCost = false;
             }
             */

            let utrace = tools.getCookie('_utrace');

            if (!utrace) {
                let uuid;

                // 先从localStorage取值
                if (window.localStorage) {
                    uuid = window.localStorage.getItem('_utrace');
                }

                // 自己生成
                if (!uuid) {
                    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
                        return v.toString(16)
                    });

                    // 若uuid空的情况下（具体浏览器未知）, 保证拿到一个不重复的值
                    if (!uuid) {
                        uuid = +new Date() + '-' + Math.round(Math.random() * 100000)
                    }

                    if (window.localStorage) {
                        window.localStorage.setItem('_utrace', uuid);
                    }
                }

                //s20是代表20秒,h是指小时，如12小时则是：h12,d是天数，30天则：d30
                tools.setCookie('_utrace', uuid, 'd30');
                utrace = uuid;
            }

            if (parseInt(utrace.substring(0,1),16) % 2 === 0) {
                self.isShowLoanCost = false;
                self.ABTestkey = 2;
            }
            // 判断是否是不显示贷款成本的城市结束

            self.defaultOrloginHeight = 400;
                // $(window).height() - $(".sel-top").height();
            defaultBox.css({ 'min-height': self.defaultOrloginHeight});
            loginBox.css({ 'min-height': self.defaultOrloginHeight});

            // 月供数组更改
            let _downP = tools.getUrlParam('downPayment'),
                _term = tools.getUrlParam('repaymentPeriod');
            if (_downP) {
                self.getIndex(self.downPaymentPercentArr, _downP, (i) => {
                    if (i != 3) {
                        self.downPaymentArr[i].isDefault = true;
                        self.downPaymentArr[3].isDefault = false;
                    }
                });
                self.downPaymentPercent = _downP;

            }
            // 月供数组更改
            if (_term) {
                self.getIndex(self.termPercentArr, _term, (i) => {
                    if (i != 3) {
                        self.termArr[i].isDefault = true;
                        self.termArr[3].isDefault = false;
                    }
                });
                self.repaymentPeriod = _term;
            }

            //首付
            self.setYXSlider({
                'id': 'downPayment',
                'sliderArr': self.downPaymentArr,
                'sliderUnitArr': self.downPaymentNoUnit,
                'sliderPercentArr': self.downPaymentPercentArr
            });
            // 期限
            self.setYXSlider();

            // 筛选swiper
            // var selSwiper = new Swiper('#selSwiper', {
            //     slidesPerView: 3,
            //     observer: true,
            //     observeParents: true
            // });
            tools.telChannel({
                'PageType': 3,
                'CityId': city.CityId,
                'CityText': city.CityName,
                'CarId': car.carId,
                'CarText': car.carSerialShowName + car.carName,
                'isDefault': false,
                'id': 'userTel',//初始化DOM结构id
                'telId': 'noProductTel',//手机号输入框id
                'statisticalMarker': 'm-xinche-list-btn-tel-channel'
            });

            //滚动加载下一页
            var moreHeight = $("#listCtn").offset().top - $(window).height();
            var jishu = parseInt($("html").css("font-size").replace("px", ""));
            $(window).scroll(function () {
                var listHeight = moreHeight + self.pageIndex * 245 * self.newPageSize / 75 * jishu + 100 / 75 * jishu;
                var scrollHeight = document.body.scrollTop || document.documentElement.scrollTop;

                if (self.scrollSign) {
                    if (scrollHeight >= listHeight) {
                        self.scrollSign = false;

                        if (self.pageIndexNum < self.pageCount)
                            $("#empty").before('<div class="sliderUp-box"><i class="sliderUp"></i>向上滑动刷新</div>');

                        self.isShowEmpty = true;
                        ++self.pageIndexNum;
                        self.pageIndex = self.pageIndexNum;
                        self.getListData();
                    }
                };
            });

            self.Quality = new iScroll("#quality", { 'click': true });
            self.scrollHeight = $(".select").offset().top/* + 60/75*jishu*/;
            self.getListData();
            self.calculateLoanData();
        },
        goBack() {
            history.go(-1);
            return false;
        },
        // 月供数组需要修改的下标
        getIndex(arr, data, callback) {
            let contrastArr = arr,
                index = 0;
            for (let i = 0; i < contrastArr.length; ++i) {
                // contrastArr[i].isDefault = false;
                if (data == contrastArr[i]) {
                    index = i;
                    callback(index);
                }
            }
        },
        // 首付&期限
        setYXSlider(obj) {
            let self = this,
                // 默认值为期限
                defaultObj = {
                    'id': 'term',
                    'sliderArr': self.termArr,
                    'sliderUnitArr': self.termNoUnitArr,
                    'sliderPercentArr': self.termPercentArr
                },
                newData = $.extend(defaultObj, obj);
            let newSlider = new YXSlider(newData.id, newData.sliderArr, function (result) {
                if (!self.isShowData) {
                    let noUnit = newData.sliderUnitArr,
                        oldNum = newData.id == 'downPayment' ? self.downPaymentPercent : self.repaymentPeriod;

                    self.getIndex(newData.sliderPercentArr, oldNum, (i) => {
                        for (let j = 0; j < noUnit.length; ++j) {
                            noUnit[j].isDefault = false;
                        }
                        noUnit[i].isDefault = true;
                        newSlider.update(noUnit);
                    });
                    return tools.showAlert("大侠手太快啦，等下再试试！");
                }

                if (newData.id == 'downPayment')
                    self.downPaymentPercent = (result.text / 100).toFixed(1);
                else
                    self.repaymentPeriod = result.text;

                self.scrollEvent = false;
                self.resetData();
                self.calculateLoanData();
            });
        },
        // 计算贷款数据
        calculateLoanData() {
            let carPrice = this.carPrice * 10000,
                downPayment = 0,
                isShowPay = '--',
                loanVolumn = 0,
                taxes = 0,
                purchaseTaxText = "",
                purchaseTax = 0,
                suggestMonthlyPayment = 0,
                downPaymentPercent = this.downPaymentPercent;
            if (carPrice == "") {
                isShowPay = '--';
                downPayment = "--";
                carPrice = "--";
                loanVolumn = "--";
                taxes = "--";
                purchaseTax = "--";
                suggestMonthlyPayment = "--";
            }
            else {
                isShowPay = carPrice * downPaymentPercent < 10000 ? carPrice * downPaymentPercent + '元' : (carPrice * downPaymentPercent / 10000).toFixed(2) + '万';
                // downPayment = tools.addCmma(carPrice * downPaymentPercent);
                // loanVolumn = tools.addCmma(carPrice - carPrice * downPaymentPercent);
                downPayment = this.carPrice * downPaymentPercent;
                loanVolumn = this.carPrice * (1 - downPaymentPercent);
                taxes = tools.addCmma(carPrice / 1.17 * this.purchaseTaxRate + 500 + 950);
                purchaseTax = carPrice / 1.17 * this.purchaseTaxRate;
                purchaseTaxText = tools.addCmma(purchaseTax);

                /***
                市场月供＝　（贷款金额×（１＋费率））/期限
                贷款金额 = 车价 ×（1-首付比例）
                参考费率：
                12  9%
                24  17%
                36  25%
                48  34%
                60  42%
                ***/
                var rate = 0.25;
                var repaymentPeriod = this.repaymentPeriod;

                switch (repaymentPeriod) {
                    case 12:
                        rate = 0.09;
                        break;
                    case 24:
                        rate = 0.17;
                        break;
                    case 36:
                        rate = 0.25;
                        break;
                    case 48:
                        rate = 0.34;
                        break;
                    case 60:
                        rate = 0.42;
                        break;
                    default:
                        rate = 0.25;
                        break;
                }
                suggestMonthlyPayment = tools.addCmma(((carPrice * (1 - parseFloat(downPaymentPercent))) * (1 + rate)) / repaymentPeriod);
            }
            this.isShowPay = isShowPay;
            this.downPayment = downPayment < 1 ? Math.round(downPayment * 10000) + '元' : downPayment.toFixed(2) + '万';
            this.loanVolumn = loanVolumn < 1 ? Math.round(loanVolumn * 10000) + '元' : loanVolumn.toFixed(2) + '万';
            this.taxes = taxes;
            this.purchaseTaxText = purchaseTaxText;
            this.purchaseTax = purchaseTax;
            this.suggestMonthlyPayment = suggestMonthlyPayment;

            //分享
            this.shareOptions.title = car.carSerialShowName + '首付只要' + this.downPayment + '，易鑫帮您贷回家~';

            var _shareUrl = tools.setUrlParam('DownPayment', this.downPaymentPercent);
            _shareUrl = tools.setUrlParam('RepaymentPeriod', this.repaymentPeriod, _shareUrl);
            this.shareOptions.url = _shareUrl;
            // console.log(this.shareOptions);
            this.$nextTick(() => this.$broadcast('updateShare', this.shareOptions));
        },
        changeCity(e) {
            e.preventDefault();
            citySelect.citySelect(city, function (result) {
                setTimeout(function () {
                    window.location.href = '/' + result.CitySpell + '/' + car.carSerialAllSpell + '?source=' + tools.getUrlParam('source');
                }, 100);
            });
        },
        selectCarCallback(data, options){
            const goto = href => {
                if(dev){
                    console.log(href)
                }else{
                    document.location.href = href
                }
            }
            if(options.trigger === 'changeCar'){
                let href = '/' + city.citySpell + '/budget/?source=' + source
                if(data.brand.id && !data.series.id){
                    href = '/' + city.citySpell + '/budget/?b=' + data.brand.id + '&source=' + source
                }else{
                    href = "/" + city.citySpell + "/" + data.series.spell + "/m" + data.car.id + (!dealer.dealerId ? '' : '/d' + dealer.dealerId) + "/?source=" + source
                }
                goto(href)
            }else{
                if(data.series.name){
                    const name = data.brand.name ? data.brand.name + ' ' + data.series.name : data.series.name
                    $searchcar.find('span').text(name)
                }
                setTimeout(()=>{
                    const href = '/' + city.citySpell + '/' + data.series.spell + '/?source=' + source
                    goto(href)
                },100)
            }
        },
        // 切换车款
        changeCar() {
            this.carSelectorLevel = 3
            this.onlySearch = false
            this.$broadcast('showCarSelector', {
                trigger: 'changeCar',
                series: {
                    id: +car.serialId,
                    name: car.carSerialShowName,
                    spell: car.carSerialAllSpell,
                },
                brand: {
                    id: +car.masterBrandId,
                    name: car.masterBrandName,
                    logo:car.masterBrandLogo
                }
            })
        },
        // 头部导航搜索车款
        searchCar() {
            this.carSelectorLevel = 2
            this.onlySearch = true
            this.$broadcast('showCarSelector', {trigger: 'searchCar'})
        },
        // 显示排序列表
        showSort() {
            let self = this;
            if (self.isShowCondition && self.isShowSort) {//筛选弹层打开卡且排序列表显示
                self.isSort = false;
                self.isSortArrow = false;
                if (self.sortType == 'MR') {
                    self.isShowSort = !self.isShowSort;
                    self.isShowSClass = !self.isShowSClass;
                    self.isShowQClass = self.quaCount != 0 ? true : false;
                    self.showMasklayer(self.isShowSort);
                } else {
                    self.isShowSort = true;
                    self.isShowSClass = true;
                    self.isShowQClass = self.quaCount != 0 ? true : false;
                    self.showMasklayer(false);
                }
            } else {//排序列表未显示
                self.isSort = true;
                self.isSortArrow = true;
                self.isShowSort = true;
                self.isShowSClass = true;
                self.isQualityArrow = false;
                self.isShowQClass = self.quaCount != 0 ? true : false;
                if (!self.isShowQClass) {
                    self.resetQuality();
                }
                self.showMasklayer(true);
                self.handleQualityData();
            }
            if (self.isShowSort) {
                let _time;
                if (parseInt(self.scrollHeight) == parseInt(document.body.scrollTop)) {
                    _time = 0;
                } else {
                    _time = 400
                    self.myscrollTop(self.scrollHeight, 400);
                }
            }
            self.scrollEvent = true;
            self.isShowQuality = false;
        },
        // 选择排序方式
        selectSort(sort, txt) {
            let self = this;
            let targetSort = 'is' + sort;
            if (!self.isShowData) {
                return tools.showAlert("大侠手太快啦<br>等下再试试！")
            }
            self.scrollEvent = true;

            self.sortType = sort;
            self.sotText = txt;
            self.isShowSort = false;
            self.isShowSClass = sort != 'MR' ? true : false;
            for (let key in self.sortObj) {
                if (self.sortObj.hasOwnProperty(key)) {
                    self.sortObj[key] = false;
                }
            }
            self.sortObj[targetSort] = true;
            self.isSortArrow = false;
            self.isShowQuality = false;
            self.isShowQClass = self.quaCount != 0 ? true : false;
            self.isQualityArrow = false;
            self.showMasklayer(false);

            // 调取接口更新数据
            self.resetData();
        },
        // 资质
        showQuality() {
            let self = this;
            if (self.isShowCondition && self.isShowQuality) {
                self.isShowQuality = !self.isShowQuality;
                self.isQualityArrow = false;
                self.isShowQClass = self.quaCount != 0 ? true : false;

                self.isShowSort = self.sortType == 'MR' ? false : true;
                self.isShowSClass = self.sortType == 'MR' ? false : true;
            } else {
                self.isShowQuality = true;
                self.isShowQClass = true;
                self.isQualityArrow = true;
                self.isShowSort = false;
                self.isShowSClass = self.sortType == 'MR' ? false : true;
            }
            if (self.isShowQuality) {
                let jichu = parseInt($("html").css("font-size").replace("px", ""));
                let _time;
                if (parseInt(self.scrollHeight) == parseInt(document.body.scrollTop)) {
                    _time = 0;

                } else {
                    _time = 400
                    self.myscrollTop(self.scrollHeight, 400);
                }
                setTimeout(function () {
                    if ($(window).height() == 960) {
                        $("#quality").css({ 'height': "695px" });
                    } else {
                        let _hei = Math.floor($(window).height() - $('.sel-header').height() - 200 / 75 * jichu - 4)
                        $("#quality").css({ 'height': _hei + "px" });
                    }
                    setTimeout(function () {
                        self.Quality.refresh();
                    }, 500);
                    $('body').bind('touchmove', function (e) {
                        e.preventDefault();
                    });
                });
            }
            self.isSortArrow = false;
            self.scrollEvent = true;
            self.showMasklayer(self.isShowQuality);
        },
        //重置资质条件
        resetQuality() {
            // $('.qua-items').each(function () {
            //     $(this).find('span').eq(0).addClass('cur').siblings('span').removeClass('cur');
            // });

            $('.qua-items span').removeClass('cur');
        },
        // swiper筛选条件
        swiperSelect(id) {
            let self = this;
            if (!self.isShowData) {
                return tools.showAlert("大侠手太快啦<br>等下再试试！")
            }
            self.scrollEvent = true;
            switch (id) {
                case '0':
                    if (self.company == '') {
                        self.company = 472;
                    } else {
                        self.company = '';
                    }
                    // 刷新数据
                    self.resetData();
                    break;
                case '1':
                    self.tiexi = !self.tiexi;
                    // 刷新数据
                    self.resetData();
                    break;
                case '2':
                    self.elasticTail = !self.elasticTail;
                    // 刷新数据
                    self.resetData();
                    break;
                case '3':
                    self.isYouXuan = !self.isYouXuan;
                    // 刷新数据
                    self.resetData();
                    break;
                case '4':
                    if (self.filterName == '') {
                        self.filterName = 'VIPGW';
                    } else {
                        self.filterName = '';
                    }
                    // 刷新数据
                    self.resetData();
                    break;
            }
            self.isSortArrow = false;
            self.isShowSort = false;
            self.isShowSClass = self.sortType != 'MR' ? true : false;
            self.isQualityArrow = false;
            self.isShowQuality = false;
            self.isShowQClass = self.quaCount != 0 ? true : false;
            // if (!self.isShowQClass) {
            //     self.resetQuality();
            // }
            self.handleQualityData();
            self.showMasklayer(false);
        },
        // 显示税费弹层
        // showTips(e) {
        //     let self = this;
        //     e.stopPropagation();
        //     self.isShowTips = !self.isShowTips;
        // },
        //处理资质数据
        handleQualityData() {
            let self = this;
            if (self.quaCount <= 0) {
                self.isShowQClass = false;
                self.resetQuality();
            } else {
                self.isShowQClass = true;
                $('.qua-items').each(function (i, item) {
                    $(item).find('span').each(function (j, child) {
                        // if(self[self.quaArr[i]] == 0){
                        //     $(child).removeClass('cur');
                        // }else if ($(child).data('id') == self[self.quaArr[i]]) {
                        //     $(child).addClass('cur').siblings('span').removeClass('cur');
                        // }
                        if (self[self.quaArr[i]] == 0) {
                            $(child).removeClass('cur');
                        } else if (self[self.quaArr[i]] != 0 && $(child).data('sign') == self.quaSignArr[i]) {
                            $(child).addClass('cur').siblings('span').removeClass('cur');
                        }
                    });
                });
            }
        },
        //获取列表数据
        getListData() {
            let self = this;
            self.isShowDefault = false;

            tools.$ajax({
                url: productsUrl + '?carPrice=' + self.carPrice + '&carId=' + car.carId + '&cityId=' + city.cityId + '&downPaymentRate=' + self.downPaymentPercent + '&repaymentPeriod=' + self.repaymentPeriod + '&ChannelCode=&sortName=' + self.sortType + '&job=' + self.career + '&credit=' + self.creditRecord + '&house=' + self.housingStatus + '&socialSecurity=' + self.insuranceCertificate + '&fund=' + self.fundStatus + '&isDiscount=' + self.tiexi + '&packageType=' + (self.elasticTail ? 7 : 0) + '&pageIndex=' + self.pageIndex + '&pageSize=' + self.pageSize + '&isNeedTop=true&companyId=' + self.company + '&isYouXuan=' + self.isYouXuan + '&filterName=' + self.filterName,
                type: 'Get',
                dataType: 'jsonp',
                success: (res) => {
                    if (!res.Result)
                        return tools.showAlert(res.Message);

                    if (res.RowCount > 0) {
                        self.pageCount = Math.ceil(res.RowCount / self.pageSize);
                        var data = res.Data,
                            newData = [];

                        for (let i = 0; i < data.length; ++i) {
                            // if (data[i].PackageType == 37)
                            //     continue;
                            newData.push(data[i]);
                        }
                        for (let j = 0; j < newData.length; ++j) {
                            var proData = {},
                                pData = newData[j];
                            proData.checked = self.pageIndex == 1 && j == 0 ? true : false;
                            proData.CompanyLogoUrl = pData.CompanyLogoUrl;//logo
                            proData.PackageName = pData.PackageName;//金融产品名称
                            proData.CompanyName = pData.CompanyName;//公司名称    
                            proData.order = pData.PackageId + '_' + pData.ProductId + '_' + (pData.ProductPromotionId ? pData.ProductPromotionId : 0);//order参数
                            proData.MonthlyPaymentPrefix = '';
                            proData.MonthlyPaymentText = pData.MonthlyPaymentText.replace("元", "").replace("万", "");//月供
                            proData.MonthlyPaymentUnit = pData.MonthlyPaymentText.indexOf("万") > 0 ? "万" : "元";

                            let CommentHtml = '';
                            if (pData.CommentCount == 0) {
                                CommentHtml = '<span>暂无评价</span>'
                            } else {
                                CommentHtml = '<span class="font-title col_rede font_no_blod">' + (pData.CommentScore % 1 != 0 ? pData.CommentScore : pData.CommentScore + '.0') + '</span>分／<span class="evaluation"><span>' + pData.CommentCount + '</span>条评价</span>'
                            }
                            proData.CommentHtml = CommentHtml;

                            //proData.ApplyCount = pData.ApplyCount;//申请人数
                            proData.TotalCostPrefix = self.isShowLoanCost ? '分期成本' : '';
                            proData.TotalCostText = self.isShowLoanCost ? pData.TotalCostText : '';//总成本
                            proData.SubHeading = pData.SubHeading;//副标题

                            proData.TotalCost = pData.TotalCostText
                            proData.MonthPayment = pData.MonthlyPaymentText
                            proData.ProductId = pData.ProductId


                            proData.IsSubtitleKlass = (pData.IsTop || pData.CompanyId == 803 || pData.OrderApplyUrl.indexOf("YxHxm") >= 0) ? "dl subtitle" : "dl subtitle hide";

                            proData.CommonRequirementName = '申请信息';
                            if (pData.CommonRequirementType == 1) {
                                proData.CommonRequirement = "严格";
                                proData.CommonRequirementKlass = "font-28 level_one";
                            } else if (pData.CommonRequirementType == 3) {
                                proData.CommonRequirement = "宽松";
                                proData.CommonRequirementKlass = "font-28 level_three";
                            } else {
                                proData.CommonRequirement = "一般";
                                proData.CommonRequirementKlass = "font-28 level_two";
                            }

                            //产品特点
                            proData.IsPackageShow = (pData.PackageFeatureIcon1 || pData.PackageFeatureIcon2) ? true : false;
                            proData.PackageFeatureHrml = pData.PackageFeatureIcon1 && pData.PackageFeatureIcon2 ? '<span class="font-22 tag_blue">' + pData.PackageFeatureIcon1 + '</span><span class="font-22 tag_red">' + pData.PackageFeatureIcon2 + '</span>' : '';

                            //惠：MultiLabel，双竖杠分隔（PC站特殊标签说明：MultiLabelRemark，双竖杠分隔，与标签一一对应）ApplyCondition
                            proData.MultiLabel = pData.MultiLabel ? pData.MultiLabel.replace(/\|\|/g, "；") : "";
                            proData.MultiLabelKlass = pData.MultiLabel ? "uf uf-ic ut-s" : "uf uf-ic ut-s hide";

                            // 付：在线支付1元押金抵1000元，两个数字字段名分别为：DepositAmount，OffsetDownPaymentAmount
                            if (pData.PaySimpleInfoList.length == 0) {
                                proData.FuLabelKalss = "uf uf-ic ut-s hide";
                                proData.PaySimpleInfo = ""
                            } else {
                                proData.FuLabelKalss = "uf uf-ic ut-s";
                                proData.PaySimpleInfo = pData.PaySimpleInfoList.join(";");
                                // console.log(pData.PaySimpleInfoList.join(";"))
                            }

                            //礼：礼包：PackageGiftValueAmount套餐礼包价值，为0不显示
                            if (pData.PackageGiftValueAmount == 0 || pData.PackageGiftValueAmount == null) {
                                proData.PackageGiftValueAmount = "";
                                proData.PackageGiftValueKlass = "uf uf-ic ut-s hide";
                            } else {
                                proData.PackageGiftValueAmount = pData.PackageGiftValueAmount;
                                proData.PackageGiftValueKlass = "uf uf-ic ut-s";
                            }

                            //角标
                            proData.RecommendText = pData.RecommendText;
                            if (pData.RecommendText) {
                                if ((pData.PackageGiftValueAmount == 0 || !pData.PackageGiftValueAmount) && (!pData.MultiLabel || pData.MultiLabel == '') && pData.PaySimpleInfoList.length == 0) {
                                    proData.RecommendTextKlass = "corner";
                                    proData.ImgInfoKlass = "img_info hide";
                                } else {
                                    proData.RecommendTextKlass = "corner corner-lifuhui";
                                    proData.ImgInfoKlass = "img_info";
                                }
                            } else {
                                //proData.RecommendTextKlass = "hide";
                                if (!pData.MultiLabel && pData.PaySimpleInfoList.length == 0) {
                                    proData.ImgInfoKlass = "hide";
                                } else {
                                    proData.ImgInfoKlass = "img_info";
                                }
                            }
                            if (pData.Idx) {
                                proData.Idx = pData.Idx;
                            } else {
                                proData.Idx = '0';
                            }

                            proData.IsTopKlass = pData.IsTop ? "top-tag" : "top-tag hide";//置顶是佛显示
                            proData.detailUrl = "/" + city.citySpell + "/m" + car.carId + "/p" + pData.ProductId + (dealer.dealerId != "" ? "/d" + dealer.dealerId : "") + "?carprice=" + car.carPrice + "&Idx=" + proData.Idx + "&source=" + source;
                            proData.applyUrl = pData.OrderApplyUrl;


                            if (pData.PackageType === 38 && pData.IsTop === true) {
                                proData.MonthlyPaymentPrefix = '租金：';
                                proData.MonthlyPaymentText = pData.MonthlyRent;//月供
                                proData.MonthlyPaymentUnit = "元";
                                if (pData.YzdgMonthlyPaymentText) {
                                    proData.TotalCostPrefix = '先开后买租金：';
                                    proData.TotalCostText = pData.YzdgMonthlyPaymentText + '/月';//总成本
                                } else {
                                    proData.TotalCostPrefix = '';
                                    proData.TotalCostText = '';
                                }
                                proData.CommonRequirementName = '提交材料';
                                proData.detailUrl = "/lease/" + city.citySpell + "/m" + car.carId + "/p" + pData.ProductId + (dealer.dealerId != "" ? "/d" + dealer.dealerId : "") + "?carprice=" + car.carPrice + "&source=" + "912";
                            }
                            self.products.push(proData);
                        }

                        self.productsView = self.products;

                        $.each(newData, (index, val) => {
                            (function (index, val) {
                                $.ajax({
                                    url: adviserApi + "v2/group/getadviserlist?CityId=" + city.cityId + "&CompanyIds=" + val.CompanyId,
                                    type: 'Get',
                                    dataType: 'jsonp',
                                    async: true,
                                    cache: true,
                                    success: (advRes) => {
                                        var eqIndex = index + self.productsView.length - newData.length;
                                        if (advRes.Data != null && advRes.Data[0] != null) {
                                            var adlist = [];
                                            var adAllList = [];
                                            var txten = '';
                                            var isCallType = 0;
                                            var setStrName = function(str, len) {
                                                var str_length = 0;
                                                var str_len = 0;
                                                var str_cut = new String();
                                                var str_len = str.length;
                                                for (var i = 0; i < str_len; i++) {
                                                   var a = str.charAt(i);
                                                    str_length++;
                                                    if (escape(a).length > 4) {
                                                        //中文字符的长度经编码之后大于4  
                                                        str_length++;
                                                    }
                                                    str_cut = str_cut.concat(a);
                                                    if (str_length >= len) {
                                                        //str_cut = str_cut.concat("...");
                                                        return str_cut;
                                                    }
                                                }
                                                //如果给定字符串小于指定长度，则返回源字符串；  
                                                if (str_length < len) {
                                                    return str;
                                                }
                                            }


                                            // for (var i = 0; i < advRes.Data[0].Adviser.length; i++) {
                                            //     if (advRes.Data[0].Adviser[i].CallType == 1) {
                                            //         isCallType = 1;
                                            //         adlist.push(advRes.Data[0].Adviser[i]);
                                            //     }
                                            // }
                                            // if (isCallType == 0) {
                                            //     adAllList = advRes.Data[0].Adviser;
                                            // } else {
                                            //     adAllList = adlist;
                                            // }
                                            //randomNum = parseInt(Math.random() * (adAllList.length)),
                                            var advData = advRes.Data[0].Adviser,
                                                advTel = 'tel:' + advData.CN400,
                                                advName = setStrName(advData.Name,6);

                                            $(".pro-groups").eq(eqIndex).data('ishas', true).data('tel', advTel).data('name', advName).data('advid', '0').prepend('<a class="adviser" data-tel=' + advTel + ' data-name=' + advName + ' data-companyid=' + val.CompanyId + '>' +
                                                '<div class="uf uf-ic adviserDiv">' +
                                                '<div class="name uf uf-ic"><img class="ad-photo" src="' + advData.Photo + '">' +
                                                '<span>' + advName + '</span>' +
                                                '</div>' +
                                                '<div class="ad-tel"></div>' +
                                                '</div>' +
                                                '</a>');
                                            $(".pro-groups").eq(eqIndex).find('.title_box').css('width', $('.item_right_box').width() - $('.adviser').width() + 'px');


                                            if (index == 0 && self.pageIndex == 1) {
                                                self.changeApply('isShowAdv');
                                                self.isShowAdvTel = advTel;
                                                self.isShowAdvName = advName;
                                            }
                                        } else {
                                            var advTel = 'tel:4000169169';
                                            $(".pro-groups").eq(eqIndex).data('ishas', true).data('tel', advTel);
                                            if (index == 0 && self.pageIndex == 1) {
                                                self.changeApply('isShowMonth');
                                                self.isShowMonthText = self.productsView[0].MonthlyPaymentText + self.productsView[0].MonthlyPaymentUnit;
                                            }
                                        }

                                        $(".pro-groups").eq(eqIndex).find('.adviser').click(function (e) {
                                            var h = $(this).attr('data-tel');
                                            location.href = h;
                                            try {
                                                bc.clk({etag: 'a', eid:bc.getXpath(this)})
                                                _hmt.push(['_trackEvent', 'm-xinche-list-btn-conslut', 'click', '', '']);
                                            } catch (e) {

                                            }
                                            e.stopPropagation();
                                            return false;
                                        });

                                        // $(".pro-groups").eq(eqIndex).find('.btn-apply').click(function (e) {
                                        //     self.applyNow($(this));
                                        //     try {
                                        //         _hmt.push(['_trackEvent', 'm-xinche-list-btn-apply', 'click', '', '']);
                                        //     } catch (e) {

                                        //     }
                                        //     e.stopPropagation();
                                        //     return false;
                                        // });

                                        let listLeg = eqIndex + 1;
                                        $('#listTel01').remove();
                                        $('#listTel02').remove();
                                        $('#listTel03').remove();

                                        if (listLeg > 0 && listLeg < 10) {
                                            $(".sliderUp-box").before('<section id="listTel01" class="tel-channel"></section>');
                                            self.telChannel('listTel01', 'listMobile01', 5);
                                        } else if (listLeg >= 10 && listLeg < 20) {
                                            $(".pro-groups").eq(9).after('<section id="listTel01" class="tel-channel"></section>');
                                            self.telChannel('listTel01', 'listMobile01', 2);
                                        } else if (listLeg >= 20 && listLeg < 30) {
                                            $(".pro-groups").eq(9).after('<section id="listTel01" class="tel-channel"></section>');
                                            $(".pro-groups").eq(19).after('<section id="listTel02" class="tel-channel"></section>');
                                            self.telChannel('listTel01', 'listMobile01', 2);
                                            self.telChannel('listTel02', 'listMobile02', listLeg == 20 ? 2 : 5);
                                        } else if (listLeg >= 30) {
                                            // alert(2)
                                            $(".pro-groups").eq(9).after('<section id="listTel01" class="tel-channel"></section>');
                                            $(".pro-groups").eq(19).after('<section id="listTel02" class="tel-channel"></section>');
                                            $(".sliderUp-box").before('<section id="listTel03" class="tel-channel"></section>');
                                            self.telChannel('listTel01', 'listMobile01', 2);
                                            self.telChannel('listTel02', 'listMobile02', 2);
                                            self.telChannel('listTel03', 'listMobile03', 5);
                                        }
                                    }
                                })
                            })(index, val);
                        });
                        self.newPageSize = newData.length;

                        if (self.pageIndex < self.pageCount) {
                            $(".sliderUp-box").remove();
                            self.scrollSign = true;
                        } else if (self.pageCount == 1) {
                            $("#empty").before('<div class="sliderUp-box">没有更多了~</div>');
                            self.scrollSign = false;
                        } else {
                            $(".sliderUp-box").html("没有更多了~");
                        }
                        if (listBox.height() <= self.defaultOrloginHeight) {
                            listBox.css({ 'min-height': self.defaultOrloginHeight});
                        }

                        self.isShowLogin = false;
                        self.isShowDefault = false;
                        self.isShowEmpty = true;
                        self.isShowBtn = true;
                        self.isShowListCtn = true;
                        $('.escdk13').removeAttr('style');

                        if (newData.length == 0) {
                            $(".sliderUp-box").html("");
                            self.isShowBtn = false;
                            self.changeApply('isShowNoChecked')
                            self.isShowListCtn = false;
                            self.isShowLogin = false;
                            self.isShowDefault = true;
                            $('.escdk13').css('margin-bottom', 0);
                        }
                    } else {
                        $(".sliderUp-box").html("");
                        self.isShowBtn = false;
                        self.changeApply('isShowNoChecked')
                        self.isShowListCtn = false;
                        self.isShowLogin = false;
                        self.isShowDefault = true;
                        $('.escdk13').css('margin-bottom', 0);
                    }

                    if (self.scrollEvent && self.pageIndex == 1) {
                        self.myscrollTop(self.scrollHeight, 400);
                    }
                    // self.isShowEmpty = true;
                    self.isShowData = true;
                }
            });
        },
        //贷款顾问
        loanAdviser(CompanyId) {
            var self = this;
            var _url = adviserApi + "group/" + city.cityId + "/" + CompanyId + "/";
            tools.$ajax({
                url: _url,
                dataType: 'jsonp',
                success: (res) => {
                    if (res.Advisers == null) {
                        self.isLoanAdviser = false;
                        self.adviserId = 0;
                    } else {
                        self.isLoanAdviser = true;

                        var loanAdviserShows = [];
                        var loanAdvisers = [],
                            advisers = res.Advisers,
                            adviserCount = advisers.length,
                            supplement = 3 - (adviserCount % 3),
                            maxIndex,
                            adviserNum = res.Advisers.length,
                            adviserIndex = Math.floor(Math.random() * adviserNum + 1) - 1;
                        self.adviserId = advisers[adviserIndex].Id;
                        (adviserCount > 3) ? maxIndex = (adviserCount + supplement) : maxIndex = adviserCount;
                        self.loanAdviserCount = adviserCount;
                        if (adviserCount == 0) {
                            $(".cpxq14").css("display", "none");
                            $(".cpxq171").css("display", "none");
                            $(".cpxq17 a").css("width", "100%");
                        }
                        var skillLevelClass = "jz";
                        for (var i = 0; i < adviserCount; i++) {
                            var adviser = advisers[i],
                                _tip = "";
                            if (adviser) {
                                if (adviser.SkillLevelId == 1) {
                                    _tip = "铜牌顾问：热情周到，跟进迅速，服务能力突出";
                                    skillLevelClass = "tz";
                                } else if (adviser.SkillLevelId == 2) {
                                    _tip = "银牌顾问：贷款成功率高，可针对不同用户的不同需求做出评估指导";
                                    skillLevelClass = "yz";
                                } else {
                                    _tip = "金牌顾问：精通车贷业务，全方位服务用户，用户评价较高";
                                    skillLevelClass = "jz";
                                }
                            }

                            var loanAdviserObj;
                            //console.log(i +"__"+(adviserCount + supplement -2))

                            loanAdviserObj = {
                                Id: adviser.Id,
                                name: adviser.Name,
                                workingYears: adviser.WorkingYears,
                                skillLevelId: adviser.SkillLevelId,
                                skillLevelClass: skillLevelClass,
                                photo: adviser.Photo,
                                cN400: adviser.CN400,
                                exTen: adviser.ExTen,
                                serveNumber: "已帮" + adviser.ServeNumber + "人贷款　",// + adviser.Rate + "%好评"
                                tip: _tip,
                                specialClass: "swiper-slide"
                            }

                            loanAdvisers.push(loanAdviserObj);
                            if (i < 3) {
                                loanAdviserShows.push(loanAdviserObj);
                            }
                        }
                        self.loanAdviserShows = loanAdviserShows;
                        self.loanAdviserOrders = loanAdvisers;
                    };
                }
            })
        },
        //改变条件，重置数据
        resetData() {
            let self = this;
            self.pageIndex = 1;
            self.pageIndexNum = 1;
            self.isShowLogin = true;
            self.isShowListCtn = false;
            self.isShowEmpty = false;
            self.isShowData = false;
            self.products = [];
            if ($(".sliderUp-box").length > 0) {
                $(".sliderUp-box").remove();
            }

            $('#listTel01').remove();
            $('#listTel02').remove();
            $('#listTel03').remove();
            self.changeApply('isShowNoChecked');
            self.getListData();

            // setTimeout(function() {
            //     $('.check-box').eq(0).click();
            //     // alert('checkboxClick')
            // }, 1000);
        },
        // 手机号通道
        telChannel(id, telId, num) {
            tools.telChannel({
                'PageType': num,
                'CityId': city.CityId,
                'CityText': city.CityName,
                'CarId': car.carId,
                'CarText': car.carSerialShowName + car.carName,
                'id': id,//初始化DOM结构id
                'telId': telId,//手机号输入框id
                'statisticalMarker': 'm-xinche-list-btn-tel-channel'
            });
        },
        //滚动模拟
        myscrollTop(scrollTo, time) {
            var scrollFrom = parseInt(document.body.scrollTop),
                i = 0,
                runEvery = 5; // run every 5ms

            scrollTo = parseInt(scrollTo);
            time /= runEvery;

            var interval = setInterval(function () {
                i++;

                document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

                if (i >= time) {
                    clearInterval(interval);
                }
            }, runEvery);
        },
        // 是否限制遮罩层
        showMasklayer(isShow) {
            if (isShow) {
                $maskLayer.css('display', 'block');
                $html.css('overflow', 'hidden');
                this.isShowCondition = true;
            } else {
                $maskLayer.css('display', 'none');
                $html.css('overflow', 'auto');
                $('body').unbind('touchmove');
                this.isShowCondition = false;
            }
        },
        // 显示（报价、贷款顾问）
        showDealerOrAdviser(id, scrollName) {
            $("#" + id).removeClass("hide");
            $("#maskLayer").css("display", "block");
            $("html").css('overflow-y', 'hidden');
            $('body').bind('touchmove', function (e) {
                e.preventDefault();
            });
            setTimeout(function () {
                scrollName.refresh();
            }, 300);
        },
        //报价和贷款顾问隐藏
        hideDealerOrAdviser(id) {
            $("#" + id).addClass("hide");
            $('body').unbind('touchmove');
            $("#maskLayer").css("display", "none");
            $("html").css('overflow-y', 'auto');
        },//申请按钮切换
        changeApply(name) {
            let self = this;
            self.isShowAdv = false;
            self.isShowMonth = false;
            self.isShowNoChecked = false;
            self[name] = true;
            switch (name) {
                case 'isShowAdv':
                    $('.apply-box .left').show();
                    $('.apply-box .right').css('width', "6rem");
                    break;
                case 'isShowNoChecked':
                    $('.apply-box .left').hide();
                    $('.apply-box .right').css('width', "100%");
                    break;
            }
        },
        track(productId){
            try{
              const pids = this.products.map(item => `${item.ProductId}_${item.TotalCost}_${item.MonthPayment}`).join(',')
              bc.evt.send('listproduct', 'listsubmit', pids, `${productId}_${this.sortType}_${car.carId}_${city.cityId}_${this.downPayment}_${this.loanVolumn}`)
            }catch(e){}
        },
        applyNow(item) {
            let self = this;
            let $group = $(item).parents('.pro-groups'),
                AdviserId = $group.data('advid'),
                Orders = $group.data('order'),
                Idx = $group.data('idx');

            this.track(Orders.split('_')[1])
            $formDom.attr('action', loanOrderApplyUrl + $group.data('applyurl').replace('/', '').replace(/\/?$/, '/'));

            $formDom.find('input[name="Orders"]').val(Orders);
            $formDom.find('input[name="CarId"]').val(car.carId);
            $formDom.find('input[name="CityId"]').val(city.CityId);
            $formDom.find('input[name="CarPrice"]').val(car.carPrice);
            $formDom.find('input[name="Source"]').val(source ? 10000 + parseInt(source) : '10');

            $formDom.find('input[name="Line"]').val(BusinessLine);
            $formDom.find('input[name="AdviserId"]').val('');
            $formDom.find('input[name="Idx"]').val(Idx);

            //插入新的节点：$formDom  <input name="ABTestkey" type="hidden" value="">
            $formDom.append('<input name="ABTestkey" type="hidden" value="" />')
            $formDom.find('input[name="ABTestkey"]').val(self.ABTestkey);
            // console.log($formDom.find('input[name="ABTestkey"]').val(self.ABTestkey),'ABTestkey______',self.ABTestkey)
            //经销商
            if (dealer.dealerId) {
                $formDom.find('input[name="DealerId"]').val(dealer.dealerId);
                $formDom.find('input[name="DealerName"]').val(dealer.dealerName);
                if (dealer.dealerTel) {
                    $formDom.find('input[name="DealerTelphone"]').val(dealer.dealerTel);
                }
            }
            $formDom.find('input[name="From"]').val('');
            $formDom.submit();
        },//点击立即申请按钮
        clickApplyNow() {
            let self = this;
            if (self.isShowNoChecked) {
                return false;
            }
            if (self.isApplyNow) {
                self.applyNow($('.check-box.cur'));
                self.isApplyNow = false;

                try {
                    _hmt.push(['_trackEvent', 'm-xinche-list-btn-apply', 'click', '', '']);
                } catch (e) {

                }
                setTimeout(function () {
                    self.isApplyNow = true;
                }, 1000);

            } else {

            }
        },//给顾问拔打电话
        callAdivser() {
            location.href = str;
            return false;
        }
    }
});
$(function () {
    //$('#listCtn .pro-groups').eq(0).find('.check-box').addClass('cur');
    // setTimeout(function() {
    //     $('.check-box').eq(0).click();
    //     // alert('checkboxDefatult')
    // }, 1000);

    // console.log($(window).height())
    // $(document).click(() => {
    //     vm.isShowTips = false;
    // });
    // 点击遮罩层
    $maskLayer.click(() => {
        if (vm.sortType == 'MR') {
            vm.isSort = false;
            vm.isShowSort = false;
            vm.isShowSClass = false;
        } else {
            vm.isSort = true;
            vm.isShowSort = false;
            vm.isShowSClass = true;
        }
        $(this).css('display', 'none');
        $html.css('overflow', 'auto');
        $('body').unbind('touchmove');

        vm.handleQualityData();
        vm.isShowCondition = false;
        vm.isSortArrow = false;
        vm.isShowQuality = false;
        vm.isQualityArrow = false;
        vm.hideDealerOrAdviser("dealerQuotes");
        vm.hideDealerOrAdviser("adviserBox");
    });

    // 我的资质
    $('.qua-items span').click(function () {
        // $(this).addClass('cur').siblings('span').removeClass('cur');
        $(this).toggleClass('cur').siblings('span').removeClass('cur');
    });
    //重置
    $('#reset').click(function () {
        setTimeout(function () {
            vm.Quality.refresh();
        }, 300);
        vm.resetQuality();
    });
    // 确认
    $('#ensure').click(function () {
        let _conut = 0,
            quaArrId = [];

        $('.qua-items').each(function () {
            let _id = $(this).find('span.cur').data('id'),
                _sign = $(this).find('span.cur').data('sign');
            if (_id) {
                _conut += 1;
            }
            quaArrId.push(_id ? _id : 0);
            vm.quaSignArr.push(_sign ? _sign : 0);
        });
        for (let i = 0; i < quaArrId.length; ++i) {
            vm[vm.quaArr[i]] = quaArrId[i];
        }
        vm.showQuaNum = _conut > 0 ? true : false;
        vm.isShowQClass = _conut > 0 ? true : false;
        vm.quaCount = _conut;
        vm.isQualityArrow = false;
        vm.isShowQuality = false;
        vm.isShowSort = false;
        vm.showMasklayer(false);
        // 调取接口
        vm.resetData();
    });

    // 报价
    if ($("#dealerQuotes").length >= 1) {
        var dealeContent = new iScroll("#dealeContent", { 'click': true, "onScrollStart": function () { vm.scrollSign = false }, "onScrollEnd": function () { setTimeout(function () { vm.scrollSign = true }, 1000); } })
        $("#baojia").click(function () {
            vm.showDealerOrAdviser("dealerQuotes", dealeContent);
        });

        $(".close").click(function () {
            vm.hideDealerOrAdviser("dealerQuotes");
        });

        $.each($("#dealeContent a"), function (index, val) {
            var _dataHref = $(this).attr("href");
            $(this).attr({
                "data-href": _dataHref,
                "href": "javascript:void(0);"
            })
        });

        $("#dealerQuotes").on('click', '#dealeContent a', function (event) {
            event.preventDefault();
            vm.hideDealerOrAdviser("dealerQuotes");
            location.href = $(this).attr("data-href");
        });

    }
    //贷款顾问
    var adviserScroll = new iScroll("#adviserScroll", {
        'preventDefault': false,
        'preventDefaultException': { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ }
    });
    $("#list").on("click", ".adviser", function () {
        vm.showDealerOrAdviser("adviserBox", adviserScroll);
        vm.loanAdviser($(this).data("companyid"));
        if (!isApp) {
            setTimeout(function () {
                $('div[name="gotoAdviser"]').on('click', function () {
                    var id = $(this).attr('data');
                    location.href = '/adviser/detail/' + id;
                });
                $('.adv-tel').on('click', function (event) {
                    var h = $(this).attr('href');
                    location.href = h;
                    event.stopPropagation();
                    return false;
                });


            }, 1000);
        }
    });
    $(".adv-close").click(function () {
        vm.hideDealerOrAdviser("adviserBox");
    });
    //贷款顾问电话
    $('.apply-box').on('click', '#advBox', function () {
        var h = $(this).data('href');
        try {
            _hmt.push(['_trackEvent', 'm-xinche-list-btn-conslut', 'click', '', '']);
        } catch (e) {

        }
        location.href = h;
    });
    //立即提交订单
    $('.apply-box').on('click', '.right', function () {

        vm.clickApplyNow();
    });
    // 选择金融产品
    $('#listCtn').on('click', '.check-box', function () {
        var $group = $(this).parents('.pro-groups');

        $(this).toggleClass('cur').parents('.pro-groups').siblings('.pro-groups').find('.check-box').removeClass('cur');
        if ($('#listCtn').find('.check-box.cur').length > 0) {
            if ($group.data('ishas')) {
                if ($group.data('name')) {
                    // 有贷款顾问
                    vm.isShowAdvTel = $group.data('tel');
                    vm.isShowAdvName = $group.data('name');
                    vm.changeApply('isShowAdv');
                    $('.apply-box .left').show();
                    $('.apply-box .right').css('width', "6rem")
                } else {
                    // 无贷款顾问
                    vm.changeApply('');
                    $('.apply-box .left').hide();
                    $('.apply-box .right').css('width', "100%");
                }

            } else {
                vm.changeApply('isShowMonth');
                vm.isShowMonthText = $(this).data('month');
            }
        } else {
            vm.changeApply('isShowNoChecked');
        }
    });

    // 导航tips
    $toolsNav.click(function () {
        $('#navTips').toggleClass('hide');
    });
    $navTips.find('a').click(function () {
        $navTips.addClass('hide');
    });

    $('body').click(function (e) {
        if ($(e.target).attr('id') != 'tools-nav')
            $navTips.addClass('hide');
    });
})