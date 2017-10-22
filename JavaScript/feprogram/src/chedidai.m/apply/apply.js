import '../list/list.scss';
import 'zepto/src/touch';
import check from 'libs/check/m';
import ko from 'knockout';
import car from 'libs/carSelect';
import city from 'libs/citySelect';
import selectControl from 'libs/selectControl';
import DatePicker from 'libs/datePicker';

    var strName = {
        tenThousandKilometres:'行驶里程',
        age:'年龄'
    }
    var isApp = tools.getCookie("YiXinAppInfo");
    var twoOrderId = null,
        addOrderId = null;
    var qulitySign = false;//资质标记
    var limited = false;//是否可以申请
    var addUrlSign = false;//是否再次申请
    var data = {}, quData ={};
    var ApplyViewModel = {
        // 产品信息
        ProductList: ko.observableArray(),//产品信息
        ProductCount: ko.observableArray()//所选产品
    }
    var LoginBox = $(".login-box"),//加载中
        ListPBox = $(".com-ctn"),  //列表内容 
        pageSize = 10;
    var resultId = null;
    var carYear = null;
    var selectLicenseYear = null;
    var isGoBack =true;
    var applyPage = {
        init: function(){
            var self = this;
            ko.applyBindings(ApplyViewModel);
            self.initBackOfDetail();
            self.step2();
            self.step3();

            $("#backToMain").tap(function () {
                if(isApp){
                    tools.jsNativeBridge("backCZDHome","goHome");
                }else{
                    location.href = '/' + cityInfo.citySpell;
                }

            })

        },
        // applyBoxTwo
        step2: function(){
            var self = this;

            // 初始化页面数据
            for(var key in vo){
                if (vo[key]) {
                    switch (key){
                        case 'CarID':
                            $("#selectCar").data("id", vo[key]).removeClass("unsubmit").find("em").text(vo['CarFullName']).addClass("f-gray6");
                            break;
                        case 'LicenseCityName':
                            $("#selectCity").data("id", vo['LicenseCityID']).removeClass("unsubmit").find("em").text(vo[key]).addClass("f-gray6");
                            break;
                        case 'LicenseYear':
                            $("#selectDate").removeClass("unsubmit").data("year", vo[key]).data("month", (parseInt(vo['LicenseMonth']) < 10?'0'+vo['LicenseMonth']:vo['LicenseMonth'])).find("em").text(vo[key]+"年"+(parseInt(vo['LicenseMonth']) < 10?'0'+vo['LicenseMonth']:vo['LicenseMonth'])+"月").addClass("f-gray6");
                            break;
                        case 'LoanPeriod':
                            $("#selectPeriod").data("id", vo[key]).removeClass("unsubmit").find("em").text(vo[key]+"个月").addClass("f-gray6");
                            break;
                        case 'TenThousandKilometres':
                            $("#tenThousandKilometres").removeClass("unsubmit").find("input").val(vo[key]);
                            break;
                        case 'CarPublishingYear':
                            carYear = vo[key];
                            break;
                        case 'HasMortgage':
                            if (vo[key])
                                $("#HasMortgage").removeClass("unsubmit").find(".radio[data-value='ture']").addClass("on");
                            break;
                    }
                };


            }
            for(var key in defaultQualification){
                $(".form_quali ."+ key +" .btn_radio[data-id='"+defaultQualification[key]+"']").addClass("select");
            }
            self.checkForm();

            var curDate =  new Date();
            var curYear = curDate.getFullYear();
            // 上牌时间            
            var datePicker = new DatePicker({
                CallBacks: function (obj) {
                    $("#selectDate").removeClass("unsubmit").attr({ 'data-year': obj.year, 'data-month': obj.month });
                    $('#selectDate em').text(obj.year + '年' + obj.month + '月').addClass("f-gray6").removeClass("f-red");
                    if ($(".gearDate").length > 1) {
                        $(".gearDate")[0].remove();
                    };
                    selectLicenseYear = obj.year;
                    self.showBtn();
                }
            });

            datePicker.init({
                trigger: '#selectDate',
                type: 'ym',
                minDate: (carYear?carYear:1900)+'-1-1',
                maxDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
            });

            //选车型
            $('#selectCar').on('click', function (e) {
                var self = this;

                e.preventDefault();
                car.carSelect({
                    onlyOnSale: false,
                    showLevel: 3,
                    showAllBrand: false,
                    hide: true,
                    showAllBrand: true,
                    showSearch: false,
                    type: "chezhudai"
                }, function (result) {
                    var carDisplayName = result.masterBrand.name + " - " + result.brand.name + " - " + result.year+"款 - " + result.carType.name;;
                    if(result.masterBrand.name!=null)
                    {
                        if(result.brand.name.indexOf(result.masterBrand.name)>=0){
                            carDisplayName = result.brand.name + " - " + result.year+"款 - " + result.carType.name;
                        }
                    }

                    // console.log(result.year)
                    carYear =( parseInt(curYear) < parseInt(result.year))?curYear:result.year;
                    datePicker.init({
                        trigger: '#selectDate',
                        type: 'ym',
                        minDate: carYear+'-1-1',
                        maxDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
                    });

                    $(self).removeClass("unsubmit").data("id", result.carType.id).find('span em').text(carDisplayName).removeClass("f-red").addClass("f-gray6");
                    if ($(".unsubmit").length <= 0) {
                        $("#btnStepTwo").addClass("btn-yellow");
                    };
                });
            });
            //选城市
            $('#selectCity').on('click', function (e) {
                var self = this;

                e.preventDefault();
                city.citySelect({
                    isSaveCookie:false
                }, function (res) {
                    $(self).removeClass("unsubmit").data("id", res.CityId).find('span').text(res.CityName).find("em").removeClass("f-red");
                    if ($(".unsubmit").length <= 0) {
                        $("#btnStepTwo").addClass("btn-yellow");
                    };
                    // data.BuyCarCityID = result.CityId;
                    // data.CityId = result.CityId;
                });
            });

            //贷款期限
            $("#selectPeriod").selectControl({
                CallBacks:function(obj){
                    $("#selectPeriod").removeClass("unsubmit").data("id", obj.id).find("em").text(obj.txt).addClass("f-gray6").removeClass("f-red");
                    self.showBtn();
                }
            });

            $('#btnStepTwo').tap(function(){
                // 验证表单
                self.checkForm();
                self.sunbmitForm();
            });
        },

        // applyBoxThree
        step3: function(){
            var self = this;
            $('.btn_radio').tap(function(){
                $(this).addClass('select').siblings('.btn_radio').removeClass('select');
                self.showCheckBtn();
            });

            $("#Gender .radio").click(function(){
                self.radioFunc("Gender", $(this));
            });

            $('#btnStepThree').tap(function(){
                // 验证表单
                if(!qulitySign){
                    return tools.showAlert("资质信息不全！");
                }
                isGoBack = false;
                quData = {
                    OrderID: twoOrderId,
                    Career: Number($(".Career .btn_radio.select").data("id")),
                    Income: Number($(".Income .btn_radio.select").data("id")),
                    Credit: Number($(".Credit .btn_radio.select").data("id")),
                    HouseState: Number($(".HouseState .btn_radio.select").data("id")),
                    Insurance: Number($(".Insurance .btn_radio.select").data("id")),
                    Funds: Number($(".Funds .btn_radio.select").data("id"))
                }
                var productsId = parseInt(tools.getUrlParam("productsId"));
                tools.$ajax({
                    url: url_updateInfoInStep3,
                    data: {q:quData, 'productIds':[productsId]},
                    success: function (res) {
                        var json_res = JSON.stringify(res);
                        tools.setCookie("resData", json_res);
                        self.applyResult(res);
                    }
                })
            });

            $("#goBack").tap(function () {
                if(isGoBack){
                    $('.header-bar .font-nav').text('基本信息');
                    $("#applyBoxThree").addClass("hide");
                    $("#applyBoxTwo").removeClass("hide");
                }

            });

            //选择金融产品
            $(".com-ctn").delegate('.check', 'tap', function(){
                limited = true;

                $(".check").removeClass("cur");
                $(this).addClass('cur');
                $(".apply-txt").text('您已选择1款金融产品');
                $("#apply-btn").addClass("bg-yellow f-white");
            });

            //立即申请
            $("#apply-btn").tap(function(){
                if (!limited) {
                    tools.showAlert("请选择金融产品！");
                    return;
                };
                addUrlSign = true;
                var $dom = $(".check.cur").parents(".com-box");
                // var $qualityDom = $("#quilty-ctn");
                var from = "";
                if (tools.getCookie('from')) {
                    from = tools.getCookie('from')
                }else if(tools.getUrlParam('from')){
                    from = tools.getUrlParam('from')
                }

                var ldata = new Object();
                ldata['Source'] = 725;
                ldata['Extensions[0]'] = {
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
                ldata['From'] = from;//外部渠道
                ldata['CarID'] = data.CarID;
                ldata['LicenseCityID'] = parseInt(data.LicenseCityID);
                ldata['LicenseYear'] = parseInt(data.LicenseYear);
                ldata['LicenseMonth'] = parseInt(data.LicenseMonth);
                ldata['TenThousandKilometres'] = parseFloat(data.TenThousandKilometres);
                ldata["OrderID"] = addOrderId;
                tools.$ajax({
                    url: '/Mortgage/ApplyAgain',
                    data: {'order': ldata},
                    success: function (res) {
                        var json_res = JSON.stringify(res);
                        tools.setCookie("resData", json_res);
                        self.applyResult(res);
                    }
                })
            });
        },

        //验证表单数据
        checkForm: function () {
            var self = this;
            $(".checkApp").on('keyup',function(){
                var inputName = $(this).attr('name');
                switch (inputName){
                    case 'tenThousandKilometres':
                        var mReg = new RegExp(/^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/);
                        self.checkInput(inputName, mReg);
                        break;
                    case 'age':
                        var ageReg = new RegExp(/^[2][2-9]|[3-5]\d|[6][0-5]$/);
                        self.checkInput(inputName, ageReg)
                        break;
                }
                self.showBtn();
            });

            // $("#HasMortgage input").click(function(){
            //     if($(this).prop("checked")){
            //         $("#HasMortgage").removeClass("unsubmit").next("li").hide();
            //         self.showBtn();
            //     }
            // });
            $("#HasMortgage .radio").click(function(){
                self.radioFunc("HasMortgage", $(this));
            });

        },
        radioFunc: function(id, $dom){
            var self = this;
            $("#"+id+" .radio").removeClass("on");
            $dom.addClass("on");
            if($dom.hasClass("on")){
                if(id=="HasMortgage")
                    $("#"+id).removeClass("unsubmit").next("li").hide();

                self.showBtn();
            }
        },
        checkInput:function(name, RegExp){
            var val = $.trim($("#"+name+" input").val());
            if (val == "") {
                $("#"+ name).addClass("unsubmit").next("li").show().text('请输入'+ strName[name]);
                return false;
            }else if(!RegExp.test(val)){
                $("#"+ name).addClass("unsubmit").next("li").show().text($("#"+ name).data("type"));
                return false;
            }if(name == 'tenThousandKilometres' && parseInt(val) > 99.99){
                $("#"+ name).addClass("unsubmit").next("li").show().text($("#"+ name).data("type"));
                return false;
            }else{
                $("#"+ name).removeClass("unsubmit").next("li").hide();
            }
        },
        sunbmitForm: function(){
            var self = this;
            if(parseInt(carYear) > parseInt(selectLicenseYear)){
                return tools.showAlert("所选上牌年限小于车款出厂年限！");
            }
            $(".selcon.unsubmit").each(function(){
                $(this).find("em").addClass("f-red");
            });

            $(".checkApp").each(function(){
                $(this).trigger('keyup');
            });

            $("#HasMortgage.unsubmit").next("li").show();

            if ($(".unsubmit").length <= 0) {
                data = {
                    ID: tools.getUrlParam("order_id"),
                    CarID: $("#selectCar").data("id"),
                    LicenseYear: $("#selectDate").data("year"),
                    LicenseMonth: Number($("#selectDate").data("month")),
                    LicenseCityID: $("#selectCity").data("id"),
                    TenThousandKilometres: $("#tenThousandKilometres input").val(),
                    LoanPeriod: $("#selectPeriod").data("id"),
                    HasMortgage: $("#HasMortgage .radio.on").data("value"),
                    Gender: $("#Gender .radio.on").data("value"),
                    Age: $("#age input").val()
                }
                tools.$ajax({
                    url:url_updateInfoInStep2,
                    data: data,
                    success:function(res){
                        if (res.Data)
                            twoOrderId = res.Data.OrderID;
                        else
                            return tools.showAlert(res.Message);
                        self.showCheckBtn();
                        $('#applyBoxTwo').addClass('hide');
                        $('#applyBoxThree').removeClass('hide');
                        $('.header-bar .font-nav').text('资质信息');
                    }
                });
            };
        },//基本信息按钮
        showBtn: function(){
            if ($(".unsubmit").length <= 0) {
                $("#btnStepTwo").addClass("btn-yellow");
            }else{
                $("#btnStepTwo").removeClass("btn-yellow");
            }
        },//资质信息按钮
        showCheckBtn: function(){
            if($(".btn_radio.select").length == 6){
                qulitySign = true;
                $("#btnStepThree").addClass("bg-yellow");
            }
        },//调取列表金融产品接口
        listContent: function(){
            var self = this;
            var listdata = {
                CityID: data.LicenseCityID,
                CreditRequirement: quData.Credit,
                HasMortgage: data.HasMortgage,
                IsQualificationLimit: false,
                LoanPeriod: data.LoanPeriod,
                MaxMileage: data.TenThousandKilometres,
                OrderBy: -1,
                ProvidentFund: quData.Funds,
                SocialSecurity: quData.Insurance,
                VocationalRequirement: quData.Career,
                LicenseYear: data.LicenseYear,
                LicenseMonth: data.LicenseMonth,
                LocationCityId: cityInfo.cityId,
                CarId: data.CarID,
                PageSource: 725,
                PageIndex: 1,
                PageSize: pageSize
            }
            tools.$ajax({
                url:'/mortgage/GetProductList',
                data: listdata,
                beforeSend: function(){
                    LoginBox.removeClass("hide");
                },
                success: function(res2){
                    if (!res2.Result) {
                        tools.showAlert(res2.Message);
                        return;
                    };
                    LoginBox.addClass("hide");
                    if(res2.RowCount > 0){
                        var rdata = res2.Data.productList;
                        var product = new Object();
                        for(var i = 0; i < rdata.length; ++i){
                            var Pdata = rdata[i];

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

                            product.detailUrl = '/'+cityInfo.citySpell+'/p'+Pdata.ID+'/c'+ data.CarID +'/lp'+data.LoanPeriod+'/'+res2.Data.LoanAmount+'/'+725+'/'+ data.LicenseCityID+'/'+data.LicenseMonth+'/'+data.LicenseYear+'/'+data.TenThousandKilometres+'/'+addOrderId;

                            ApplyViewModel.ProductList.push(product);
                        }

                        if(resultId == 0){
                            $(".res_txt, .msg_form").removeClass("hide");
                        }
                        ListPBox.removeClass("hide");
                        $(".btn-fixed").removeClass("hide");
                        $(".h-btn").removeClass("hide");
                    }else{
                        $(".msg_form").addClass("hide")
                        $(".res_txt").removeClass("hide").html("暂时没有匹配的金融方案");
                        $(".u_wrap, .tip_txt").removeClass("hide");
                        $("#applyBoxFour").css({"height":$(window).height(), 'background-color':'#fff'});
                    }
                }
            });

        },
        applyResult: function(res){
            var self = this;
            if (!res.Result) {
                if (res.RowCount == -1 || res.RowCount == -2) {
                    return tools.showAlert(res.Message);
                }else{
                    if (addUrlSign) {
                        return tools.showAlert(res.Message);
                    };
                    addOrderId = res.Data.OrderID;
                    $(".res_tit span").html(res.Data.LoanAmount.toFixed(2)+'万');
                    //没有符合条件的金融产品
                    resultId = res.RowCount;
                    self.listContent();
                }
            }else{
                addOrderId = res.Data.OrderID;
                $(".res_tit span").html(res.Data.LoanAmount.toFixed(2) + '万');

                if (tools.getUrlParam("productsId")) {
                    //已选择过金融产品
                    self.selectProductView(addOrderId);

                } else {
                    //极速贷，低息贷，去贷款，快速申请四种情况下url中没有productsId  需要特俗处理
                    if (res.Data.productList != undefined && res.Data.productList.length > 0) {
                        //已选择过金融产品
                        self.selectProductView(addOrderId);
                    }else {
                        //没选择金融产品
                        $(".msg_form").removeClass("hide").html("依据您的资质，为您定制了以下优质金融方案，请选择");
                        self.listContent();
                    }
                }
            }
            // 出applyBoxFour
            $('#applyBoxTwo').addClass('hide');
            $('#applyBoxThree').addClass('hide');
            $('#applyBoxFour').removeClass('hide');
            //app分享交互
            if(isApp){
                tools.jsNativeBridge("showShare",{
                    pageId:102
                });
            }
            $('.header-bar .font-nav').text('审核结果');
            isGoBack = true;
        },//已选择经融产品结果
        selectProductView: function(addOrderId){
            tools.$ajax({
                url: '/Mortgage/SelectSingleViewProduct?orderId=' + addOrderId,
                type: 'Get',
                success: function (res1) {
                    if (!res1.Result) {
                        return tools.showAlert(res1.Message);
                    }
                    $(".msg_form, .h-btn, .com-ctn, .res_txt").addClass("hide");
                    $(".u_wrap").removeClass("hide");

                    //数据处理
                    var rdata1 = res1.Data;
                    var proData = {
                        Logo: CDNFileURL + rdata1.Logo,
                        ProductName: rdata1.ProductName,
                        promotionHtml: (rdata1.Discount != 0 ? '<span class="label font-22">折扣</span>' : '') + (rdata1.IsPromotion ? '<span class="label font-22">' + rdata1.PromotionTitle + '</span>' : ''),
                        MonthPayment: rdata1.MonthPayment < 10000 ? Math.round(rdata1.MonthPayment) + '元' : (rdata1.MonthPayment / 10000.00).toFixed(2) + "万",
                        MonthRate: rdata1.MonthRate ? rdata1.MonthRate.toFixed(2) + "%" : '0%',
                        TotalMoney: rdata1.TotalMoney ? (rdata1.TotalMoney / 10000.00).toFixed(2) + "万" : '0元'
                    }
                    ApplyViewModel.ProductCount.push(proData);

                    $(".success_box, .u_wrap").removeClass("hide");
                }
            });
        },

        initBackOfDetail: function () {
            var self = this;
            var isback = tools.getUrlParam("backofDetail");
            if (isback) {
                $('.header-bar .font-nav').text('审核结果');

                var res = JSON.parse(tools.getCookie('resData'));

                data = {
                    LicenseYear: vo['LicenseYear'],
                    LicenseMonth: vo['LicenseMonth'],
                    LicenseCityID: vo['LicenseCityID'],
                    TenThousandKilometres: vo['TenThousandKilometres'],
                    LoanPeriod: vo['LoanPeriod'],
                    CarID: vo['CarID'],
                    HasMortgage: vo['HasMortgage']
                };
                quData = {
                    Career: defaultQualification['Career'],
                    Income: defaultQualification['Income'],
                    Credit: defaultQualification['Credit'],
                    HouseState: defaultQualification['HouseState'],
                    Insurance: defaultQualification['Insurance'],
                    Funds: defaultQualification['Funds']
                }
                $('#applyBoxTwo').addClass('hide');
                self.applyResult(res);
            }
            else {
                $('.header-bar .font-nav').text('基本信息');
                $('#applyBoxTwo').removeClass('hide');
            }
        },
    }


    applyPage.init();