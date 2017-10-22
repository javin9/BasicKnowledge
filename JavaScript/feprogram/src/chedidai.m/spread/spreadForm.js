require("./qqIndex.scss")

import check from 'libs/check/m';
import car from 'libs/carSelect';
import datePicker from 'libs/datePicker';
import city from 'libs/citySelect';
require('libs/selectControl');

 var strName = {
        Name: '姓名',
        Mobile: '手机号',
        Code: '验证码',
        Age: '年龄',
        TenThousandKilometres: '行驶里程'
    };
    var FormCheck = function(){
        this.param = $(".form").data("param");
        this.carYear = null;
    };
    /*添加防伪标记*/
    function addAntiForgeryToken(data) {
        data.__RequestVerificationToken = $('input[name=__RequestVerificationToken]').val();
        return data;
    }
    function getCode(data, successFunc){
        var defaultData = {
            seconds:60,
            tel_id:'mobile',
            gvc_id:'GetValidateCode',
            line:'550',
            url:CODE_GETTING_URL
        }
        var Tdata = $.extend(defaultData, data);

        if (Tdata.seconds <= 0) {
            alert(倒计时时间不能小于0);
            return false;
        };
        if ($("#"+Tdata.gvc_id).hasClass("disable")) {
            return false;
        };

        var telNum = $("#"+Tdata.tel_id).val();
        if (check.isPhoneNumber(telNum)) {
            tools.$ajax({
                url: Tdata.url,
                data:addAntiForgeryToken({mobile:telNum, line:Tdata.line}),
                success:function(res){
                    successFunc(res);
                }
            });
            $("#"+Tdata.gvc_id).addClass("disable").text(Tdata.seconds+"秒后获取");
            window.tmo = setInterval(function(){
                if(--Tdata.seconds == 0){
                    clearInterval(tmo);
                    $("#"+Tdata.gvc_id).removeClass("disable").text("获取验证码");
                    return;
                }
                $("#"+Tdata.gvc_id).text(Tdata.seconds+"秒后获取");
            }, 1000);
            return true;
        }else{
            return false;
        }
    }
    FormCheck.prototype = {
        init: function(){
            this.domInit();
            // this.qqGoBack();
        },
        domInit: function(){
            var self = this;

            //获取验证码
            $(".CodeEvent").click(function(){
                var $that = $(this),
                    gId = $that.attr('id'),
                    $input = $("input[name='Mobile']");
                    
                if (!getCode({ gvc_id: gId, line: BusinessLine }, successFunc)) {
                    self.checkInput( 'Mobile', check.isPhoneNumber($input.val()));
                    return false;
                }else{
                    getCode({ gvc_id: gId, line: BusinessLine }, successFunc);
                    // $(".formTip").show().text("请输入正确的验证码");
                } 

                function successFunc(res){
                    if(!res.Result){
                        $(".formTip").show().text(res.Message);
                    }else{
                        $(".formTip").hide();                   
                    }
                }
            });
            //首页提交代码
            $("#index_btn").click(function(){
                self.submitForm("/Mortgage/AddMortgageOrder", "/Spread/QQCarInfo");
            });

            /********车贷流程开始*********/
            // 上牌时间            
            var cardDatePicker = new datePicker({
                trigger: '#selectDate',
                type: 'ym',
                minDate: 1900+'-1-1',
                maxDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                CallBacks: function (obj) {
                    $("#selectDate").removeClass("unsubmit");
                    $('#selectDate .select-ctn').text(obj.year + '年' + obj.month + '月').addClass("cur").removeClass("f-red");
                    if ($(".gearDate").length > 1) {
                        $(".gearDate")[0].remove();
                    };
                    // selectLicenseYear = obj.year;
                    $("input[name='LicenseYear']").val(obj.year);
                    $("input[name='LicenseMonth']").val(obj.month);

                }
            });

            // console.log(cardDatePicker.init)
            //选车型
            $('#selectCar').on('click', function (e) {
                var that = this;

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
                    // if(result.masterBrand.name!=null)
                    // {
                    //     if(result.brand.name.indexOf(result.masterBrand.name)>=0){
                    //         carDisplayName = result.brand.name + " - " + result.year+"款 - " + result.carType.name;
                    //     }
                    // }
                    var newYear = result.year > new Date().getFullYear()?result.year - 2:result.year;
                    self.carYear = newYear;
                    cardDatePicker.init({
                        trigger: '#selectDate',
                        type: 'ym',
                        minDate: newYear+'-1-1',
                        maxDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
                    });

                    $(that).removeClass("unsubmit").find('.select-ctn').text(carDisplayName).addClass("cur").removeClass("f-red");
                    $("input[name='CarID']").val(result.carType.id);
                });
            });
            //选城市
            $('#selectCity').on('click', function (e) {
                var that = this;

                e.preventDefault();
                city.citySelect({
                    isSaveCookie:false
                }, function (res) {
                    $(that).removeClass("unsubmit").find('.select-ctn').text(res.CityName).addClass("cur").removeClass("f-red");
                    $("input[name='LicenseCityID']").val(res.CityId);
                });
            });
            //贷款期限
            // $("#selectPeriod").selectControl({
            //     CallBacks:function(obj){
            //      alert(1)
            //         $("#selectPeriod").removeClass("unsubmit").find(".select-ctn").text(obj.txt).addClass("cur").removeClass("f-red");
            //         $("input[name='LoanPeriod']").val(obj.id);
            //     }
            // });
            //抵押状态
            $("#HasMortgage .radio").click(function(){
                self.radioFunc("HasMortgage", $(this));
            });
            //性别
            $("#Gender .radio").click(function(){
                self.radioFunc("Gender", $(this));
            });
            //车贷信息提交
            $("#car_btn").click(function(){
                self.submitForm("/MortgageTool/UpdateMortgageOrderInStep2", "/Spread/QQCredential");
            });
            /********车贷流程结束*********/

            /********资质信息开始********/
            $(".selectControl").selectControl({
                CallBacks:function(obj){
                    var name = $(obj.item).attr("id");
                    $(obj.item).removeClass("unsubmit").find(".select-ctn").text(obj.txt).addClass("cur").removeClass("f-red");
                    $("input[name='"+ name +"']").val(obj.id);
                }
            });
            //车贷信息提交
            $("#credit_btn").click(function(){
                self.submitForm("/MortgageTool/AddQualificationInStep3", "/Spread/QQResult");
            });
            /********资质信息结束********/

            // 服务条款固定底部
            var htmlHeight = $(".QQ").height();
            var wHeight = $(window).height() - 120;
            if(htmlHeight < wHeight){
                $(".QQ").css("height", $(window).height() + "px");
            }else{
                $(".QQ .footer").addClass("relative");
            }
        },
        radioFunc: function(id, $dom){
            var self = this;
            $("#"+id+" .radio").removeClass("cur");
            $dom.addClass("cur");
            $("input[name='"+ id +"']").val($dom.data("id"))
        },
        checkInput:function(name, checkResult){
            var self = this;
            var $dom = $("input[name='"+ name +"']");
            if (checkResult === "") { 
                if(self.param == "under"){
                    $dom.parents("li").addClass("unsubmit");
                    $(".formTip").show().text("请输入" + strName[name]);
                }else{
                    $dom.parents("li").addClass("unsubmit").next("li.formTip").show().text('请输入'+ strName[name]);
                }
                return false;
            }else if(checkResult === false){
                if(self.param == "under"){
                    $dom.parents("li").addClass("unsubmit");
                    $(".formTip").show().text("请输入正确的" + strName[name]);
                }else{
                    $dom.parents("li").addClass("unsubmit").next("li.formTip").show().text($dom.parents("li").data("type"));
                }
                return false;
            }else{
                if(self.param == "under"){
                   $dom.parents("li").removeClass("unsubmit");
                   $(".formTip").hide();
                }else{
                    $dom.parents("li").removeClass("unsubmit").next("li.formTip").hide();
                }
            }
        },
        checkForm: function(){
            var self = this;
            for(var i = 0; i < $(".checkApp").length; ++i){
                var name = $(".checkApp").eq(i).attr("name"),
                    inputValue = $(".checkApp").eq(i).val(),
                    stopSgin = true;
                if (name == "Name") {
                    stopSgin = check.isName(inputValue);
                }else if(name == "Mobile"){
                    stopSgin = check.isPhoneNumber(inputValue);
                }else if(name == "Code"){
                    stopSgin = check.isValidateCode(inputValue);
                }else if(name == "Age"){
                    stopSgin = check.isAge(inputValue);
                }else if(name == "TenThousandKilometres"){
                    if(parseFloat(inputValue) > 100){
                        stopSgin = false;
                    }else{
                        stopSgin = check.isKilometres(inputValue);
                    }
                }

                if (self.param == "under" && !stopSgin) {
                    self.checkInput(name, stopSgin);    
                    return false;
                }else{
                    self.checkInput(name, stopSgin);
                }
            }

            $(".selcon.unsubmit").each(function(){
                $(this).find(".select-ctn").addClass("f-red");
            });
        },
        sendAjax: function(url, translateUrl){
            var self = this;
            var data = new Object();
            var _data = null;
            tools.showAlert("申请中...",999999999)
            if($(".form").data("form")){
                var from = "";
                if(tools.getCookie('from')){
                    from = tools.getCookie('from');
                }else if(tools.getUrlParam('from')){
                    from = tools.getUrlParam('from');
                }
                $("input[name='From']").val(from);
            }
            $("input.data").each(function(){
                data[$(this).attr("name")] = $.trim($(this).val());
            });

            if(dataSgin == "index"){
                _data = { "order": data ,"q":null}
            }else if(dataSgin == "car"){
                data["ID"] = tools.getUrlParam("id");
                _data = { "order": data ,"q":null}
            }else if(dataSgin == "credit"){
                data["OrderID"] = tools.getCookie("orderId");
                _data = {"q":data}
            }

            tools.$ajax({
                url: url,
                data: _data,
                dataType: 'json',
                success: function(res){
                    if (res.Result) {
                        if(dataSgin == "index"){
                            window.location.href = translateUrl + "?id=" + res.Data.ID;
                        }else if(dataSgin == "car"){
                            tools.setCookie('orderId', res.Data.OrderID);
                            window.location.href = translateUrl
                        }else{
                            var orderId = tools.getCookie("orderId");
                            tools.setCookie('orderId', null);
                            window.location.href = translateUrl + "?orderId=" + orderId;

                        }
                        
                    } else {
                        tools.showAlert(res.Message);
                    }

                }
            });

        },
        submitForm: function(url, translateUrl){
            var self = this;
            self.checkForm();

            if(parseInt(self.carYear) > parseInt($(".input[name='LicenseYear']").val())){
                return tools.showAlert("所选上牌年限小于车款出厂年限！");
            }

            if($(".unsubmit").length == 0){
                if($(".CodeEvent").length >0){
                    check.checkCode({number:$.trim($("input[name='Code']").val()), line:BusinessLine},function(res){
                        if(!res.Result){
                            $(".formTip").show().text(res.Message);
                            return false;
                        }else{
                            self.sendAjax(url, translateUrl);
                        }
                    });
                }else{
                    self.sendAjax(url, translateUrl);
                }
            }
        }
    }

    $(function(){
        var formCheck = new FormCheck();
        formCheck.init();

        var _title = "";
        if(option==1){
             mqq.ui.setTitleButtons({
                left: {
                    title: 'QQ钱包',
                    callback: function() {
                        mqq.ui.popBack();
                    }
                },
                right: { title: " " }
            });
        }else{
            if(option == 2 || option == 3){
                _title = "上一步";
            }else if(option == 4){
                _title = "返回首页";
            }
            var QQbaseUrl = "http://"+window.location.host +'/spread/';
            if(option == 3){
                var oid=sessionStorage['oid'];
            }
            mqq.ui.setTitleButtons({
                left: {
                    title: _title,
                    callback: function() {
                        $("#maskLayer").hide();
                        if(option == 2 || option == 4){
                            window.location.href = QQbaseUrl + "/QQIndex";
                            $("input").val("");
                        }else if(option ==3){
                            $("#maskLayer").hide();
                            window.location.href = QQbaseUrl + "/QQCarInfo?id=" + oid;
                        }
                    }
                },
                right: { title: " " }
            });
        }
    });