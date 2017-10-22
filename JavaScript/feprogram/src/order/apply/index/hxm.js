    require('./hxm.scss');

    var check = require("libs/check");
    var ko = require("knockout");
    var fg=false;
    var fg2=false;
    var fg3= false;

    let isfirstClickSubmit = true;
    /*var opts = {
     angle: 0,
     lineWidth: 0.02
     };
     var target = document.getElementById('canvas-preview');
     var gauge = new Gauge(target).setOptions(opts);
     gauge.maxValue = 130000;
     gauge.animationSpeed = 55;*/
    var carPriceData = $("#formQ #CarPrice").val(),
        carIdData = $("#formQ #CarId").val();
    var	isDownPaymentPeriodAjax  = true;
    var orderViewModel = {
        commonQuestions: ko.observableArray(), //常见问题
        recommendProducts: ko.observableArray(), //推荐金融产品
        latestLoanOrders: ko.observableArray(), //最近申请订单
        loanAdviserOrders: ko.observableArray(), //贷款顾问
        isLoanAdviser:ko.observable(),//是否显示贷款顾问
        isGetRecentApplyTime:ko.observable(),//是否显示最近申请时间
        getRecentApplyTime:ko.observable(),//最近申请时间
        firstAdviserOrder: ko.observableArray(),//第一贷款顾问

        userEvaluationlist: ko.observableArray(),//用户评价
        userEvaNum: ko.observable(),//评价条数
        pageIndex: ko.observable(),//当前页码数

        quotationType: ko.observable('--'),//报价类型
        quotationAmount:ko.observable('--'),//报价金额
        downPayment:ko.observable('--'),//首付金额
        downPaymentRate:ko.observable('--'),//首付比例
        downPaymentRateData:ko.observable(0),//首付比例原始数据
        repaymentPeriodData:ko.observable(0),//月供原始数据
        loanAmount:ko.observable('--'),//贷款金额
        totalCost:ko.observable('--'),//贷款成本（利息、手续费之和）
        totalExpenses:ko.observable('--'),//总花费（车价 + 贷款成本 + 税费）
        monthlyPayment:ko.observable('--'),//月供
        finalPaymentAmount:ko.observable('--'),//贷款尾款
        isFinalPaymentAmount:ko.observable(false),
        finalPaymentRate:ko.observable('--'),//尾款比例
        rateText:ko.observable('--'),//月费率/月利率文本
        interestRate:ko.observable('--'),//月费率/月利率金额
        totalInterest:ko.observable('--'),//利息
        serviceFee:ko.observable('--'),//手续费
        purchaseTax:ko.observable('--'),//购置税
        taxation:ko.observable('--'),//税费=购置税 + 500（上牌） + 950（强险）
        carPrice:ko.observable(carPriceData),//车价
        productId:ko.observable(product),
        packageId:ko.observable(),
        downPaymentHtml:ko.observable(''),//首付文本Html
        repaymentHtml:ko.observable(''),//月供文本Html
        isLoanAdviser:ko.observable(false),//贷款顾问是否显示
        loanAdviserCount:ko.observable(0),//贷款顾问数量
        isSecurityDeposit:ko.observable(false),//是否有保证金
        securityDeposit:ko.observable("--"),//保证金
        securityDepositHtml:ko.observable(''),
        securityDepositRate:ko.observable("--"),//保证金比例
        securityDepositRateData:ko.observable(0),//原始数据
        firstPayment:ko.observable("--"),//首次支付
    };

    var ordera = {

        init: function(){
            ko.applyBindings(orderViewModel);
            this.loanInfo();
            if(typeof username !="undefined")
            {
                //易鑫流程，没有这个变量
                $(".layx22-left2-zsxm input").val(username);
            }
            $(".layx22-left2-sfzh input").val('请输入18位证件号');
            var layx3p=$(".layx3").offset().top;
            if($(window).scrollTop()>layx3p+80-$(window).height()){
                $(".layx3-con").removeClass("layx3f");
            }else{
                $(".layx3-con").addClass("layx3f");
            }
            $(window).scroll(function(){
                if($(window).scrollTop()>layx3p+80-$(window).height()){
                    $(".layx3-con").removeClass("layx3f");
                }else{
                    $(".layx3-con").addClass("layx3f");
                }
            })

            $(".layx22-left2-zsxm input").focus(function(){
                if(this.value==this.defaultValue){
                    this.value="";
                    this.style.color="#333";
                }
            })

            $(".layx22-left2-zsxm input").blur(function(){
                if(this.value==''){
                    this.style.color="#c4c4c4";
                    this.value=this.defaultValue;
                }

                if($(".layx22-left2-zsxm input").val()=="请输入您的中文全名"){
                    fg=false;
                    $(".layx22-left2-zsxm input").parent().next().html('请输入您的中文全名');
                    $(".layx22-left2-zsxm input").parent().next().css("display","");
                    return;
                }

                if(!check.isName($(".layx22-left2-zsxm input").val())){
                    fg=false;
                    $(".layx22-left2-zsxm input").parent().next().html('姓名格式错误，请核实');
                    $(".layx22-left2-zsxm input").parent().next().css("display","");
                    return;
                }

                $(".layx22-left2-zsxm input").parent().next().css("display","none");
                fg=true;
            })

            $(".layx22-left2-sfzh input").focus(function(){
                if(this.value==this.defaultValue){
                    this.value="";
                    this.style.color="#333";
                }
            })

            $(".layx22-left2-sfzh input").blur(function(){
                if(this.value==''){
                    this.style.color="#c4c4c4";
                    this.value=this.defaultValue;
                }

                if($(this).val()=="请输入18位证件号"){
                    fg2=false;
                    $(this).parent().next().html('请输入18位证件号');
                    $(this).parent().next().css("display","");
                    return;
                }

                if(!check.isID($(this).val())){
                    fg2=false;
                    $(this).parent().next().html('身份证号码格式错误，请核实');
                    $(this).parent().next().css("display","");
                    return;
                }

                $(this).parent().next().css("display","none");
                fg2=true;
            })

            //alert(1);
            let tpjyInputDom = $(".layx22-left2-tpjy input");
            tpjyInputDom.focus(function(){
                if(this.value==this.defaultValue){
                    this.value="";
                    this.style.color="#333";
                }
            })

            tpjyInputDom.blur(function(){
                if(this.value==''){
                    this.style.color="#c4c4c4";
                    this.value=this.defaultValue;
                }

                if(tpjyInputDom.val()=="请输入图片验证码"){
                    fg3=false;
                    tpjyInputDom.parent().next().html('请输入图片验证码');
                    tpjyInputDom.parent().next().css("display","");
                    return;
                }

                if(tpjyInputDom.val().length !== 4){
                    fg3=false;
                    tpjyInputDom.parent().next().html('请输入正确的验证码');
                    tpjyInputDom.parent().next().css("display","");
                    return;
                }

                tpjyInputDom.parent().next().css("display","none");
                fg3=true;
            })

            $('#changeCode').click(function(){
                $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
            });

            $(".hqdk").click(function(){
                //$(".layx22-left2-zsxm input").blur();
                //$(".layx22-left2-sfzh input").blur();
                const ishasImgCode = !$('#imgValidateCodeBox').hasClass('hide');

                if(!$(this).hasClass('disable')){
                    if($(".layx22-left2-zsxm input").val()=="请输入您的中文全名"){
                        $(".layx22-left2-zsxm input").parent().next().html('请输入您的中文全名');
                        $(".layx22-left2-zsxm input").parent().next().css("display","");
                    }else if(!check.isName($(".layx22-left2-zsxm input").val())){
                        $(".layx22-left2-zsxm input").parent().next().html('姓名格式错误，请核实');
                        $(".layx22-left2-zsxm input").parent().next().css("display","");
                    }

                    if($(".layx22-left2-sfzh input").val()=="请输入18位证件号"){
                        $(".layx22-left2-sfzh input").parent().next().html('请输入18位证件号');
                        $(".layx22-left2-sfzh input").parent().next().css("display","");
                    }else if(!check.isID($(".layx22-left2-sfzh input").val())){
                        $(".layx22-left2-sfzh input").parent().next().html('身份证号码格式错误，请核实');
                        $(".layx22-left2-sfzh input").parent().next().css("display","");
                    }

                    if(ishasImgCode){

                        if(tpjyInputDom.val()=="请输入图片验证码"){
                            tpjyInputDom.parent().next().html('请输入图片验证码');
                            tpjyInputDom.parent().next().css("display","");
                        }else if(tpjyInputDom.val().length !== 4){
                            tpjyInputDom.parent().next().html('请输入正确的验证码');
                            tpjyInputDom.parent().next().css("display","");
                        }
                    }

                    if(!$(".layx3 input[type=checkbox]")[0].checked){
                        tools.showAlert("请阅读车贷服务条款，并勾选");
                    }

                    if((fg && fg2 && $(".layx3 input[type=checkbox]")[0].checked && !ishasImgCode) || (fg && fg2 && $(".layx3 input[type=checkbox]")[0].checked && ishasImgCode && fg3)){
                        //$(".spedwin").css("left",($(window).width()-$(".spedwin").width())/2+$(window).scrollLeft());
                        //$(".spedwin").css("top",($(window).height()-$(".spedwin").height())/2+$(window).scrollTop());

                        //$("#maskLayer").css("display","block");
                        //$(".spedwin").css("display","");
                        //gauge.set(130000);
                        $(".hqdk").addClass('disable');
                        $.ajax({
                            url:id_checking_url,
                            type:"post",
                            dataType:"json",
                            data: {
                                "name":$(".layx22-left2-zsxm input").val(),
                                "idNumber":$(".layx22-left2-sfzh input").val(),
                                "userId":uid,
                                // "phone":mobile
                                imageCode: $('#imgValidateCodeBox').hasClass('hide')?'':$('#imgValidateCode').val()
                            },
                            beforeSend: function () {
                                $("a.hqdk").html("提交中..");
                            },
                            success: function (res) {
                                $(".hqdk").removeClass('disable');
                                $("a.hqdk").html("提交订单");
                                if(res.Result){
                                    document.getElementById("formQ").submit();
                                }else{
                                    if(res.Data === 0){
                                        //验证码错误
                                        $('#imgValidateCodeBox').removeClass('hide');
                                        if(!isfirstClickSubmit){
                                            $(".layx22-left2-tpjy input").parents('.items').next('.layx22-left2-cwxx').html('请输入正确的验证码').css("display","");
                                        }else {
                                            $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                                            tools.showAlert("请输入图片验证码");
                                        }
                                        // $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                                    }else if(res.Data === -1){
                                        //需要验证码
                                        $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                                        $('#imgValidateCodeBox').removeClass('hide');
                                        tools.showAlert("请输入图片验证码");
                                    }else {
                                        //$(".layx22-left2-cwxx2").css("display","");
                                        $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                                        tools.showAlert("验证不通过，请核实姓名与身份证信息是否符合");
                                    }
                                }
                                isfirstClickSubmit = false;
                            }
                        });

                        //location='/loanapplyyx/Qualification';
                    }else if( ishasImgCode  && fg3 && (!fg || !fg2)) {
                        $('#GetImgValidateCode').find('img').attr('src', image_code_getting_url+'?t=' + (new Date().getTime()));
                        fg3 = false;
                    }
                }

            })

            $(".layx22-left2-cwxx2 a").click(function(){
                $(".layx22-left2-cwxx2").css("display","none");
            })

            //$(".spedwin-jx").click(function(){
            //location='/loanapplyyx/Qualification';
            //})

            //如何贷款？
            $("#howgetgifts").hover(function(e){
                debugger;
                $(this).parent().prev(".tip").show();
            },function(e){
                $(this).parent().prev(".tip").hide();
            });

        },
        //环状图
        doughnutChart:function(datasets){
            var self = this;
            echarts.init(document.getElementById('myChart')).setOption({
                series : [
                    {
                        name:'总花费',
                        type:'pie',
                        radius : ['60%', '100%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : false,
                                    position : 'center',
                                    textStyle : {
                                        fontSize : '20',
                                        fontWeight : 'bold'
                                    }
                                }
                            }
                        },
                        data:datasets
                    }
                ]
            });
        },
        //通过车价和产品计算贷款信息
        loanInfo:function(){
            var self = this,
                _url = '/LoanApplyYxHxm/GetCalculationInfo?carPrice=' + carPriceData + '&productId='+ product +'&carId=' + carIdData;

            self.sendAjax({
                url: _url,
            }, success, sendAgain);

            function success(res){

                isDownPaymentPeriodAjax = true;
                if(res.Result){
                    var _downPayment = res.Data.downPayment * 10000,
                        _loanAmount = res.Data.loanAmount * 10000,
                        _totalCost = res.Data.totalCost * 10000,
                        _monthlyPayment = res.Data.monthlyPayment * 10000,
                        _finalPaymentAmount = res.Data.finalPaymentAmount *10000,
                        _totalInterest = res.Data.totalInterest *10000,
                        _serviceFee = res.Data.serviceFee *10000,
                        _purchaseTax = res.Data.purchaseTax *10000,
                        _totalExpenses = orderViewModel.carPrice()*10000 + _totalCost + _purchaseTax + 1450,
                        _isSecurityDeposit = res.Data.securityDepositRate?true:false,
                        _isFinalPaymentAmount = _finalPaymentAmount>0?true:false,
                        _securityDeposit = res.Data.securityDeposit*10000,
                        _firstPayment = res.Data.firstPayment*10000;
                    //是否有保证金
                    orderViewModel.isSecurityDeposit(_isSecurityDeposit);
                    //保证金
                    orderViewModel.securityDeposit(tools.addCmma(_securityDeposit));
                    //保障金比例
                    orderViewModel.securityDepositRate((res.Data.securityDepositRate * 100).toString() +'%');
                    //首次支付
                    orderViewModel.firstPayment(tools.addCmma(_firstPayment));
                    //首付金额
                    orderViewModel.downPayment(tools.addCmma(_downPayment));
                    //首付比例
                    orderViewModel.downPaymentRate((res.Data.downPaymentRate * 100).toString() +'%');
                    //贷款金额
                    orderViewModel.loanAmount(tools.addCmma(_loanAmount));
                    //贷款成本
                    orderViewModel.totalCost(tools.addCmma(_totalCost));
                    //月供
                    orderViewModel.monthlyPayment(tools.addCmma(_monthlyPayment));
                    //贷款尾款
                    orderViewModel.finalPaymentAmount(tools.addCmma(_finalPaymentAmount));
                    orderViewModel.isFinalPaymentAmount(_isFinalPaymentAmount);
                    //尾款比例
                    orderViewModel.finalPaymentRate((res.Data.finalPaymentRate * 100).toString() +'%');
                    //月费率/月利率文本
                    orderViewModel.rateText(res.Data.rateText);
                    //月费率/月利率金额
                    orderViewModel.interestRate((res.Data.interestRate * 100).toString() +'%');
                    //利息
                    orderViewModel.totalInterest(tools.addCmma(_totalInterest));
                    //手续费
                    orderViewModel.serviceFee(tools.addCmma(_serviceFee));

                    //购置税
                    orderViewModel.purchaseTax(tools.addCmma(_purchaseTax));
                    //税费=购置税 + 500（上牌） + 950（强险）
                    orderViewModel.taxation(tools.addCmma(_purchaseTax + 1450));
                    //总花费
                    orderViewModel.totalExpenses(tools.addCmma(_totalExpenses))
                    //环形图初始数据
                    var datasetsData = [
                        {
                            value: _isSecurityDeposit?(res.Data.firstPayment*10000):_downPayment,
                            itemStyle:{
                                normal:{color:'#000000'}
                            },
                            name:_isSecurityDeposit?'首次支付':'首付'
                        },
                        {
                            value:_loanAmount,
                            itemStyle:{
                                normal:{color:'#dbb76c'}
                            },
                            name:'贷款额度'
                        },
                        {
                            value:_purchaseTax + 1450,
                            itemStyle:{
                                normal:{color:'#a4a4a4'}
                            },
                            name:'税费'
                        },
                        {
                            value:_totalCost,
                            itemStyle:{
                                normal:{color:'#5f5f5e'}
                            },
                            name:'贷款成本'
                        }
                    ]

                    //刷新环形图
                    // self.doughnutChart(datasetsData);
                }

            }

            // 出错后重新加载
            function sendAgain(info) {
                //console.log(info);
                self.sendAjax({
                    url: _url,
                }, success, sendAgain);
            };
        },
        //ajax
        sendAjax: function (options, _callback, _errorcallback) {
            var self = this;
            var setting = {
                url: '',
                timeout: 5000,
                type: 'get',
                dataType: 'json',
                cache: true,
                async: true,
                data: {}
            };
            setting = $.extend(setting, options);
            $.ajax({
                url: setting.url,
                type: setting.type,
                dataType: setting.dataType,
                async: setting.async,
                cache: setting.cache,
                data: setting.data,
                beforeSend: function () {
                },
                success: function (res) {
                    _callback(res);
                },
                complete: function (XMLHttpRequest, textStatus) {
                    if (status == 'timeout') {//超时,status还有success,error等值的情况
                        _errorcallback(textStatus);
                    }
                }
            })
        }
    }

    ordera.init();
