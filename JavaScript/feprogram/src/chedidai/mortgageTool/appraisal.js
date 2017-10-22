require("./appraisal.scss")
    require('libs/jquery.datetimepicker');
    require("libs/carSelect/selCarThird.pc.js");
    require("libs/selCity");
    var ko = require('knockout');


    String.prototype.trim = function() {
        return this.replace(/(^\s*)|(\s*$)/g, "")
    };

var $headerDom = $("#Header"),
    $footerDom = $("#Footer"),
    $btPageDom = $(".bt_page"),
    $footerBottom = $(".footer-bottom"),
    $window = $(window);
function onResizeFun(){
    if(($headerDom.height() +$footerDom.height() +$btPageDom.height())< $window.height()){
        $footerDom.css({
            'width': '100%',
            'position': 'fixed',
            'bottom':"40px"
        });
        $footerBottom.css({
            'width': '100%',
            'position': 'fixed',
            'bottom':"0"
        });
    }else{
        $footerDom.css({
            'width': 'auto',
            'position': 'static'
        });
        $footerBottom.css({
            'width': 'auto',
            'position': 'static'
        });
    }
}
$(window).on("resize",function(e){
    onResizeFun();
})

var MortgageView = {
        // 选车控件
        CarLetters: ko.observableArray(),
        CarBrands: ko.observableArray(),
        CarSerials: ko.observableArray(),
        CarDetails: ko.observableArray(),
        CarPrice: ko.observable(0),
        // 城市控件    
        ProvincesArray: ko.observableArray(),
        CitiesArray: ko.observableArray(),
        // 页面展示
        ID: ko.observable(0), // 订单 ID

        CarsBrandVal: ko.observable(""), // 所选车最终展示的品牌名
        CarsSerialVal: ko.observable(""), // 所选车最终展示的车系名
        CarsVal: ko.observable(""), // 所选车最终展示的车款名
        CarsFullVal: ko.observable("请选择"), // 所选车最终展示的名字，格式： 品牌 - 车系 - 车款
        CarId: ko.observable(0), // 所选车的 id
        CarYear: ko.observable(0), // 所选车的年份
        CarPriceVal: ko.observable(""), // 所选车最终展示的价格

        LicenseYearVal: ko.observable(0), // 上牌年
        LicenseMonthVal: ko.observable(0), // 上牌月
        LicenseBool: ko.observable(false), // 上牌时间合法性

        MileageVal: ko.observable("4"), // 行驶里程
        MortgageStatusVal: ko.observable(0), // 抵押状态
        LoanPeriodVal: ko.observable(3), // 贷款期限

        ProvinceId: ko.observable(0), // 省份id
        CityId: ko.observable(0), // 城市 id
        CityName: ko.observable("请选择"), //城市名称

        // YearArray: ko.observableArray(),
        UserName: ko.observable("姓名"), //姓名
        Mobile: ko.observable("手机号"),
        ValidateVal: ko.observable("短信验证码"), //短信验证码
        UserAge: ko.observable(""), // 年龄
        Gender: ko.observable('男'), // 性别
        CreditStatus: ko.observable(71), // 信用记录
        B2CCarValuation: ko.observable(""),  //汽车估价
        LoanAmount: ko.observable("")  //可贷额度
    };
    //年龄订阅方法
    MortgageView.UserAge.subscribe(function(newValue) {
        var maxValue = 99, minValue = 18;
        newValue = newValue + "";
        if (newValue.match(/\d+/) == null) {
            MortgageView.UserAge("");
        } else {
            if (newValue <= maxValue) {
                MortgageView.UserAge(newValue.match(/\d+/)[0]);
            } else {
                MortgageView.UserAge(newValue.match(/\d+/)[0].substr(0, 2));
            }
        }
    });

    //车型订阅方法
    MortgageView.CarId.subscribe(function(newValue) {
        if (newValue > 0) {
            $(".xzcx .alert").hide();
        }
    });

    //城市订阅方法
    MortgageView.CityId.subscribe(function(newValue) {
        if (newValue > 0) {
            $(".spsj .l_box .alert").hide();
        }
    });

    //时间订阅方法
    MortgageView.LicenseYearVal.subscribe(function(newValue) {
        if (newValue > 0 && MortgageView.LicenseMonthVal() > 0) {
            $(".spsj .r_box .alert").hide();
        }
    });
    MortgageView.LicenseMonthVal.subscribe(function(newValue) {
        if (newValue > 0 && MortgageView.LicenseYearVal() > 0) {
            $(".spsj .r_box .alert").hide();
        }
    });

    //申请表单
    var Formmain = function() {
        //var _id = window.location.href.match(/id=\d+/)[0].match(/\d+/)[0];
        //MortgageView.ID(_id);
        // 选车
        $("#CarsA").selCar2({
            OnlyOnSale: false,
            ShowPrice: true,
            IsOutput:false,
            Callback: function (data) {
                $('#CarsA').addClass('active');
                showAlert('car');
                showAlert('checkYear');
                MortgageView.CarsFullVal(data.data("fullname")); 
                MortgageView.CarId(data.data("id")); // 所选车的 id
                MortgageView.CarYear(data.data("year")); // 所选车的年份
                MortgageView.CarPriceVal(data.data("val") +"万"); // 所选车最终展示的价格

                /*时间插件*/
                $('.time_year a').datetimepicker({
                    lang: 'ch',          //选择语言
                    format: 'Y年m月',      //格式化日期
                    monthpicker: true,    //关闭时间选项
                    timepicker: false,
                    datepicker: false,
                    isPosition:false,
                    yearStart: MortgageView.CarYear(),     //设置最小年份
                    yearEnd: (new Date()).getFullYear(), //设置最大年份
                    minDate: MortgageView.CarYear() + '/01/1', //最小日期
                    maxDate: (new Date()).getFullYear() + '/' + ((new Date()).getMonth() + 1) + '/' + (new Date()).getDate(),//最大日期 
                    onChangeDateTime: function (dp, $input, obj) {
                        MortgageView.LicenseYearVal(dp.getFullYear());
                        MortgageView.LicenseMonthVal(dp.getMonth() + 1);
                        $('.time_year a').text(dp.getFullYear() +"年"+(dp.getMonth() + 1) +"月")
                    }
                });
            }
        });

        //选择城市
        $(".SelCityEvent a.jt").selCity({
            callBacks:function(obj){
                MortgageView.CityName(obj.cityName);
                MortgageView.CityId(obj.cityId);
            }
        });

        
       

        // 年龄
        $('#UserAge').on('blur', function() {
            if (MortgageView.UserAge() === '') {
                $(this).siblings('.alert').show().text('请输入年龄');
                MortgageView.UserAge('');
            } else if(MortgageView.UserAge() < 18){
                $(this).siblings('.alert').show().text('请输入正确的年龄');
                MortgageView.UserAge('');
            }else {
                $(this).siblings('.alert').hide();
            }
        });

        // 检查是否可提交
        function showAlert(_type) {
            // 车
            if (_type == 'car') {
                if (MortgageView.CarId() == 0) {
                    $('#CarsA').parents('.f-item').find('.alert').show();
                } else {
                    $('#CarsA').parents('.f-item').find('.alert').hide();
                }
            }
            // 行驶里程
            if (_type == 'mile') {
                if (MortgageView.MileageVal() == 0) {
                    $('.MileA').parents('.f-item').find('.alert').show();
                } else {
                    $('.MileA').parents('.f-item').find('.alert').hide();
                }
            }
            // 上牌年份
            if (_type == 'year') {
                if (MortgageView.LicenseYearVal() == 0 || MortgageView.LicenseMonthVal() == 0) {
                    $('.YearA').parents('.f-item').find('.alert').show().text('请选择上牌时间');
                } else {
                    $('.YearA').parents('.f-item').find('.alert').hide();
                }
            }
            if (_type == 'checkYear') {
                if (MortgageView.LicenseYearVal() != 0 && MortgageView.CarYear() != 0) {
                    if ((parseInt(MortgageView.LicenseYearVal()) + 1) < MortgageView.CarYear()) {
                        MortgageView.LicenseBool(false);
                        $('.YearA').parents('.f-item').find('.alert').show().text('请选择正确的上牌时间');
                    } else {
                        MortgageView.LicenseBool(true);
                        $('.YearA').parents('.f-item').find('.alert').hide();
                    }
                }
            }
            // 城市
            if (_type == 'city') {
                if (MortgageView.CityId() == 0) {
                    $('.ProvinceA').parents('.f-item').find('.alert').show();
                } else {
                    $('.ProvinceA').parents('.f-item').find('.alert').hide();
                }
            }
            // 贷款期限
            if (_type == 'period') {
                if (MortgageView.LoanPeriodVal() == 0) {
                    $('.PeriodA').parents('.f-item').find('.alert').show();
                } else {
                    $('.PeriodA').parents('.f-item').find('.alert').hide();
                }
            }
            // 年龄
            if (_type == 'age') {
                $('#UserAge').blur();
            }
            // 信用记录
            if (_type == 'credit') {
                if (MortgageView.CreditStatus() == 0) {
                    $('.FundA').parents('.f-item').find('.alert').show();
                } else {
                    $('.FundA').parents('.f-item').find('.alert').hide();
                }
            }
        };

        // 提交
        $("#postData").on("click", submitApply);
        function submitApply() {

            //showAlert('car');
            //showAlert('mile');
            //showAlert('year');
            //showAlert('checkYear');
            //showAlert('city');
            //showAlert('period');
            showAlert('age');
            //showAlert('credit');

            //清楚提示信息
            $("#alertName, #alertMobile, #alertValidate").hide();

            //验证校验码
            checkValidateCode();

            //NameBool && MobileBool && ValidateBool 非法时返回
            if (!NameBool) {
                $("#alertName").show();
            }
            if (!MobileBool) {
                $("#alertMobile").show();
            }
            if (!ValidateBool) {
                $("#alertValidate").html("验证码输入错误").show();
            }
            if (!NameBool || !MobileBool || !ValidateBool) {
                return;
            }

            if (MortgageView.CarId() > 0 && MortgageView.MileageVal() > 0 && MortgageView.CityId() > 0 && MortgageView.LoanPeriodVal() > 0 && MortgageView.CreditStatus() > 0 && MortgageView.UserAge() > 0) {
                var MortgageOrder = {};
                //MortgageOrder.ID = MortgageView.ID();
                MortgageOrder.CarID = MortgageView.CarId();  //车型
                MortgageOrder.LicenseCityID = MortgageView.CityId(); //城市            
                MortgageOrder.LicenseYear = MortgageView.LicenseYearVal();  //年
                MortgageOrder.LicenseMonth = MortgageView.LicenseMonthVal(); //月
                MortgageOrder.TenThousandKilometres = MortgageView.MileageVal();  //里程
                MortgageOrder.HasMortgage = MortgageView.MortgageStatusVal() == '1' ? true :false;  //抵押状态            

                MortgageOrder.Name = MortgageView.UserName(); //姓名
                MortgageOrder.Mobile = MortgageView.Mobile(); //手机
                //MortgageOrder.Age = MortgageView.UserAge(); // 年龄
                var myDate = new Date();
                MortgageOrder.BirthYear = myDate.getFullYear() - MortgageView.UserAge();  //年龄转化成 出生年份
                MortgageOrder.Gender = MortgageView.Gender();// 性别
                MortgageOrder.Credit = MortgageView.CreditStatus(); // 信用记录
                MortgageOrder.LoanPeriod = MortgageView.LoanPeriodVal();  //贷款期限
                MortgageOrder.B2CCarValuation = MortgageView.B2CCarValuation(); //估价
                MortgageOrder.LoanAmount = MortgageView.LoanAmount();  //可贷额度
                MortgageOrder.Level = 2;  //订单等级
                MortgageOrder.From = tools.getCookie("from");//订单来源
                MortgageOrder.Source = 602;
                MortgageOrder.CanMortgage = MortgageView.MortgageStatusVal();//抵押状态
                var postdata = {
                    order:MortgageOrder,
                    q:null
                }

                
                $.ajax({
                    url: "/mortgage/AddMortgageOrder",
                    type: "Post",
                    data: postdata,
                    async: true,
                    beforeSend: function() {
                        $("#postData").off('click').text('提交中').parents('.button_208_34').addClass('disabled');
                    },
                    success: function (res) {
                        if (res.Result) {
                            location.hash = "#result";
                            $("#postData").parents('.button_208_34').removeClass('disabled').end().parents(".daikuan_pg").hide().next(".daikuan_pg").show();
                            onResizeFun();
                          //启动定时器
                            t = setInterval(function(){

                                 var val = $('.succ_box .timer').html();
                                var newVal = parseInt(val) - 1;
                                if (newVal >= 0) {
                                    $('.succ_box .timer').html(newVal);
                                }else {
                                    clearInterval(t);
                                    // $('.succ_box .timer').html("10");
                                    window.location.href="/"
                                    // $("#back_to_home").click();
                                }
                            }, 1000);
                        }
                    },
                    failure: function (res) {
                        $("#postData").on("click", submitApply).parents('.button_208_34').removeClass('disabled');
                        // alert('Failed');
                    }
                });
            }
            else {
                
            }
        };

    };

    // 下拉
    $.extend({
        ShowSel: function(_opts) {
            var $options = {
                trigger: {},
                selectCon: {},
                callback: new Function()
            };

            $options = $.extend($options, _opts);

            $options.trigger.off('click').on('click', function() {
                $('.SelectCon').not($options.selectCon).hide();
                $options.selectCon.toggle();

                $options.selectCon.on('click', 'li', function() {
                    $options.selectCon.hide();
                    $options.callback($(this));
                });

                $(document).off('click').on('click', function(e) {
                    e = e || window.event;
                    var $target = $(e.target);
                    if (!$target.is($options.selectCon) && !$target.is($options.selectCon.find('li')) && !$target.is($options.trigger)) {
                        $('.SelectCon').hide();
                    }
                });
            });
        }
    });

    //计时器
    var t;

    $(function() {
        ko.applyBindings(MortgageView);
        Formmain();
    });

    

    //初始化只显示车型选择div
    $().ready(function () {
        if(location.hash == ""){
            $(".daikuan_pg:first").show().siblings(".daikuan_pg").hide();
        }else if(location.hash == "#pinggu"){
            $(".daikuan_pg").eq(4).show().siblings(".daikuan_pg").hide();
        }else if(location.hash == "#result"){
             $(".daikuan_pg").eq(5).show().siblings(".daikuan_pg").hide();
            onResizeFun();
             //启动定时器
            t = setInterval(function(){

                 var val = $('.succ_box .timer').html();
                var newVal = parseInt(val) - 1;
                if (newVal >= 0) {
                    $('.succ_box .timer').html(newVal);
                }else {
                    clearInterval(t);
                    // $('.succ_box .timer').html("10");
                    window.location.href="/"
                    // $("#back_to_home").click();
                }
            }, 1000);
        }
        
    });


    //下一步，上一步
    $().ready(function () {
        $(".btn_box a.next").on("click", function () {
            var selfEvent = $(this);
            //清楚显示信息
            $(".alert").hide();
            $(".CityLayer").hide();
            $(".com_sele .SelectCon").hide();
            //选择车型下一步
            if ($(this).is("#xzcx_next")) {
                if (MortgageView.CarId() > 0) {
                    $(this).parents(".daikuan_pg").hide().next(".daikuan_pg").show();
                }
                else {
                    $(this).parents(".daikuan_pg").find(".alert").show();
                }
                return false;
            }
            //选择上牌城市， 上牌时间下一步
            if ($(this).is("#spsj_next")) {
                if (MortgageView.CityId() > 0 && MortgageView.LicenseYearVal() > 0 && MortgageView.LicenseMonthVal() > 0) {
                    $(this).parents(".daikuan_pg").hide().next(".daikuan_pg").show();
                }
                else {
                    if (MortgageView.CityId() == 0){
                        $(this).parents(".daikuan_pg").find(".l_box .alert").show();
                    }
                    if (MortgageView.LicenseYearVal() == 0 || MortgageView.LicenseMonthVal() == 0) {
                        $(this).parents(".daikuan_pg").find(".r_box .alert").show();
                    }
                }
                return false;
            }

            
            if ($(this).is("#to_pinggu")) {
                $("#maskLayer").show();
                tools.showAlert("努力估价中...",9999999);
                var postdata = { 
                    "CarID": MortgageView.CarId(), 
                    "LicenseCityID": MortgageView.CityId(),
                    "LicenseYear": MortgageView.LicenseYearVal(),
                    "LicenseMonth": MortgageView.LicenseMonthVal(),
                    "TenThousandKilometres":MortgageView.MileageVal()
                };
                $.ajax({
                    url: "/MortgageTool/GetMortgagePirce",
                    type: "get",
                    data: postdata,
                    async: true,
                    success: function (res) {
                        if(res.Result){
                            location.href += "#pinggu";
                            MortgageView.B2CCarValuation(res.Data.B2CCarValuation);
                            MortgageView.LoanAmount(res.Data.LoanAmount);

                            $("#B2CPirc").html((res.Data.B2CCarValuation==0)?0:res.Data.B2CCarValuation.toFixed(2) + "万");
                            $("#LoanAmount").html((res.Data.LoanAmount==0)?0:res.Data.LoanAmount.toFixed(2) + "万");
                            $("#maskLayer").hide();
                            $("#showAlertBox").hide();
                            selfEvent.parents(".daikuan_pg").hide().next(".daikuan_pg").show();
                            return false;    
                        }
                        
                    }
                });
            }else{
                $(this).parents(".daikuan_pg").hide().next(".daikuan_pg").show();
                return false;
            }

        });
        $(".btn_box a.last").on("click", function () {
            $(this).parents(".daikuan_pg").hide().prev(".daikuan_pg").show();
            return false;
        });
        $(".btn_box a.again").on("click", function () {
            $(".daikuan_pg:first").show().siblings(".daikuan_pg").hide();
            return false;
        });
    });


    //里程选择,抵押状态,年龄,信用状态,贷款期限,性别
    $().ready(function () {
        //里程选择
        $(".xslc > ul > li").click(function () {
            $(this).addClass("current").siblings("li").removeClass("current");
            MortgageView.MileageVal($(this).attr('data-id'));
        });
        //抵押状态
        $(".dyzt > ul > li").click(function () {
            $(this).addClass("current").siblings("li").removeClass("current");
            var val = parseInt($(this).attr('data-id'));
            MortgageView.MortgageStatusVal(val);
        });
        //年龄
        //$("#age").change(function () {
        //    var val = $(this).children("option:selected").val();
        //    MortgageView.UserAge(val);
        //});
        //信用状态
        $("#credit").change(function () {
            var val = $(this).children("option:selected").val();
            MortgageView.CreditStatus(val);
        });
        //贷款期限
        $("#period").change(function () {
            MortgageView.LoanPeriodVal($(this).children("option:selected").val());
        });
        //性别
        $(".form_box :radio").change(function () {
            MortgageView.Gender($(".form_box :radio:checked").val());
        });
    });



    //评估结果页中 姓名，手机号，验证码  正确性验证
    var NameReg = new RegExp(/^[\u4e00-\u9fa5]{2,8}$/);
    var MobileReg = new RegExp(/^(13[0-9]|15[0-9]|18[0-9]|17[0-9]|14[0-9])\d{8}$/);
    var NameBool = false,
        MobileBool = false,
        ValidateBool = false;
    $().ready(function () {

        

        $("#inputName, #inputMobile, #inputValidate").focus(function () {
            if ($(this).is("#inputName") && ($(this).val().trim() === "") || $(this).val().trim() === "姓名") {
                $(this).val("")
            }
            if ($(this).is("#inputMobile") && ($(this).val().trim() === "") || $(this).val().trim() === "手机号") {
                $(this).val("")
            }
            if ($(this).is("#inputValidate") && ($(this).val().trim() === "") || $(this).val().trim() === "短信验证码") {
                $(this).val("")
            }
        }).blur(function () {
            if ($(this).is("#inputName")) {
                if ($(this).val().trim() === "" || $(this).val().trim() === "姓名") {
                    $(this).val("姓名");
                    $(this).removeClass("curr");
                    $("#alertName").show().text('请输入姓名');
                    NameBool = false
                } else {
                    if (!$(this).val().match(NameReg)) {
                        $(this).removeClass("curr");
                        $("#alertName").show().text('请输入正确的姓名');
                        NameBool = false
                    } else {
                        $("#alertName").hide();
                        NameBool = true
                    }
                }
            }
            if ($(this).is("#inputMobile")) {
                if ($(this).val().trim() === "" || $(this).val().trim() === "手机号") {
                    $(this).val("手机号");
                    $(this).removeClass("curr");
                    $("#alertMobile").show().text("请输入手机号");
                    MobileBool = false
                } else {
                    if (!$(this).val().match(MobileReg)) {
                        $(this).removeClass("curr");
                        $("#alertMobile").show().text("请输入正确手机号");
                        MobileBool = false
                    } else {
                        $("#alertMobile").hide();
                        MobileBool = true
                    }
                }
            }
            if ($(this).is("#inputValidate")) {
                if ($(this).val().trim() === "" || $(this).val().trim() === "短信验证码") {
                    $(this).val("短信验证码");
                    $(this).removeClass("curr");
                    $("#alertValidate").show().html("请输入短信验证码");
                    ValidateBool = false;
                }
                else {
                    $("#alertValidate").hide();
                    //ValidateBool = true;
                }
            }
        });
    });

    //短信验证码
    $("#getValidateCode").off("click").on("click", function () {
        if (MobileBool) {
            getValidateCode()
        }
    });
    var getValidateCode = function () {
        var countdownTime = 60,
            dftText = "获取验证码",
        isCountDownTime = true;
        //var $validateBtn = $("#getValidateCode");
        $("#getValidateCode").css("background-color", "gray").off("click").val(countdownTime + "秒后重新获取");
        var timer = setInterval(function () {
            if (countdownTime > 0) {
                countdownTime--;
                $("#getValidateCode").val(countdownTime + "秒后重新获取")
            } else {
                $("#getValidateCode").css("background-color", "#2E80BD").val(dftText).on("click", getValidateCode);
                clearInterval(timer)
            }
        }, 1000);
        var postdata = {
            "mobile": MortgageView.Mobile()
        };
        $.ajax({
            url: CODE_GETTING_URL,
            type: "Post",
            data: postdata,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                if (data.Result) {
                    $("#alertValidate").hide()
                }
                else {
                    $('#alertValidate').show().html(data.Message);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) { },
            complete: function (jqXHR, textStatus) { }
        })
    };
    //验证校验码
    var checkValidateCode = function () {
        
        var postdata = {
            "mobile": MortgageView.Mobile(),
            "validatecode": MortgageView.ValidateVal()
        };
        
        $.ajax({
            url: CODE_VALIDATING_URL,
            type: "Post",
            data: postdata,
            async: false,
            success: function (data, textStatus, jqXHR) {
                if (data.Result) {
                    ValidateBool = true;
                    $("#alertValidate").hide();
                    
                }
                else {
                    if (data.Data == '3' || data.Data == '4') {
                        $('#alertValidate').show().html(data.Message);
                    }
                    ValidateBool = false;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                ValidateBool = false
            },
            complete: function (jqXHR, textStatus) { }
        });
    }
