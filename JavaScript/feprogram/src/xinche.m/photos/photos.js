import './photos.scss';
import Vue from 'vue';
import appDown from '../components/appDown.vue';
import 'libs/swiper';
import iScroll from 'iScroll';
tools.appDown(true);

var photoSwiper = {
    init: function (options) {
        var self = this;
        var carId = options.carId;

        self.getData(carId, self.initDom);
    },

    getData: function (carId, callback) {
        var size = 11,
            clientWidth = document.documentElement.clientWidth;
        if (clientWidth > 750 & clientWidth <= 1024) {
            size = 6;
        } else if (clientWidth > 1024) {
            size = 16;
        }
        $.ajax({
            /*url: '/api/product/GetCarImages',*/
            url: dev ? testURL + 'api/product/GetCarImages' : '/api/product/GetCarImages',
            type: 'get',
            data: {
                carId: carId,
                size: size
            },
            success: function (result) {
                if (result.Result) {
                    callback(result.Data);
                }
            }
        })
    },

    initDom: function (data) {
        var photoData = {
            marks: [],
            images: []
        };
        var imageCount = 0; // 图片总数
        var pos = [];   // 各组图片第一张位置

        for (var i = 0; i < data.length; i++) {
            if (data[i].CarImages.length) {
                photoData.marks.push('<div>' + data[i].GroupName + '</div>');
                pos.push(photoData.images.length);
                photoData.images = photoData.images.concat(data[i].CarImages);
            }
        }
        imageCount = photoData.images.length;
        /* console.log(photoData)
         console.log(photoData.images.length)*/

        if (imageCount) {
            var vm = new Vue({
                el: '#photo-container',
                data: photoData,
                methods: {}
            });

            vm.$nextTick(function () {
                var marks = $('.photo-mark .mark');
                var mySwiper = new Swiper('.swiper-container', {
                    loop: false,
                    pagination: '.swiper-pagination',
                    paginationType: 'fraction',
                    lazyLoading: true,
                    onSlideChangeStart: function (swiper) {
                        var index = swiper.activeIndex % imageCount;
                        for (var i = 0; i < pos.length; i++) {
                            if (index < pos[i]) {
                                break;
                            }
                        }
                        marks.removeClass('active').eq(i - 1).addClass('active');
                    }
                });

                marks.eq(0).addClass('active');
                marks.each(function (index) {
                    $(this).bind('click', function () {
                        $(this).addClass('active').siblings().removeClass('active');
                        mySwiper.slideTo(pos[index], 0, false);
                    });
                });
            });
        } else {
            // TODO: 没图片的处理
        }
    }
}

$(function () {
    photoSwiper.init({
        carId: carId
    });
});


var productsUrl = APIURL + "api/FinancialProduct/SearchFinancialProducts",
    $html = $('html'),
    listBox = $('.listCtn'),//列表页内容
    $selTop = $('#sel-top'),//头部筛选
    $maskLayer = $('#maskLayer'),//遮罩层
    $finaHeader = $('.finance-list-box .header-bar'),//页面头部
    loginBox = $('.login-box'),//加载中
    defaultBox = $('.default-box'),//缺省页
    $formDom = $("#orderInfoForm"),
    source = Source, channel = Channel
