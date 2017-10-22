import './list.scss';
import 'libs/citySelect/index.scss';
import 'libs/swiper';
import ko from 'knockout';
import carThirdLevel from 'libs/carSelect/carThirdLevel.js';
import iScroll from 'iScroll';

    var ListViewModel = {//observableArray
        CityID: ko.observable(),//上牌城市
        CreditRequirement: ko.observable(),//信用
        HasMortgage: ko.observable(),//住房
        IsQualificationLimit: ko.observable(),//是否受限
        LoanPeriod: ko.observable(),//贷款期限
        MaxMileage: ko.observable(),//行驶里程
        OrderBy: ko.observable(),//排序
        PageIndex: ko.observable(),//当前页码
        ProvidentFund: ko.observable(),//公积金
        SocialSecurity: ko.observable(),//社保
        VocationalRequirement: ko.observable(),//职业要求
        CarId: ko.observable(),//车id
        LicenseYear: ko.observable(),//上牌年
        LicenseMonth: ko.observable(),//上牌月
        LocationCityId: ko.observable(),//定位城市id
        CarId: ko.observable(),//车辆id
        PageSource: ko.observable(),//来源

        // 产品信息
        ProductList: ko.observableArray(),//产品信息
        CarImg: ko.observable(),//车款图片
        EstimatePrice: ko.observable(),//预估车价
        LoanAmount: ko.observable(),//贷款额度
        TradeVolume: ko.observable(),//月成交量
        AvgTradeMoney: ko.observable()//平均成交额

    }
    // var applySign = true,//判断提交前是否点击过资质或者车辆信息进行选择
    var firstSign = true,
        limited = false,//是否可以申请
        scrollSign = true,//是否可滚动加载数据
        qualityEnsure = false;//是否点击了资质确认按钮

    var LoginBox = $(".login-box"),//加载中
        defaultBox = $(".default-box"),//缺省页
        ListPBox = $(".com-ctn");  //列表内容
    var pageCount = 0,//总页码数
        pageSize =10,
        pageIndex = 1;

    var ListPage ={
        init: function(){
            ko.applyBindings(ListViewModel);
            this.initViewModel();
            this.domInit();
            this.listContent();
        },
        initViewModel: function(){
            ListViewModel.CityID(pingGuParas.LicenseCityID);
            ListViewModel.CreditRequirement(-1);
            ListViewModel.HasMortgage(-1);
            ListViewModel.IsQualificationLimit(false);
            ListViewModel.LoanPeriod(pingGuParas.LoanPeriod);
            ListViewModel.MaxMileage(pingGuParas.Mileage);
            ListViewModel.OrderBy(-1);
            ListViewModel.PageIndex(1);
            ListViewModel.ProvidentFund(-1);
            ListViewModel.SocialSecurity(-1);
            ListViewModel.VocationalRequirement(-1);
            ListViewModel.LicenseYear(pingGuParas.LicenseYear);
            ListViewModel.LicenseMonth(pingGuParas.LicenseMonth);
            ListViewModel.LocationCityId(city.CityId);
            ListViewModel.CarId(pingGuParas.CarId);
            ListViewModel.PageSource(pingGuParas.Source);

            ListViewModel.ProductList([]);
            ListViewModel.CarImg(carImg);
            ListViewModel.EstimatePrice('');
            ListViewModel.LoanAmount('');
            ListViewModel.TradeVolume('');
            ListViewModel.AvgTradeMoney('');
        },
        domInit: function(){
            var self = this;
            // 选车
            $(".selectCar").click(function(e){
                e.preventDefault();
                carThirdLevel.carThirdLevel({
                    onlyOnSale: false,
                    showLevel: 3,
                    CityId:city.CityId
                }, {
                    brand: {
                        id: car.serialId,
                        logo: car.masterBrandLogo,
                        name: car.masterBrandName,
                        price: car.carPrice,
                        spell: car.serialSpell
                    }
                }, function (result) {
                    ListViewModel.CarId(result.carType.id);
                    $('#selectCar').text(result.brand.name + ' ' + result.year + '款' + result.carType.name);
                    setTimeout(function () {
                        history.back();
                    }, 100);
                    if (result.year > pingGuParas.LicenseYear) {
                        pingGuParas.LicenseYear = result.year;
                        $('#carRel').data('year', result.year).text(licenseCityName + ' ' + pingGuParas.LicenseYear + '-' + pingGuParas.LicenseMonth + ' ' + pingGuParas.Mileage + '万公里');
                        ListViewModel.LicenseYear(result.year);
                    }
                    self.resetData();
                });
            });

            //car infomation
            $('#carInfo').on('click', function (e) {
                e.preventDefault();
                location.href = '/' + pingGuParas.CarId + '/' + pingGuParas.LicenseYear + '/' + pingGuParas.LicenseMonth + '/' + pingGuParas.Mileage + '/' + pingGuParas.LicenseCityID + '/' + pingGuParas.Source;
            });

            //期限
            var swiper1 = new Swiper('#mouthPay', {
                slidesPerView: 4.7,
                slidesPerGroup : 1,
                initialSlide :self.getIndex("mouthPay"),
                freeMode: true,
                observer:true,
                spaceBetween: 0.32 * parseInt($("html").css("font-size").replace("px", ""))
            });
            $("#mouthPay").delegate(".label","click",function(){
                ListViewModel.LoanPeriod($(this).data("id"));
                $(".label").removeClass("cur");
                $(this).addClass("cur");
                self.resetData();
            });

            //资质信息操作开始
            // 资质入口
            var QualityS = new iScroll("#quilty",{'click':true});
            $("#myQuilty").click(function(){
                // applySign=false;
                $("html").css({'overflow-y':'hidden'});
                //关闭资质信息弹层后回填数据
                if(qualityEnsure){
                    var IdArr = ['vocational', 'credit', 'mortgage', 'security', 'fund', 'income'];
                    for(var n=0; n< IdArr.length; ++n){
                        $("#"+ IdArr[n] +" .btn_radio[data-id='"+ $("#quilty-ctn").data(IdArr[n]) +"']").addClass("select");
                    }
                }

                setTimeout(function(){
                    $("#quilty").css({'height':$(window).height()-$(".btn_black").height()});
                    QualityS.refresh();
                }, 300)
                $(".quali").removeClass("hide");
            });


            //选择资质信息
            $(".btn_radio").click(function(){
                if(firstSign){
                    firstSign = false;
                    $(".btn_black").addClass("bg-yellow");
                }
                $(this).addClass("select").siblings(".btn_radio").removeClass("select");
            });

            //确定资质信息
            $(".btn_black").click(function(){
                $("html").css({'overflow-y':'auto'});
                var textArr = [];
                if(firstSign){
                    tools.showAlert("请选择资质信息！");
                    return;
                }
                // applySign=true;
                qualityEnsure = true;
                $(".quali").addClass("hide");
                $(".btn_radio.select").each(function(){
                    textArr.push($(this).text());
                    var qualityName = $(this).parents(".quali_bd").attr("id"),
                        qualityId = $(this).data("id");
                    switch(qualityName) {
                        case 'vocational':
                            ListViewModel.VocationalRequirement(qualityId);
                            $("#quilty-ctn").data('vocational', qualityId);
                            break;
                        case 'credit':
                            ListViewModel.CreditRequirement(qualityId);
                            $("#quilty-ctn").data('credit', qualityId);
                            break;
                        case 'mortgage':
                            ListViewModel.HasMortgage(qualityId);
                            $("#quilty-ctn").data('mortgage', qualityId);
                            break;
                        case 'security':
                            ListViewModel.SocialSecurity(qualityId);
                            $("#quilty-ctn").data('security', qualityId);
                            break;
                        case 'fund':
                            ListViewModel.ProvidentFund(qualityId);
                            $("#quilty-ctn").data('fund', qualityId);
                            break;
                        case 'income':
                            $("#quilty-ctn").data('income', qualityId);
                            break;
                    }
                });

                $("#quilty-ctn").html(textArr.join(" ")).removeClass("f-gray").addClass("f-gray6");
                self.resetData();
            });
            //关闭资质信息弹层
            $("#close").click(function(){
                $("html").css({'overflow-y':'auto'});
                $(".quali").addClass("hide");
                $(".btn_radio").removeClass("select");
                if(!qualityEnsure){
                    firstSign = true;
                    $(".btn_black").removeClass("bg-yellow");
                }
            });

            //排序
            $(".sort").click(function(){
                // 页面定位 edit by ChenJH
                console.log($("#list").offset().top);
                self.myscrollTop(30,300);

                ListViewModel.OrderBy($(this).data("id"));

                $(this).addClass("cur").siblings(".sort").removeClass("cur");
                self.resetData();

            });

            //选择金融产品
            $(".com-ctn").delegate('.check-box', 'click', function(){
                limited = true;
                // alert('cur1');
                $(".check").removeClass("cur").css({'background': 'url("' +RESURL+ 'css/chezhudai/images/check01.png") no-repeat', 'background-size': '100%', '-webkit-background-size': '100%'});
                $(this).find(".check").addClass('cur').css({'background': 'url("' +RESURL+ 'css/chezhudai/images/check02.png") no-repeat', 'background-size': '100%', '-webkit-background-size': '100%'});
                console.log($(this).find(".check").parent('.uf-ic').html());
                // alert('cur2');
                $(".apply-txt").text('您已选择1款金融产品');
                $("#apply-btn").addClass("bg-yellow f-white");
            });

            //立即申请
            $("#apply-btn").click(function(){
                // if (!applySign) {
                //     tools.showAlert("请选择资质信息！");
                //     return;
                // };
                if (!limited) {
                    tools.showAlert("请选择金融产品！");
                    return;
                };
                var $dom = $(".check.cur").parents(".com-box");
                var $qualityDom = $("#quilty-ctn");
                var from = "";
                if (tools.getCookie('from')) {
                    from = tools.getCookie('from')
                }else if(tools.getUrlParam('from')){
                    from = tools.getUrlParam('from')
                }
                //参数存cookie  begin
                var data = new Object();
                data['Source'] = parseInt(pingGuParas.Source);
                data['Extensions[0]'] = {
                    'RecommendProductID': $dom.attr("data-rpId"),
                    'ProductId': $dom.attr("data-pid"),
                    'LoanPeriod': $dom.attr("data-Period"),
                    'LoanRate': $dom.attr("data-lRate"),
                    'DiscountRate': $dom.attr("data-dRate"),
                    'MonthPay': $dom.attr("data-mPay"),
                    'TotalMoney': $dom.attr("data-tmaney"),
                    'CompanyID': $dom.attr("data-comId")
                    //'LoanTypeID':0
                };
                data['From'] = from;//外部渠道
                data['CarID'] = ListViewModel.CarId();
                data['LicenseCityID'] = parseInt(pingGuParas.LicenseCityID);
                data['LicenseYear'] = parseInt(pingGuParas.LicenseYear);
                data['LicenseMonth'] = parseInt(pingGuParas.LicenseMonth);
                data['TenThousandKilometres'] = parseFloat(pingGuParas.Mileage);

                var q = {
                    Career: ($qualityDom.attr("data-vocational")) ? parseInt($qualityDom.attr("data-vocational")) : -1,//职业
                    Income: ($qualityDom.attr("data-income")) ? parseInt($qualityDom.attr("data-income")) : -1,
                    Insurance: ($qualityDom.attr("data-security")) ? parseInt($qualityDom.attr("data-security")) : -1,//社保证明
                    Funds: ($qualityDom.attr("data-fund")) ? parseInt($qualityDom.attr("data-fund")) : -1,//公积金
                    Credit: ($qualityDom.attr("data-credit")) ? parseInt($qualityDom.attr("data-credit")) : -1,//信用记录
                    HouseState: ($qualityDom.attr("data-mortgage")) ? parseInt($qualityDom.attr("data-mortgage")) : -1//住房状态
                }
                var json_data = JSON.stringify(data);
                var json_quadata = JSON.stringify(q);
                tools.setCookie("OrderData", json_data + '|' + json_quadata);
                //参数存cookie  end
                window.location.href="/Mortgage/Register";
            });

            var moreHeight = $("#list").offset().top-$(window).height()+$("#list header").height();
            var listHeight = moreHeight + ListViewModel.PageIndex()*185*pageSize/75*parseInt($("html").css("font-size").replace("px",""));

            $(window).scroll(function(){
                var scrollHeight=document.body.scrollTop || document.documentElement.scrollTop;
                if (scrollSign) {
                    if(scrollHeight >= listHeight){
                        scrollSign = false;

                        if(pageIndex < pageCount)
                            $(".com-ctn").append('<div class="sliderUp-box"><i class="sliderUp"></i>向上滑动刷新</div>');

                        ++pageIndex;
                        ListViewModel.PageIndex(pageIndex);
                        self.listContent();
                    }
                };
            })
        },
        getIndex: function(idName){
            var activeIndex = 0;
            $.each($("#"+ idName +" .swiper-slide"), function(i, item){
                if ($(item).find(".label").data("id") == pingGuParas.LoanPeriod) {
                    activeIndex = i;
                    return false;
                };
            });
            return activeIndex;
        },//调取接口
        listContent: function(){
            var self = this;
            var data = {
                CityID:ListViewModel.CityID(),
                CreditRequirement:ListViewModel.CreditRequirement(),
                HasMortgage:ListViewModel.HasMortgage(),
                IsQualificationLimit:ListViewModel.IsQualificationLimit(),
                LoanPeriod:ListViewModel.LoanPeriod(),
                MaxMileage:ListViewModel.MaxMileage(),
                OrderBy:ListViewModel.OrderBy(),
                PageIndex:ListViewModel.PageIndex(),
                ProvidentFund:ListViewModel.ProvidentFund(),
                SocialSecurity:ListViewModel.SocialSecurity(),
                VocationalRequirement:ListViewModel.VocationalRequirement(),
                LicenseYear:ListViewModel.LicenseYear(),
                LicenseMonth:ListViewModel.LicenseMonth(),

                LocationCityId:ListViewModel.LocationCityId(),
                CarId:ListViewModel.CarId(),
                PageSource:ListViewModel.PageSource(),
                PageSize: pageSize
            }
            tools.$ajax({
                url:'/mortgage/GetProductList',
                data: data,
                beforeSend: function(){
                    defaultBox.addClass("hide");
                    if(ListViewModel.PageIndex() == 1){
                        LoginBox.removeClass("hide");
                    }
                },
                success: function(res){
                    if(ListViewModel.PageIndex() == 1){
                        ListPBox.html("");
                    }
                    if (!res.Result) {
                        tools.showAlert(res.Message);
                        return;
                    };
                    $(".sliderUp-box").html("").addClass("hide");
                    LoginBox.addClass("hide");
                    ListViewModel.CarImg(res.Data.CarImg);
                    ListViewModel.EstimatePrice(res.Data.EstimatePrice.toFixed(2)+"万");
                    ListViewModel.LoanAmount(res.Data.LoanAmount.toFixed(2)+"万");
                    ListViewModel.TradeVolume(res.Data.TradeVolume);
                    ListViewModel.AvgTradeMoney(res.Data.AvgTradeMoney.toFixed(2)+"万");
                    if(res.RowCount > 0){
                        pageCount = Math.ceil(res.RowCount/pageSize);
                        $(".h-btn, .btn-fixed").removeClass("hide");
                        var data = res.Data.productList;
                        var product = new Object();
                        for(var i = 0; i < data.length; ++i){
                            var Pdata = data[i];

                            product.Id = Pdata.ID;//金融产品编号
                            product.recommendProductId = Pdata.RecommendProductID;//推荐产品id
                            product.loanPeriod = Pdata.LoanPeriod;//贷款期限
                            product.loanRate = Pdata.LoanRate;//贷款利率
                            product.discountRate = Pdata.Discount;//折扣
                            product.totalMoney = Pdata.TotalMoney;//总成本
                            product.companyID = Pdata.CompanyID; //金融公司id

                            product.CompanyName = Pdata.CompanyName;//金融公司名称
                            product.Logo = CDNFileURL +Pdata.Logo;//公司Logo
                            product.ProductName = Pdata.ProductName;//金融产品名称

                            //促销
                            product.promotionHtml = (Pdata.Discount != 0?'<span class="label font-22">折扣</span>':'') + (Pdata.IsPromotion?'<span class="label font-22">'+Pdata.PromotionTitle+'</span>':'');

                            product.MonthPayment = Pdata.MonthPayment;//月供原始值
                            product.MonthPaymentTxt = Pdata.MonthPayment < 10000? Math.round(Pdata.MonthPayment)+'元':(Pdata.MonthPayment/10000.00).toFixed(2) + "万";//月供

                            product.MonthRate = Pdata.MonthRate;//利率原始值
                            product.MonthRateTxt = Pdata.MonthRate?Pdata.MonthRate.toFixed(2) +"%":'0%';//利率

                            product.TotalMoneyTxt = Pdata.TotalMoney?(Pdata.TotalMoney/10000.00).toFixed(2)+"万":'0元';//总费用
                            product.detailUrl = '/' + city.CitySpell + '/p' + Pdata.ID + '/c' + ListViewModel.CarId() + '/lp' + ListViewModel.LoanPeriod() + '/' + res.Data.LoanAmount + '/' + pingGuParas.Source + '/' + pingGuParas.LicenseCityID + '/'+ pingGuParas.LicenseMonth+'/'+pingGuParas.LicenseYear+'/'+pingGuParas.Mileage+'/0';

                            ListViewModel.ProductList.push(product);
                        }

                        if(ListViewModel.PageIndex() < pageCount){
                            scrollSign = true;
                        }
                        ListPBox.removeClass("hide");
                    }else{
                        defaultBox.removeClass("hide");
                        $(".h-btn, .btn-fixed").addClass("hide");
                    }
                }
            });

        },
        myscrollTop: function(scrollTo, time) {
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
        },//改变条件，重置数据
        resetData: function(){
            var self = this;
            limited = false;
            ListViewModel.PageIndex(1);
            pageIndex =1;

            ListPBox.addClass("hide");
            $("#apply-btn").removeClass("bg-yellow f-white");
            $(".apply-txt").html("请选择金融产品");
            //刷新列表
            self.listContent();
        }
    }
    ListPage.init()

