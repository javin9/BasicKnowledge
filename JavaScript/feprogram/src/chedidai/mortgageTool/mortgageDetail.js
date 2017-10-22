require('./mortgageDetail.scss');

    var check = require("libs/check");
    var echarts = require('echarts');
    var Extensions = [];
    var Calcul = {
        pageNo: 1,
        money: null,
        rate: null,
        time: null,
        mtd: null,
        x: null,
        lx: null,
        orderId: null,
        Gender: null,
        Age: null,
        init: function () {
            this.drawCircle();
            $(".mtd_sel").on("click", function() {
                $(this).addClass("sel").siblings(".mtd_sel").removeClass("sel")
            });
            //开始计算 获取input验证  calculBtn
            var mcldInput = $('.mort_cal_list .item .dd input');
            var calculBtn = $('.calculBtn');
            $('.mort_loan_details').hide();
            $('#money').blur(function () {
                $('.mort_loan_details').hide();
                var money = $('#money').val();
                var timeTriggerMoth = $('#timeTrigger').val();
                if (money >= 1 && money <= 9999999999) {
                    if (isNaN($(mcldInput).val())) {
                        $(this).siblings('.alert').show();
                    } else {
                        $(this).siblings('.alert').hide();
                    };
                } else {
                    $(this).siblings('.alert').show();
                }
            })
            $('#timeTrigger').blur(function () {
                var timeTriggerMoth = $('#timeTrigger').val();
                if (timeTriggerMoth >= 1 && timeTriggerMoth <= 240) {
                    if (!isNaN(timeTriggerMoth)) {
                        $(this).siblings('.alert').hide();
                        return;
                    }
                    $(this).siblings('.alert').hide();
                } else {
                    $(this).siblings('.alert').show();
                }
            });
            $('#rateTrigger').blur(function () {
                var rateTrigger = $('#rateTrigger').val();
                if (rateTrigger >= 0.01 ) {
                    if (!isNaN(rateTrigger)) {
                        $(this).siblings('.alert').hide();
                        return;
                    }
                    $(this).siblings('.alert').hide();
                } else {
                    $(this).siblings('.alert').text('请填写有效的贷款月利率 注：最小值0.01');
                    $(this).siblings('.alert').show();
                }
            })
            $(mcldInput).keydown(function() {
                $('.mort_loan_details').hide();
                var money = $(mcldInput).val().length;
                if (money > 9) {
                    $(this).siblings('.nb_big').show();
                }else{
                    $(this).siblings('.nb_big').hide();
                }
            });
            // 饼图 初始化
            var colorArr = ["#5c8ce0", "#f19715"];
            // 开始计算
            $(".calculBtn").on("click", function () {
                //input mort_cal_list
                var mortCalListIn = $('.mort_cal_list').find('input');
                var flag = true;
                $('.mort_cal_list input').each(function () {
                    if ($(this).val() == '' || $(this).parents('li').find('.alert').is(':hidden') == false) {//
                        flag = false;
                        return $(this).siblings('.alert').show();
                    } else {
                        $(this).siblings('.alert').hide();
                        flag = true;
                    }
                });
                if (flag) {
                    var mortLoanDetaBox = $('.mort_loan_details');
                    var money2 = $(mcldInput).val();
                    if (money2 >= 0 && money2 <= 9999999999) {
                        if (isNaN($(mcldInput).val())) {
                            $(this).siblings('.alert').show();
                        } else {
                            $(this).siblings('.alert').hide();
                        }
                    } else {
                        $(this).siblings('.alert').show();
                    }
                    $('.mort_loan_details').show();
                    $('.talbes').hide();
                    Calcul.money = $("#money").val();
                    var money = Calcul.money * 10000;
                    var time = Calcul.time = $("#timeTrigger").val();
                    var mtd = Calcul.mtd = $(".mtd_sel.sel").data("id");
                    Calcul.rate = $("#rateTrigger").val();
                    var rate = Calcul.rate / 100;
                    switch (mtd) {
                        case "xi":
                            Calcul.x = Math.ceil(money * rate * Math.pow(1 + rate, time) / (Math.pow(1 + rate, time) - 1));
                            Calcul.lx = Math.ceil(Calcul.x * time - money);
                            break;
                        case "jin":
                            Calcul.x = Math.round((money / time + money * rate));
                            Calcul.lx = Math.ceil(Calcul.x * time - money);
                            Calcul.lx = 0;
                            var tt = money;
                            for (var i = 0; i < time; i++) {
                                Calcul.lx += (money - money * i / time) * rate
                            }
                            Calcul.lx = Math.round(Calcul.lx);
                            break
                    }
                    var total = money + Calcul.lx;
                    $("#canvas_circle").html("");//重绘
                    // 基于准备好的dom，初始化echarts实例
                    var dataValDKZE = parseInt((money / total * 360).toFixed(1));
                    var dataValZFLX = parseInt((Calcul.lx / total * 360).toFixed(1));
                    var myChart = echarts.init(document.getElementById('canvas_circle'));
                    // 指定图表的配置项和数据
                    var option = {
                        series: [{
                            name: '访问来源',
                            type: 'pie',
                            radius: '60%',
                            center: ['50%', '50%'],
                            data: [
                                {
                                    value: dataValDKZE, //name: '贷款总额',
                                    itemStyle: {
                                        normal: {
                                            color: 'rgba(90,138, 227,1)',
                                        }
                                    }
                                },
                                {
                                    value: dataValZFLX, //name: '支付利息',
                                    itemStyle: {
                                        normal: {
                                            color: 'rgba(255,153, 0,1)',
                                            labelLine: {
                                                normal: {
                                                    show: false
                                                }
                                            }
                                        }
                                    }
                                }
                            ],
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            }
                        }]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
                    $(".cleEvt").each(function () {
                        $(this).text(Calcul[$(this).attr("id").split("E")[0]])
                    });
                }
            })
            //点击详情
            $('.calcul_con_a').on('click',function() {
                Calcul.listInit();
                $(".talbes").css("display","block");
            })
        },
        drawCircle: function() {
            (function($) {
                $.fn.drawCircle = function(options) {
                    var defaults = {
                        canvasId: "canvasId",
                        dataArr: [],
                        colorArr: [],
                        callback: new Function()
                    };
                    var ops = $.extend(defaults, options);
                    var c = $(this)[0];
                    var ctx = c.getContext("2d");
                    var radius = c.height / 2;
                    var ox = radius,
                        oy = radius;
                    var startAngle = 0;
                    var endAngle = 0;
                    for (var i = 0; i < ops.dataArr.length; i++) {
                        endAngle = endAngle + ops.dataArr[i] * Math.PI * 2;
                        ctx.fillStyle = ops.colorArr[i];
                        ctx.beginPath();
                        ctx.moveTo(ox, oy);
                        ctx.arc(ox, oy, radius, startAngle, endAngle, false);
                        ctx.closePath();
                        ctx.fill();
                        startAngle = endAngle
                    }
                    ops.callback && ops.callback()
                }
            })(jQuery)
        },
        listInit: function() {
            var money = Calcul.money * 10000||100000;
            var time = Calcul.time||12;
            var mtd = Calcul.mtd||"xi";
            var rate = Calcul.rate / 100||0.01;
            var lx = Calcul.lx||6500;
            var total = (money - 0) + (lx - 0);
            var html = "";
            switch (mtd) {
                case "xi":
                    for (var i = 0; i < Math.ceil(time / 12); i++) {
                        if (i != 0) html += '<ul class="table_ul"><li class="table_td year_class" >第' + (i + 1) + '年</li></ul>';
                        for (var j = 0; j < ((time % 12 != 0 && i == Math.ceil(time / 12) - 1) ? time % 12 : 12); j++) {
                            var bx = ((money - 0) + (lx - 0)) / time;
                            var s_lx = Math.round((money * rate - bx) * Math.pow(1 + (rate - 0), i * 12 + j) + (bx - 0));
                            total -= bx;
                            html += '<ul class="table_ul">' +
                                '	<li class="table_td">' + (j + 1) + '</li>' +
                                '	<li class="table_td">' + Math.round(bx) + '</li>' +
                                '	<li class="table_td">' + s_lx + '</li>' +
                                '	<li class="table_td">' + (bx - s_lx) + '</li>' +
                                '	<li class="table_td">' + total + '</li>' +
                                '</ul>';
                        }
                    }
                    break;
                case "jin":
                    for (var i = 0; i < Math.ceil(time / 12); i++) {
                        html += '<ul>';
                        if (i != 0) html += '<ul class="table_ul"><li class="table_td year_class" >第' + (i + 1) + '年</li></ul>';
                        for (var j = 0; j < ((time % 12 != 0 && i == Math.ceil(time / 12) - 1) ? time % 12 : 12); j++) {
                            var bx = Math.round((money / time + (money - money / time * (12 * i + j)) * rate));
                            total -= bx;
                            html += '<ul class="table_ul">' +
                                '	<li class="table_td">' + (j + 1) + '</li>' +
                                '	<li class="table_td">' + bx + '</li>' +
                                '	<li class="table_td">' + Math.round(((money - money / time * (i * 12 + j)) * rate)) + '</li>' +
                                '	<li class="table_td">' + Math.round(money / time) + '</li>' +
                                '	<li class="table_td">' + total + '</li>' +
                                '</ul>';
                        };
                        //html += '</ul>'
                    };
                    break;
            }
            $(".table_tbody").html(html);
            // 滚动区域逻辑
            var num = 0;
            var last = 0;
            var total = $(".wrapper").find("ul:eq(0)").height();
            $(".wrapper").scroll(function(){
                var scrollTop = $(this)[0].scrollTop;
                if (scrollTop>total){
                    num++;
                    $(".cal_con em").text(num+1);
                    last = total;
                    total += $(".wrapper").find("ul:eq(" + num + ")").height();
                }
                if (scrollTop<last){
                    num--;
                    $(".cal_con em").text(num+1);
                    total = last;
                    last -= $(".wrapper").find("ul:eq(" + num + ")").height();
                }
            })
            // 数据回填
            $(".dEvt").each(function(){
                $(this).text(getQueryString($(this).attr("id")));
            });
        },
        detailCheck: function(){
            //快速申请
            $(".detailBtn").on("click",Calcul.detailDataSub);//快速申请
            $(".mort_gage_list input").on("blur", function () {
                var name = $(this).attr("name");
                var val = $(this).val();
                var $dom = $(this).siblings(".alert");
                switch (name) {
                    case "Mobile":
                        if (!checkPhone(val))
                            $dom.show();
                        else
                            $dom.hide();
                        break;
                    case "Code":
                        if (val=="")
                            return $dom.show();
                        $ajax({
                            url: "/user/CheckMobileValidateCode",
                            data: { mobile: $("#Telphone").val(), validatecode: $("#Code").val() },
                            success: function (res) {
                                if (res.Result)
                                    $dom.hide();
                                else
                                    $dom.show();
                            }
                        });
                        break;
                    case "Name":
                        if (val==""||!val.match(nameRexp))
                            $dom.show();
                        else
                            $dom.hide();
                        break;
                    case "Age":
                        if (val==""||val<18||val>99||val % 1 != 0||val.indexOf(".")!=-1)
                            $dom.show();
                        else
                            $dom.hide();
                        break;
                }
            });
            $("#GetValidateCodeBtn").click(function () {
                if ($(this).hasClass("disable"))
                    return;
                if (checkPhone($("#Telphone").val())) {
                    $ajax({
                        url: "/user/GetMobileValidateCode",
                        data: { mobile: $("#Telphone").val() }
                    });
                    var n = 60;
                    $("#GetValidateCodeBtn").addClass("disable").text(n + "秒后获取");
                    var tmo = setInterval(function () {
                        if (--n == 0) {
                            clearInterval(tmo);
                            $("#GetValidateCodeBtn").removeClass("disable").text("获取校验码");
                            return;
                        }
                        $("#GetValidateCodeBtn").text(n + "秒后获取");
                    }, 1000);
                } else
                    $("#Telphone").parent().parent().next(".alert").removeClass("hide");
            });
        },
        detailDataSub: function () {
            $(".mort_gage_list input").blur();
            var data = new Object();
            $(".mort_gage_list input").each(function(){
                data[$(this).attr("name")] = $(this).val();
            });
            data.Gender = $.trim($(".mtd_sel.sel").text());
            var flag = true;
            $(".mort_gage_list .alert").each(function(){
                if (!$(this).is(':hidden'))
                    return flag=false;
            });
            if (!flag)
                return;

            data.Source = regSource == 'jsq' ? 511 : 512;//贷款计算器
            data.From = GetFromCode();
            data.IPLocationCityID = bit_locationInfo.cityId;
            data.BirthYear = (parseInt(new Date().getFullYear()) - parseInt(data.Age));
            data.Qualification = qualification;
            $ajax({
                url: AddMortgageOrderURL,
                type: "post",
                data:  {
                    "mortgageorder": JSON.stringify(data)
                },
                success: function(res){
                    res = JSON.parse(res);
                    if (res.Result) {
                        $('#SubmitQualification').data({ 'orderId': res.Data, 'Age': data.Age, 'Gender': data.Gender});
                        Calcul.orderId = res.Data;
                        Calcul.Age = data.Age;
                        Calcul.Gender = data.Gender;
                        $("#detail_t_name").text(data.Name);
                        $("#detail_t_phone").text("（" + data.Mobile + "）");
                        $(".mor_gage_index").addClass("hide");
                        $(".mor_gage_detail").removeClass("hide");
                        setCookie('W_Source', 'jsq');
                    }

                }
            });
        },
        detailSub: function(){
            $("#Mileage").keyup();
            var data = new Object();
            var flag = true;
        },
        goApply: function () {
            var self = this;
            $(".mask").css('height', document.body.clientHeight);
            $(".close").click(function () {
                $(".mask").addClass("hide");
                $('.popup_win_con.form .jyts').hide();
            });
            //贷款计算器 - 我要贷款  -  去贷款  GoApply
            $(".i_rapidly").on('click', function (e) {
                $("#detail").addClass("hide");
                $(this).addClass("active");
                $("#rapidly").removeClass("hide");
                $("#rapidly").attr('data-pid', $("#detail").attr('data-idpro'))
                //$(window).scrollTop(0);
            });
            //申请提交
            $("#submit").click(function (e) {
                e.preventDefault();
                self.submitFunc();
            });
            //申请贷款
            $("#get_apply_btn").click(function (e) {
                e.preventDefault();
                window.location.href = '/mortgage/apply?productsId='+ '&order_id=' + $("#rapidly").attr("data-id");
            });
        },
        sendAjax: function (opt, callBack, errorCallBack) {
            var self = this;
            var setting = {
                url: '',
                timeout: 5000,
                type: 'POST',
                async: true,
                data: {}
            };
            setting = $.extend(setting, opt);
            Tools.$ajax({
                url: setting.url,
                type: setting.type,
                async: setting.async,
                data: setting.data,
                beforeSend: function () {

                },
                success: function (res) {
                    callBack(res);
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        _errorcallback(textStatus);
                    }
                }
            })
        },
        //获得详情页数据
        getDetailData: function (data, url, successCallBack) {
            var self = this;
            if (self.isShowData) {
                self.sendAjax({
                    url: url,
                    data: data,
                }, successCallBack, sendAngin);
                self.isShowData = false;
            }
            // 重新加载
            function sendAngin(info) {
                self.sendAjax({
                    url: url,
                    dataType: 'jsonp'
                }, showSerials, sendAgain);
            }
        },
        //提交快速申请
        submitFunc: function () {
            var self = this;
            self.isShowData = true;
            $("#rapidly input").blur();
            check.checkCode($("#ValidateCode").val(), "Telphone", line, function (res) {
                if (!res.Result) {
                    $("#ValidateCode").parents(".input_item").next(".jyts").text("*您的验证码有误").show();
                    return false;
                } else {
                    if ($("input.unsubmit").length === 0) {
                        var data = new Object();
                        $("input.AppCheck").each(function () {
                            data[$(this).attr('name')] = $.trim($(this).val());
                        });
                        data['Source'] = 600;
                        data['Extensions'] = Extensions ;
                        data['Line'] = line;
                        self.getDetailData({ "order": data, "q": null }, url_addInfoInStep1, function (res) {
                            if (res.Result) {
                                $("#rapidly").attr("data-id", res.Data.ID);
                                if ($('#rapidly').attr('data-goapply') == 'GoApply') {
                                    $('#rapidly').removeAttr('data-goapply');
                                    window.location.href = '/mortgage/apply?productsId=' + '&order_id=' + $("#rapidly").attr("data-id");//权威评估  -  去贷款  GoApply
                                } else { }
                                $(".form").addClass("hide");
                                $(".succForm").removeClass("hide");
                            } else {
                                Tools.showAlert(res.Message);
                            }
                        });
                    }
                }
            });
        },
        //验证表单数据
        checkForm: function () {
            var ID2STR = {
                Name: '姓名',
                Mobile: '手机号'
            };
            $("input").on("blur", function () {
                var inputName = $(this).attr("name"),
                    inputValue = $(this).val();

                switch (inputName) {
                    case 'Name':
                        checkInput(check.isName(inputValue), $(this), inputName);
                        break;
                    case 'Mobile':
                        checkInput(check.isPhoneNumber(inputValue), $(this), inputName);
                        break;
                    case 'code':
                        if ($.trim($(this).val()) == "") {
                            $(this).addClass("unsubmit").parent(".input_item").next(".jyts").show();
                            return false;
                        } else {
                            $(this).removeClass("unsubmit").parent(".input_item").next(".jyts").hide();
                            return false;
                        }
                        break;
                }
            });
            //获取验证码
            $("#GetValidateCode").click(function () {
                check.getCode(60, "Telphone", "GetValidateCode", line);
                if (!check.getCode(60, "Telphone", "GetValidateCode", line)) {
                    checkInput(check.isPhoneNumber($("#Telphone").val()), $("#Telphone"), 'Mobile');
                }
            });
            function checkInput(checkFunction, $input, name) {
                if (checkFunction === "") {
                    $input.addClass("unsubmit").parent(".input_item").next(".jyts").show().text("*请输入您的" + ID2STR[name]);
                    return false;
                } else if (checkFunction === false) {
                    $input.addClass("unsubmit").parent(".input_item").next(".jyts").show().text("*请输入正确的" + ID2STR[name]);
                    return false;
                } else {
                    $input.removeClass("unsubmit").parent(".input_item").next(".jyts").hide();
                    return true;
                }
            }
        },
    };
    Calcul.init();
    Calcul.goApply();
    Calcul.checkForm();
    /*刷新数据*/
    window.onload = function () {
        $('input').val('');
    }
    /*切换城市定位刷新*/
    window.selCityCallback = function (obj) {
        window.location.reload();
    }