var vmlist = new Vue({
    el: '#list',
    ready() {
        this.domInit();
    },
    data() {
        return {
            /*// 首付
            downPaymentArr: [
                {'text': 0, 'isDisable': false, 'isDefault': false, 'unit': '%'},
                {'text': 10, 'isDisable': false, 'isDefault': false, 'unit': '%'},
                {'text': 20, 'isDisable': false, 'isDefault': false, 'unit': '%'},
                {'text': 30, 'isDisable': false, 'isDefault': true, 'unit': '%'},
                {'text': 40, 'isDisable': false, 'isDefault': false, 'unit': '%'},
                {'text': 50, 'isDisable': false, 'isDefault': false, 'unit': '%'},
                {'text': 60, 'isDisable': false, 'isDefault': false, 'unit': '%'},
                {'text': 70, 'isDisable': false, 'isDefault': false, 'unit': '%'}
            ],
            // 期限
            termArr: [
                {'text': 12, 'isDisable': false, 'isDefault': false, 'unit': '期'},
                {'text': 18, 'isDisable': false, 'isDefault': false, 'unit': '期'},
                {'text': 24, 'isDisable': false, 'isDefault': false, 'unit': '期'},
                {'text': 36, 'isDisable': false, 'isDefault': true, 'unit': '期'},
                {'text': 48, 'isDisable': false, 'isDefault': false, 'unit': '期'},
                {'text': 60, 'isDisable': false, 'isDefault': false, 'unit': '期'}
            ],*/

            /*------dom相关------*/
            /*defaultOrloginHeight: null,*/
            // 防止刷新接口
            isShowData: true,
            scrollSign: false,
            isShowLogin: true,//是否显示加载中
            isShowDefault: false,//是否显示缺省页
            isShowListCtn: false,//是否显示列表内容

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
            carPrice: car.carPrice, //车款报价
            downPaymentTxt: '--', //首付--车价格
            downPaymentPercent: 0.3, // 首付比例
            repaymentPeriod: 36, // 分期类别
            /*------接口相关------*/
            sortType: 'MR',//排序类型
            // 五大特点
            company: '',//易鑫自营 472
            tiexi: false,//贴息促销  true
            filterName: '',//VIP顾问 VIIPGM
            isYouXuan: false, //优选商户 true
            elasticTail: false, //弹性尾款 true

            // 资质
            /*career: 0,//职业身份
            creditRecord: 0,//信用记录
            insuranceCertificate: 0,//社保证明
            fundStatus: 0,//公积金
            housingStatus: 0,//住房状态*/

            /***产品列表相关**/
            itemTotal: '--',//产品总数
            pageIndex: 1,
            pageIndexNum: 1,
            pageSize: 10,//产品数据页大小
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
        }
    },
    components: {
        // down
    },
    methods: {
        //dom渲染
        domInit() {

            var self = this;

            /*self.defaultOrloginHeight = $(window).height() - $(".sel-top").height();
            defaultBox.css({ 'height': self.defaultOrloginHeight, 'background-color': '#fff' });
            loginBox.css({ 'height': self.defaultOrloginHeight, 'background-color': '#fff' });*/
            //滚动加载下一页
            var moreHeight = $("#listCtn").offset().top - $(window).height();
            var jishu = parseInt($("html").css("font-size").replace("px", ""));
            $(window).scroll(function () {

                var listHeight = $(window).height();
                var scrollHeight = document.body.scrollTop || document.documentElement.scrollTop;
                //console.log(listHeight,scrollHeight)
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
                }
                ;
            });

            /*self.Quality = new iScroll("#quality", { 'click': true });
             self.scrollHeight = $(".select").offset().top/!* + 60/75*jishu*!/;*/
            /*self.getListData();*/
            self.downPaymenthtML();
            //self.loanAdviser();
            //self.calculateLoanData();
        },
        goBack() {
            history.go(-1);
            return false;
        },
        //获取列表数据
        getListData() {
            var self = this;
            self.isShowDefault = false;
            tools.$ajax({
                url: productsUrl + '?carPrice=' + self.carPrice + '&carId=' + car.carId + '&cityId=' + city.cityId + '&downPaymentRate=' + self.downPaymentPercent +
                '&repaymentPeriod=' + self.repaymentPeriod + '&ChannelCode=&sortName=' + self.sortType + '&pageIndex=' + self.pageIndex + '&pageSize=' + self.pageSize + '&isNeedTop=true',
                //                  ?carPrice=10.08&carId=112888&cityId=2401&downPaymentRate=0.3
                // &repaymentPeriod=36&ChannelCode=&sortName=MR&pageIndex=1&pageSize=10&isNeedTop=true
                type: 'Get',
                dataType: 'jsonp',
                success: function (res) {
                    if (!res.Result) {
                        return tools.showAlert(res.Message);
                    }
                    $('#see-finance').find('span').text('').text(res.RowCount)
                    if (res.RowCount > 0) {
                        $('#see-finance-box').removeClass('hide');

                        self.pageCount = Math.ceil(res.RowCount / self.pageSize);
                        var data = res.Data,
                            newData = [];
                        ////console.log('if:',data[0].ApplyCount)
                        for (var i = 0; i < data.length; ++i) {
                            if (data[i].PackageType == 37) {
                                continue;
                            }
                            newData.push(data[i]);
                        }
                        for (var j = 0; j < newData.length; ++j) {
                            var proData = {},
                                pData = newData[j];
                            ////console.log('for:',data[0].ApplyCount)
                            proData.checked = self.pageIndex == 1 && j == 0 ? true : false;
                            proData.CompanyLogoUrl = pData.CompanyLogoUrl;//logo
                            proData.PackageName = pData.PackageName;//金融产品名称
                            proData.CompanyName = pData.CompanyName;//公司名称
                            proData.order = pData.PackageId + '_' + pData.ProductId + '_' + (pData.ProductPromotionId ? pData.ProductPromotionId : 0);//order参数
                            proData.MonthlyPaymentPrefix = '';
                            proData.MonthlyPaymentText = pData.MonthlyPaymentText.replace("元", "").replace("万", "");//月供
                            proData.MonthlyPaymentUnit = pData.MonthlyPaymentText.indexOf("万") > 0 ? "万" : "元";

                            var CommentHtml = '';
                            if (pData.CommentCount == 0) {
                                CommentHtml = '<span>暂无评价</span>'
                            } else {
                                CommentHtml = '<span class="font-title col_rede font_no_blod">' + (pData.CommentScore % 1 != 0 ? pData.CommentScore : pData.CommentScore + '.0') + '</span>分／<span class="evaluation"><span>' + pData.CommentCount + '</span>条评价</span>'
                            }
                            proData.CommentHtml = CommentHtml;

                            proData.ApplyCount = pData.ApplyCount;//申请人数
                            proData.TotalCostPrefix = self.isShowLoanCost ? '贷款成本' : '';
                            proData.TotalCostText = self.isShowLoanCost ? pData.TotalCostText : '';//总成本
                            proData.SubHeading = pData.SubHeading;//副标题

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
                                // ////console.log(pData.PaySimpleInfoList.join(";"))
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
                            proData.detailUrl = "/" + city.citySpell + "/m" + car.carId + "/p" + pData.ProductId + "/?carprice=" + car.carPrice + "&Idx=" + proData.Idx + "&source=" + source;
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
                                proData.detailUrl = "/lease/" + city.citySpell + "/m" + car.carId + "/p" + pData.ProductId + "?carprice=" + car.carPrice + "&source=" + source;
                            }
                            ////console.log('qian--',self.products);
                            self.products.push(proData);
                            //console.log('houm--',self.products);
                        }

                        self.productsView = self.products;
                        //列表页的里的顾问
                        $.each(newData, (index, val) => {
                            (function (index, val) {
                                $.ajax({
                                    url: adviserApi + "v2/group/getadviserlist?CityId=" + city.cityId + "&CompanyIds="+ val.CompanyId,//
                                    type: 'Get',
                                    dataType: 'jsonp',
                                    async: true,
                                    cache: true,
                                    success: (advRes) => {
                                        var eqIndex = index + self.productsView.length - newData.length;
                                        if (advRes.Data != null && advRes.Data[0] != null) {
                                            var ad = advRes.Data[0].Adviser;
                                            $('.pro-groups').eq(eqIndex).find('.title_box').css({'padding-right':'3.41333rem'});
                                            var setStrName = function (str, len) {
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
                                                     var advTel = 'tel:' + ad.CN400,
                                                advName = setStrName(ad.Name,6);
                                            $(".pro-groups").eq(eqIndex).data('ishas', true).data('tel', advTel).data('name', advName).data('advid', '0').prepend('<a class="adviser" data-tel=' + advTel + ' data-name=' + advName + ' data-companyid=' + val.CompanyId + '>' +
                                                '<div class="uf uf-ic adviserDiv">' +
                                                '<div class="name uf uf-ic"><img class="ad-photo" src="' + ad.Photo + '">' +
                                                '<span>' + advName + '</span>' +
                                                '</div>' +
                                                '<div class="ad-tel"></div>' +
                                                '</div>' +
                                                '</a>');
                                              
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
                                                _hmt.push(['_trackEvent', 'm-xinche-list-btn-conslut', 'click', '', '']);
                                            } catch (e) {

                                            }
                                            e.stopPropagation();
                                            return false;
                                        });
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
                            listBox.css({ 'height': self.defaultOrloginHeight, 'background-color': '#f2f2f2' });
                        }

                        self.isShowLogin = false;
                        self.isShowDefault = false;
                        self.isShowEmpty = true;
                        self.isShowBtn = true;
                        self.isShowListCtn = true;

                        if (newData.length == 0) {
                            $(".sliderUp-box").html("");
                            self.isShowBtn = false;
                            self.changeApply('isShowNoChecked')
                            self.isShowListCtn = false;
                            self.isShowLogin = false;
                            self.isShowDefault = true;
                        }

                    } else {
                        $(".sliderUp-box").html("");
                        self.isShowBtn = false;
                        self.changeApply('isShowNoChecked')
                        self.isShowListCtn = false;
                        self.isShowLogin = false;
                        self.isShowDefault = true;
                    }
                    self.scrollEvent = true;


                    /*if (self.scrollEvent && self.pageIndex == 1) {
                        //console.log(self.scrollEvent, self.pageIndex, self.scrollHeight)
                        self.myscrollTop(self.scrollHeight, 400);
                    }*/
                    if (self.scrollEvent && self.pageIndex == 1) {
                        self.myscrollTop(self.scrollHeight, 400);
                    }
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
                            //////console.log(i +"__"+(adviserCount + supplement -2))

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
                    }
                    ;
                }
            })
        },
        //改变条件，重置数据
        resetData() {
            var self = this;
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
            self.changeApply('isShowNoChecked');
            self.getListData();

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
            var self = this;
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
        applyNow(item) {
            var self = this;
            var $group = $(item).parents('.pro-groups'),
                AdviserId = $group.data('advid'),
                Orders = $group.data('order'),
                Idx = $group.data('idx');
            $formDom.attr('action', loanOrderApplyUrl + $group.data('applyurl').replace('/', '').replace(/\/?$/, '/'));

            $formDom.find('input[name="Orders"]').val(Orders);
            $formDom.find('input[name="CarId"]').val(car.carId);
            $formDom.find('input[name="CityId"]').val(city.CityId);
            $formDom.find('input[name="CarPrice"]').val(car.carPrice);
            $formDom.find('input[name="Source"]').val(source ? '10' + source : '10');

            $formDom.find('input[name="Line"]').val(BusinessLine);
            $formDom.find('input[name="AdviserId"]').val('');
            $formDom.find('input[name="Idx"]').val(Idx);

            //经销商
            /*if (dealer.dealerId) {
                $formDom.find('input[name="DealerId"]').val(dealer.dealerId);
                $formDom.find('input[name="DealerName"]').val(dealer.dealerName);
                if (dealer.dealerTel) {
                    $formDom.find('input[name="DealerTelphone"]').val(dealer.dealerTel);
                }
            }*/
            $formDom.find('input[name="From"]').val('');
            $formDom.submit();
        },
        //点击立即申请按钮
        clickApplyNow() {
            var self = this;
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
        },
        //给顾问拔打电话
        callAdivser() {
              location.href = str;
            return false;
        },
        //0首付 (0元)
        downPaymenthtML() {
            var _this = this, _CommentHtml = '', _carPrice = car.carPrice
            for (var i = 0; i < 8; i++) {
                if (i == 0) {
                    _CommentHtml += '<div class="sort-tap" data-payment="0">0首付 (0元)</div>'
                } else if (i == 3) {
                    _CommentHtml += '<div class="sort-tap cur" data-payment="0.' + i + '">' + i * 10 + '% (' + _this.price(Number(_carPrice * i * 0.1)) + ')</div>'
                } else {
                    _CommentHtml += '<div class="sort-tap" data-payment="0.' + i + '">' + i * 10 + '% (' + _this.price(Number(_carPrice * i * 0.1)) + ')</div>'
                }
            }
            _this.downPaymentTxt = _CommentHtml;

        },
        //价格换算
        price(priceNum) {
            var newNum = '';
            if (priceNum > 1) {
                return newNum = (priceNum).toFixed(2) + '万'
            } else {
                return newNum = (priceNum * 10000).toFixed(0) + '元'
            }
        },
    }
});

window.onload = function () {
    /*vmlist.isShowBtn = false;*/
    /*setTimeout(function() {
        $('.check-box').eq(0).click();
        // alert('checkboxDefatult')
    }, 1000);*/
    var _phobox = $('.photos-box')
    //顾问宽度问题
    function adviwidth() {
        // setTimeout(function () {
        //     $(".listCtn .pro-groups").each(function (index, con) {
        //         var _this = $(this)
        //         console.log('bb', _this.find('.item_right_box').width(), _this.find(".adviser").width())
        //         if (_this.find(".adviser").length > 0) {
        //             _this.find('.title_box').css('width', _this.find('.item_right_box').width() - _this.find(".adviser").width() - 2 + 'px')
        //             //console.log('aa',_this.find('.title_box').attr('style'))
        //         } else {
        //             _this.find('.title_box').css({ 'width': '100%' })
        //             //console.log('bb',_this.find('.title_box').attr('style'))
        //         }
        //     })
        // }, 1000)
    }
    $('.see-finance-box').on('click', function () {
        /*console.log(self.isShowDefault=true,self.isShowDefault=false)*/
        /*vmlist.isShowDefault=true*/
        _phobox.addClass('hide');
        $('#list').css('height', 'auto')
        $('.apply-box').css({ 'z-index': '4' })
        $('.apply-box').css({ 'opacity': '1' })
        $('body').css({ 'background': '#f2f2f2' })
        adviwidth()
    })
    /*****************************************************************************************************************/
    vmlist.resetData();

    //贷款顾问
    var adviserScroll = new iScroll("#adviserScroll", {
        'preventDefault': false,
        'preventDefaultException': { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ }
    });
    $("#list").on("click", ".adviser", function () {
        vmlist.showDealerOrAdviser("adviserBox", adviserScroll);
        vmlist.loanAdviser($(this).data("companyid"));
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
        vmlist.hideDealerOrAdviser("adviserBox");
    });
    //贷款顾问电话
    $('.apply-box').on('click', '#advBox', function () {
 
        var h = $(this).data('href');
        try {
            _hmt.push(['_trackEvent', 'm-xinche-list-btn-conslut', 'click', '', '']);
        } catch (e) {

        }
        location.href=h;
    });
    //立即提交订单
    $('.apply-box').on('click', '.right', function () {
        vmlist.clickApplyNow();
    });
    // 选择金融产品
    $('#listCtn').on('click', '.check-box', function () {

        var $group = $(this).parents('.pro-groups');
        $(this).toggleClass('cur').parents('.pro-groups').siblings('.pro-groups').find('.check-box').removeClass('cur');
        if ($('#listCtn').find('.check-box.cur').length > 0) {
            if ($group.data('ishas')) {
                if ($group.data('name')) {
                    // 有贷款顾问
                    vmlist.isShowAdvTel = $group.data('tel');
                    vmlist.isShowAdvName = $group.data('name');
                    $('.apply-box .left').show();
                    $('.apply-box .right').css('width', "6rem")
                    vmlist.changeApply('isShowAdv');
                } else {
                    // 无贷款顾问
                    $('.apply-box .left').hide();
                    $('.apply-box .right').css('width', "100%");
                    vmlist.changeApply('');
                }

            } else {
                vmlist.isShowMonthText = $(this).data('month');
                vmlist.changeApply('isShowMonth');
            }
        } else {
            vmlist.changeApply('isShowNoChecked');
        }
    });
    //

    $('#sel-top .tap').on('click', function () {
        var $Hei = $finaHeader.height(), _this = $(this);
        if (_this.hasClass('cur')) {
            $('.header-bar').removeClass('cur')
            $('.sel-box').removeClass('cur').attr('style', '')
            $('.header-bar').removeClass('cur')

            $('#installment').removeClass('cur')
            $('#payment').removeClass('cur')
            $('#sel-top .tap').removeClass('cur')
            _this.find('.list-icon').removeClass('cur');
            vmlist.showMasklayer(false);

        } else {
            $finaHeader.addClass('cur');
            $('.sel-box').addClass('cur');
            $('.sel-box').css('top', $Hei + 'px');
            $('#sel-top .tap').removeClass('cur');
            $('#sel-top .tap .list-icon').removeClass('cur');
            _this.addClass('cur');
            _this.find('.list-icon').addClass('cur');
            //console.log(_this.index())
            if (_this.index() == 0) {
                $('#payment').addClass('cur')
                $('#installment').removeClass('cur')
            } else if (_this.index() == 1) {
                $('#installment').addClass('cur')
                $('#payment').removeClass('cur')
            }
            vmlist.showMasklayer(true)
        }
    })
    $('#sel-top .sort-tap,#maskLayer,.close').on('click', function () {
        //console.log('qian',vmlist.downPaymentPercent,vmlist.repaymentPeriod)
        var _this = $(this)
        //console.log(_this.parents('#payment').length,_this.parents('#installment').length,_this.attr('id')=='maskLayer')
        if (_this.parents('#payment').length >= 1) {
            $('#payment .sort-tap').removeClass('cur');
            _this.addClass('cur');
            if (_this.attr('data-payment') == 0) {
                $('.sel-top .tap').eq(0).find('font').text('').text((Number((_this.attr('data-payment') * 10))).toFixed(0) + '%')
            } else {
                $('.sel-top .tap').eq(0).find('font').text('').text((Number((_this.attr('data-payment') * 10))).toFixed(0) + '0%')
            }

            vmlist.downPaymentPercent = _this.attr('data-payment')
            vmlist.resetData();
            adviwidth();
        } else if (_this.parents('#installment').length >= 1) {
            $('#installment .sort-tap').removeClass('cur');
            _this.addClass('cur');
            $('.sel-top .tap').eq(1).find('font').text('').text(_this.attr('data-installment') + '期')
            vmlist.repaymentPeriod = _this.attr('data-installment')
            vmlist.resetData();
            adviwidth();
        } else if (_this.attr('id') == 'maskLayer') {
        } else if (_this.attr('class') == 'close') {
            $('#list').css('height', '0')
            _phobox.removeClass('hide')
            $('body').css({ 'background': '#000' })
            $('.apply-box').attr('style', '')

        }

        $('#payment').removeClass('cur');
        $('#installment').removeClass('cur');
        $finaHeader.removeClass('cur');
        $('.sel-box').removeClass('cur');
        $('#sel-top .tap').removeClass('cur');
        $('#sel-top .list-icon').removeClass('cur');
        $('.sel-box').css('top', '');
        vmlist.showMasklayer(false);
        /*setTimeout(function() {
            $('.check-box').eq(0).click();
        }, 1000);*/
    })


}
